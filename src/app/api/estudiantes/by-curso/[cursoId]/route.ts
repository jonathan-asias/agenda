import { NextRequest, NextResponse } from 'next/server';
import { tenantErrorToResponse } from '@/lib/tenant';
import { withAdminSedeDb } from '@/lib/security/require-admin-api';
import { rbacErrorToResponse } from '@/lib/security/rbac';
import {
  assertRecordBelongsToSede,
  cursosSedeWhere,
  institutionSedeWhere,
  sedeErrorToResponse,
} from '@/lib/sede-scope';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cursoId: string }> }
) {
  try {
    const { cursoId: cursoIdParam } = await params;
    const cursoId = parseInt(cursoIdParam);

    if (!cursoId || isNaN(cursoId)) {
      return NextResponse.json({ error: 'ID de curso inválido' }, { status: 400 });
    }

    return await withAdminSedeDb(request, async (tx, { institutionId, scope }) => {
      const curso = await tx.cursos.findFirst({
        where: { id: cursoId, ...cursosSedeWhere(institutionId, scope) },
      });

      if (!curso) {
        return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
      }

      assertRecordBelongsToSede(curso.sede_id, scope);

      const estudiantes = await tx.estudiantes.findMany({
        where: {
          curso_id: cursoId,
          ...institutionSedeWhere(institutionId, scope),
          activo: true
        },
        select: {
          id: true,
          nombres: true,
          apellidos: true,
          codigo_estudiantil: true
        },
        orderBy: [{ apellidos: 'asc' }, { nombres: 'asc' }]
      });

      return NextResponse.json({ estudiantes });
    });
  } catch (error) {
    const sedeResp = sedeErrorToResponse(error);
    if (sedeResp) return sedeResp;
    const rbacResp = rbacErrorToResponse(error);
    if (rbacResp) return rbacResp;
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error buscando estudiantes:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
