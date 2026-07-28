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

      await tx.materiaGrados.deleteMany({
        where: mgWhere
      });

      if (asignaciones.length === 0) {
        return NextResponse.json({
          success: true,
          asignaciones: 0,
          data: { asignacionesCreadas: [] }
        });
      }

      const materiaIds = [...new Set(asignaciones.map((a) => a.materiaId))];
      const gradoIds = [...new Set(asignaciones.map((a) => a.gradoId))];

      const [materias, grados] = await Promise.all([
        tx.materias.findMany({ where: { id: { in: materiaIds } } }),
        tx.grados.findMany({ where: { id: { in: gradoIds } } }),
      ]);

      const materiasById = new Map(materias.map((m) => [m.id, m]));
      const gradosById = new Map(grados.map((g) => [g.id, g]));

      for (const materiaId of materiaIds) {
        const materia = materiasById.get(materiaId);
        if (!materia) {
          throw new Error(`Materia con ID ${materiaId} no encontrada`);
        }
        assertRecordBelongsToSede(materia.sede_id, scope);
      }

      for (const gradoId of gradoIds) {
        const grado = gradosById.get(gradoId);
        if (!grado) {
          throw new Error(`Grado con ID ${gradoId} no encontrado`);
        }
        assertRecordBelongsToSede(grado.sede_id, scope);
      }

      // Deduplicar pares materia-grado por si el cliente envía duplicados
      const uniquePairs = new Map<string, MateriaGradoAsignacion>();
      for (const asignacion of asignaciones) {
        uniquePairs.set(`${asignacion.materiaId}:${asignacion.gradoId}`, asignacion);
      }
      const paresUnicos = [...uniquePairs.values()];

      const createResult = await tx.materiaGrados.createMany({
        data: paresUnicos.map((asignacion) => ({
          materia_id: asignacion.materiaId,
          grado_id: asignacion.gradoId,
        })),
        skipDuplicates: true,
      });

      return NextResponse.json({
        success: true,
        asignaciones: createResult.count,
        data: { asignacionesCreadas: createResult.count }
      });
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
