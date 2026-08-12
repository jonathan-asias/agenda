import { NextRequest, NextResponse } from 'next/server';
import { enforceTenant, tenantErrorToResponse } from '@/lib/tenant';
import { withAdminSedeDb } from '@/lib/security/require-admin-api';
import { rbacErrorToResponse } from '@/lib/security/rbac';
import {
  assertRecordBelongsToSede,
  institutionSedeWhere,
  sedeErrorToResponse,
} from '@/lib/sede-scope';
import {
  CALENDARIO_TIPO_COLORS,
  isCalendarioEventoCategoria,
  normalizeCalendarioEventoTipo,
  type CalendarioEventoCategoria,
} from '@/lib/calendario-academico/tipos';
import { mapCalendarioEvento, resolveEventoTitulo } from '@/lib/calendario-academico/map';

/**
 * PATCH /api/instituciones/[id]/calendario-academico/[eventId]
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; eventId: string }> }
) {
  try {
    const { id, eventId: eventIdRaw } = await params;
    const institucionId = Number.parseInt(id, 10);
    const eventId = Number.parseInt(eventIdRaw, 10);
    if (Number.isNaN(institucionId) || Number.isNaN(eventId)) {
      return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 });
    }

    const body = await request.json().catch(() => null);

    return await withAdminSedeDb(request, async (tx, { institutionId, scope }) => {
      enforceTenant(institutionId, institucionId);

      const existing = await tx.calendarioAcademicoEventos.findFirst({
        where: { id: eventId, ...institutionSedeWhere(institucionId, scope) },
      });
      if (!existing) {
        return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
      }
      assertRecordBelongsToSede(existing.sede_id, scope);

      const autorizacionesEnCurso = await tx.recordatorios.count({
        where: {
          calendario_evento_id: eventId,
          tipo: 'autorizacion',
        },
      });
      if (autorizacionesEnCurso > 0) {
        return NextResponse.json(
          {
            error:
              'No se puede editar el evento: ya hay autorizaciones vinculadas. Por seguridad queda bloqueado.',
          },
          { status: 409 }
        );
      }

      const data: {
        titulo?: string;
        descripcion?: string | null;
        tipo?: string;
        categoria?: string | null;
        lugar?: string | null;
        todo_el_dia?: boolean;
        fecha_inicio?: Date;
        fecha_fin?: Date;
        color?: string | null;
        sede_id?: number | null;
      } = {};

      if (typeof body?.descripcion === 'string') {
        data.descripcion = body.descripcion.trim() || null;
      }
      if (typeof body?.todoElDia === 'boolean') data.todo_el_dia = body.todoElDia;
      if (typeof body?.fechaInicio === 'string') {
        const d = new Date(body.fechaInicio);
        if (Number.isNaN(d.getTime())) {
          return NextResponse.json({ error: 'Fecha de inicio inválida' }, { status: 400 });
        }
        data.fecha_inicio = d;
      }
      if (typeof body?.fechaFin === 'string') {
        const d = new Date(body.fechaFin);
        if (Number.isNaN(d.getTime())) {
          return NextResponse.json({ error: 'Fecha de fin inválida' }, { status: 400 });
        }
        data.fecha_fin = d;
      }
      if (typeof body?.color === 'string') {
        data.color = body.color.trim() || null;
      }

      const nextTipo =
        typeof body?.tipo === 'string'
          ? normalizeCalendarioEventoTipo(body.tipo)
          : normalizeCalendarioEventoTipo(existing.tipo);
      data.tipo = nextTipo;

      let nextCategoria: CalendarioEventoCategoria | null = null;
      if (nextTipo === 'evento') {
        const catRaw =
          typeof body?.categoria === 'string'
            ? body.categoria.trim()
            : existing.categoria || '';
        if (!isCalendarioEventoCategoria(catRaw)) {
          return NextResponse.json(
            { error: 'Selecciona el tipo de evento' },
            { status: 400 }
          );
        }
        nextCategoria = catRaw;
        data.categoria = nextCategoria;
        const lugarRaw =
          typeof body?.lugar === 'string' ? body.lugar.trim() : existing.lugar || '';
        if (!lugarRaw) {
          return NextResponse.json({ error: 'Indica el lugar del evento' }, { status: 400 });
        }
        data.lugar = lugarRaw;
      } else {
        data.categoria = null;
        data.lugar = null;
      }

      if (!body?.color) {
        data.color = CALENDARIO_TIPO_COLORS[nextTipo];
      }

      const tituloRaw =
        typeof body?.titulo === 'string' ? body.titulo.trim() : existing.titulo;
      data.titulo = resolveEventoTitulo({
        titulo: tituloRaw,
        tipo: nextTipo,
        categoria: nextCategoria,
      });

      if (scope.allSedes && body?.sedeId !== undefined) {
        if (body.sedeId === null || body.sedeId === 'principal' || body.sedeId === '') {
          data.sede_id = null;
        } else {
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
          data.sede_id = sede.id;
        }
      }

      const inicio = data.fecha_inicio ?? existing.fecha_inicio;
      const fin = data.fecha_fin ?? existing.fecha_fin;
      if (fin.getTime() < inicio.getTime()) {
        return NextResponse.json(
          { error: 'La fecha de fin no puede ser anterior al inicio' },
          { status: 400 }
        );
      }

      const updated = await tx.calendarioAcademicoEventos.update({
        where: { id: eventId },
        data,
        include: { sede: { select: { id: true, nombre: true } } },
      });

      return NextResponse.json({ success: true, evento: mapCalendarioEvento(updated) });
    });
  } catch (error) {
    const sedeResp = sedeErrorToResponse(error);
    if (sedeResp) return sedeResp;
    const rbacResp = rbacErrorToResponse(error);
    if (rbacResp) return rbacResp;
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error actualizando evento calendario:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

/**
 * DELETE /api/instituciones/[id]/calendario-academico/[eventId]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; eventId: string }> }
) {
  try {
    const { id, eventId: eventIdRaw } = await params;
    const institucionId = Number.parseInt(id, 10);
    const eventId = Number.parseInt(eventIdRaw, 10);
    if (Number.isNaN(institucionId) || Number.isNaN(eventId)) {
      return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 });
    }

    return await withAdminSedeDb(request, async (tx, { institutionId, scope }) => {
      enforceTenant(institutionId, institucionId);

      const existing = await tx.calendarioAcademicoEventos.findFirst({
        where: { id: eventId, ...institutionSedeWhere(institucionId, scope) },
      });
      if (!existing) {
        return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
      }
      assertRecordBelongsToSede(existing.sede_id, scope);

      const autorizacionesEnCurso = await tx.recordatorios.count({
        where: {
          calendario_evento_id: eventId,
          tipo: 'autorizacion',
        },
      });
      if (autorizacionesEnCurso > 0) {
        return NextResponse.json(
          {
            error:
              'No se puede eliminar el evento: ya hay autorizaciones vinculadas. Por seguridad queda bloqueado.',
          },
          { status: 409 }
        );
      }

      await tx.calendarioAcademicoEventos.delete({ where: { id: eventId } });
      return NextResponse.json({ success: true });
    });
  } catch (error) {
    const sedeResp = sedeErrorToResponse(error);
    if (sedeResp) return sedeResp;
    const rbacResp = rbacErrorToResponse(error);
    if (rbacResp) return rbacResp;
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error eliminando evento calendario:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
