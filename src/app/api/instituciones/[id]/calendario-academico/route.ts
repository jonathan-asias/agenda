import { NextRequest, NextResponse } from 'next/server';
import { enforceTenant, tenantErrorToResponse } from '@/lib/tenant';
import { withAdminSedeDb } from '@/lib/security/require-admin-api';
import { rbacErrorToResponse } from '@/lib/security/rbac';
import {
  institutionSedeWhere,
  sedeDataForCreate,
  sedeErrorToResponse,
} from '@/lib/sede-scope';
import {
  CALENDARIO_TIPO_COLORS,
  isCalendarioEventoCategoria,
  normalizeCalendarioEventoTipo,
  type CalendarioEventoCategoria,
  type CalendarioEventoTipo,
} from '@/lib/calendario-academico/tipos';
import { mapCalendarioEvento, resolveEventoTitulo } from '@/lib/calendario-academico/map';

/**
 * GET /api/instituciones/[id]/calendario-academico
 * Admin de sede: solo su sede. Institución (owner): todas las sedes (consolidado).
 * Query: from, to (ISO), sedeId (solo owner, filtro opcional)
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

    const fromRaw = request.nextUrl.searchParams.get('from');
    const toRaw = request.nextUrl.searchParams.get('to');
    const sedeFilterParam = request.nextUrl.searchParams.get('sedeId');

    return await withAdminSedeDb(request, async (tx, { institutionId, scope }) => {
      enforceTenant(institutionId, institucionId);

      const where: {
        institucion_id: number;
        sede_id?: number | null;
        AND?: Array<Record<string, unknown>>;
      } = {
        ...institutionSedeWhere(institucionId, scope),
      };

      if (scope.allSedes && sedeFilterParam && sedeFilterParam !== 'all') {
        if (sedeFilterParam === 'principal') {
          where.sede_id = null;
        } else {
          const sedeId = Number.parseInt(sedeFilterParam, 10);
          if (!Number.isNaN(sedeId)) where.sede_id = sedeId;
        }
      }

      if (fromRaw && toRaw) {
        const from = new Date(fromRaw);
        const to = new Date(toRaw);
        if (!Number.isNaN(from.getTime()) && !Number.isNaN(to.getTime())) {
          where.AND = [
            { fecha_inicio: { lte: to } },
            { fecha_fin: { gte: from } },
          ];
        }
      }

      const eventos = await tx.calendarioAcademicoEventos.findMany({
        where,
        include: { sede: { select: { id: true, nombre: true } } },
        orderBy: { fecha_inicio: 'asc' },
      });

      const sedes = scope.allSedes
        ? await tx.sedes.findMany({
            where: { institucion_id: institucionId },
            select: { id: true, nombre: true },
            orderBy: { nombre: 'asc' },
          })
        : [];

      return NextResponse.json({
        success: true,
        consolidado: scope.allSedes,
        sedeId: scope.sedeId,
        sedes,
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
    console.error('Error listando calendario académico:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

/**
 * POST /api/instituciones/[id]/calendario-academico
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const institucionId = Number.parseInt(id, 10);
    if (Number.isNaN(institucionId)) {
      return NextResponse.json({ error: 'ID de institución inválido' }, { status: 400 });
    }

    const body = await request.json().catch(() => null);
    const tituloRaw = typeof body?.titulo === 'string' ? body.titulo.trim() : '';
    const descripcion =
      typeof body?.descripcion === 'string' ? body.descripcion.trim() : '';
    const lugar = typeof body?.lugar === 'string' ? body.lugar.trim() : '';
    const tipoRaw = typeof body?.tipo === 'string' ? body.tipo.trim() : 'otro';
    const categoriaRaw =
      typeof body?.categoria === 'string' ? body.categoria.trim() : '';
    const todoElDia = body?.todoElDia !== false;
    const fechaInicio = typeof body?.fechaInicio === 'string' ? new Date(body.fechaInicio) : null;
    const fechaFin = typeof body?.fechaFin === 'string' ? new Date(body.fechaFin) : null;
    const color = typeof body?.color === 'string' ? body.color.trim() : null;

    if (!fechaInicio || Number.isNaN(fechaInicio.getTime())) {
      return NextResponse.json({ error: 'Fecha de inicio inválida' }, { status: 400 });
    }
    if (!fechaFin || Number.isNaN(fechaFin.getTime())) {
      return NextResponse.json({ error: 'Fecha de fin inválida' }, { status: 400 });
    }
    if (fechaFin.getTime() < fechaInicio.getTime()) {
      return NextResponse.json(
        { error: 'La fecha de fin no puede ser anterior al inicio' },
        { status: 400 }
      );
    }

    const tipo: CalendarioEventoTipo = normalizeCalendarioEventoTipo(tipoRaw);
    let categoria: CalendarioEventoCategoria | null = null;
    if (tipo === 'evento') {
      if (!isCalendarioEventoCategoria(categoriaRaw)) {
        return NextResponse.json(
          { error: 'Selecciona el tipo de evento (salida pedagógica, izada de bandera, etc.)' },
          { status: 400 }
        );
      }
      categoria = categoriaRaw;
      if (!lugar) {
        return NextResponse.json({ error: 'Indica el lugar del evento' }, { status: 400 });
      }
    }

    const titulo = resolveEventoTitulo({ titulo: tituloRaw, tipo, categoria });

    return await withAdminSedeDb(request, async (tx, { institutionId, scope }) => {
      enforceTenant(institutionId, institucionId);

      let sedeId: number | null;
      if (scope.allSedes) {
        if (body?.sedeId === null || body?.sedeId === 'principal' || body?.sedeId === '') {
          sedeId = null;
        } else if (typeof body?.sedeId === 'number' || typeof body?.sedeId === 'string') {
          const parsed = Number.parseInt(String(body.sedeId), 10);
          if (Number.isNaN(parsed)) {
            return NextResponse.json({ error: 'Sede inválida' }, { status: 400 });
          }
          const sede = await tx.sedes.findFirst({
            where: { id: parsed, institucion_id: institucionId },
            select: { id: true },
          });
          if (!sede) {
            return NextResponse.json({ error: 'Sede no encontrada' }, { status: 404 });
          }
          sedeId = sede.id;
        } else {
          const countSedes = await tx.sedes.count({ where: { institucion_id: institucionId } });
          if (countSedes > 0) {
            return NextResponse.json(
              { error: 'Selecciona la sede del evento' },
              { status: 400 }
            );
          }
          sedeId = null;
        }
      } else {
        sedeId = sedeDataForCreate(scope).sede_id;
      }

      const created = await tx.calendarioAcademicoEventos.create({
        data: {
          institucion_id: institucionId,
          sede_id: sedeId,
          titulo,
          descripcion: descripcion || null,
          tipo,
          categoria,
          lugar: tipo === 'evento' ? lugar || null : null,
          todo_el_dia: todoElDia,
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          color: color || CALENDARIO_TIPO_COLORS[tipo],
        },
        include: { sede: { select: { id: true, nombre: true } } },
      });

      return NextResponse.json({ success: true, evento: mapCalendarioEvento(created) }, { status: 201 });
    });
  } catch (error) {
    const sedeResp = sedeErrorToResponse(error);
    if (sedeResp) return sedeResp;
    const rbacResp = rbacErrorToResponse(error);
    if (rbacResp) return rbacResp;
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error creando evento calendario:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
