import { NextRequest, NextResponse } from 'next/server';
import { approvePayment } from '@/lib/payments/approve-payment';
import { getWompiEventsSecret, isWompiConfigured, isWompiSandbox } from '@/lib/wompi/config';
import { findPagoReferenciaForWompiTransaction } from '@/lib/wompi/resolve-pago';
import { validateWompiEventChecksum } from '@/lib/wompi/webhook-signature';
import { checkRateLimit, rateLimitResponse } from '@/lib/security/rate-limit';

interface WompiWebhookBody {
  event?: string;
  data?: {
    transaction?: {
      id?: string;
      status?: string;
      amount_in_cents?: number;
      reference?: string;
      customer_email?: string;
      currency?: string;
      payment_link_id?: string | null;
    };
  };
  timestamp?: number;
  signature?: {
    properties?: string[];
    checksum?: string;
  };
}

export async function POST(request: NextRequest) {
  const rate = checkRateLimit(request, 'wompi-webhook', { max: 120, windowSec: 60 });
  if (!rate.ok) {
    return rateLimitResponse(rate.retryAfterSec ?? 60);
  }

  if (!isWompiConfigured()) {
    return NextResponse.json({ error: 'Webhook no configurado' }, { status: 503 });
  }

  let body: WompiWebhookBody;
  try {
    body = (await request.json()) as WompiWebhookBody;
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }

  if (body.event !== 'transaction.updated') {
    return NextResponse.json({ received: true, ignored: true });
  }

  const tx = body.data?.transaction;
  if (!tx?.id) {
    return NextResponse.json({ error: 'Transacción incompleta' }, { status: 400 });
  }

  const eventsSecret = getWompiEventsSecret();
  const checksum =
    body.signature?.checksum || request.headers.get('x-event-checksum')?.trim();
  const properties = body.signature?.properties;
  const timestamp = body.timestamp;

  if (eventsSecret && checksum && properties?.length && typeof timestamp === 'number') {
    const valid = validateWompiEventChecksum({
      data: body.data,
      properties,
      timestamp,
      checksum,
      eventsSecret,
    });
    if (!valid) {
      if (!isWompiSandbox()) {
        return NextResponse.json({ error: 'Firma inválida' }, { status: 401 });
      }
      console.warn('Webhook Wompi: firma inválida en sandbox, se continúa con precaución');
    }
  } else if (!isWompiSandbox()) {
    return NextResponse.json({ error: 'Webhook sin firma' }, { status: 401 });
  }

  if (tx.status !== 'APPROVED') {
    return NextResponse.json({ received: true, status: tx.status });
  }

  const amountCop = Math.round((tx.amount_in_cents ?? 0) / 100);
  const referencia = await findPagoReferenciaForWompiTransaction({
    reference: tx.reference,
    paymentLinkId: tx.payment_link_id,
    customerEmail: tx.customer_email,
    amountCop,
  });

  if (!referencia) {
    console.error('Webhook Wompi: pago no encontrado', {
      reference: tx.reference,
      paymentLinkId: tx.payment_link_id,
      email: tx.customer_email,
    });
    return NextResponse.json({ error: 'Pago no encontrado' }, { status: 404 });
  }

  const result = await approvePayment({
    referencia,
    gatewayPaymentId: tx.id,
    transactionAmount: amountCop,
    gateway: 'WOMPI',
    request,
  });

  if (!result.ok) {
    if (result.reason === 'not_found') {
      return NextResponse.json({ error: 'Pago no encontrado' }, { status: 404 });
    }
    console.error('Webhook Wompi: monto no coincide', {
      referencia,
      amountInCents: tx.amount_in_cents,
    });
    return NextResponse.json({ error: 'Monto inválido' }, { status: 400 });
  }

  return NextResponse.json({ received: true, approved: true });
}
