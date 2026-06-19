import type { Prisma } from '@prisma/client';
import { withDbBypass } from '@/lib/db/rls-context';
import { isPaymentRequiredForRegistration } from '@/lib/env';

export type SubscriptionAccessMode = 'full' | 'grace_readonly' | 'blocked';

export interface InstitutionSubscriptionAccess {
  mode: SubscriptionAccessMode;
  estado: string | null;
  graceUntil: string | null;
  graceDays: number;
  canWrite: boolean;
  canLogin: boolean;
  message: string;
}

async function maybeMarkSubscriptionExpired(
  tx: Prisma.TransactionClient,
  suscripcion: { id: number; estado: string; fecha_fin: Date | null }
): Promise<void> {
  if (suscripcion.estado !== 'CANCELADA' || !suscripcion.fecha_fin) return;
  if (new Date() <= suscripcion.fecha_fin) return;

  await tx.suscripcion.update({
    where: { id: suscripcion.id },
    data: { estado: 'VENCIDA' },
  });
}

export async function resolveInstitutionSubscriptionAccess(
  institutionId: number
): Promise<InstitutionSubscriptionAccess> {
  if (!isPaymentRequiredForRegistration()) {
    return {
      mode: 'full',
      estado: null,
      graceUntil: null,
      graceDays: 0,
      canWrite: true,
      canLogin: true,
      message: '',
    };
  }

  return withDbBypass(async (tx) => {
    const institucion = await tx.instituciones.findUnique({
      where: { id: institutionId },
      include: { suscripcion: true },
    });

    if (!institucion?.suscripcion) {
      return {
        mode: 'blocked',
        estado: null,
        graceUntil: null,
        graceDays: 0,
        canWrite: false,
        canLogin: false,
        message:
          'No hay suscripción activa. Adquiera un plan o contacte a soporte@agendavirtual.com.',
      };
    }

    const sub = institucion.suscripcion;
    await maybeMarkSubscriptionExpired(tx, sub);

    const refreshed = await tx.suscripcion.findUnique({ where: { id: sub.id } });
    const estado = refreshed?.estado ?? sub.estado;
    const fechaFin = refreshed?.fecha_fin ?? sub.fecha_fin;

    if (estado === 'ACTIVA') {
      return {
        mode: 'full',
        estado,
        graceUntil: null,
        graceDays: 0,
        canWrite: true,
        canLogin: true,
        message: '',
      };
    }

    if ((estado === 'CANCELADA' || estado === 'VENCIDA') && fechaFin) {
      const graceUntil = fechaFin.toISOString();
      if (new Date() <= fechaFin) {
        const daysLeft = Math.ceil(
          (fechaFin.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        return {
          mode: 'grace_readonly',
          estado,
          graceUntil,
          graceDays: daysLeft,
          canWrite: false,
          canLogin: true,
          message: `Su suscripción fue cancelada. Puede consultar información hasta el ${fechaFin.toLocaleDateString('es-CO', { dateStyle: 'long' })} (${daysLeft} día(s) restante(s)). No podrá crear, editar ni eliminar datos. Renueve su plan en Perfil o contacte soporte.`,
        };
      }
    }

    return {
      mode: 'blocked',
      estado,
      graceUntil: fechaFin?.toISOString() ?? null,
      graceDays: 0,
      canWrite: false,
      canLogin: false,
      message:
        'Su suscripción expiró. Contacte a soporte o adquiera un nuevo plan para volver a ingresar.',
    };
  });
}
