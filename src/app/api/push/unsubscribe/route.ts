import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export interface UnsubscribeBody {
  endpoint: string;
}

/**
 * POST /api/push/unsubscribe
 *
 * Elimina la suscripción push por endpoint.
 * No lanza error si no existe (idempotente).
 *
 * Futuro: validar endpoint por tenant; activar push solo si plan === "plus"; preferencias por tipo; panel de configuración.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as UnsubscribeBody;
    const { endpoint } = body;

    if (!endpoint || typeof endpoint !== 'string' || !endpoint.trim()) {
      return NextResponse.json(
        { error: 'endpoint es requerido' },
        { status: 400 }
      );
    }

    const deleted = await prisma.pushSubscriptions.deleteMany({
      where: { endpoint: endpoint.trim() },
    });

    return NextResponse.json({
      success: true,
      removed: (deleted?.count ?? 0) > 0,
    });
  } catch (error) {
    console.error('Error en /api/push/unsubscribe:', error);
    return NextResponse.json(
      { error: 'Error al desactivar notificaciones' },
      { status: 500 }
    );
  }
}
