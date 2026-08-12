import { NextRequest, NextResponse } from 'next/server';
import { withDbBypass } from '@/lib/db/rls-context';
import { checkRateLimit, rateLimitResponse } from '@/lib/security/rate-limit';
import {
  extractCaptchaToken,
  requireTurnstileOrError,
} from '@/lib/security/turnstile';
import { isAutorizacionRespuesta } from '@/lib/recordatorios/tipos';

const FECHA_RE = /^\d{4}-\d{2}-\d{2}$/;

function normalizeIdentificador(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function parseFechaDia(fecha: string): { start: Date; end: Date } | null {
  if (!FECHA_RE.test(fecha)) return null;
  const start = new Date(`${fecha}T00:00:00.000Z`);
  if (Number.isNaN(start.getTime())) return null;
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { start, end };
}

/**
 * POST /api/recordatorios/consultar/autorizar
 * Registra la respuesta del acudiente (autorizó / no autorizó) tras consultar.
 */
export async function POST(request: NextRequest) {
  try {
    const rate = checkRateLimit(request, 'recordatorios-autorizar', {
      max: 20,
      windowSec: 300,
    });
    if (!rate.ok) {
      return rateLimitResponse(rate.retryAfterSec ?? 300);
    }

    const body = await request.json().catch(() => null);
    const identificadorRaw =
      typeof body?.identificador === 'string' ? body.identificador : '';
    const fechaRaw = typeof body?.fecha === 'string' ? body.fecha.trim() : '';
    const recordatorioId = Number(body?.recordatorioId);
    const respuestaRaw =
      typeof body?.respuesta === 'string' ? body.respuesta.trim() : '';

    const captchaError = await requireTurnstileOrError(extractCaptchaToken(body));
    if (captchaError) return captchaError;

    const identificador = normalizeIdentificador(identificadorRaw);
    if (!identificador || identificador.length < 2) {
      return NextResponse.json(
        { error: 'Ingresa el nombre completo o el código del estudiante' },
        { status: 400 }
      );
    }

    const rango = parseFechaDia(fechaRaw);
    if (!rango) {
      return NextResponse.json(
        { error: 'La fecha es inválida. Usa el formato AAAA-MM-DD' },
        { status: 400 }
      );
    }

    if (!Number.isFinite(recordatorioId) || recordatorioId <= 0) {
      return NextResponse.json(
        { error: 'Recordatorio inválido' },
        { status: 400 }
      );
    }

    if (!isAutorizacionRespuesta(respuestaRaw)) {
      return NextResponse.json(
        { error: 'Selecciona Se autorizó o No autorizó' },
        { status: 400 }
      );
    }

    return await withDbBypass(async (tx) => {
      const candidatos = await tx.$queryRaw<Array<{ id: number }>>`
        SELECT id
        FROM "Estudiantes"
        WHERE activo = true
          AND (
            lower(codigo_estudiantil) = ${identificador}
            OR lower(
              regexp_replace(trim(nombres) || ' ' || trim(apellidos), '\\s+', ' ', 'g')
            ) = ${identificador}
            OR lower(
              regexp_replace(trim(apellidos) || ' ' || trim(nombres), '\\s+', ' ', 'g')
            ) = ${identificador}
          )
        LIMIT 5
      `;

      if (candidatos.length === 0) {
        return NextResponse.json(
          { error: 'No se encontró el estudiante con esos datos.' },
          { status: 404 }
        );
      }
      if (candidatos.length > 1) {
        return NextResponse.json(
          {
            error:
              'Hay varios estudiantes con ese nombre. Usa el código estudiantil.',
          },
          { status: 409 }
        );
      }

      const estudianteId = candidatos[0].id;
      const vinculo = await tx.recordatorioEstudiantes.findFirst({
        where: {
          estudiante_id: estudianteId,
          recordatorio_id: recordatorioId,
          recordatorio: {
            tipo: 'autorizacion',
            fecha: {
              gte: rango.start,
              lt: rango.end,
            },
          },
        },
        select: {
          id: true,
          autorizacion_respuesta: true,
        },
      });

      if (!vinculo) {
        return NextResponse.json(
          {
            error:
              'No se encontró esa autorización para el estudiante y la fecha indicados.',
          },
          { status: 404 }
        );
      }

      if (
        vinculo.autorizacion_respuesta === 'autorizado' ||
        vinculo.autorizacion_respuesta === 'no_autorizado'
      ) {
        return NextResponse.json(
          {
            error:
              'Esta autorización ya fue respondida y no se puede modificar.',
          },
          { status: 409 }
        );
      }

      const updated = await tx.recordatorioEstudiantes.update({
        where: { id: vinculo.id },
        data: {
          autorizacion_respuesta: respuestaRaw,
          autorizacion_respondido_at: new Date(),
        },
        select: {
          autorizacion_respuesta: true,
          autorizacion_respondido_at: true,
        },
      });

      return NextResponse.json({
        success: true,
        respuesta: updated.autorizacion_respuesta,
        respondidoAt: updated.autorizacion_respondido_at,
      });
    });
  } catch (error) {
    console.error('Error registrando autorización:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
