import { NextRequest, NextResponse } from 'next/server';
import {
  checkCheckoutEmailAvailability,
  checkoutEmailBlockMessage,
} from '@/lib/payments/check-checkout-email';
import { checkRateLimit, rateLimitResponse } from '@/lib/security/rate-limit';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * GET /api/payments/check-email?email=...
 * Comprueba si el correo puede usarse antes del checkout (público, rate-limited).
 */
export async function GET(request: NextRequest) {
  const rate = checkRateLimit(request, 'mp-check-checkout-email', {
    max: 30,
    windowSec: 60,
  });
  if (!rate.ok) {
    return rateLimitResponse(rate.retryAfterSec ?? 60);
  }

  const emailParam = request.nextUrl.searchParams.get('email');
  if (!emailParam?.trim() || !isValidEmail(emailParam.trim())) {
    return NextResponse.json({ error: 'email inválido' }, { status: 400 });
  }

  try {
    const result = await checkCheckoutEmailAvailability(emailParam);

    return NextResponse.json({
      available: result.available,
      message: result.available
        ? null
        : checkoutEmailBlockMessage(result.reason!),
    });
  } catch (error) {
    console.error('Error en check-checkout-email:', error);
    return NextResponse.json({ error: 'Error al verificar el correo' }, { status: 500 });
  }
}
