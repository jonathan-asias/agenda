import { NextRequest, NextResponse } from 'next/server';
import { withDbBypass } from '@/lib/db/rls-context';
import { sendPaymentConfirmationEmail } from '@/lib/mercadopago/send-payment-confirmation-email';
import { isWompiSandbox } from '@/lib/wompi/config';
import { isMercadoPagoSandbox } from '@/lib/mercadopago/config';
import { checkRateLimit, rateLimitResponse } from '@/lib/security/rate-limit';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * POST /api/payments/resend-registro-email
 * Reenvía correo de registro si el pago ya está aprobado (sandbox/dev).
 */
export async function POST(request: NextRequest) {
  const sandbox = isMercadoPagoSandbox() || isWompiSandbox();
  if (!sandbox && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'No disponible' }, { status: 403 });
  }

  const rate = checkRateLimit(request, 'resend-registro-email', { max: 5, windowSec: 300 });
  if (!rate.ok) {
    return rateLimitResponse(rate.retryAfterSec ?? 300);
  }

  let body: { email?: string; referencia?: string };
  try {
    body = (await request.json()) as { email?: string; referencia?: string };
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const referencia = body.referencia?.trim();
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: 'email inválido' }, { status: 400 });
  }

  const pago = await withDbBypass(async (tx) => {
    if (referencia) {
      return tx.pago.findUnique({
        where: { referencia },
        include: { plan: true },
      });
    }
    return tx.pago.findFirst({
      where: { email, estado: 'APPROVED', procesado: true },
      orderBy: { created_at: 'desc' },
      include: { plan: true },
    });
  });

  if (!pago || pago.email !== email) {
    return NextResponse.json({ error: 'Pago aprobado no encontrado' }, { status: 404 });
  }

  if (pago.estado !== 'APPROVED' || !pago.procesado) {
    return NextResponse.json(
      {
        error: 'El pago aún no está confirmado. Complete el checkout o espere la sincronización.',
        estado: pago.estado,
      },
      { status: 400 }
    );
  }

  const institucion = await withDbBypass(async (tx) =>
    tx.instituciones.findFirst({ where: { email }, select: { id: true } })
  );
  if (institucion) {
    return NextResponse.json(
      { error: 'Ya existe una institución registrada con este correo.' },
      { status: 409 }
    );
  }

  const result = await sendPaymentConfirmationEmail({
    email: pago.email,
    referencia: pago.referencia,
    plan: pago.plan,
  });

  if (!result.sent) {
    return NextResponse.json(
      {
        error:
          result.error ??
          'No se pudo enviar el correo. Verifique RESEND_API_KEY y EMAIL_FROM en .env.local.',
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ sent: true, referencia: pago.referencia });
}
