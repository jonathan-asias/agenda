import { NextRequest, NextResponse } from 'next/server';
import { withDbBypass } from '@/lib/db/rls-context';
import { approvePaymentFromMercadoPago } from '@/lib/mercadopago/approve-payment';
import {
  getPaymentById,
  isMercadoPagoConfigured,
  searchPaymentsByReference,
} from '@/lib/mercadopago/client';
import { isMercadoPagoSandbox } from '@/lib/mercadopago/config';
import { checkRateLimit, rateLimitResponse } from '@/lib/security/rate-limit';

interface SyncBody {
  ref?: string;
  email?: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * POST /api/payments/sync-status
 * Sandbox/dev: confirma pago consultando MP si el webhook no llegó (sin túnel).
 */
export async function POST(request: NextRequest) {
  if (!isMercadoPagoSandbox()) {
    return NextResponse.json({ error: 'No disponible en producción' }, { status: 403 });
  }

  const rate = checkRateLimit(request, 'mp-sync-status', { max: 20, windowSec: 60 });
  if (!rate.ok) {
    return rateLimitResponse(rate.retryAfterSec ?? 60);
  }

  if (!isMercadoPagoConfigured()) {
    return NextResponse.json({ error: 'Pasarela no configurada' }, { status: 503 });
  }

  let body: SyncBody;
  try {
    body = (await request.json()) as SyncBody;
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }

  const referencia = body.ref?.trim();
  const email = body.email?.trim().toLowerCase();

  if (!referencia || !email || !isValidEmail(email)) {
    return NextResponse.json({ error: 'ref y email requeridos' }, { status: 400 });
  }

  const pago = await withDbBypass(async (tx) =>
    tx.pago.findUnique({ where: { referencia } })
  );

  if (!pago || pago.email !== email) {
    return NextResponse.json({ error: 'Pago no encontrado' }, { status: 404 });
  }

  if (pago.estado === 'APPROVED' && pago.procesado) {
    return NextResponse.json({
      synced: true,
      canRegister: true,
      status: 'APPROVED',
      duplicate: true,
    });
  }

  try {
    const payments = await searchPaymentsByReference(referencia);
    const approved = payments.find((p) => p.status === 'approved');

    if (!approved) {
      const latest = payments[0];
      const detail = latest?.status_detail ?? null;
      const hint =
        detail === 'cc_rejected_other_reason'
          ? 'Use tarjeta Colombia (5254 1336 7440 3564), titular APRO y documento 123456789 en el formulario de MP.'
          : detail === 'cc_rejected_bad_filled_security_code'
            ? 'CVV incorrecto o campo de tarjeta bloqueado por el navegador (cookies de terceros).'
            : payments.length === 0
              ? 'Aún no hay pago en MP para esta referencia. Complete el checkout o espere el webhook.'
              : null;
      return NextResponse.json({
        synced: false,
        canRegister: false,
        status: latest?.status ?? 'pending',
        statusDetail: detail,
        hint,
      });
    }

    const result = await approvePaymentFromMercadoPago({
      referencia,
      mpPaymentId: String(approved.id),
      transactionAmount: approved.transaction_amount,
      request,
    });

    if (!result.ok) {
      return NextResponse.json({ error: 'No se pudo confirmar el pago' }, { status: 400 });
    }

    return NextResponse.json({
      synced: true,
      canRegister: true,
      status: 'APPROVED',
      duplicate: result.duplicate,
    });
  } catch (error) {
    console.error('Error en sync-status MP:', error);
    return NextResponse.json({ error: 'Error al sincronizar pago' }, { status: 500 });
  }
}
