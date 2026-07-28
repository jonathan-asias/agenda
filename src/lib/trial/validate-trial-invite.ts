import type { Prisma } from '@prisma/client';
import { isTrialReferencia } from '@/lib/trial/constants';

export interface TrialInviteValidation {
  ok: true;
  email: string;
  referencia: string;
  institucionNombre: string;
  nit: string;
  planId: number;
  trialDays: number;
  suscripcionId: number;
}

export type TrialInviteValidationResult =
  | TrialInviteValidation
  | { ok: false; reason: 'not_found' | 'expired' | 'used' | 'revoked' | 'link_expired' };

export async function validateTrialInviteByReferencia(
  tx: Prisma.TransactionClient,
  referencia: string
): Promise<TrialInviteValidationResult> {
  if (!isTrialReferencia(referencia)) {
    return { ok: false, reason: 'not_found' };
  }

  const invite = await tx.invitacionPrueba.findUnique({
    where: { referencia },
    include: { suscripcion: true },
  });

  if (!invite) {
    return { ok: false, reason: 'not_found' };
  }

  if (invite.estado === 'USADA') {
    return { ok: false, reason: 'used' };
  }

  if (invite.estado === 'REVOCADA') {
    return { ok: false, reason: 'revoked' };
  }

  if (invite.estado === 'EXPIRADA' || invite.link_expires_at < new Date()) {
    if (invite.estado === 'PENDIENTE') {
      await tx.invitacionPrueba.update({
        where: { id: invite.id },
        data: { estado: 'EXPIRADA' },
      });
    }
    return { ok: false, reason: 'link_expired' };
  }

  if (!invite.suscripcion || invite.suscripcion.institucion_id != null) {
    return { ok: false, reason: 'used' };
  }

  return {
    ok: true,
    email: invite.email,
    referencia: invite.referencia,
    institucionNombre: invite.institucion_nombre,
    nit: invite.nit,
    planId: invite.plan_id,
    trialDays: invite.trial_days,
    suscripcionId: invite.suscripcion_id,
  };
}

export async function completeTrialRegistration(
  tx: Prisma.TransactionClient,
  params: {
    referencia: string;
    institucionId: number;
    trialDays: number;
  }
): Promise<void> {
  const now = new Date();
  const fechaFin = new Date(now);
  fechaFin.setDate(fechaFin.getDate() + params.trialDays);

  const invite = await tx.invitacionPrueba.findUnique({
    where: { referencia: params.referencia },
    select: { id: true, suscripcion_id: true },
  });

  if (!invite) {
    throw new Error('Invitación de prueba no encontrada.');
  }

  await tx.suscripcion.update({
    where: { id: invite.suscripcion_id },
    data: {
      institucion_id: params.institucionId,
      fecha_inicio: now,
      fecha_fin: fechaFin,
      estado: 'PRUEBA',
      es_prueba: true,
    },
  });

  await tx.invitacionPrueba.update({
    where: { id: invite.id },
    data: {
      estado: 'USADA',
      used_at: now,
    },
  });
}
