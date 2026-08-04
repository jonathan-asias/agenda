import bcrypt from 'bcryptjs';
import type { Prisma } from '@prisma/client';
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from '@/lib/supabase-admin';
import {
  completeTrialRegistration,
  validateTrialInviteByReferencia,
} from '@/lib/trial/validate-trial-invite';

export type ProvisionSedeInput = {
  nombre: string;
  jornadas: string[];
};

export type ProvisionTrialInstitutionInput = {
  inviteId: number;
  password: string;
  direccionPrincipal: string;
  nombreContacto: string;
  telefonoContacto: string;
  /** Si vacío / omitido → institución sin sedes físicas (sede principal). */
  sedes?: ProvisionSedeInput[];
  colorPrimario?: string;
  colorSecundario?: string;
};

export type ProvisionTrialInstitutionResult = {
  institucionId: number;
  email: string;
  nombre: string;
  nit: string;
  sedeIds: number[];
};

/**
 * Aprovisiona una institución desde una invitación trial pendiente.
 * Solo para uso por operadores Gestión Vortico (sin Turnstile).
 */
export async function provisionTrialInstitution(
  tx: Prisma.TransactionClient,
  input: ProvisionTrialInstitutionInput
): Promise<ProvisionTrialInstitutionResult> {
  if (!isSupabaseAdminConfigured()) {
    throw new Error('Supabase admin no configurado');
  }

  const invite = await tx.invitacionPrueba.findUnique({
    where: { id: input.inviteId },
    include: { plan: true },
  });

  if (!invite) {
    throw new Error('Invitación no encontrada');
  }

  const validated = await validateTrialInviteByReferencia(tx, invite.referencia);
  if (!validated.ok) {
    throw new Error(`Invitación no usable: ${validated.reason}`);
  }

  const email = validated.email;
  const password = input.password;
  const sedes = (input.sedes ?? []).filter((s) => s.nombre.trim());
  const tieneSedes = sedes.length > 0;
  const hashedPassword = await bcrypt.hash(password, 12);

  const institucion = await tx.instituciones.create({
    data: {
      nombre: validated.institucionNombre,
      direccion_principal: input.direccionPrincipal.trim(),
      nit: validated.nit,
      nombre_contacto: input.nombreContacto.trim(),
      telefono_contacto: input.telefonoContacto.trim(),
      email,
      password: hashedPassword,
      color_primario: input.colorPrimario?.trim() || '#2563eb',
      color_secundario: input.colorSecundario?.trim() || '#0f172a',
      tiene_sedes: tieneSedes,
      jornadas: tieneSedes ? [] : ['Mañana'],
      plan_id: validated.planId,
      suscripcion_id: validated.suscripcionId,
      push_enabled: Boolean(invite.plan.push),
    },
  });

  const sedeIds: number[] = [];
  if (tieneSedes) {
    for (const sede of sedes) {
      const created = await tx.sedes.create({
        data: {
          nombre: sede.nombre.trim(),
          jornadas: sede.jornadas?.length ? sede.jornadas : ['Mañana'],
          institucion_id: institucion.id,
        },
      });
      sedeIds.push(created.id);
    }
  }

  await completeTrialRegistration(tx, {
    referencia: validated.referencia,
    institucionId: institucion.id,
    trialDays: validated.trialDays,
  });

  const supabase = getSupabaseAdminClient();
  const { data: createdAuth, error: createErr } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      tipo: 'institucion',
      institucion_id: institucion.id,
      institucion: institucion.nombre,
    },
  });

  if (createErr) {
    const msg = (createErr.message || '').toLowerCase();
    const exists = msg.includes('already') || createErr.code === 'email_exists';
    if (!exists) {
      throw new Error(`Auth institución: ${createErr.message}`);
    }
    // Confirmar y actualizar password del usuario existente
    const { data: listed } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const user = listed?.users?.find((u) => u.email?.toLowerCase() === email);
    if (user) {
      await supabase.auth.admin.updateUserById(user.id, {
        password,
        email_confirm: true,
      });
    }
  } else if (createdAuth.user && !createdAuth.user.email_confirmed_at) {
    await supabase.auth.admin.updateUserById(createdAuth.user.id, {
      email_confirm: true,
    });
  }

  return {
    institucionId: institucion.id,
    email,
    nombre: institucion.nombre,
    nit: institucion.nit,
    sedeIds,
  };
}
