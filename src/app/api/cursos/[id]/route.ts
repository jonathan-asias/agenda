import { NextRequest, NextResponse } from 'next/server';
import { tenantErrorToResponse } from '@/lib/tenant';
import { withAdminSedeDb } from '@/lib/security/require-admin-api';
import { rbacErrorToResponse } from '@/lib/security/rbac';
import {
  assertRecordBelongsToSede,
  cursosSedeWhere,
  sedeErrorToResponse,
} from '@/lib/sede-scope';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cursoId = Number.parseInt(id, 10);

    if (Number.isNaN(cursoId)) {
      return NextResponse.json(
        { error: 'ID de curso inválido' },
        { status: 400 }
      );
    }

    return await withAdminSedeDb(request, async (tx, { institutionId, scope }) => {
      const curso = await tx.cursos.findFirst({
        where: { id: cursoId, ...cursosSedeWhere(institutionId, scope) }
      });

      if (!curso) {
        return NextResponse.json(
          { error: 'Curso no encontrado' },
          { status: 404 }
        );
      }

      assertRecordBelongsToSede(curso.sede_id, scope);

      await tx.cursos.delete({
        where: { id: cursoId, institucion_id: institutionId }
      });

      return NextResponse.json({
        success: true,
        message: 'Curso eliminado exitosamente',
        data: { id: curso.id, nombre: curso.nombre }
      });
    });
  } catch (error) {
    const sedeResp = sedeErrorToResponse(error);
    if (sedeResp) return sedeResp;
    const rbacResp = rbacErrorToResponse(error);
    if (rbacResp) return rbacResp;
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error al eliminar curso:', error);
    return NextResponse.json(
      {
        error: 'Error interno del servidor al eliminar el curso',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
