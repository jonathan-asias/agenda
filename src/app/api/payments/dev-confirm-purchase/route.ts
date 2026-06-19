import { NextRequest, NextResponse } from 'next/server';
import { withDbBypass } from '@/lib/db/rls-context';
import { approvePayment } from '@/lib/payments/approve-payment';
import {
  isDevConfirmPurchaseEnabled,
  isValidDevConfirmPurchaseToken,
} from '@/lib/payments/dev-confirm-purchase';
import { checkRateLimit, rateLimitResponse } from '@/lib/security/rate-limit';
import { writeAuditLog } from '@/lib/security/audit-log';

interface ConfirmBody {
  ref?: string;
  email?: string;
  token?: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function resolveGateway(marker: string | null | undefined): 'MERCADOPAGO' | 'WOMPI' {
  if (marker?.startsWith('wompi-')) return 'WOMPI';
  return 'MERCADOPAGO';
}

/**
 * POST /api/payments/dev-confirm-purchase
 * Sandbox/dev: confirma manualmente un pago pendiente con referencia + correo.
 * Requiere token secreto (mismo valor que PAYMENT_DEV_CONFIRM_SECRET).
 */
export async function POST(request: NextRequest) {
  if (!isDevConfirmPurchaseEnabled()) {
    return NextResponse.json({ error: 'No disponible' }, { status: 404 });
  }

  const rate = checkRateLimit(request, 'dev-confirm-purchase', { max: 15, windowSec: 60 });
  if (!rate.ok) {
    return rateLimitResponse(rate.retryAfterSec ?? 60);
  }

  let body: ConfirmBody;
  try {
    body = (await request.json()) as ConfirmBody;
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }

  const token =
    body.token?.trim() ||
    request.headers.get('x-dev-confirm-token')?.trim() ||
    '';

  if (!isValidDevConfirmPurchaseToken(token)) {
    return NextResponse.json({ error: 'No disponible' }, { status: 404 });
  }

  const referencia = body.ref?.trim();
  const email = body.email?.trim().toLowerCase();

  if (!referencia || !email || !isValidEmail(email)) {
    return NextResponse.json(
      { error: 'Ingrese la referencia del comprobante y un correo válido.' },
      { status: 400 }
    );
  }

  const pago = await withDbBypass(async (tx) =>
    tx.pago.findUnique({
      where: { referencia },
      select: {
        email: true,
        referencia: true,
        monto: true,
        estado: true,
        procesado: true,
        mercado_pago_id: true,
      },
    })
  );

  if (!pago || pago.email !== email) {
    return NextResponse.json(
      { error: 'No encontramos un pago pendiente con esa referencia y correo.' },
      { status: 404 }
    );
  }

  if (pago.estado === 'APPROVED' && pago.procesado) {
    return NextResponse.json({
      confirmed: true,
      alreadyApproved: true,
      ref: pago.referencia,
      email: pago.email,
    });
  }

  const gateway = resolveGateway(pago.mercado_pago_id);
  const result = await approvePayment({
    referencia: pago.referencia,
    gatewayPaymentId: `dev-manual-${pago.referencia}`,
    transactionAmount: pago.monto,
    gateway,
    request,
  });

  if (!result.ok) {
    return NextResponse.json({ error: 'No se pudo confirmar el pago.' }, { status: 400 });
  }

  await writeAuditLog({
    usuario: pago.email,
    accion: 'PAGO_CONFIRMADO',
    metadata: {
      referencia: pago.referencia,
      devManualConfirm: true,
      gateway,
    },
    request,
  });

  return NextResponse.json({
    confirmed: true,
    alreadyApproved: result.duplicate,
    ref: pago.referencia,
    email: pago.email,
  });
}
