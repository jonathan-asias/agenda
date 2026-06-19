import { NextResponse } from 'next/server';

/**
 * GET /api/push/test — deshabilitado en producción por seguridad.
 */
export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  }

  const { prisma } = await import('@/lib/prisma');
  const { sendPushNotification } = await import('@/lib/notifications/push');

  try {
    const subscription = await prisma.pushSubscriptions.findFirst({
      orderBy: { created_at: 'desc' },
      select: { institucion_id: true, acudiente_id: true },
    });

    if (!subscription) {
      return NextResponse.json(
        {
          success: false,
          error:
            'No hay ninguna subscription activa para probar. Active notificaciones desde el correo o /activar-notificaciones.',
        },
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
