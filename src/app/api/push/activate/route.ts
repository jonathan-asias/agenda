import { NextRequest, NextResponse } from 'next/server';
import { withDbBypass } from '@/lib/db/rls-context';
import { checkRateLimit, rateLimitResponse } from '@/lib/security/rate-limit';
import {
  createPushSubscribeToken,
  verifyPushActivationSig,
} from '@/lib/security/push-activation-token';

/**
 * GET /api/push/activate?estudianteId=X&sig=...
 * Requiere firma HMAC en enlaces de email para evitar IDOR.
 */
export async function GET(request: NextRequest) {
  try {
    const rate = checkRateLimit(request, 'push-activate', { max: 20, windowSec: 60 });
    if (!rate.ok) {
      return rateLimitResponse(rate.retryAfterSec ?? 60);
    }

    const { searchParams } = new URL(request.url);
    const estudianteId = searchParams.get('estudianteId');
    const sig = searchParams.get('sig');

    const publicKey = process.env.WEB_PUSH_PUBLIC_KEY;
    if (!publicKey) {
      return NextResponse.json({ error: 'Push no configurado' }, { status: 503 });
    }

    if (!estudianteId || !sig) {
      return NextResponse.json(
        { error: 'estudianteId y sig son requeridos' },
        { status: 400 }
      );
    }

    const estId = Number.parseInt(estudianteId, 10);
    if (Number.isNaN(estId)) {
      return NextResponse.json({ error: 'estudianteId inválido' }, { status: 400 });
    }

    try {
      if (!verifyPushActivationSig(sig, estId)) {
        return NextResponse.json({ error: 'Enlace inválido o expirado' }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: 'Push no configurado' }, { status: 503 });
    }

    const result = await withDbBypass(async (tx) => {
      const estudiante = await tx.estudiantes.findFirst({
        where: { id: estId, activo: true },
      });

      if (!estudiante || !estudiante.correo_acudiente?.trim()) {
        return null;
      }

      const email = estudiante.correo_acudiente.trim();
      const nombre = estudiante.nombre_acudiente || 'Acudiente';
      const telefono = estudiante.telefono_acudiente || null;

      let acudiente = await tx.acudientes.findUnique({
        where: {
          institucion_id_email: {
            institucion_id: estudiante.institucion_id,
            email,
          },
        },
      });

      if (!acudiente) {
        acudiente = await tx.acudientes.create({
          data: {
            institucion_id: estudiante.institucion_id,
            email,
            nombre,
            telefono,
          },
        });
      }

      return {
        acudienteId: acudiente.id,
        institucionId: acudiente.institucion_id,
      };
    });

    if (!result) {
      return NextResponse.json(
        { error: 'Estudiante no encontrado o sin correo de acudiente' },
        { status: 404 }
      );
    }

    const subscribeToken = createPushSubscribeToken(
      result.acudienteId,
      result.institucionId
    );

    return NextResponse.json({
      acudienteId: result.acudienteId,
      institucionId: result.institucionId,
      publicKey,
      subscribeToken,
    });
  } catch (error) {
    console.error('Error en /api/push/activate:', error);
    return NextResponse.json({ error: 'Error al activar' }, { status: 500 });
  }
}
