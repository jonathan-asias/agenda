import { NextRequest, NextResponse } from 'next/server';
import { enforceTenant, tenantErrorToResponse } from '@/lib/tenant';
import { withTenantFromRequest } from '@/lib/db/with-tenant-request';
import {
  rbacErrorToResponse,
  requireRole,
  resolveSessionDocenteId,
  STAFF_ROLES,
} from '@/lib/security/rbac';
import { resolveSedeScope, sedeErrorToResponse } from '@/lib/sede-scope';
import { mapCalendarioEvento } from '@/lib/calendario-academico/map';

/**
 * GET /api/instituciones/[id]/calendario-academico/para-autorizacion
 * Lista eventos académicos (tipo evento) de la sede del docente/admin.
 * Solo eventos con lugar (definidos por el admin en el calendario).
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const institucionId = Number.parseInt(id, 10);
    if (Number.isNaN(institucionId)) {
      return NextResponse.json({ error: 'ID de institución inválido' }, { status: 400 });
    }

    const ctx = await requireRole(request, STAFF_ROLES);
    enforceTenant(ctx.institutionId, institucionId);

    return await withTenantFromRequest(request, async (tx) => {
      let sedeFilter: { sede_id?: number | null } = {};

      if (ctx.role === 'docente') {
        const docenteId = await resolveSessionDocenteId(request);
        if (!docenteId) {
          return NextResponse.json({ error: 'Docente no encontrado' }, { status: 404 });
        }
        const docente = await tx.docentes.findFirst({
          where: { id: docenteId, institucion_id: institucionId },
          select: { sede_id: true },
        });
        if (!docente) {
          return NextResponse.json({ error: 'Docente no encontrado' }, { status: 404 });
        }
        sedeFilter = { sede_id: docente.sede_id ?? null };
      } else if (ctx.role === 'admin') {
        const scope = await resolveSedeScope(request, institucionId);
        if (!scope.allSedes) {
          sedeFilter = { sede_id: scope.sedeId ?? null };
        }
      }

      const from = new Date();
      from.setDate(from.getDate() - 7);
      from.setHours(0, 0, 0, 0);

      const eventos = await tx.calendarioAcademicoEventos.findMany({
        where: {
          institucion_id: institucionId,
          ...sedeFilter,
          tipo: { in: ['evento', 'reunion'] },
          fecha_fin: { gte: from },
          AND: [{ lugar: { not: null } }, { NOT: { lugar: '' } }],
        },
        include: { sede: { select: { id: true, nombre: true } } },
        orderBy: { fecha_inicio: 'asc' },
        take: 100,
      });

      return NextResponse.json({
        success: true,
        eventos: eventos.map(mapCalendarioEvento),
      });
    });
  } catch (error) {
    const sedeResp = sedeErrorToResponse(error);
    if (sedeResp) return sedeResp;
    const rbacResp = rbacErrorToResponse(error);
    if (rbacResp) return rbacResp;
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error listando eventos para autorización:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
