import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { withDbBypass } from '@/lib/db/rls-context';
import {
  canUseMercadoPagoAutoReturn,
  resolvePaymentReturnBase,
  resolveWebhookUrl,
} from '@/lib/app-url';
import {
  createCheckoutPreference,
  isMercadoPagoConfigured,
} from '@/lib/mercadopago/client';
import {
  isMercadoPagoSandbox,
  resolveMercadoPagoCheckoutUrl,
} from '@/lib/mercadopago/config';
import {
  checkCheckoutEmailAvailability,
  checkoutEmailBlockMessage,
} from '@/lib/payments/check-checkout-email';
import { createPendingPago } from '@/lib/payments/create-pending-pago';
import { parsePreRegistroInstitucion } from '@/lib/payments/pre-registro-institucion';
import {
  billingPeriodLabel,
  billingCycleQueryParam,
  getPlanChargeAmount,
  parseBillingCycle,
} from '@/lib/plan-billing';
import { checkRateLimit, rateLimitResponse } from '@/lib/security/rate-limit';
import { writeAuditLog } from '@/lib/security/audit-log';
import type { PreRegistroInstitucion } from '@/types/pre-registro-institucion';

interface CreatePreferenceBody {
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

export async function POST(request: NextRequest) {
  try {
    const rate = checkRateLimit(request, 'mp-create-preference', {
      max: 10,
      windowSec: 60,
    });
    if (!rate.ok) {
      return rateLimitResponse(rate.retryAfterSec ?? 60);
    }

    if (!isMercadoPagoConfigured()) {
      return NextResponse.json(
        { error: 'Pasarela de pagos no configurada' },
        { status: 503 }
      );
    }

    const body = (await request.json()) as CreatePreferenceBody;
    const email = body.email?.trim().toLowerCase();
    const planId = body.planId;
    const nombre = body.nombre?.trim();

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

    const emailCheck = await checkCheckoutEmailAvailability(email);
    if (!emailCheck.available && emailCheck.reason) {
      return NextResponse.json(
        {
          error: checkoutEmailBlockMessage(emailCheck.reason),
          code: emailCheck.reason,
        },
        { status: 409 }
      );
    }

    if (typeof planId !== 'number' || !Number.isInteger(planId) || planId <= 0) {
      return NextResponse.json({ error: 'planId inválido' }, { status: 400 });
    }

    const plan = await withDbBypass(async (tx) =>
      tx.plan.findFirst({
        where: { id: planId, activo: true },
      })
    );

    if (!plan) {
      return NextResponse.json({ error: 'Plan no encontrado' }, { status: 404 });
    }

    const billingCycle = parseBillingCycle(body.billingCycle ?? body.ciclo);
    const monto = getPlanChargeAmount(plan.precio, billingCycle);

    const referencia = randomUUID();
    const sandbox = isMercadoPagoSandbox();
    const returnBase = resolvePaymentReturnBase(request, body.returnOrigin);
    const encodedEmail = encodeURIComponent(email);
    const encodedRef = encodeURIComponent(referencia);

    const successUrl = `${returnBase}/pago-exitoso?ref=${encodedRef}&email=${encodedEmail}`;
    const failureUrl = `${returnBase}/?payment=cancelled`;
    const pendingUrl = successUrl;
    const autoReturn = canUseMercadoPagoAutoReturn(successUrl);

    if (!autoReturn && !sandbox) {
      return NextResponse.json(
        {
          error:
            'Configure APP_URL con una URL HTTPS pública (túnel o dominio) para redirecciones de Mercado Pago.',
        },
        { status: 503 }
      );
    }

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
      metadata: { planId: plan.id, referencia, sandbox, billingCycle },
      request,
    });

    const webhookBase = resolveWebhookUrl(request);
    const notificationUrl =
      webhookBase && !webhookBase.includes('localhost')
        ? `${webhookBase}/api/payments/webhook`
        : undefined;

    const preference = await createCheckoutPreference({
      items: [
        {
          title: `${plan.nombre} - Agenda Virtual (Pago ${billingPeriodLabel(billingCycle)})`,
          quantity: 1,
          unit_price: monto,
          currency_id: 'COP',
        },
      ],
      payerEmail: email,
      payerName: nombre || undefined,
      externalReference: referencia,
      notificationUrl,
      successUrl,
      failureUrl,
      pendingUrl,
      autoReturn,
    });

    const checkoutUrl = resolveMercadoPagoCheckoutUrl(preference);

    return NextResponse.json({ checkoutUrl, sandbox, referencia });
  } catch (error) {
    console.error('Error en create-preference:', error);
    return NextResponse.json(
      { error: 'Error al crear preferencia de pago' },
      { status: 500 }
    );
  }
}
