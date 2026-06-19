import { withDbBypass } from '@/lib/db/rls-context';
import {
  checkCheckoutEmailAvailability,
  checkoutEmailBlockMessage,
} from '@/lib/payments/check-checkout-email';
import { parsePreRegistroInstitucion } from '@/lib/payments/pre-registro-institucion';
import { getPlanChargeAmount, parseBillingCycle } from '@/lib/plan-billing';
import type { PreRegistroInstitucion } from '@/types/pre-registro-institucion';

export interface CheckoutBodyInput {
  email: string;
  planId: number;
  nombre?: string;
  preRegistro?: PreRegistroInstitucion;
  ciclo?: string;
  billingCycle?: string;
}

export type ParseCheckoutResult =
  | {
      ok: true;
      email: string;
      nombre?: string;
      plan: {
        id: number;
        nombre: string;
        precio: number;
      };
      monto: number;
      datosPreregistro?: PreRegistroInstitucion;
    }
  | { ok: false; status: number; error: string; code?: string };

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function parseCheckoutBody(
  body: CheckoutBodyInput
): Promise<ParseCheckoutResult> {
  const email = body.email?.trim().toLowerCase();
  const planId = body.planId;
  const nombre = body.nombre?.trim();

  let datosPreregistro: PreRegistroInstitucion | undefined;
  if (body.preRegistro) {
    const parsed = parsePreRegistroInstitucion(body.preRegistro);
    if (!parsed.ok) {
      return { ok: false, status: 400, error: parsed.error };
    }
    if (parsed.data.email !== email) {
      return {
        ok: false,
        status: 400,
        error: 'El correo del formulario no coincide con el correo de pago',
      };
    }
    datosPreregistro = parsed.data;
  }

  if (!email || !isValidEmail(email)) {
    return { ok: false, status: 400, error: 'email inválido' };
  }

  const emailCheck = await checkCheckoutEmailAvailability(email);
  if (!emailCheck.available && emailCheck.reason) {
    return {
      ok: false,
      status: 409,
      error: checkoutEmailBlockMessage(emailCheck.reason),
      code: emailCheck.reason,
    };
  }

  if (typeof planId !== 'number' || !Number.isInteger(planId) || planId <= 0) {
    return { ok: false, status: 400, error: 'planId inválido' };
  }

  const plan = await withDbBypass(async (tx) =>
    tx.plan.findFirst({
      where: { id: planId, activo: true },
      select: { id: true, nombre: true, precio: true },
    })
  );

  if (!plan) {
    return { ok: false, status: 404, error: 'Plan no encontrado' };
  }

  const billingCycle = parseBillingCycle(body.billingCycle ?? body.ciclo);
  const monto = getPlanChargeAmount(plan.precio, billingCycle);

  return {
    ok: true,
    email,
    nombre,
    plan,
    monto,
    datosPreregistro,
  };
}
