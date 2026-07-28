import type { Prisma } from '@prisma/client';
import { buildActiveSubscriptionDates, type BillingCycle } from '@/lib/plan-billing';

export async function applyInstitutionPlanChange(
  tx: Prisma.TransactionClient,
  params: {
    institucionId: number;
    planId: number;
    email: string;
    billingCycle?: BillingCycle;
  }
): Promise<void> {  const institucion = await tx.instituciones.findUnique({
    where: { id: params.institucionId },
    include: { suscripcion: true, plan: true },
  });

  if (!institucion) {
    throw new Error('Institución no encontrada');
  }

  if (institucion.email.toLowerCase() !== params.email.toLowerCase()) {
    throw new Error('El correo del pago no coincide con la institución');
  }

  const plan = await tx.plan.findUnique({ where: { id: params.planId } });
  if (!plan) {
    throw new Error('Plan no encontrado');
  }

  if (institucion.suscripcion_id) {
    await tx.suscripcion.update({
      where: { id: institucion.suscripcion_id },
      data: {
        estado: 'CANCELADA',
        fecha_fin: new Date(),
        institucion_id: null,
      },
    });
  }

  const dates = buildActiveSubscriptionDates(params.billingCycle ?? 'monthly');

  const nuevaSuscripcion = await tx.suscripcion.create({
    data: {
      email: params.email,
      plan_id: params.planId,
      estado: 'ACTIVA',
      es_prueba: false,
      fecha_inicio: dates.fecha_inicio,
      fecha_fin: dates.fecha_fin,
      institucion_id: params.institucionId,
    },
  });
  await tx.instituciones.update({
    where: { id: params.institucionId },
    data: {
      plan_id: params.planId,
      suscripcion_id: nuevaSuscripcion.id,
      push_enabled: Boolean(plan.push),
    },
  });
}
