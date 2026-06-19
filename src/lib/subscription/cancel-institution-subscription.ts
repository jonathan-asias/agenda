import type { Prisma } from '@prisma/client';
import { parseWompiPaymentLinkMarker } from '@/lib/wompi/client';
import { deactivateWompiPaymentLink } from '@/lib/wompi/deactivate-payment-link';
import { addGraceDays, getSubscriptionGraceDays } from '@/lib/subscription/grace-period';

export interface CancelSubscriptionResult {
  email: string;
  graceUntil: Date;
  wompiLinkDeactivated: boolean;
  mercadoPagoNote: string;
}

export async function cancelInstitutionSubscription(
  tx: Prisma.TransactionClient,
  institucionId: number
): Promise<
  | { ok: true; data: CancelSubscriptionResult }
  | { ok: false; reason: 'not_found' | 'no_subscription' | 'already_cancelled' }
> {
  const institucion = await tx.instituciones.findUnique({
    where: { id: institucionId },
    include: { suscripcion: true },
  });

  if (!institucion) {
    return { ok: false, reason: 'not_found' };
  }

  if (!institucion.suscripcion_id || !institucion.suscripcion) {
    return { ok: false, reason: 'no_subscription' };
  }

  if (
    institucion.suscripcion.estado === 'CANCELADA' ||
    institucion.suscripcion.estado === 'VENCIDA'
  ) {
    return { ok: false, reason: 'already_cancelled' };
  }

  const graceUntil = addGraceDays();

  await tx.suscripcion.update({
    where: { id: institucion.suscripcion_id },
    data: {
      estado: 'CANCELADA',
      fecha_fin: graceUntil,
    },
  });

  let wompiLinkDeactivated = false;
  const latestPago = await tx.pago.findFirst({
    where: {
      email: institucion.email.toLowerCase(),
      estado: 'APPROVED',
      procesado: true,
    },
    orderBy: { created_at: 'desc' },
    select: { mercado_pago_id: true },
  });

  const linkId = parseWompiPaymentLinkMarker(latestPago?.mercado_pago_id);
  if (linkId) {
    const wompiResult = await deactivateWompiPaymentLink(linkId);
    wompiLinkDeactivated = wompiResult.ok;
    if (!wompiResult.ok) {
      console.warn('No se pudo desactivar payment link Wompi:', linkId, wompiResult.detail);
    }
  }

  const mercadoPagoNote =
    'Mercado Pago: los pagos Checkout Pro son únicos; no hay suscripción recurrente que cancelar en MP. El acceso se revoca en Agenda Virtual.';

  return {
    ok: true,
    data: {
      email: institucion.email,
      graceUntil,
      wompiLinkDeactivated,
      mercadoPagoNote,
    },
  };
}

export { getSubscriptionGraceDays };
