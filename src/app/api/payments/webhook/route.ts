import { NextRequest, NextResponse } from 'next/server';
import {
  getMerchantOrderById,
  getPaymentById,
  isMercadoPagoConfigured,
} from '@/lib/mercadopago/client';
import { approvePaymentFromMercadoPago } from '@/lib/mercadopago/approve-payment';
import { isMercadoPagoSandbox } from '@/lib/mercadopago/config';
import { validateMercadoPagoWebhookSignature } from '@/lib/mercadopago/webhook-signature';
import { checkRateLimit, rateLimitResponse } from '@/lib/security/rate-limit';

interface WebhookBody {
  action?: string;
  type?: string;
  topic?: string;
  data?: { id?: string | number };
}

function isSignatureValid(dataId: string, xSignature: string | null, xRequestId: string | null): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET?.trim();
  if (!secret || !xSignature || !xRequestId) return false;

  const candidates = [dataId, dataId.toLowerCase()];
  return candidates.some((id) =>
    validateMercadoPagoWebhookSignature({
      secret,
      xSignature,
      xRequestId,
      dataId: id,
    })
  );
}

async function processApprovedPayment(
  paymentId: string,
  request: NextRequest
): Promise<NextResponse> {
  const mpPayment = await getPaymentById(paymentId);

  if (mpPayment.status !== 'approved') {
    return NextResponse.json({ received: true, status: mpPayment.status }, { status: 200 });
  }

  const referencia = mpPayment.external_reference;
  if (!referencia) {
    return NextResponse.json({ error: 'Referencia ausente' }, { status: 400 });
  }

  const result = await approvePaymentFromMercadoPago({
    referencia,
    mpPaymentId: String(mpPayment.id),
    transactionAmount: mpPayment.transaction_amount,
    request,
  });

  if (!result.ok) {
    if (result.reason === 'not_found') {
      return NextResponse.json({ error: 'Pago no encontrado' }, { status: 404 });
    }
    console.error('Webhook MP: monto no coincide', { referencia, paymentId });
    return NextResponse.json({ error: 'Monto inválido' }, { status: 400 });
  }

  return NextResponse.json({
    received: true,
    approved: !result.duplicate,
    duplicate: result.duplicate,
  }, { status: 200 });
}

async function handleWebhook(request: NextRequest): Promise<NextResponse> {
  const rate = checkRateLimit(request, 'mp-webhook', { max: 120, windowSec: 60 });
  if (!rate.ok) {
    return rateLimitResponse(rate.retryAfterSec ?? 60);
  }

  if (!isMercadoPagoConfigured()) {
    return NextResponse.json({ error: 'Webhook no configurado' }, { status: 503 });
  }

  const sandbox = isMercadoPagoSandbox();
  const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET?.trim();
  if (!webhookSecret && !sandbox) {
    return NextResponse.json({ error: 'Webhook no configurado' }, { status: 503 });
  }

  const topicParam = request.nextUrl.searchParams.get('topic')?.trim().toLowerCase();
  const idParam = request.nextUrl.searchParams.get('id')?.trim();

  let body: WebhookBody = {};
  if (request.method === 'POST') {
    try {
      const text = await request.text();
      if (text) {
        body = JSON.parse(text) as WebhookBody;
      }
    } catch {
      return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
    }
  }

  const topic =
    topicParam ||
    body.type?.toLowerCase() ||
    body.topic?.toLowerCase() ||
    '';

  const resourceIdRaw =
    idParam ||
    (body.data?.id != null ? String(body.data.id) : null);

  if (!resourceIdRaw) {
    return NextResponse.json({ received: true }, { status: 200 });
  }

  const dataId = resourceIdRaw;
  const xSignature = request.headers.get('x-signature');
  const xRequestId = request.headers.get('x-request-id');

  if (webhookSecret && xSignature && xRequestId) {
    const valid = isSignatureValid(dataId, xSignature, xRequestId);
    if (!valid && !sandbox) {
      return NextResponse.json({ error: 'Firma inválida' }, { status: 401 });
    }
    if (!valid && sandbox) {
      console.warn('[MP webhook] Firma inválida en sandbox; se verifica el pago vía API.');
    }
  }

  try {
    if (topic === 'payment' || topic.includes('payment')) {
      return await processApprovedPayment(dataId, request);
    }

    if (topic === 'merchant_order' || topic.includes('merchant_order')) {
      const order = await getMerchantOrderById(dataId);
      const approvedPayment = order.payments?.find((p) => p.status === 'approved');

      if (approvedPayment?.id) {
        return await processApprovedPayment(String(approvedPayment.id), request);
      }

      return NextResponse.json({ received: true, topic: 'merchant_order' }, { status: 200 });
    }

    return NextResponse.json({ received: true, topic: topic || 'unknown' }, { status: 200 });
  } catch (error) {
    console.error('Error en webhook Mercado Pago:', error);
    return NextResponse.json({ error: 'Error al procesar webhook' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return handleWebhook(request);
}

export async function GET(request: NextRequest) {
  return handleWebhook(request);
}
