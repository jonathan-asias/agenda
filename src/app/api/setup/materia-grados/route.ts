import { NextRequest, NextResponse } from 'next/server';
import {
  enforceTenant,
  tenantErrorToResponse
} from '@/lib/tenant';
import { withAdminSedeDb } from '@/lib/security/require-admin-api';
import { rbacErrorToResponse } from '@/lib/security/rbac';
import {
  assertRecordBelongsToSede,
  materiaGradosWhere,
  sedeErrorToResponse,
} from '@/lib/sede-scope';

interface MateriaGradoAsignacion {
  materiaId: number;
  gradoId: number;
}

interface MateriaGradosPayload {
  institucionId: number;
  asignaciones: MateriaGradoAsignacion[];
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as MateriaGradosPayload;
    
    const { institucionId, asignaciones } = body;

    if (!institucionId) {
      throw new Error('institucionId es requerido');
    }

    if (!asignaciones || !Array.isArray(asignaciones)) {
      throw new Error('asignaciones debe ser un array');
    }

    return await withAdminSedeDb(request, async (tx, { institutionId, scope }) => {
      const institucion = await tx.instituciones.findUnique({
        where: { id: institucionId }
      });

      if (!institucion) {
        throw new Error(`Institución con ID ${institucionId} no encontrada`);
      }

      enforceTenant(institutionId, institucionId);

      const mgWhere = materiaGradosWhere(institucionId, scope);

      const asignacionesExistentes = await tx.materiaGrados.findMany({
        where: mgWhere
      });

      if (asignacionesExistentes.length > 0) {
        await tx.materiaGrados.deleteMany({
          where: mgWhere
        });
      }

      for (const asignacion of asignaciones) {
        const materia = await tx.materias.findUnique({
          where: { id: asignacion.materiaId }
        });
        
        if (!materia) {
          throw new Error(`Materia con ID ${asignacion.materiaId} no encontrada`);
        }

        assertRecordBelongsToSede(materia.sede_id, scope);
        
        const grado = await tx.grados.findUnique({
          where: { id: asignacion.gradoId }
        });
        
        if (!grado) {
          throw new Error(`Grado con ID ${asignacion.gradoId} no encontrado`);
        }

        assertRecordBelongsToSede(grado.sede_id, scope);
      }

      const asignacionesCreadas = await Promise.all(
        asignaciones.map(async (asignacion) => {
          try {
            return await tx.materiaGrados.create({
              data: {
                materia_id: asignacion.materiaId,
                grado_id: asignacion.gradoId
              }
            });
          } catch (createError) {
            console.error('Error creando asignación específica:', createError);
            console.error('Datos que causaron el error:', asignacion);
            throw createError;
          }
        })
      );

      const response = {
        success: true,
        asignaciones: asignacionesCreadas.length,
        data: { asignacionesCreadas }
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
    console.error('=== ERROR EN ENDPOINT MATERIA-GRADOS ===');
    console.error('Error completo:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al asignar materias a grados',
        details: error instanceof Error ? error.message : 'Error desconocido',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
