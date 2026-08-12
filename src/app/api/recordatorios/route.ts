import { NextRequest, NextResponse } from 'next/server';
import { sendReminderEmailNotification } from '@/lib/notifications/reminder';
import { sendPushNotification } from '@/lib/notifications/push';
import {
  enforceTenant,
  tenantErrorToResponse
} from '@/lib/tenant';
import { withTenantFromRequest } from '@/lib/db/with-tenant-request';
import { checkRateLimit, rateLimitResponse } from '@/lib/security/rate-limit';
import {
  assertDocenteSelfOrStaff,
  rbacErrorToResponse,
  requireInstitutionAuth,
  resolveSessionDocenteId,
} from '@/lib/security/rbac';
import { resolveEmailLinkBaseUrl } from '@/lib/app-url';
import { isRecordatorioTipo } from '@/lib/recordatorios/tipos';
import {
  buildAutorizacionResponderUrl,
  createAutorizacionToken,
} from '@/lib/security/autorizacion-token';
import {
  computeAutorizacionVencimiento,
  validateAutorizacionVencimiento,
  validateHoraFin,
} from '@/lib/recordatorios/autorizacion';

function resolvePublicBaseUrl(request: NextRequest): string {
  return resolveEmailLinkBaseUrl(request);
}

function toNoonUtcIso(dateInput: string): Date | null {
  const trimmed = dateInput.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [y, m, d] = trimmed.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  }
  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function parseIdList(raw: unknown): number[] {
  if (Array.isArray(raw)) {
    return raw
      .map((id) => parseInt(String(id), 10))
      .filter((id) => Number.isFinite(id) && id > 0);
  }
  if (typeof raw === 'string' && raw.trim()) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parseIdList(parsed);
    } catch {
      return raw
        .split(',')
        .map((id) => parseInt(id.trim(), 10))
        .filter((id) => Number.isFinite(id) && id > 0);
    }
  }
  return [];
}

function parseModoEnvio(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.map((m) => String(m).toLowerCase());
  }
  if (typeof raw === 'string' && raw.trim()) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parseModoEnvio(parsed);
    } catch {
      return raw.split(',').map((m) => m.trim().toLowerCase()).filter(Boolean);
    }
  }
  return [];
}

type ParsedBody = {
  nombre: string;
  descripcion: string;
  fecha: string;
  tipo: string;
  modoEnvio: string[];
  docenteId: string;
  gradoId: string;
  cursoId: string;
  areaId: string;
  materiaId: string;
  estudiantesSeleccionados: number[];
  eventoNombre: string;
  fechaEvento: string;
  lugarEvento: string;
  horaFin: string;
  horaLlegada: string;
  calendarioEventoId: number | null;
};

async function parseRequestBody(request: NextRequest): Promise<ParsedBody> {
  const contentType = request.headers.get('content-type') || '';
  if (contentType.includes('multipart/form-data')) {
    const form = await request.formData();
    return {
      nombre: String(form.get('nombre') ?? ''),
      descripcion: String(form.get('descripcion') ?? ''),
      fecha: String(form.get('fecha') ?? ''),
      tipo: String(form.get('tipo') ?? ''),
      modoEnvio: parseModoEnvio(form.get('modoEnvio')),
      docenteId: String(form.get('docenteId') ?? ''),
      gradoId: String(form.get('gradoId') ?? ''),
      cursoId: String(form.get('cursoId') ?? ''),
      areaId: String(form.get('areaId') ?? ''),
      materiaId: String(form.get('materiaId') ?? ''),
      estudiantesSeleccionados: parseIdList(form.get('estudiantesSeleccionados')),
      eventoNombre: String(form.get('eventoNombre') ?? ''),
      fechaEvento: String(form.get('fechaEvento') ?? ''),
      lugarEvento: String(form.get('lugarEvento') ?? ''),
      horaFin: String(form.get('horaFin') ?? ''),
      horaLlegada: String(form.get('horaLlegada') ?? ''),
      calendarioEventoId: (() => {
        const raw = form.get('calendarioEventoId');
        if (raw == null || raw === '') return null;
        const n = Number.parseInt(String(raw), 10);
        return Number.isFinite(n) && n > 0 ? n : null;
      })(),
    };
  }

  const body = await request.json();
  return {
    nombre: String(body?.nombre ?? ''),
    descripcion: String(body?.descripcion ?? ''),
    fecha: String(body?.fecha ?? ''),
    tipo: String(body?.tipo ?? ''),
    modoEnvio: parseModoEnvio(body?.modoEnvio),
    docenteId: String(body?.docenteId ?? ''),
    gradoId: String(body?.gradoId ?? ''),
    cursoId: String(body?.cursoId ?? ''),
    areaId: String(body?.areaId ?? ''),
    materiaId: String(body?.materiaId ?? ''),
    estudiantesSeleccionados: parseIdList(body?.estudiantesSeleccionados),
    eventoNombre: String(body?.eventoNombre ?? body?.evento_nombre ?? ''),
    fechaEvento: String(body?.fechaEvento ?? body?.fecha_evento ?? ''),
    lugarEvento: String(body?.lugarEvento ?? body?.lugar_evento ?? ''),
    horaFin: String(body?.horaFin ?? body?.hora_fin ?? ''),
    horaLlegada: String(body?.horaLlegada ?? body?.hora_llegada ?? ''),
    calendarioEventoId: (() => {
      const raw = body?.calendarioEventoId ?? body?.calendario_evento_id;
      if (raw == null || raw === '') return null;
      const n = Number.parseInt(String(raw), 10);
      return Number.isFinite(n) && n > 0 ? n : null;
    })(),
  };
}

