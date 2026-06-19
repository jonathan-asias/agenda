import type { NextRequest } from 'next/server';
import { withDbBypass } from '@/lib/db/rls-context';
import { sendPaymentConfirmationEmail } from '@/lib/mercadopago/send-payment-confirmation-email';
import { applyInstitutionPlanChange } from '@/lib/subscription/apply-institution-plan-change';
import { buildActiveSubscriptionDates } from '@/lib/plan-billing';
import { resolveBillingCycleFromPago } from '@/lib/subscription/resolve-billing-cycle';
import { writeAuditLog } from '@/lib/security/audit-log';
import { parsePagoMetadata } from '@/types/pago-metadata';

export type ApprovePaymentResult =
  | { ok: true; email: string; referencia: string; duplicate: boolean }
  | { ok: false; reason: 'not_found' | 'amount_mismatch' };

export async function approvePayment(params: {
  referencia: string;
  gatewayPaymentId: string;
  transactionAmount: number;
  gateway?: 'MERCADOPAGO' | 'WOMPI';
  request?: NextRequest;
}): Promise<ApprovePaymentResult> {
  const { referencia, gatewayPaymentId, transactionAmount, gateway = 'MERCADOPAGO', request } =
    params;

  const result = await withDbBypass(async (tx) => {
    const pago = await tx.pago.findUnique({
      where: { referencia },
      include: { plan: true },
    });

    if (!pago) {
      return { notFound: true as const };
    }

    if (Math.round(transactionAmount) !== pago.monto) {
      return { amountMismatch: true as const };
    }

    if (pago.estado === 'APPROVED' && pago.procesado) {
      return { duplicate: true as const, email: pago.email, referencia };
    }

    const claimed = await tx.pago.updateMany({
      where: { id: pago.id, procesado: false },
      data: {
        estado: 'APPROVED',
        procesado: true,
        mercado_pago_id: gatewayPaymentId,
      },
    });

    if (claimed.count === 0) {
      const current = await tx.pago.findUnique({ where: { referencia } });
      if (current?.estado === 'APPROVED' && current.procesado) {
        return { duplicate: true as const, email: current.email, referencia };
      }
      return { claimFailed: true as const };
    }

    const metadata = parsePagoMetadata(pago.datos_preregistro);
    const isPlanChange =
      metadata?.tipo === 'cambio_plan' && typeof metadata.institucionId === 'number';
    const billingCycle = resolveBillingCycleFromPago({
      datosPreregistro: pago.datos_preregistro,
      planPrecio: pago.plan.precio,
      monto: pago.monto,
    });

    if (isPlanChange && metadata?.institucionId) {
      await applyInstitutionPlanChange(tx, {
        institucionId: metadata.institucionId,
        planId: pago.plan_id,
        email: pago.email,
        billingCycle,
      });
    } else {
      const existingSub = await tx.suscripcion.findFirst({
        where: {
          email: pago.email,
          plan_id: pago.plan_id,
          estado: 'ACTIVA',
          institucion_id: null,
        },
      });

      if (!existingSub) {
        const dates = buildActiveSubscriptionDates(billingCycle);
        await tx.suscripcion.create({
          data: {
            email: pago.email,
            plan_id: pago.plan_id,
            estado: 'ACTIVA',
            fecha_inicio: dates.fecha_inicio,
            fecha_fin: dates.fecha_fin,
          },
        });
      }
    }

    return {
      duplicate: false as const,
      email: pago.email,
      referencia,
      planChange: isPlanChange,
      plan: {
        nombre: pago.plan.nombre,
        precio: pago.plan.precio,
        push: pago.plan.push,
        whatsapp: pago.plan.whatsapp,
        email: pago.plan.email,
      },
    };
  });

  if ('notFound' in result && result.notFound) {
    return { ok: false, reason: 'not_found' };
  }

  if ('amountMismatch' in result && result.amountMismatch) {
    return { ok: false, reason: 'amount_mismatch' };
  }

  if ('claimFailed' in result && result.claimFailed) {
    throw new Error('PAYMENT_CLAIM_FAILED');
  }

  if ('email' in result && !result.duplicate) {
    await writeAuditLog({
      usuario: result.email,
      accion: 'PAGO_CONFIRMADO',
      metadata: { referencia: result.referencia, gatewayPaymentId, gateway },
      request,
    });

    if ('plan' in result && !result.planChange) {
      sendPaymentConfirmationEmail({
        email: result.email,
        referencia: result.referencia,
        plan: result.plan,
      }).catch((err) => {
        console.error('Correo post-pago no enviado:', result.email, err);
      });
    }
  }

  return {
    ok: true,
    email: result.email,
    referencia: result.referencia,
    duplicate: result.duplicate,
  };
}
