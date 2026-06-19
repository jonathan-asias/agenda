import { NextRequest, NextResponse } from 'next/server';
import { withDbBypass } from '@/lib/db/rls-context';
import { checkRateLimit, rateLimitResponse } from '@/lib/security/rate-limit';import { verifyPushSubscribeToken } from '@/lib/security/push-activation-token';

export interface SubscribeBody {
  institucionId: number;
  acudienteId: number;
  subscribeToken: string;
  subscription: {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  };
}

/**
 * POST /api/push/subscribe
 * Requiere subscribeToken emitido por /api/push/activate tras validar firma del enlace.
 */
export async function POST(request: NextRequest) {
  try {
    const rate = checkRateLimit(request, 'push-subscribe', { max: 15, windowSec: 60 });
    if (!rate.ok) {
      return rateLimitResponse(rate.retryAfterSec ?? 60);
    }

    const body = (await request.json()) as SubscribeBody;
    const { institucionId, acudienteId, subscribeToken, subscription } = body;

    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return NextResponse.json(
        { error: 'subscription inválida: endpoint, keys.p256dh y keys.auth son requeridos' },
        { status: 400 }
      );
    }

    if (!institucionId || !acudienteId || !subscribeToken) {
      return NextResponse.json(
        { error: 'institucionId, acudienteId y subscribeToken son requeridos' },
        { status: 400 }
      );
    }

    const instId = Number.parseInt(String(institucionId), 10);
    const acudId = Number.parseInt(String(acudienteId), 10);

    try {
      if (!verifyPushSubscribeToken(subscribeToken, acudId, instId)) {
        return NextResponse.json(
          { error: 'Token de suscripción inválido o expirado' },
          { status: 403 }
        );
      }
    } catch {
      return NextResponse.json({ error: 'Push no configurado' }, { status: 503 });
    }

    await withDbBypass(async (tx) => {
      const acudiente = await tx.acudientes.findFirst({
        where: { id: acudId, institucion_id: instId },
      });

      if (!acudiente) {
        throw new Error('ACUDIENTE_NOT_FOUND');
      }

      await tx.pushSubscriptions.upsert({
        where: {
          institucion_id_acudiente_id_endpoint: {
            institucion_id: instId,
            acudiente_id: acudId,
            endpoint: subscription.endpoint,
          },
        },
        create: {
          institucion_id: instId,
          acudiente_id: acudId,
          endpoint: subscription.endpoint,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
        },
        update: {
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'ACUDIENTE_NOT_FOUND') {
      return NextResponse.json(
        { error: 'Acudiente no encontrado o no pertenece a la institución' },
        { status: 404 }
      );
    }
    console.error('Error en /api/push/subscribe:', error);
    return NextResponse.json(
      { error: 'Error al guardar la suscripción' },
      { status: 500 }
    );
  }
}
