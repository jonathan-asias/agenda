import { NextRequest, NextResponse } from 'next/server';
import {
  enforceTenant,
  tenantErrorToResponse
} from '@/lib/tenant';
import { withTenantFromRequest } from '@/lib/db/with-tenant-request';
import {
  assertDocenteSelfOrStaff,
  rbacErrorToResponse,
  requireInstitutionAuth,
  resolveSessionDocenteId,
} from '@/lib/security/rbac';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ docenteId: string }> }
) {
  try {
    const { docenteId: docenteIdParam } = await params;
    const docenteId = parseInt(docenteIdParam);

    if (!docenteId || isNaN(docenteId)) {
      return NextResponse.json({ error: 'ID de docente inválido' }, { status: 400 });
    }

    const ctx = await requireInstitutionAuth(request);
    const sessionDocenteId =
      ctx.role === 'docente' ? await resolveSessionDocenteId(request) : null;
    assertDocenteSelfOrStaff(ctx, docenteId, sessionDocenteId);

    return await withTenantFromRequest(request, async (tx, userInstitutionId) => {
      const docente = await tx.docentes.findUnique({
        where: { id: docenteId },
        select: { institucion_id: true }
      });
      if (!docente) {
        return NextResponse.json({ error: 'Docente no encontrado' }, { status: 404 });
      }
      enforceTenant(userInstitutionId, docente.institucion_id);

      const recordatorios = await tx.recordatorios.findMany({
        where: { docente_id: docenteId },
        include: {
          grado: {
            select: { id: true, nombre: true, nivel: true }
          },
          curso: {
            select: { id: true, nombre: true, jornada: true }
          },
          area: {
            select: { id: true, nombre: true }
          },
          materia: {
            select: { id: true, nombre: true }
          },
          estudiantes: {
            include: {
              estudiante: {
                select: {
                  id: true,
                  nombres: true,
                  apellidos: true,
                  codigo_estudiantil: true
                }
              }
            }
          }
        },
        orderBy: { fecha: 'asc' }
      });

      return NextResponse.json({ recordatorios });
    });
  } catch (error) {
    const rbacResp = rbacErrorToResponse(error);
    if (rbacResp) return rbacResp;
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error buscando recordatorios:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
