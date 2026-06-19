import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { withDbBypass } from '@/lib/db/rls-context';
import { resolvePaymentReturnBase } from '@/lib/app-url';
import { approvePaymentFromMercadoPago } from '@/lib/mercadopago/approve-payment';
import { isMercadoPagoConfigured } from '@/lib/mercadopago/client';
import { isMercadoPagoDevMockCheckout } from '@/lib/mercadopago/config';
import {
  checkCheckoutEmailAvailability,
  checkoutEmailBlockMessage,
} from '@/lib/payments/check-checkout-email';
import { createPendingPago } from '@/lib/payments/create-pending-pago';
import { parsePreRegistroInstitucion } from '@/lib/payments/pre-registro-institucion';
import { getPlanChargeAmount, parseBillingCycle, billingCycleQueryParam } from '@/lib/plan-billing';
import { checkRateLimit, rateLimitResponse } from '@/lib/security/rate-limit';
import { writeAuditLog } from '@/lib/security/audit-log';
import type { PreRegistroInstitucion } from '@/types/pre-registro-institucion';

interface MockCheckoutBody {
  email: string;
  planId: number;
  nombre?: string;
  returnOrigin?: string;
  preRegistro?: PreRegistroInstitucion;
  ciclo?: string;
  billingCycle?: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * POST /api/payments/dev-mock-checkout
 * Desarrollo: simula pago aprobado sin abrir sandbox.mercadopago.com.co
 */
export async function POST(request: NextRequest) {
  if (!isMercadoPagoDevMockCheckout()) {
    return NextResponse.json({ error: 'No disponible' }, { status: 403 });
  }

  const rate = checkRateLimit(request, 'mp-dev-mock-checkout', {
    max: 20,
    windowSec: 60,
  });
  if (!rate.ok) {
    return rateLimitResponse(rate.retryAfterSec ?? 60);
  }

  if (!isMercadoPagoConfigured()) {
    return NextResponse.json({ error: 'Pasarela no configurada' }, { status: 503 });
  }

  let body: MockCheckoutBody;
  try {
    body = (await request.json()) as MockCheckoutBody;
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const planId = body.planId;

  let datosPreregistro: PreRegistroInstitucion | undefined;
  if (body.preRegistro) {
    const parsed = parsePreRegistroInstitucion(body.preRegistro);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }
    if (parsed.data.email !== email) {
      return NextResponse.json(
        { error: 'El correo del formulario no coincide con el correo de pago' },
        { status: 400 }
      );
    }
    datosPreregistro = parsed.data;
  }

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: 'email inválido' }, { status: 400 });
  }

  if (typeof planId !== 'number' || !Number.isInteger(planId) || planId <= 0) {
    return NextResponse.json({ error: 'planId inválido' }, { status: 400 });
  }

  const emailCheck = await checkCheckoutEmailAvailability(email);
  if (!emailCheck.available && emailCheck.reason) {
    return NextResponse.json(
      { error: checkoutEmailBlockMessage(emailCheck.reason), code: emailCheck.reason },
      { status: 409 }
    );
  }

  const plan = await withDbBypass(async (tx) =>
    tx.plan.findFirst({ where: { id: planId, activo: true } })
  );

  if (!plan) {
    return NextResponse.json({ error: 'Plan no encontrado' }, { status: 404 });
  }

  const billingCycle = parseBillingCycle(body.billingCycle ?? body.ciclo);
  const monto = getPlanChargeAmount(plan.precio, billingCycle);

  const referencia = randomUUID();
  const returnBase = resolvePaymentReturnBase(request, body.returnOrigin);
  const encodedEmail = encodeURIComponent(email);
  const encodedRef = encodeURIComponent(referencia);

  await createPendingPago({
    email,
    referencia,
    planId: plan.id,
    monto,
    datosPreregistro,
    billingCycle: billingCycleQueryParam(billingCycle),
  });

  await writeAuditLog({
    usuario: email,
    accion: 'PAGO_CREADO',
    metadata: { planId: plan.id, referencia, devMock: true, billingCycle },
    request,
  });

  const result = await approvePaymentFromMercadoPago({
    referencia,
    mpPaymentId: `dev-mock-${referencia}`,
    transactionAmount: monto,
    request,
  });

  if (!result.ok) {
    return NextResponse.json({ error: 'No se pudo simular el pago' }, { status: 500 });
  }

  return NextResponse.json({
    mock: true,
    redirectUrl: `${returnBase}/pago-exitoso?ref=${encodedRef}&email=${encodedEmail}`,
  });
}
