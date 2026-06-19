import { NextRequest, NextResponse } from 'next/server';
import { withDbBypass } from '@/lib/db/rls-context';
import { isPaymentRequiredForRegistration } from '@/lib/env';
import { checkRateLimit, rateLimitResponse } from '@/lib/security/rate-limit';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * GET /api/payments/can-register?email=...
 * Indica si el email puede iniciar registro de institución (sin exponer datos de pago).
 */
export async function GET(request: NextRequest) {
  const rate = checkRateLimit(request, 'mp-can-register', { max: 30, windowSec: 60 });
  if (!rate.ok) {
    return rateLimitResponse(rate.retryAfterSec ?? 60);
  }

  if (!isPaymentRequiredForRegistration()) {
    return NextResponse.json({ canRegister: true, paymentRequired: false });
  }

  const emailParam = request.nextUrl.searchParams.get('email');
  if (!emailParam?.trim() || !isValidEmail(emailParam.trim())) {
    return NextResponse.json({ error: 'email inválido' }, { status: 400 });
  }

  const email = emailParam.trim().toLowerCase();

  const eligible = await withDbBypass(async (tx) => {
    const pago = await tx.pago.findFirst({
      where: {
        email,
        estado: 'APPROVED',
        procesado: true,
      },
      orderBy: { created_at: 'desc' },
    });

    if (!pago) return false;

    const suscripcion = await tx.suscripcion.findFirst({
      where: {
        email,
        estado: 'ACTIVA',
        institucion_id: null,
        plan_id: pago.plan_id,
      },
      orderBy: { created_at: 'desc' },
    });

    return Boolean(suscripcion);
  });

  return NextResponse.json({
    canRegister: eligible,
    paymentRequired: true,
  });
}
