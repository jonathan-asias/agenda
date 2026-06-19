import { withDbBypass } from '@/lib/db/rls-context';
import {
  parseWompiPaymentLinkMarker,
  wompiPaymentLinkMarker,
} from '@/lib/wompi/client';

export async function attachWompiPaymentLinkToPago(
  referencia: string,
  paymentLinkId: string
): Promise<void> {
  await withDbBypass(async (tx) => {
    await tx.pago.update({
      where: { referencia },
      data: { mercado_pago_id: wompiPaymentLinkMarker(paymentLinkId) },
    });
  });
}

export async function findPagoReferenciaForWompiTransaction(params: {
  reference?: string;
  paymentLinkId?: string | null;
  customerEmail?: string;
  amountCop?: number;
}): Promise<string | null> {
  return withDbBypass(async (tx) => {
    if (params.reference) {
      const byRef = await tx.pago.findUnique({
        where: { referencia: params.reference },
        select: { referencia: true },
      });
      if (byRef) return byRef.referencia;
    }

    if (params.paymentLinkId) {
      const marker = wompiPaymentLinkMarker(params.paymentLinkId);
      const byLink = await tx.pago.findFirst({
        where: { mercado_pago_id: marker },
        select: { referencia: true },
      });
      if (byLink) return byLink.referencia;
    }

    if (params.customerEmail && params.amountCop != null) {
      const byEmail = await tx.pago.findFirst({
        where: {
          email: params.customerEmail.toLowerCase(),
          monto: params.amountCop,
          estado: 'PENDING',
        },
        orderBy: { created_at: 'desc' },
        select: { referencia: true },
      });
      if (byEmail) return byEmail.referencia;
    }

    return null;
  });
}

export async function findPagoReferenciaByPaymentLinkMarker(
  mercadoPagoId: string | null | undefined
): Promise<string | null> {
  const linkId = parseWompiPaymentLinkMarker(mercadoPagoId);
  if (!linkId) return null;

  return withDbBypass(async (tx) => {
    const pago = await tx.pago.findFirst({
      where: { mercado_pago_id: wompiPaymentLinkMarker(linkId) },
      select: { referencia: true },
    });
    return pago?.referencia ?? null;
  });
}
