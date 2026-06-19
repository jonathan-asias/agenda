import { randomUUID } from 'crypto';
import type { NextRequest } from 'next/server';
import {
  canUseMercadoPagoAutoReturn,
  resolvePaymentReturnBase,
  resolveWebhookUrl,
  resolveWompiPaymentReturnBase,
  buildWompiSuccessRedirectUrl,
} from '@/lib/app-url';
import {
  createCheckoutPreference,
  isMercadoPagoConfigured,
} from '@/lib/mercadopago/client';
import {
  isMercadoPagoSandbox,
  resolveMercadoPagoCheckoutUrl,
} from '@/lib/mercadopago/config';
import { createPendingPago } from '@/lib/payments/create-pending-pago';
import { billingPeriodLabel, billingCycleQueryParam, getPlanChargeAmount, parseBillingCycle } from '@/lib/plan-billing';
import type { PagoMetadata } from '@/types/pago-metadata';
import { createWompiCheckout } from '@/lib/wompi/client';
import { attachWompiPaymentLinkToPago } from '@/lib/wompi/resolve-pago';
import { getWompiPublicKey, isWompiAmountValid, isWompiConfigured, wompiMinAmountErrorMessage } from '@/lib/wompi/config';

export type PlanCheckoutGateway = 'mercadopago' | 'wompi';

export async function createInstitutionPlanCheckout(params: {
  request: NextRequest;
  institucionId: number;
  email: string;
  planId: number;
  planNombre: string;
  planPrecio: number;
  gateway: PlanCheckoutGateway;
  billingCycle?: string;
  returnOrigin?: string;
}): Promise<
  | { ok: true; checkoutUrl: string; referencia: string; billingPeriod: string }
  | { ok: false; status: number; error: string; code?: string }
> {
  const billingCycle = parseBillingCycle(params.billingCycle);
  const monto = getPlanChargeAmount(params.planPrecio, billingCycle);
  const billingPeriod = billingPeriodLabel(billingCycle);
  const referencia = randomUUID();

  const metadata: PagoMetadata = {
    tipo: 'cambio_plan',
    institucionId: params.institucionId,
    billingCycle: billingCycleQueryParam(billingCycle),
    ciclo: billingCycleQueryParam(billingCycle),
  };

  await createPendingPago({
    email: params.email,
    referencia,
    planId: params.planId,
    monto,
    metadata,
    billingCycle: billingCycleQueryParam(billingCycle),
  });

  if (params.gateway === 'wompi') {
    if (!isWompiConfigured() || !getWompiPublicKey()) {
      return { ok: false, status: 503, error: 'Wompi no configurado' };
    }
    if (!isWompiAmountValid(monto)) {
      return {
        ok: false,
        status: 400,
        error: wompiMinAmountErrorMessage(monto),
        code: 'WOMPI_MIN_AMOUNT',
      };
    }

    const returnBase = resolveWompiPaymentReturnBase(params.request, params.returnOrigin);
    const redirectUrl = buildWompiSuccessRedirectUrl(returnBase, referencia, params.email);

    const checkout = await createWompiCheckout({
      referencia,
      amountCop: monto,
      planNombre: params.planNombre,
      billingPeriod,
      redirectUrl,
      customerEmail: params.email,
    });

    await attachWompiPaymentLinkToPago(referencia, checkout.paymentLinkId);

    return {
      ok: true,
      checkoutUrl: checkout.checkoutUrl,
      referencia,
      billingPeriod,
    };
  }

  if (!isMercadoPagoConfigured()) {
    return { ok: false, status: 503, error: 'Mercado Pago no configurado' };
  }

  const returnBase = resolvePaymentReturnBase(params.request, params.returnOrigin);
  const encodedEmail = encodeURIComponent(params.email);
  const encodedRef = encodeURIComponent(referencia);
  const successUrl = `${returnBase}/pago-exitoso?ref=${encodedRef}&email=${encodedEmail}`;
  const sandbox = isMercadoPagoSandbox();
  const autoReturn = canUseMercadoPagoAutoReturn(successUrl);

  if (!autoReturn && !sandbox) {
    return {
      ok: false,
      status: 503,
      error: 'Configure APP_URL con HTTPS para redirecciones de Mercado Pago.',
    };
  }

  const webhookBase = resolveWebhookUrl(params.request);
  const notificationUrl =
    webhookBase && !webhookBase.includes('localhost')
      ? `${webhookBase}/api/payments/webhook`
      : undefined;

  const preference = await createCheckoutPreference({
    items: [
      {
        title: `${params.planNombre} - Agenda Virtual (Pago ${billingPeriod})`,
        quantity: 1,
        unit_price: monto,
        currency_id: 'COP',
      },
    ],
    payerEmail: params.email,
    externalReference: referencia,
    notificationUrl,
    successUrl,
    failureUrl: `${returnBase}/institucion/${params.institucionId}/perfil?planChange=cancelled`,
    pendingUrl: successUrl,
    autoReturn,
  });

  return {
    ok: true,
    checkoutUrl: resolveMercadoPagoCheckoutUrl(preference),
    referencia,
    billingPeriod,
  };
}
