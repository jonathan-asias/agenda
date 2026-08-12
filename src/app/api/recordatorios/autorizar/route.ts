import { NextRequest, NextResponse } from 'next/server';
import { withDbBypass } from '@/lib/db/rls-context';
import { checkRateLimit, rateLimitResponse } from '@/lib/security/rate-limit';
import { verifyAutorizacionToken } from '@/lib/security/autorizacion-token';
import { isAutorizacionRespuesta } from '@/lib/recordatorios/tipos';

type VinculoLoaded = {
  id: number;
  autorizacion_respuesta: string | null;
  autorizacion_respondido_at: Date | null;
  estudiante: {
    id: number;
    nombres: string;
    apellidos: string;
    codigo_estudiantil: string;
    institucion: { nombre: string };
  };
  recordatorio: {
    id: number;
    nombre: string;
    descripcion: string;
    fecha: Date;
    motivo: string | null;
    evento_nombre: string | null;
    fecha_evento: Date | null;
    lugar_evento: string | null;
    hora_fin: Date | null;
    hora_llegada: Date | null;
    materia: { nombre: string };
    area: { nombre: string };
    grado: { nombre: string };
    curso: { nombre: string };
    docente: { nombres: string; apellidos: string };
  };
};

function mapAutorizacionPayload(vinculo: VinculoLoaded) {
  const r = vinculo.recordatorio;
  return {
    recordatorioId: r.id,
    nombre: r.nombre,
    descripcion: r.descripcion,
    fechaVencimiento: r.fecha.toISOString(),
    motivo: r.motivo,
    eventoNombre: r.evento_nombre,
    fechaEvento: r.fecha_evento ? r.fecha_evento.toISOString() : null,
    lugarEvento: r.lugar_evento,
    horaFin: r.hora_fin ? r.hora_fin.toISOString() : null,
    horaLlegada: r.hora_llegada ? r.hora_llegada.toISOString() : null,
    materia: r.materia.nombre,
    area: r.area.nombre,
    grado: r.grado.nombre,
    curso: r.curso.nombre,
    docente: `${r.docente.nombres} ${r.docente.apellidos}`.trim(),
    institucion: vinculo.estudiante.institucion.nombre,
    estudiante: {
      id: vinculo.estudiante.id,
      nombres: vinculo.estudiante.nombres,
      apellidos: vinculo.estudiante.apellidos,
      codigoEstudiantil: vinculo.estudiante.codigo_estudiantil,
    },
    respuestaActual: vinculo.autorizacion_respuesta,
    respondidoAt: vinculo.autorizacion_respondido_at
      ? vinculo.autorizacion_respondido_at.toISOString()
      : null,
  };
}

function mapExpiredPayload(
  vinculo: VinculoLoaded | null,
  expMs: number
) {
  const vencimientoIso = vinculo
    ? vinculo.recordatorio.fecha.toISOString()
    : new Date(expMs).toISOString();

  return {
    reason: 'expired' as const,
    error:
      'Esta autorización ya no es válida porque se superó la hora límite para responder.',
    fechaVencimiento: vencimientoIso,
    nombre: vinculo?.recordatorio.nombre ?? null,
    eventoNombre: vinculo?.recordatorio.evento_nombre ?? null,
    institucion: vinculo?.estudiante.institucion.nombre ?? null,
    estudiante: vinculo
      ? {
          nombres: vinculo.estudiante.nombres,
          apellidos: vinculo.estudiante.apellidos,
          codigoEstudiantil: vinculo.estudiante.codigo_estudiantil,
        }
      : null,
  };
}

const vinculoInclude = {
  estudiante: {
    select: {
      id: true,
      nombres: true,
      apellidos: true,
      codigo_estudiantil: true,
      institucion: { select: { nombre: true } },
    },
  },
  recordatorio: {
    include: {
      materia: { select: { nombre: true } },
      area: { select: { nombre: true } },
      grado: { select: { nombre: true } },
      curso: { select: { nombre: true } },
      docente: { select: { nombres: true, apellidos: true } },
    },
  },
} as const;

async function loadVinculo(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tx: any,
  recordatorioId: number,
  estudianteId: number
) {
  return tx.recordatorioEstudiantes.findFirst({
    where: {
      recordatorio_id: recordatorioId,
      estudiante_id: estudianteId,
      recordatorio: { tipo: 'autorizacion' },
    },
    include: vinculoInclude,
  });
}

