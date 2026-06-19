import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { resolveWompiPaymentReturnBase, buildWompiSuccessRedirectUrl } from '@/lib/app-url';
import { createPendingPago } from '@/lib/payments/create-pending-pago';
import { parseCheckoutBody } from '@/lib/payments/parse-checkout-body';
import { billingPeriodLabel, billingCycleQueryParam, parseBillingCycle } from '@/lib/plan-billing';
import { createWompiCheckout } from '@/lib/wompi/client';
import { attachWompiPaymentLinkToPago } from '@/lib/wompi/resolve-pago';
import { getWompiPublicKey, isWompiAmountValid, isWompiConfigured, WOMPI_MIN_AMOUNT_COP, wompiMinAmountErrorMessage } from '@/lib/wompi/config';
import { getWompiSetupStatus } from '@/lib/wompi/setup';
import { checkRateLimit, rateLimitResponse } from '@/lib/security/rate-limit';
import { writeAuditLog } from '@/lib/security/audit-log';
import type { PreRegistroInstitucion } from '@/types/pre-registro-institucion';

interface CreateWompiBody {
  email: string;
  planId: number;
  nombre?: string;
  returnOrigin?: string;
  preRegistro?: PreRegistroInstitucion;
  ciclo?: string;
  billingCycle?: string;
}

/**
 * POST /api/wompi/create-transaction
 * Crea pago pendiente y devuelve URL de checkout Wompi (Payment Link preferido).
 */
export async function POST(request: NextRequest) {
  const rate = checkRateLimit(request, 'wompi-create-transaction', {
    max: 10,
    windowSec: 60,
  });
  if (!rate.ok) {
    return rateLimitResponse(rate.retryAfterSec ?? 60);
  }

  const setup = getWompiSetupStatus();
  if (!isWompiConfigured()) {
    return NextResponse.json(
      {
        error: 'Wompi no configurado',
        missing: setup.missing,
      },
      { status: 503 }
    );
  }

  if (!getWompiPublicKey()) {
    return NextResponse.json({ error: 'WOMPI_PUBLIC_KEY no configurada' }, { status: 503 });
  }

  let body: CreateWompiBody;
  try {
    body = (await request.json()) as CreateWompiBody;
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }

  const parsed = await parseCheckoutBody(body);
  if (!parsed.ok) {
    return NextResponse.json(
      { error: parsed.error, code: parsed.code },
      { status: parsed.status }
    );
  }

  const billingCycle = parseBillingCycle(body.billingCycle ?? body.ciclo);
  const billingPeriod = billingPeriodLabel(billingCycle);

  if (!isWompiAmountValid(parsed.monto)) {
    return NextResponse.json(
      {
        error: wompiMinAmountErrorMessage(parsed.monto),
        code: 'WOMPI_MIN_AMOUNT',
        minAmountCop: WOMPI_MIN_AMOUNT_COP,
      },
      { status: 400 }
    );
  }

  const referencia = randomUUID();
  const returnBase = resolveWompiPaymentReturnBase(request, body.returnOrigin);
  const redirectUrl = buildWompiSuccessRedirectUrl(returnBase, referencia, parsed.email);

  await createPendingPago({
    email: parsed.email,
    referencia,
    planId: parsed.plan.id,
    monto: parsed.monto,
    datosPreregistro: parsed.datosPreregistro,
    billingCycle: billingCycleQueryParam(billingCycle),
  });

  let checkout;
  try {
    checkout = await createWompiCheckout({
      referencia,
      amountCop: parsed.monto,
      planNombre: parsed.plan.nombre,
      billingPeriod,
      redirectUrl,
      customerEmail: parsed.email,
    });
  } catch (error) {
    console.error('Error creando checkout Wompi:', error);
    return NextResponse.json(
      {
        error:
          'No se pudo crear el checkout en Wompi. Verifique llaves privada/pública e integridad en el Dashboard.',
      },
      { status: 502 }
    );
  }

  if (checkout.paymentLinkId) {
    await attachWompiPaymentLinkToPago(referencia, checkout.paymentLinkId);
  }

  await writeAuditLog({
    usuario: parsed.email,
    accion: 'PAGO_CREADO',
    metadata: {
      planId: parsed.plan.id,
      referencia,
      gateway: 'WOMPI',
      billingCycle,
      checkoutMethod: checkout.method,
      paymentLinkId: checkout.paymentLinkId,
    },
    request,
  });

  return NextResponse.json({
    checkoutUrl: checkout.checkoutUrl,
    referencia,
    gateway: 'wompi',
    checkoutMethod: checkout.method,
    planNombre: parsed.plan.nombre,
    billingPeriod,
  });
}
