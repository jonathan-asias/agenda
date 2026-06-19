import { NextRequest, NextResponse } from 'next/server';
import { withDbBypass } from '@/lib/db/rls-context';
import { approvePayment } from '@/lib/payments/approve-payment';
import {
  findApprovedWompiTransactionByReference,
  findApprovedWompiTransactionForPago,
  getWompiTransactionById,
} from '@/lib/wompi/client';
import { findPagoReferenciaForWompiTransaction } from '@/lib/wompi/resolve-pago';
import { isWompiConfigured, isWompiSandbox } from '@/lib/wompi/config';
import { checkRateLimit, rateLimitResponse } from '@/lib/security/rate-limit';

interface SyncBody {
  ref?: string;
  email?: string;
  wompiTransactionId?: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * POST /api/wompi/sync-status
 * Sandbox/dev: confirma pago consultando Wompi si el webhook no llegó.
 */
export async function POST(request: NextRequest) {
  if (!isWompiSandbox()) {
    return NextResponse.json({ error: 'No disponible en producción' }, { status: 403 });
  }

  const rate = checkRateLimit(request, 'wompi-sync-status', { max: 20, windowSec: 60 });
  if (!rate.ok) {
    return rateLimitResponse(rate.retryAfterSec ?? 60);
  }

  if (!isWompiConfigured()) {
    return NextResponse.json({ error: 'Wompi no configurado' }, { status: 503 });
  }

  let body: SyncBody;
  try {
    body = (await request.json()) as SyncBody;
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }

  let referencia = body.ref?.trim();
  let email = body.email?.trim().toLowerCase();
  const wompiTransactionId = body.wompiTransactionId?.trim();

  if (wompiTransactionId && (!referencia || !email)) {
    const tx = await getWompiTransactionById(wompiTransactionId);
    if (tx) {
      const resolved = await findPagoReferenciaForWompiTransaction({
        reference: tx.reference,
        paymentLinkId: tx.payment_link_id,
        customerEmail: tx.customer_email,
        amountCop: Math.round(tx.amount_in_cents / 100),
      });
      if (resolved) referencia = referencia || resolved;
      email = email || tx.customer_email?.trim().toLowerCase();
    }
  }

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
    return NextResponse.json({ synced: true, canRegister: true, status: 'APPROVED' });
  }

  try {
    let approved =
      wompiTransactionId ? await getWompiTransactionById(wompiTransactionId) : null;

    if (approved && approved.status !== 'APPROVED') {
      approved = null;
    }

    if (!approved && referencia) {
      approved = await findApprovedWompiTransactionForPago({
        referencia,
        email: pago.email,
        monto: pago.monto,
        paymentLinkMarker: pago.mercado_pago_id,
        createdAfter: pago.created_at,
      });
    }

    if (approved) {
      const resolvedRef = await findPagoReferenciaForWompiTransaction({
        reference: approved.reference,
        paymentLinkId: approved.payment_link_id,
        customerEmail: approved.customer_email,
        amountCop: Math.round(approved.amount_in_cents / 100),
      });
      if (resolvedRef) referencia = resolvedRef;
    }

    if (!approved) {
      return NextResponse.json({
        synced: false,
        canRegister: false,
        status: 'pending',
        hint: 'Complete el checkout en Wompi o espere el webhook.',
      });
    }

    const amountCop = Math.round(approved.amount_in_cents / 100);
    const result = await approvePayment({
      referencia,
      gatewayPaymentId: approved.id,
      transactionAmount: amountCop,
      gateway: 'WOMPI',
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
    console.error('Error en sync-status Wompi:', error);
    return NextResponse.json({ error: 'Error al sincronizar pago' }, { status: 500 });
  }
}
