import {
  getPlanChargeAmount,
  parseBillingCycle,
  type BillingCycle,
} from '@/lib/plan-billing';

/** Obtiene el ciclo de facturación guardado en el pago o lo infiere por el monto. */
export function resolveBillingCycleFromPago(params: {
  datosPreregistro: unknown;
  planPrecio: number;
  monto: number;
}): BillingCycle {
  if (params.datosPreregistro && typeof params.datosPreregistro === 'object') {
    const raw = params.datosPreregistro as Record<string, unknown>;
    const cycleRaw =
      typeof raw.billingCycle === 'string'
        ? raw.billingCycle
        : typeof raw.ciclo === 'string'
          ? raw.ciclo
          : undefined;
    if (cycleRaw) {
      return parseBillingCycle(cycleRaw);
    }
  }

  const annualAmount = getPlanChargeAmount(params.planPrecio, 'annual');
  if (params.monto === annualAmount) {
    return 'annual';
  }

  return 'monthly';
}

export function inferBillingCycleFromDates(
  fechaInicio: Date,
  fechaFin: Date
): BillingCycle {
  const days = (fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24);
  return days > 90 ? 'annual' : 'monthly';
}
