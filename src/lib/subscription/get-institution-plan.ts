import type { Prisma } from '@prisma/client';
import { billingPeriodLabel } from '@/lib/plan-billing';
import { inferBillingCycleFromDates } from '@/lib/subscription/resolve-billing-cycle';

export interface InstitutionPlanInfo {
  plan: {
    id: number;
    nombre: string;
    precio: number;
    push: boolean;
    whatsapp: boolean;
    email: boolean;
  } | null;
  suscripcion: {
    id: number;
    estado: string;
    fecha_inicio: string | null;
    fecha_fin: string | null;
    ciclo_facturacion: string | null;
  } | null;
  availablePlans: Array<{
    id: number;
    nombre: string;
    precio: number;
    push: boolean;
    whatsapp: boolean;
    email: boolean;
  }>;
}

export async function getInstitutionPlanInfo(
  tx: Prisma.TransactionClient,
  institucionId: number
): Promise<InstitutionPlanInfo | null> {
  const institucion = await tx.instituciones.findUnique({
    where: { id: institucionId },
    include: {
      plan: true,
      suscripcion: true,
    },
  });

  if (!institucion) return null;

  const availablePlans = await tx.plan.findMany({
    where: { activo: true },
    orderBy: { precio: 'asc' },
    select: {
      id: true,
      nombre: true,
      precio: true,
      push: true,
      whatsapp: true,
      email: true,
    },
  });

  return {
    plan: institucion.plan
      ? {
          id: institucion.plan.id,
          nombre: institucion.plan.nombre,
          precio: institucion.plan.precio,
          push: institucion.plan.push,
          whatsapp: institucion.plan.whatsapp,
          email: institucion.plan.email,
        }
      : null,
    suscripcion: institucion.suscripcion
      ? {
          id: institucion.suscripcion.id,
          estado: institucion.suscripcion.estado,
          fecha_inicio: institucion.suscripcion.fecha_inicio?.toISOString() ?? null,
          fecha_fin: institucion.suscripcion.fecha_fin?.toISOString() ?? null,
          ciclo_facturacion:
            institucion.suscripcion.fecha_inicio &&
            institucion.suscripcion.fecha_fin &&
            institucion.suscripcion.estado === 'ACTIVA'
              ? billingPeriodLabel(
                  inferBillingCycleFromDates(
                    institucion.suscripcion.fecha_inicio,
                    institucion.suscripcion.fecha_fin
                  )
                )
              : null,
        }
      : null,
    availablePlans,
  };
}
