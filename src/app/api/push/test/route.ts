import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPushNotification } from '@/lib/notifications/push';

/**
 * GET /api/push/test
 *
 * Endpoint temporal de prueba: busca una subscription activa y envía un push manual.
 * Útil para verificar que el sistema push funciona sin depender del flujo de recordatorios.
 */
export async function GET() {
  try {
    const subscription = await prisma.pushSubscriptions.findFirst({
      orderBy: { created_at: 'desc' },
      select: { institucion_id: true, acudiente_id: true },
    });

    if (!subscription) {
      return NextResponse.json(
        { success: false, error: 'No hay ninguna subscription activa para probar. Active notificaciones desde el correo o /activar-notificaciones.' },
        { status: 404 }
      );
    }

    const result = await sendPushNotification({
      institucionId: subscription.institucion_id,
      title: 'Título prueba push',
      body: 'Si ves esto, el sistema push funciona correctamente.',
      acudienteIds: [subscription.acudiente_id],
    });

    return NextResponse.json({
      success: true,
      sent: result.sent,
      failed: result.failed,
      removed: result.removed,
    });
  } catch (error) {
    console.error('Error en /api/push/test:', error);
    return NextResponse.json(
      { success: false, error: 'Error al enviar push de prueba' },
      { status: 500 }
    );
  }
}