export async function POST(request: NextRequest) {
  try {
    const rate = checkRateLimit(request, 'recordatorios-create', {
      max: 15,
      windowSec: 300,
    });
    if (!rate.ok) {
      return rateLimitResponse(
        rate.retryAfterSec ?? 300,
        `Has enviado demasiados recordatorios. Espera ${Math.max(1, Math.ceil((rate.retryAfterSec ?? 300) / 60))} minuto(s) e inténtalo de nuevo.`
      );
    }

    const body = await parseRequestBody(request);
    const {
      nombre,
      descripcion,
      fecha,
      tipo,
      modoEnvio,
      docenteId,
      gradoId,
      cursoId,
      areaId,
      materiaId,
      estudiantesSeleccionados,
      eventoNombre,
      fechaEvento,
      lugarEvento,
      horaFin,
      horaLlegada,
      calendarioEventoId,
    } = body;

    if (!nombre.trim() || !descripcion.trim() || !fecha || !tipo) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    if (!docenteId || !gradoId || !cursoId || !areaId || !materiaId) {
      return NextResponse.json(
        { error: 'Faltan relaciones requeridas (docente, grado, curso, área, materia)' },
        { status: 400 }
      );
    }

    if (estudiantesSeleccionados.length === 0) {
      return NextResponse.json(
        { error: 'Debe seleccionar al menos un estudiante' },
        { status: 400 }
      );
    }

    if (!isRecordatorioTipo(tipo)) {
      return NextResponse.json(
        { error: 'Tipo de recordatorio inválido' },
        { status: 400 }
      );
    }

    const esAutorizacion = tipo === 'autorizacion';
    if (esAutorizacion) {
      if (!calendarioEventoId) {
        return NextResponse.json(
          { error: 'Selecciona un evento del calendario académico' },
          { status: 400 }
        );
      }
      if (!eventoNombre.trim()) {
        return NextResponse.json(
          { error: 'Indica a qué evento pertenece la autorización' },
          { status: 400 }
        );
      }
      if (!lugarEvento.trim()) {
        return NextResponse.json(
          { error: 'El lugar del evento es requerido' },
          { status: 400 }
        );
      }
      if (!fechaEvento) {
        return NextResponse.json(
          { error: 'La fecha y hora del evento son requeridas' },
          { status: 400 }
        );
      }
      if (!horaFin) {
        return NextResponse.json(
          { error: 'La hora de fin del evento es requerida' },
          { status: 400 }
        );
      }
    }

    const docenteRate = checkRateLimit(
      request,
      `recordatorios:docente:${String(docenteId)}`,
      { max: 10, windowSec: 300 }
    );
    if (!docenteRate.ok) {
      return rateLimitResponse(
        docenteRate.retryAfterSec ?? 300,
        `Has enviado demasiados recordatorios. Espera ${Math.max(1, Math.ceil((docenteRate.retryAfterSec ?? 300) / 60))} minuto(s) e inténtalo de nuevo.`
      );
    }

    const parsedDocenteId = parseInt(docenteId, 10);
    const ctx = await requireInstitutionAuth(request);
    const sessionDocenteId =
      ctx.role === 'docente' ? await resolveSessionDocenteId(request) : null;
    assertDocenteSelfOrStaff(ctx, parsedDocenteId, sessionDocenteId);

    let fechaDateTime = toNoonUtcIso(fecha);
    if (!fechaDateTime) {
      return NextResponse.json({ error: 'Fecha inválida' }, { status: 400 });
    }

    const fechaEventoDateTime = esAutorizacion ? toNoonUtcIso(fechaEvento) : null;
    if (esAutorizacion && !fechaEventoDateTime) {
      return NextResponse.json({ error: 'Fecha del evento inválida' }, { status: 400 });
    }
    const horaFinDateTime = esAutorizacion ? toNoonUtcIso(horaFin) : null;
    if (esAutorizacion && !horaFinDateTime) {
      return NextResponse.json({ error: 'Hora de fin inválida' }, { status: 400 });
    }
    if (esAutorizacion && fechaEventoDateTime && horaFinDateTime) {
      const finError = validateHoraFin(fechaEventoDateTime, horaFinDateTime);
      if (finError) {
        return NextResponse.json({ error: finError }, { status: 400 });
      }
    }
    if (esAutorizacion && fechaEventoDateTime) {
      // Forzar vencimiento exacto: evento − 30 min
      fechaDateTime = computeAutorizacionVencimiento(fechaEventoDateTime);
      const vencError = validateAutorizacionVencimiento(fechaDateTime, fechaEventoDateTime);
      if (vencError) {
        return NextResponse.json({ error: vencError }, { status: 400 });
      }
    }

    return await withTenantFromRequest(request, async (tx, userInstitutionId) => {
      const docente = await tx.docentes.findUnique({
        where: { id: parsedDocenteId },
        include: { institucion: true }
      });

      if (!docente) {
        return NextResponse.json(
          { error: 'Docente no encontrado' },
          { status: 404 }
        );
      }

      enforceTenant(userInstitutionId, docente.institucion_id);

      const estudiantes = await tx.estudiantes.findMany({
        where: {
          id: { in: estudiantesSeleccionados },
          curso_id: parseInt(cursoId, 10),
          institucion_id: userInstitutionId,
          activo: true
        }
      });

      if (estudiantes.length !== estudiantesSeleccionados.length) {
        return NextResponse.json(
          { error: 'Uno o más estudiantes no existen o no pertenecen al curso seleccionado' },
          { status: 400 }
        );
      }

      const modoEnviosValidos = ['sms', 'whatsapp', 'email'];
      let modoEnvioStr: string | null = null;
      if (modoEnvio.length > 0) {
        const filtrados = modoEnvio.filter((m) => modoEnviosValidos.includes(m));
        if (filtrados.length > 0) {
          modoEnvioStr = filtrados.join(',');
        }
      }

      let calendarioEventoIdValido: number | null = null;
      if (esAutorizacion && calendarioEventoId) {
        const cal = await tx.calendarioAcademicoEventos.findFirst({
          where: {
            id: calendarioEventoId,
            institucion_id: userInstitutionId,
            tipo: { in: ['evento', 'reunion'] },
          },
          select: { id: true },
        });
        if (!cal) {
          return NextResponse.json(
            { error: 'El evento del calendario no existe o no pertenece a esta institución' },
            { status: 400 }
          );
        }
        calendarioEventoIdValido = cal.id;
      }

      const nuevoRecordatorio = await tx.recordatorios.create({
        data: {
          nombre: nombre.trim(),
          descripcion: descripcion.trim(),
          fecha: fechaDateTime,
          tipo,
          modo_envio: modoEnvioStr,
          motivo: null,
          evento_nombre: esAutorizacion ? eventoNombre.trim() : null,
          fecha_evento: esAutorizacion ? fechaEventoDateTime : null,
          lugar_evento: esAutorizacion ? lugarEvento.trim() : null,
          hora_fin: esAutorizacion ? horaFinDateTime : null,
          hora_llegada: null,
          calendario_evento_id: calendarioEventoIdValido,
          documento_path: null,
          documento_nombre: null,
          documento_mime: null,
          documento_tamano: null,
          docente_id: parsedDocenteId,
          grado_id: parseInt(gradoId, 10),
          curso_id: parseInt(cursoId, 10),
          area_id: parseInt(areaId, 10),
          materia_id: parseInt(materiaId, 10)
        }
      });

      await tx.recordatorioEstudiantes.createMany({
        data: estudiantesSeleccionados.map((estudianteId) => ({
          recordatorio_id: nuevoRecordatorio.id,
          estudiante_id: estudianteId
        }))
      });

      const enviarPorEmail = modoEnvio.some((m) => m === 'email');
      if (enviarPorEmail) {
        const docenteNombre = `${docente.nombres} ${docente.apellidos}`.trim();
        const baseUrl = resolvePublicBaseUrl(request);
        const autorizacionPayload = esAutorizacion
          ? {
              eventoNombre: eventoNombre.trim(),
              lugarEvento: lugarEvento.trim(),
              fechaEvento: fechaEventoDateTime,
              horaFin: horaFinDateTime,
              fechaVencimiento: fechaDateTime,
            }
          : null;

        if (esAutorizacion) {
          // Un correo por estudiante con enlace firmado personalizado.
          void (async () => {
            for (const estudiante of estudiantes) {
              const email = estudiante.correo_acudiente?.trim();
              if (!email) continue;
              try {
                let autorizacionHref: string | null = null;
                try {
                  const token = createAutorizacionToken(
                    nuevoRecordatorio.id,
                    estudiante.id,
                    fechaDateTime
                  );
                  autorizacionHref = buildAutorizacionResponderUrl(baseUrl, token);
                } catch (tokenErr) {
                  if (process.env.NODE_ENV !== 'test') {
                    console.error(
                      'No se pudo firmar enlace de autorización (revisa PUSH_ACTIVATION_SECRET):',
                      tokenErr
                    );
                  }
                }
                await sendReminderEmailNotification({
                  institucionNombre: docente.institucion.nombre,
                  docenteNombre,
                  titulo: nombre.trim(),
                  descripcion: descripcion.trim(),
                  fechaLimite: fechaDateTime,
                  emails: [email],
                  baseUrl: baseUrl || undefined,
                  primerEstudianteId: estudiante.id,
                  autorizacion: autorizacionPayload,
                  autorizacionHref,
                });
              } catch (err) {
                if (process.env.NODE_ENV !== 'test') {
                  console.error(
                    `Error enviando autorización a estudiante ${estudiante.id}:`,
                    err
                  );
                }
              }
            }
          })().catch(() => {});
        } else {
          const emailsDestino = [
            ...new Set(
              estudiantes
                .map((e) => e.correo_acudiente)
                .filter((email): email is string => Boolean(email?.trim()))
            ),
          ];
          if (emailsDestino.length > 0) {
            sendReminderEmailNotification({
              institucionNombre: docente.institucion.nombre,
              docenteNombre,
              titulo: nombre.trim(),
              descripcion: descripcion.trim(),
              fechaLimite: fechaDateTime,
              emails: emailsDestino,
              baseUrl: baseUrl || undefined,
              primerEstudianteId: estudiantes[0]?.id,
              autorizacion: null,
            }).catch(() => {});
          }
        }
      }

      const emailsAcudientes = [
        ...new Set(
          estudiantes
            .map((e) => e.correo_acudiente)
            .filter((email): email is string => Boolean(email?.trim()))
        )
      ];
      if (emailsAcudientes.length > 0) {
        const acudientes = await tx.acudientes.findMany({
          where: {
            institucion_id: userInstitutionId,
            email: { in: emailsAcudientes }
          },
          select: { id: true }
        });
        const fechaISO = fechaDateTime.toISOString().slice(0, 10);
        const pushBaseUrl = resolvePublicBaseUrl(request);
        const consultarPath = `/consultar-recordatorios?fecha=${encodeURIComponent(fechaISO)}`;
        sendPushNotification({
          institucionId: userInstitutionId,
          title: nombre.trim(),
          body:
            descripcion.trim().slice(0, 200) +
            (descripcion.trim().length > 200 ? '...' : ''),
          acudienteIds: acudientes.length > 0 ? acudientes.map((a) => a.id) : undefined,
          data: {
            url: pushBaseUrl ? `${pushBaseUrl.replace(/\/$/, '')}${consultarPath}` : consultarPath,
          },
        }).catch((err) => {
          if (process.env.NODE_ENV !== 'test') {
            console.error('Error en envío push tras recordatorio:', err);
          }
        });
      }

      return NextResponse.json(
        {
          success: true,
          recordatorio: {
            id: nuevoRecordatorio.id,
            nombre: nuevoRecordatorio.nombre,
            descripcion: nuevoRecordatorio.descripcion,
            fecha: nuevoRecordatorio.fecha,
            tipo: nuevoRecordatorio.tipo,
            evento_nombre: nuevoRecordatorio.evento_nombre,
            fecha_evento: nuevoRecordatorio.fecha_evento,
            lugar_evento: nuevoRecordatorio.lugar_evento,
            hora_fin: nuevoRecordatorio.hora_fin,
            hora_llegada: nuevoRecordatorio.hora_llegada,
          }
        },
        { status: 201 }
      );
    });
  } catch (error) {
    const rbacResp = rbacErrorToResponse(error);
    if (rbacResp) return rbacResp;
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error creando recordatorio:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
