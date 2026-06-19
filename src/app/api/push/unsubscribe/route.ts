import { NextRequest, NextResponse } from 'next/server';
import { withDbBypass } from '@/lib/db/rls-context';
import { checkRateLimit, rateLimitResponse } from '@/lib/security/rate-limit';

export interface UnsubscribeBody {
  endpoint: string;
}

export async function POST(request: NextRequest) {
  try {
    const rate = checkRateLimit(request, 'push-unsubscribe', { max: 20, windowSec: 60 });
    if (!rate.ok) {
      return rateLimitResponse(rate.retryAfterSec ?? 60);
    }

    const body = (await request.json()) as UnsubscribeBody;
    const { endpoint } = body;

    if (!endpoint || typeof endpoint !== 'string' || !endpoint.trim()) {
      return NextResponse.json(
        { error: 'endpoint es requerido' },
        { status: 400 }
      );
    }

    const trimmed = endpoint.trim();
    if (!trimmed.startsWith('https://')) {
      return NextResponse.json({ error: 'endpoint inválido' }, { status: 400 });
    }

    const deleted = await withDbBypass(async (tx) =>
      tx.pushSubscriptions.deleteMany({
        where: { endpoint: trimmed },
      })
    );

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