/**
 * GET /api/recordatorios/autorizar?token=...
 * Devuelve el detalle de la autorización para el enlace firmado del correo.
 */
export async function GET(request: NextRequest) {
  try {
    const rate = checkRateLimit(request, 'recordatorios-autorizar-get', {
      max: 40,
      windowSec: 300,
    });
    if (!rate.ok) return rateLimitResponse(rate.retryAfterSec ?? 300);

    const token = request.nextUrl.searchParams.get('token')?.trim() || '';
    const verified = verifyAutorizacionToken(token);

    if (!verified.ok && verified.reason === 'invalid') {
      return NextResponse.json(
        {
          reason: 'invalid',
          error: 'El enlace de autorización no es válido.',
        },
        { status: 400 }
      );
    }

    if (!verified.ok && verified.reason === 'expired') {
      return await withDbBypass(async (tx) => {
        const vinculo =
          verified.recordatorioId && verified.estudianteId
            ? await loadVinculo(tx, verified.recordatorioId, verified.estudianteId)
            : null;
        return NextResponse.json(
          mapExpiredPayload(vinculo as VinculoLoaded | null, verified.exp ?? Date.now()),
          { status: 410 }
        );
      });
    }

    if (!verified.ok) {
      return NextResponse.json(
        { reason: 'invalid', error: 'El enlace de autorización no es válido.' },
        { status: 400 }
      );
    }

    return await withDbBypass(async (tx) => {
      const vinculo = await loadVinculo(tx, verified.recordatorioId, verified.estudianteId);
      if (!vinculo) {
        return NextResponse.json(
          { error: 'No se encontró esta autorización.' },
          { status: 404 }
        );
      }

      const loaded = vinculo as VinculoLoaded;
      // Doble chequeo por si el reloj del token y la fecha de negocio diferían.
      if (loaded.recordatorio.fecha.getTime() < Date.now()) {
        return NextResponse.json(mapExpiredPayload(loaded, loaded.recordatorio.fecha.getTime()), {
          status: 410,
        });
      }

      return NextResponse.json({
        success: true,
        autorizacion: mapAutorizacionPayload(loaded),
      });
    });
  } catch (error) {
    console.error('Error cargando autorización:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/recordatorios/autorizar
 * Guarda la respuesta del acudiente desde el enlace firmado.
 * Body: { token, respuesta }
 */
export async function POST(request: NextRequest) {
  try {
    const rate = checkRateLimit(request, 'recordatorios-autorizar-post', {
      max: 30,
      windowSec: 300,
    });
    if (!rate.ok) return rateLimitResponse(rate.retryAfterSec ?? 300);

    const body = await request.json().catch(() => null);
    const token = typeof body?.token === 'string' ? body.token.trim() : '';
    const respuestaRaw =
      typeof body?.respuesta === 'string' ? body.respuesta.trim() : '';

    const verified = verifyAutorizacionToken(token);
    if (!verified.ok) {
      if (verified.reason === 'expired') {
        return NextResponse.json(
          {
            reason: 'expired',
            error:
              'Esta autorización ya no es válida porque se superó la hora límite para responder.',
            fechaVencimiento: new Date(verified.exp ?? Date.now()).toISOString(),
          },
          { status: 410 }
        );
      }
      return NextResponse.json(
        { reason: 'invalid', error: 'El enlace de autorización no es válido.' },
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
      const vinculo = await tx.recordatorioEstudiantes.findFirst({
        where: {
          recordatorio_id: verified.recordatorioId,
          estudiante_id: verified.estudianteId,
          recordatorio: { tipo: 'autorizacion' },
        },
        select: {
          id: true,
          autorizacion_respuesta: true,
          recordatorio: { select: { fecha: true } },
        },
      });
      if (!vinculo) {
        return NextResponse.json(
          { error: 'No se encontró esta autorización.' },
          { status: 404 }
        );
      }

      if (vinculo.recordatorio.fecha.getTime() < Date.now()) {
        return NextResponse.json(
          {
            reason: 'expired',
            error:
              'Esta autorización ya no es válida porque se superó la hora límite para responder.',
            fechaVencimiento: vinculo.recordatorio.fecha.toISOString(),
          },
          { status: 410 }
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
        include: vinculoInclude,
      });

      return NextResponse.json({
        success: true,
        autorizacion: mapAutorizacionPayload(updated as VinculoLoaded),
      });
    });
  } catch (error) {
    console.error('Error guardando autorización:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
