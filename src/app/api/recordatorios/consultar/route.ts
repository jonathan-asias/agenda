import { NextRequest, NextResponse } from 'next/server';
import { withDbBypass } from '@/lib/db/rls-context';
import { checkRateLimit, rateLimitResponse } from '@/lib/security/rate-limit';
import {
  extractCaptchaToken,
  requireTurnstileOrError,
} from '@/lib/security/turnstile';

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
 * POST /api/recordatorios/consultar
 * Consulta pública de recordatorios por nombre completo o código estudiantil + fecha.
 */
export async function POST(request: NextRequest) {
  try {
    const rate = checkRateLimit(request, 'recordatorios-consultar', {
      max: 15,
      windowSec: 300,
    });
    if (!rate.ok) {
      return rateLimitResponse(rate.retryAfterSec ?? 300);
    }

    const body = await request.json().catch(() => null);
    const identificadorRaw =
      typeof body?.identificador === 'string' ? body.identificador : '';
    const fechaRaw = typeof body?.fecha === 'string' ? body.fecha.trim() : '';

    const captchaError = await requireTurnstileOrError(extractCaptchaToken(body));
    if (captchaError) return captchaError;

    const identificador = normalizeIdentificador(identificadorRaw);
    if (!identificador || identificador.length < 2) {
      return NextResponse.json(
        { error: 'Ingresa el nombre completo o el código del estudiante' },
        { status: 400 }
      );
    }
    if (identificador.length > 200) {
      return NextResponse.json(
        { error: 'El identificador es demasiado largo' },
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
        return NextResponse.json({
          success: true,
          fecha: fechaRaw,
          recordatorios: [],
          mensaje:
            'No se encontraron recordatorios para los datos ingresados. Verifica el nombre o código y la fecha.',
        });
      }

      if (candidatos.length > 1) {
        return NextResponse.json(
          {
            error:
              'Hay varios estudiantes con ese nombre. Usa el código estudiantil para consultar.',
          },
          { status: 409 }
        );
      }

      const estudianteId = candidatos[0].id;
      const estudiante = await tx.estudiantes.findFirst({
        where: { id: estudianteId, activo: true },
        select: {
          id: true,
          nombres: true,
          apellidos: true,
          codigo_estudiantil: true,
          institucion: { select: { nombre: true } },
        },
      });

      if (!estudiante) {
        return NextResponse.json({
          success: true,
          fecha: fechaRaw,
          recordatorios: [],
          mensaje:
            'No se encontraron recordatorios para los datos ingresados. Verifica el nombre o código y la fecha.',
        });
      }

      const vinculos = await tx.recordatorioEstudiantes.findMany({
        where: {
          estudiante_id: estudianteId,
          recordatorio: {
            fecha: {
              gte: rango.start,
              lt: rango.end,
            },
          },
        },
        include: {
          recordatorio: {
            include: {
              materia: { select: { nombre: true } },
              area: { select: { nombre: true } },
              grado: { select: { nombre: true } },
              curso: { select: { nombre: true } },
              docente: {
                select: { nombres: true, apellidos: true },
              },
            },
          },
        },
      });

      const recordatorios = vinculos
        .map((v) => ({
          id: v.recordatorio.id,
          nombre: v.recordatorio.nombre,
          descripcion: v.recordatorio.descripcion,
          fecha: v.recordatorio.fecha.toISOString(),
          tipo: v.recordatorio.tipo,
          motivo: v.recordatorio.motivo,
          evento_nombre: v.recordatorio.evento_nombre,
          fecha_evento: v.recordatorio.fecha_evento
            ? v.recordatorio.fecha_evento.toISOString()
            : null,
          lugar_evento: v.recordatorio.lugar_evento,
          hora_fin: v.recordatorio.hora_fin
            ? v.recordatorio.hora_fin.toISOString()
            : null,
          hora_llegada: v.recordatorio.hora_llegada
            ? v.recordatorio.hora_llegada.toISOString()
            : null,
          autorizacion_respuesta: v.autorizacion_respuesta,
          materia: v.recordatorio.materia.nombre,
          area: v.recordatorio.area.nombre,
          grado: v.recordatorio.grado.nombre,
          curso: v.recordatorio.curso.nombre,
          docente: `${v.recordatorio.docente.nombres} ${v.recordatorio.docente.apellidos}`.trim(),
        }))
        .sort((a, b) => a.fecha.localeCompare(b.fecha));

      return NextResponse.json({
        success: true,
        fecha: fechaRaw,
        estudiante: {
          nombres: estudiante.nombres,
          apellidos: estudiante.apellidos,
          codigo_estudiantil: estudiante.codigo_estudiantil,
          institucion: estudiante.institucion.nombre,
        },
        recordatorios,
        mensaje:
          recordatorios.length === 0
            ? 'No hay recordatorios para este estudiante en la fecha indicada.'
            : undefined,
      });
    });
  } catch (error) {
    console.error('Error consultando recordatorios:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
