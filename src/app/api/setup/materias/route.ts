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

type MateriaInput = {
  nombre: string;
  area_id: number | string;
};

export async function POST(request: NextRequest) {
  try {
    const { institucionId, materias } = await request.json() as {
      institucionId: number;
      materias: MateriaInput[];
    };

    if (!institucionId || !materias || !Array.isArray(materias)) {
      return NextResponse.json(
        { error: 'institucionId y materias son requeridos' },
        { status: 400 }
      );
    }

    for (const materia of materias) {
      if (!materia.nombre || !materia.area_id) {
        return NextResponse.json(
          { error: 'Cada materia debe tener nombre y area_id' },
          { status: 400 }
        );
      }
    }

    return await withAdminSedeDb(request, async (tx, { institutionId, scope }) => {
      const institucion = await tx.instituciones.findUnique({
        where: { id: institucionId }
      });

      if (!institucion) {
        return NextResponse.json(
          { error: 'Institución no encontrada' },
          { status: 404 }
        );
      }

      enforceTenant(institutionId, institucionId);

      const sedeWhere = institutionSedeWhere(institucionId, scope);
      const sedeData = sedeDataForCreate(scope);

      const areasPredeterminadas = [
        { id: 1, nombre: 'Ciencias naturales y educación ambiental', es_opcional: false, orden: 1 },
        { id: 2, nombre: 'Ciencias sociales, historia, geografía, constitución política y democracia', es_opcional: false, orden: 2 },
        { id: 3, nombre: 'Educación artística y cultural', es_opcional: false, orden: 3 },
        { id: 4, nombre: 'Educación ética y en valores humanos', es_opcional: false, orden: 4 },
        { id: 5, nombre: 'Educación física, recreación y deportes', es_opcional: false, orden: 5 },
        { id: 6, nombre: 'Educación religiosa', es_opcional: false, orden: 6 },
        { id: 7, nombre: 'Humanidades, lengua castellana e idiomas extranjeros', es_opcional: false, orden: 7 },
        { id: 8, nombre: 'Matemáticas', es_opcional: false, orden: 8 },
        { id: 9, nombre: 'Tecnología e informática', es_opcional: false, orden: 9 },
        { id: 10, nombre: 'Filosofía', es_opcional: true, orden: 10 },
        { id: 11, nombre: 'Educación sexual', es_opcional: true, orden: 11 },
        { id: 12, nombre: 'Cátedras y emprendimiento', es_opcional: true, orden: 12 },
        { id: 13, nombre: 'Comportamiento y disciplina', es_opcional: true, orden: 13 }
      ];

      type MateriaRecord = Materias;
      const materiasCreadas: MateriaRecord[] = [];

      for (const materiaData of materias) {
        const areaId = Number(materiaData.area_id);

        if (!Number.isFinite(areaId)) {
          return NextResponse.json(
            { error: `Área con identificador ${materiaData.area_id} no es válida` },
            { status: 400 }
          );
        }

        const areaPredeterminada = areasPredeterminadas.find(a => a.id === areaId);
        if (!areaPredeterminada) {
          return NextResponse.json(
            { error: `Área con ID ${areaId} no es válida` },
            { status: 400 }
          );
        }

        let area = await tx.areas.findFirst({
          where: {
            nombre: areaPredeterminada.nombre,
            ...sedeWhere,
          }
        });

        if (!area) {
          area = await tx.areas.create({
            data: {
              nombre: areaPredeterminada.nombre,
              es_opcional: areaPredeterminada.es_opcional,
              orden: areaPredeterminada.orden,
              institucion_id: institucionId,
              activa: true,
              ...sedeData,
            }
          });
        }

        const materia = await tx.materias.create({
          data: {
            nombre: materiaData.nombre,
            area_id: area.id,
            institucion_id: institucionId,
            ...sedeData,
          }
        });

        materiasCreadas.push(materia);
      }

      return NextResponse.json({
        success: true,
        message: `${materiasCreadas.length} materia(s) creada(s) exitosamente`,
        materias: materiasCreadas
      });
    });

  } catch (error) {
    const sedeResp = sedeErrorToResponse(error);
    if (sedeResp) return sedeResp;
    const rbacResp = rbacErrorToResponse(error);
    if (rbacResp) return rbacResp;
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error creating materias:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
