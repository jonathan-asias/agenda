import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export interface SubscribeBody {
  institucionId: number;
  acudienteId: number;
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
 *
 * Guarda la push subscription del acudiente.
 * - Validación: institucionId y acudienteId deben existir y pertenecer a la misma institución.
 * - Evita duplicados por (institucion_id, acudiente_id, endpoint).
 *
 * Multi-tenant: institucion_id en push_subscriptions.
 * Futuro: validar que institucion.push_enabled y plan plus antes de permitir.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SubscribeBody;
    const { institucionId, acudienteId, subscription } = body;

    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return NextResponse.json(
        { error: 'subscription inválida: endpoint, keys.p256dh y keys.auth son requeridos' },
        { status: 400 }
      );
    }

    if (!institucionId || !acudienteId) {
      return NextResponse.json(
        { error: 'institucionId y acudienteId son requeridos' },
        { status: 400 }
      );
    }

    const instId = parseInt(String(institucionId));
    const acudId = parseInt(String(acudienteId));

    const acudiente = await prisma.acudientes.findFirst({
      where: { id: acudId, institucion_id: instId },
    });

    if (!acudiente) {
      return NextResponse.json(
        { error: 'Acudiente no encontrado o no pertenece a la institución' },
        { status: 404 }
      );
    }

    await prisma.pushSubscriptions.upsert({
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en /api/push/subscribe:', error);
    return NextResponse.json(
      { error: 'Error al guardar la suscripción' },
      { status: 500 }
    );
  }
}
