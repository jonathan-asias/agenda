export type BillingCycle = 'monthly' | 'annual';

export const ANNUAL_BILLING_DISCOUNT = 0.05;

export function parseBillingCycle(raw: string | null | undefined): BillingCycle {
  if (raw === 'anual' || raw === 'annual') return 'annual';
  return 'monthly';
}

export function billingCycleQueryParam(cycle: BillingCycle): string {
  return cycle === 'annual' ? 'anual' : 'mensual';
}

export function getPlanChargeAmount(monthlyPrice: number, cycle: BillingCycle): number {
  if (cycle === 'monthly') return monthlyPrice;
  return Math.round(monthlyPrice * 12 * (1 - ANNUAL_BILLING_DISCOUNT));
}

export interface PlanPriceDisplay {
  amount: number;
  periodSuffix: string;
  monthlyEquivalent?: number;
  annualSavings?: number;
}

export function getPlanPriceDisplay(
  monthlyPrice: number,
  cycle: BillingCycle
): PlanPriceDisplay {
  if (cycle === 'monthly') {
    return { amount: monthlyPrice, periodSuffix: '/ mes' };
  }

  const amount = getPlanChargeAmount(monthlyPrice, 'annual');
  const fullYear = monthlyPrice * 12;

  return {
    amount,
    periodSuffix: '/ año',
    monthlyEquivalent: Math.round(amount / 12),
    annualSavings: fullYear - amount,
  };
}

export function billingPeriodLabel(cycle: BillingCycle): string {
  return cycle === 'annual' ? 'anual' : 'mensual';
}

/** Fecha de caducidad del plan según ciclo de facturación. */
export function computeSubscriptionEndDate(from: Date, cycle: BillingCycle): Date {
  const end = new Date(from);
  if (cycle === 'annual') {
    end.setFullYear(end.getFullYear() + 1);
  } else {
    end.setMonth(end.getMonth() + 1);
  }
  return end;
}

export function buildActiveSubscriptionDates(
  cycle: BillingCycle,
  purchaseDate: Date = new Date()
): { fecha_inicio: Date; fecha_fin: Date } {
  return {
    fecha_inicio: purchaseDate,
    fecha_fin: computeSubscriptionEndDate(purchaseDate, cycle),
  };
}
