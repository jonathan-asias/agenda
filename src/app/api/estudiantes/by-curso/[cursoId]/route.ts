import { NextRequest, NextResponse } from 'next/server';
import { tenantErrorToResponse } from '@/lib/tenant';
import { withAdminSedeDb } from '@/lib/security/require-admin-api';
import { withTenantFromRequest } from '@/lib/db/with-tenant-request';
import {
  RoleAccessDeniedError,
  requireInstitutionAuth,
  resolveSessionDocenteId,
  rbacErrorToResponse,
  STAFF_ROLES,
  assertRole,
} from '@/lib/security/rbac';
import {
  assertRecordBelongsToSede,
  cursosSedeWhere,
  institutionSedeWhere,
  sedeErrorToResponse,
} from '@/lib/sede-scope';

const estudianteSelect = {
  id: true,
  nombres: true,
  apellidos: true,
  codigo_estudiantil: true,
} as const;

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

    const ctx = await requireInstitutionAuth(request);
    assertRole(ctx.role, STAFF_ROLES);

    // Docente: solo cursos a los que está asignado.
    if (ctx.role === 'docente') {
      return await withTenantFromRequest(request, async (tx, institutionId) => {
        const docenteId = await resolveSessionDocenteId(request);
        if (docenteId == null) {
          throw new RoleAccessDeniedError(['docente'], ctx.role);
        }

        const asignacion = await tx.docenteAsignaciones.findFirst({
          where: {
            docente_id: docenteId,
            curso_id: cursoId,
            docente: { institucion_id: institutionId },
          },
          select: { id: true },
        });

        if (!asignacion) {
          return NextResponse.json(
            { error: 'No tienes acceso a los estudiantes de este curso' },
            { status: 403 }
          );
        }

        const curso = await tx.cursos.findFirst({
          where: { id: cursoId, institucion_id: institutionId },
          select: { id: true },
        });
        if (!curso) {
          return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
        }

        const estudiantes = await tx.estudiantes.findMany({
          where: {
            curso_id: cursoId,
            institucion_id: institutionId,
            activo: true,
          },
          select: estudianteSelect,
          orderBy: [{ apellidos: 'asc' }, { nombres: 'asc' }],
        });

        return NextResponse.json({ estudiantes });
      });
    }

    // Admin / institución: scoped por sede.
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
          activo: true,
        },
        select: estudianteSelect,
        orderBy: [{ apellidos: 'asc' }, { nombres: 'asc' }],
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
