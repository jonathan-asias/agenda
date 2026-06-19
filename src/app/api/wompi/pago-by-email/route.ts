import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserEmail } from '@/lib/tenant';
import { checkRateLimit, rateLimitResponse } from '@/lib/security/rate-limit';
import { withSystemDb } from '@/lib/db/with-tenant-request';

/**
 * GET /api/wompi/pago-by-email?email=...
 * Compatibilidad: delega al esquema Mercado Pago.
 */
export async function GET(request: NextRequest) {
  const rate = checkRateLimit(request, 'wompi-pago-by-email', { max: 20, windowSec: 60 });
  if (!rate.ok) {
    return rateLimitResponse(rate.retryAfterSec ?? 60);
  }

  const sessionEmail = await getAuthUserEmail(request);
  if (!sessionEmail) {
    return NextResponse.json({ error: 'Se requiere autenticación' }, { status: 401 });
  }

  const emailParam = request.nextUrl.searchParams.get('email');
  if (!emailParam?.trim()) {
    return NextResponse.json({ error: 'Parámetro email requerido' }, { status: 400 });
  }

  const normalized = emailParam.trim().toLowerCase();
  if (normalized !== sessionEmail) {
    return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
  }

  return await withSystemDb(async (tx) => {
    const pago = await tx.pago.findFirst({
      where: {
        email: normalized,
        estado: 'APPROVED',
        procesado: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json({
      hasApprovedPayment: !!pago,
    });
  });
}
