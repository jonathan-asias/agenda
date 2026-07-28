import { randomUUID } from 'crypto';
import type { Prisma } from '@prisma/client';
import { TRIAL_DAYS_DEFAULT, TRIAL_LINK_TTL_HOURS, TRIAL_REFERENCIA_PREFIX } from '@/lib/trial/constants';
import { buildRegistroInstitucionUrlPair } from '@/lib/payments/registro-url';
import { sendTrialInviteEmail } from '@/lib/trial/send-trial-invite-email';

export interface CreateTrialInviteInput {
  institucionNombre: string;
  nit: string;
  email: string;
  planId: number;
  createdBy: string;
  trialDays?: number;
}

export interface CreateTrialInviteResult {
  inviteId: number;
  referencia: string;
  registroUrl: string;
  registroUrlLocalhost?: string;
  linkExpiresAt: Date;
  trialDays: number;
  emailSent: boolean;
}

async function assertNoConflictingTrial(
  tx: Prisma.TransactionClient,
  email: string,
  nit: string
): Promise<void> {
  const emailNorm = email.trim().toLowerCase();
  const nitNorm = nit.trim();

  const existingInstitution = await tx.instituciones.findFirst({
    where: {
      OR: [{ email: emailNorm }, { nit: nitNorm }],
    },
    select: { id: true },
  });
  if (existingInstitution) {
    throw new Error('Ya existe una institución registrada con ese correo o NIT.');
  }

  const pendingInvite = await tx.invitacionPrueba.findFirst({
    where: {
      estado: 'PENDIENTE',
      link_expires_at: { gt: new Date() },
      OR: [{ email: emailNorm }, { nit: nitNorm }],
    },
    select: { id: true },
  });
  if (pendingInvite) {
    throw new Error('Ya hay una invitación de prueba pendiente para ese correo o NIT.');
  }

  const activeTrialSub = await tx.suscripcion.findFirst({
    where: {
      email: emailNorm,
      es_prueba: true,
      estado: { in: ['PRUEBA', 'ACTIVA'] },
    },
    select: { id: true },
  });
  if (activeTrialSub) {
    throw new Error('Ya existe una prueba activa o en curso para ese correo.');
  }
}

export async function createTrialInvite(
  tx: Prisma.TransactionClient,
  input: CreateTrialInviteInput
): Promise<CreateTrialInviteResult> {
  const email = input.email.trim().toLowerCase();
  const nit = input.nit.trim();
  const institucionNombre = input.institucionNombre.trim();
  const trialDays = input.trialDays ?? TRIAL_DAYS_DEFAULT;

  if (!institucionNombre || !nit || !email) {
    throw new Error('Nombre de institución, NIT y correo son obligatorios.');
  }

  const plan = await tx.plan.findUnique({ where: { id: input.planId } });
  if (!plan?.activo) {
    throw new Error('Plan no válido para la prueba.');
  }

  await assertNoConflictingTrial(tx, email, nit);

  const referencia = `${TRIAL_REFERENCIA_PREFIX}${randomUUID()}`;
  const linkExpiresAt = new Date(Date.now() + TRIAL_LINK_TTL_HOURS * 60 * 60 * 1000);

  const suscripcion = await tx.suscripcion.create({
    data: {
      email,
      plan_id: input.planId,
      estado: 'PRUEBA',
      es_prueba: true,
      fecha_inicio: null,
      fecha_fin: null,
      institucion_id: null,
    },
  });

  const invite = await tx.invitacionPrueba.create({
    data: {
      referencia,
      institucion_nombre: institucionNombre,
      nit,
      email,
      plan_id: input.planId,
      suscripcion_id: suscripcion.id,
      estado: 'PENDIENTE',
      link_expires_at: linkExpiresAt,
      trial_days: trialDays,
      created_by: input.createdBy,
    },
    include: { plan: true },
  });

  const { registroUrl, registroUrlLocalhost } = buildRegistroInstitucionUrlPair(
    email,
    referencia,
    TRIAL_LINK_TTL_HOURS
  );

  const emailSent = await sendTrialInviteEmail({
    to: email,
    institucionNombre,
    planNombre: invite.plan.nombre,
    registroUrl,
    registroUrlLocalhost,
    linkExpiresInHours: TRIAL_LINK_TTL_HOURS,
    trialDays,
  });

  return {
    inviteId: invite.id,
    referencia,
    registroUrl,
    registroUrlLocalhost,
    linkExpiresAt,
    trialDays,
    emailSent,
  };
}
