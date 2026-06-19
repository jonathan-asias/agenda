import { NextRequest, NextResponse } from 'next/server';
import type { Materias } from '@prisma/client';
import {
  enforceTenant,
  tenantErrorToResponse
} from '@/lib/tenant';
import { withAdminSedeDb } from '@/lib/security/require-admin-api';
import { rbacErrorToResponse } from '@/lib/security/rbac';
import {
  institutionSedeWhere,
  sedeDataForCreate,
  sedeErrorToResponse,
} from '@/lib/sede-scope';

type AreaInput = {
  nombre: string;
  es_opcional: boolean;
  orden: number;
};

type MateriaInput = {
  nombre: string;
  areaId: number | string;
};

export async function POST(request: NextRequest) {
  try {
    let rawBody: unknown = {};
    try {
      rawBody = await request.json();
    } catch (jsonError) {
      console.error('Error parsing JSON:', jsonError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Error parsing JSON',
          details: jsonError instanceof Error ? jsonError.message : 'Error desconocido'
        },
        { status: 400 }
      );
    }

    const { institucionId, areas, materias } = rawBody as {
      institucionId: number;
      areas: AreaInput[];
      materias: MateriaInput[];
    };

    if (!institucionId) {
      throw new Error('institucionId es requerido');
    }

    if (!areas || !Array.isArray(areas)) {
      throw new Error('areas debe ser un array');
    }

    if (!materias || !Array.isArray(materias)) {
      throw new Error('materias debe ser un array');
    }

    return await withAdminSedeDb(request, async (tx, { institutionId, scope }) => {
      const institucion = await tx.instituciones.findUnique({
        where: { id: institucionId }
      });

      if (!institucion) {
        throw new Error(`Institución con ID ${institucionId} no encontrada`);
      }

      enforceTenant(institutionId, institucionId);

      const sedeWhere = institutionSedeWhere(institucionId, scope);
      const sedeData = sedeDataForCreate(scope);

      const areasExistentes = await tx.areas.findMany({
        where: sedeWhere
      });

      if (areasExistentes.length > 0) {
        await tx.materias.deleteMany({
          where: sedeWhere
        });
        await tx.areas.deleteMany({
          where: sedeWhere
        });
      }

      const areasCreadas = await Promise.all(
        areas.map(async (area) => {
          return await tx.areas.create({
            data: {
              nombre: area.nombre,
              es_opcional: area.es_opcional,
              orden: area.orden,
              institucion_id: institucionId,
              activa: true,
              ...sedeData,
            }
          });
        })
      );

      const areaIdMap = new Map<number, number>();
      areasCreadas.forEach(area => {
        areaIdMap.set(area.orden, area.id);
      });

      const materiasCreadas: Materias[] = [];
      for (let i = 0; i < materias.length; i++) {
        const materia = materias[i];
        const areaKey = Number(materia.areaId);

        if (!Number.isFinite(areaKey)) {
          throw new Error(`El identificador de área ${materia.areaId} no es válido`);
        }

        const areaId = areaIdMap.get(areaKey);
        
        if (!areaId) {
          throw new Error(`No se encontró el área con orden ${materia.areaId}`);
        }

        try {
          const materiaCreada = await tx.materias.create({
            data: {
              nombre: materia.nombre,
              area_id: areaId,
              institucion_id: institucionId,
              ...sedeData,
            }
          });
          materiasCreadas.push(materiaCreada);
          
          if (i < materias.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        } catch (error) {
          console.error('Error creando materia:', error);
          throw error;
        }
      }

      const response = {
        success: true,
        areas: areasCreadas.length,
        materias: materiasCreadas.length,
        data: { areasCreadas, materiasCreadas }
      };

      return NextResponse.json(response);
    });

  } catch (error) {
    const sedeResp = sedeErrorToResponse(error);
    if (sedeResp) return sedeResp;
    const rbacResp = rbacErrorToResponse(error);
    if (rbacResp) return rbacResp;
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('=== ERROR EN ENDPOINT AREAS-MATERIAS ===');
    console.error('Error completo:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al guardar áreas y materias',
        details: error instanceof Error ? error.message : 'Error desconocido',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
