import { NextRequest, NextResponse } from 'next/server';
import { enforceTenant, tenantErrorToResponse } from '@/lib/tenant';
import { withAdminSedeDb } from '@/lib/security/require-admin-api';
import { rbacErrorToResponse } from '@/lib/security/rbac';
import {
  assertRecordBelongsToSede,
  institutionSedeWhere,
  sedeErrorToResponse,
} from '@/lib/sede-scope';

/**
 * GET /api/instituciones/[id]/calendario-academico/[eventId]/autorizaciones
 * Resumen de recordatorios de autorización vinculados al evento.
 */
export async function GET(
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
        select: { id: true, sede_id: true },
      });
      if (!existing) {
        return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
      }
      assertRecordBelongsToSede(existing.sede_id, scope);

      const recordatorios = await tx.recordatorios.findMany({
        where: {
          calendario_evento_id: eventId,
          tipo: 'autorizacion',
          docente: { institucion_id: institucionId },
        },
        select: {
          id: true,
          nombre: true,
          grado: { select: { id: true, nombre: true } },
          curso: { select: { id: true, nombre: true } },
          docente: {
            select: { id: true, nombres: true, apellidos: true },
          },
          estudiantes: {
            select: {
              autorizacion_respuesta: true,
              estudiante: {
                select: {
                  id: true,
                  nombres: true,
                  apellidos: true,
                  codigo_estudiantil: true,
                },
              },
            },
          },
        },
        orderBy: { created_at: 'desc' },
      });

      let autorizaron = 0;
      let noAutorizaron = 0;
      let pendientes = 0;
      let respuestas = 0;

      const detalle = recordatorios.map((rec) => {
        let a = 0;
        let n = 0;
        let p = 0;
        for (const vinculo of rec.estudiantes) {
          if (vinculo.autorizacion_respuesta === 'autorizado') {
            a += 1;
            respuestas += 1;
          } else if (vinculo.autorizacion_respuesta === 'no_autorizado') {
            n += 1;
            respuestas += 1;
          } else {
            p += 1;
          }
        }
        autorizaron += a;
        noAutorizaron += n;
        pendientes += p;
        return {
          id: rec.id,
          nombre: rec.nombre,
          gradoNombre: rec.grado.nombre,
          cursoNombre: rec.curso.nombre,
          docenteNombre: `${rec.docente.nombres} ${rec.docente.apellidos}`.trim(),
          resumen: {
            autorizaron: a,
            noAutorizaron: n,
            pendientes: p,
            total: rec.estudiantes.length,
          },
        };
      });

      const tieneAutorizaciones = recordatorios.length > 0;
      const tieneRespuestas = respuestas > 0;
      // En curso o con respuestas: no se puede editar/eliminar el evento
      const bloqueado = tieneAutorizaciones;

      return NextResponse.json({
        success: true,
        bloqueado,
        tieneAutorizaciones,
        tieneRespuestas,
        resumen: {
          autorizaron,
          noAutorizaron,
          pendientes,
          total: autorizaron + noAutorizaron + pendientes,
          recordatorios: recordatorios.length,
        },
        recordatorios: detalle,
      });
    });
  } catch (error) {
    const sedeResp = sedeErrorToResponse(error);
    if (sedeResp) return sedeResp;
    const rbacResp = rbacErrorToResponse(error);
    if (rbacResp) return rbacResp;
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error listando autorizaciones del evento:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
