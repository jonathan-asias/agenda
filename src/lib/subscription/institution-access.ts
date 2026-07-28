import type { Prisma } from '@prisma/client';
import type { UserRole } from '@/types/auth';
import { withDbBypass } from '@/lib/db/rls-context';
import { isPaymentRequiredForRegistration } from '@/lib/env';

export type SubscriptionAccessMode =
  | 'full'
  | 'grace_readonly'
  | 'trial_billing_only'
  | 'blocked';

export interface InstitutionSubscriptionAccess {
  mode: SubscriptionAccessMode;
  estado: string | null;
  graceUntil: string | null;
  graceDays: number;
  canWrite: boolean;
  canLogin: boolean;
  isTrial: boolean;
  trialDaysLeft: number;
  message: string;
}

async function maybeMarkSubscriptionExpired(
  tx: Prisma.TransactionClient,
  suscripcion: { id: number; estado: string; fecha_fin: Date | null; es_prueba: boolean }
): Promise<void> {
  if (suscripcion.estado !== 'CANCELADA' || !suscripcion.fecha_fin) return;
  if (new Date() <= suscripcion.fecha_fin) return;

  await tx.suscripcion.update({
    where: { id: suscripcion.id },
    data: { estado: 'VENCIDA' },
  });
}

async function maybeMarkTrialExpired(
  tx: Prisma.TransactionClient,
  suscripcion: { id: number; estado: string; fecha_fin: Date | null }
): Promise<void> {
  if (suscripcion.estado !== 'PRUEBA' || !suscripcion.fecha_fin) return;
  if (new Date() <= suscripcion.fecha_fin) return;

  await tx.suscripcion.update({
    where: { id: suscripcion.id },
    data: { estado: 'VENCIDA' },
  });
}

function computeTrialDaysLeft(fechaFin: Date | null): number {
  if (!fechaFin) return 0;
  return Math.max(0, Math.ceil((fechaFin.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
}

function trialActiveAccess(fechaFin: Date | null): InstitutionSubscriptionAccess {
  const trialDaysLeft = computeTrialDaysLeft(fechaFin);
  return {
    mode: 'full',
    estado: 'PRUEBA',
    graceUntil: fechaFin?.toISOString() ?? null,
    graceDays: 0,
    canWrite: true,
    canLogin: true,
    isTrial: true,
    trialDaysLeft,
    message: '',
  };
}

function trialExpiredForRole(role: UserRole | null | undefined): InstitutionSubscriptionAccess {
  const message =
    'El periodo de prueba ya finalizó. Contrate un plan para reactivar el acceso de su institución.';

  if (role === 'institucion') {
    return {
      mode: 'trial_billing_only',
      estado: 'VENCIDA',
      graceUntil: null,
      graceDays: 0,
      canWrite: false,
      canLogin: true,
      isTrial: true,
      trialDaysLeft: 0,
      message,
    };
  }

  return {
    mode: 'blocked',
    estado: 'VENCIDA',
    graceUntil: null,
    graceDays: 0,
    canWrite: false,
    canLogin: false,
    isTrial: true,
    trialDaysLeft: 0,
    message:
      'El periodo de prueba de esta institución ya finalizó. Contacte al responsable de la cuenta institucional.',
  };
}

export async function resolveInstitutionSubscriptionAccess(
  institutionId: number,
  role?: UserRole | null
): Promise<InstitutionSubscriptionAccess> {
  if (!isPaymentRequiredForRegistration()) {
    return {
      mode: 'full',
      estado: null,
      graceUntil: null,
      graceDays: 0,
      canWrite: true,
      canLogin: true,
      isTrial: false,
      trialDaysLeft: 0,
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
        isTrial: false,
        trialDaysLeft: 0,
        message:
          'No hay suscripción activa. Adquiera un plan o contacte a soporte@agendavirtual.com.',
      };
    }

    const sub = institucion.suscripcion;
    await maybeMarkSubscriptionExpired(tx, sub);
    await maybeMarkTrialExpired(tx, sub);

    const refreshed = await tx.suscripcion.findUnique({ where: { id: sub.id } });
    const estado = refreshed?.estado ?? sub.estado;
    const fechaFin = refreshed?.fecha_fin ?? sub.fecha_fin;
    const esPrueba = refreshed?.es_prueba ?? sub.es_prueba;

    if (estado === 'PRUEBA' && fechaFin && new Date() <= fechaFin) {
      return trialActiveAccess(fechaFin);
    }

    if (esPrueba && estado === 'VENCIDA') {
      return trialExpiredForRole(role);
    }

    if (estado === 'ACTIVA') {
      return {
        mode: 'full',
        estado,
        graceUntil: null,
        graceDays: 0,
        canWrite: true,
        canLogin: true,
        isTrial: false,
        trialDaysLeft: 0,
        message: '',
      };
    }

    if ((estado === 'CANCELADA' || estado === 'VENCIDA') && fechaFin) {
      const graceUntil = fechaFin.toISOString();
      if (new Date() <= fechaFin) {
        const daysLeft = computeTrialDaysLeft(fechaFin);
        return {
          mode: 'grace_readonly',
          estado,
          graceUntil,
          graceDays: daysLeft,
          canWrite: false,
          canLogin: true,
          isTrial: false,
          trialDaysLeft: 0,
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
      isTrial: esPrueba,
      trialDaysLeft: 0,
      message:
        'Su suscripción expiró. Contacte a soporte o adquiera un nuevo plan para volver a ingresar.',
    };
  });
}
