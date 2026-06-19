import { NextRequest, NextResponse } from 'next/server';
import { withDbBypass } from '@/lib/db/rls-context';
import { getWompiTransactionById } from '@/lib/wompi/client';
import { isWompiConfigured } from '@/lib/wompi/config';
import { findPagoReferenciaForWompiTransaction } from '@/lib/wompi/resolve-pago';
import { checkRateLimit, rateLimitResponse } from '@/lib/security/rate-limit';

/**
 * GET /api/wompi/resolve-return?id=...
 * Wompi redirige con ?id=transaccion; resolvemos ref y email para pago-exitoso.
 */
export async function GET(request: NextRequest) {
  const rate = checkRateLimit(request, 'wompi-resolve-return', { max: 30, windowSec: 60 });
  if (!rate.ok) {
    return rateLimitResponse(rate.retryAfterSec ?? 60);
  }

  if (!isWompiConfigured()) {
    return NextResponse.json({ error: 'Wompi no configurado' }, { status: 503 });
  }

  const id = request.nextUrl.searchParams.get('id')?.trim();
  if (!id) {
    return NextResponse.json({ error: 'id requerido' }, { status: 400 });
  }

  const tx = await getWompiTransactionById(id);
  if (!tx) {
    return NextResponse.json({ error: 'Transacción no encontrada' }, { status: 404 });
  }

  const referencia = await findPagoReferenciaForWompiTransaction({
    reference: tx.reference,
    paymentLinkId: tx.payment_link_id,
    customerEmail: tx.customer_email,
    amountCop: Math.round(tx.amount_in_cents / 100),
  });

  if (!referencia) {
    return NextResponse.json({ error: 'Pago no registrado' }, { status: 404 });
  }

  const pago = await withDbBypass(async (db) =>
    db.pago.findUnique({
      where: { referencia },
      select: { email: true, referencia: true, estado: true, procesado: true },
    })
  );

  if (!pago) {
    return NextResponse.json({ error: 'Pago no registrado' }, { status: 404 });
  }

  if (tx.customer_email && tx.customer_email.toLowerCase() !== pago.email.toLowerCase()) {
    return NextResponse.json({ error: 'Correo no coincide' }, { status: 403 });
  }

  return NextResponse.json({
    ref: pago.referencia,
    email: pago.email,
    wompiTransactionId: tx.id,
    status: tx.status,
    approved: pago.estado === 'APPROVED' && pago.procesado,
  });
}
