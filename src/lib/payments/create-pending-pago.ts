import { Prisma } from '@prisma/client';
import { withDbBypass } from '@/lib/db/rls-context';
import { billingCycleQueryParam, parseBillingCycle } from '@/lib/plan-billing';
import type { PreRegistroInstitucion } from '@/types/pre-registro-institucion';
import type { PagoMetadata } from '@/types/pago-metadata';

function buildJsonPayload(params: {
  datosPreregistro?: PreRegistroInstitucion;
  metadata?: PagoMetadata;
  billingCycle?: string;
}): Prisma.InputJsonValue | undefined {
  const cycle = params.billingCycle
    ? billingCycleQueryParam(parseBillingCycle(params.billingCycle))
    : undefined;
  const cycleFields = cycle ? { billingCycle: cycle, ciclo: cycle } : {};

  if (params.metadata) {
    return { ...params.metadata, ...cycleFields } as Prisma.InputJsonValue;
  }
  if (params.datosPreregistro) {
    return { ...params.datosPreregistro, ...cycleFields } as Prisma.InputJsonValue;
  }
  if (cycle) {
    return cycleFields as Prisma.InputJsonValue;
  }
  return undefined;
}

export async function createPendingPago(params: {
  email: string;
  referencia: string;
  planId: number;
  monto: number;
  datosPreregistro?: PreRegistroInstitucion;
  metadata?: PagoMetadata;
  billingCycle?: string;
}): Promise<void> {
  const jsonPayload = buildJsonPayload(params);
  await withDbBypass(async (tx) => {
    await tx.pago.create({
      data: {
        email: params.email,
        referencia: params.referencia,
        plan_id: params.planId,
        monto: params.monto,
        estado: 'PENDING',
        procesado: false,
        datos_preregistro: jsonPayload,
      },
    });
  });
}
