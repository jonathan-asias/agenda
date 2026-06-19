import type { UserRole } from '@/types/auth';
import { prismaBypass } from '@/lib/prisma-bypass';

export interface UserRoleAndInstitution {
  role: UserRole;
  institutionId: number;
}

interface SupabaseUserRef {
  id: string;
  email?: string | null;
}

/**
 * Resuelve institutionId priorizando supabase user.id sobre email (V-11).
 */
export async function resolveInstitutionIdFromUser(
  user: SupabaseUserRef
): Promise<number | null> {
  const byRole = await resolveRoleAndInstitutionFromUser(user);
  return byRole?.institutionId ?? null;
}

/**
 * Orden: admin (uid) → docente (uid) → email fallback admin → docente → institución.
 */
export async function resolveRoleAndInstitutionFromUser(
  user: SupabaseUserRef
): Promise<UserRoleAndInstitution | null> {
  const adminByUid = await prismaBypass.administradores.findFirst({
    where: { supabase_user_id: user.id },
    select: { institucion_id: true },
  });
  if (adminByUid?.institucion_id != null) {
    return { role: 'admin', institutionId: adminByUid.institucion_id };
  }

  const docenteByUid = await prismaBypass.docentes.findFirst({
    where: { auth_user_id: user.id },
    select: { institucion_id: true },
  });
  if (docenteByUid?.institucion_id != null) {
    return { role: 'docente', institutionId: docenteByUid.institucion_id };
  }

  const email = user.email?.trim();
  if (!email) return null;

  return resolveRoleAndInstitutionByEmail(email);
}

export async function resolveRoleAndInstitutionByEmail(
  email: string
): Promise<UserRoleAndInstitution | null> {
  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    return null;
  }

  const normalizedEmail = email.trim();

  const admin = await prismaBypass.administradores.findUnique({
    where: { correo: normalizedEmail },
    select: { institucion_id: true },
  });
  if (admin?.institucion_id != null) {
    return { role: 'admin', institutionId: admin.institucion_id };
  }

  const docente = await prismaBypass.docentes.findUnique({
    where: { email: normalizedEmail },
    select: { institucion_id: true },
  });
  if (docente?.institucion_id != null) {
    return { role: 'docente', institutionId: docente.institucion_id };
  }

  const institucion = await prismaBypass.instituciones.findUnique({
    where: { email: normalizedEmail },
    select: { id: true },
  });
  if (institucion?.id != null) {
    return { role: 'institucion', institutionId: institucion.id };
  }

  return null;
}

export async function resolveRoleFromUser(user: SupabaseUserRef): Promise<UserRole | null> {
  const info = await resolveRoleAndInstitutionFromUser(user);
  return info?.role ?? null;
}
