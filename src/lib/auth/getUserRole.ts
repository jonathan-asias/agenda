/**
 * Detecta el rol del usuario basado en la sesión Supabase.
 * Prioriza supabase user.id sobre email (V-11).
 */

import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { UserRole } from '@/types/auth';
import {
  resolveRoleAndInstitutionByEmail,
  resolveRoleAndInstitutionFromUser,
  resolveRoleFromUser,
} from './resolveTenantFromUser';

export type { UserRoleAndInstitution } from './resolveTenantFromUser';

export {
  resolveRoleAndInstitutionByEmail,
  resolveRoleAndInstitutionFromUser,
  resolveInstitutionIdFromUser,
} from './resolveTenantFromUser';

/**
 * Determina el rol a partir del email buscando en las tablas correspondientes.
 */
export async function getUserRoleByEmail(email: string): Promise<UserRole | null> {
  const info = await resolveRoleAndInstitutionByEmail(email);
  return info?.role ?? null;
}

/** @deprecated Use resolveRoleAndInstitutionByEmail */
export async function getUserRoleAndInstitutionByEmail(
  email: string
) {
  return resolveRoleAndInstitutionByEmail(email);
}

/**
 * Obtiene el rol del usuario autenticado a partir de la sesión Supabase (cookies).
 */
export async function getAuthUserRole(): Promise<UserRole | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) return null;

    return resolveRoleFromUser(user);
  } catch {
    return null;
  }
}
