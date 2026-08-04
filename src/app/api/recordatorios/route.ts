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
import { APP_URL } from '@/lib/env';

function resolvePublicBaseUrl(request: NextRequest): string {
  return (
    APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    request.nextUrl?.origin ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '')
  );
}

export async function POST(request: NextRequest) {
  try {
    const rate = checkRateLimit(request, 'recordatorios-create', {
      max: 15,
      windowSec: 300,
    });
    if (!rate.ok) {
      return rateLimitResponse(rate.retryAfterSec ?? 300);
    }

    const body = await request.json();
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
      estudiantesSeleccionados
    } = body;

    if (!nombre || !descripcion || !fecha || !tipo) {
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

    if (!Array.isArray(estudiantesSeleccionados) || estudiantesSeleccionados.length === 0) {
      return NextResponse.json(
        { error: 'Debe seleccionar al menos un estudiante' },
        { status: 400 }
      );
    }

    const tiposValidos = ['tarea', 'examen', 'evento', 'otro'];
    if (!tiposValidos.includes(tipo)) {
      return NextResponse.json(
        { error: 'Tipo de recordatorio inválido' },
        { status: 400 }
      );
    }

    const docenteRate = checkRateLimit(
      request,
      `recordatorios:docente:${String(docenteId)}`,
      { max: 10, windowSec: 300 }
    );
    if (!docenteRate.ok) {
      return rateLimitResponse(docenteRate.retryAfterSec ?? 300);
    }

    const parsedDocenteId = parseInt(docenteId);
    const ctx = await requireInstitutionAuth(request);
    const sessionDocenteId =
      ctx.role === 'docente' ? await resolveSessionDocenteId(request) : null;
    assertDocenteSelfOrStaff(ctx, parsedDocenteId, sessionDocenteId);

    return await withTenantFromRequest(request, async (tx, userInstitutionId) => {
      const docente = await tx.docentes.findUnique({
        where: { id: parseInt(docenteId) },
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
          id: { in: estudiantesSeleccionados.map((id: number) => parseInt(id.toString())) },
          curso_id: parseInt(cursoId),
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
      if (Array.isArray(modoEnvio) && modoEnvio.length > 0) {
        const filtrados = modoEnvio.filter((m: string) =>
          modoEnviosValidos.includes(String(m).toLowerCase())
        );
        if (filtrados.length > 0) {
          modoEnvioStr = filtrados.map((m: string) => String(m).toLowerCase()).join(',');
        }
      }

      const fechaDateTime = new Date(fecha);

      const nuevoRecordatorio = await tx.recordatorios.create({
        data: {
          nombre: nombre.trim(),
          descripcion: descripcion.trim(),
          fecha: fechaDateTime,
          tipo,
          modo_envio: modoEnvioStr,
          docente_id: parseInt(docenteId),
          grado_id: parseInt(gradoId),
          curso_id: parseInt(cursoId),
          area_id: parseInt(areaId),
          materia_id: parseInt(materiaId)
        }
      });

      await tx.recordatorioEstudiantes.createMany({
        data: estudiantesSeleccionados.map((estudianteId: number) => ({
          recordatorio_id: nuevoRecordatorio.id,
          estudiante_id: parseInt(estudianteId.toString())
        }))
      });

      const enviarPorEmail =
        Array.isArray(modoEnvio) &&
        modoEnvio.some((m: string) => String(m).toLowerCase() === 'email');
      if (enviarPorEmail) {
        const emailsDestino = [
          ...new Set(
            estudiantes
              .map((e) => e.correo_acudiente)
              .filter((email): email is string => Boolean(email?.trim()))
          )
        ];
        if (emailsDestino.length > 0) {
          const docenteNombre = `${docente.nombres} ${docente.apellidos}`.trim();
          const baseUrl = resolvePublicBaseUrl(request);
          sendReminderEmailNotification({
            institucionNombre: docente.institucion.nombre,
            docenteNombre,
            titulo: nombre.trim(),
            descripcion: descripcion.trim(),
            fechaLimite: fechaDateTime,
            emails: emailsDestino,
            baseUrl: baseUrl || undefined,
            primerEstudianteId: estudiantes[0]?.id
          }).catch(() => {});
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
            tipo: nuevoRecordatorio.tipo
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
