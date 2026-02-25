/**
 * Detecta el rol del usuario basado en la sesión Supabase.
 * Usa la base de datos para determinar si el email pertenece a admin, docente o institución.
 */

import { prisma } from '@/lib/prisma';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { UserRole } from '@/types/auth';

export interface UserRoleAndInstitution {
  role: UserRole;
  institutionId: number;
}

/**
 * Obtiene rol e institutionId en una sola pasada. Orden: admin → docente → institución.
 */
export async function getUserRoleAndInstitutionByEmail(
  email: string
): Promise<UserRoleAndInstitution | null> {
  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    return null;
  }

  const normalizedEmail = email.trim();

  const admin = await prisma.administradores.findUnique({
    where: { correo: normalizedEmail },
    select: { institucion_id: true }
  });
  if (admin?.institucion_id != null) {
    return { role: 'admin', institutionId: admin.institucion_id };
  }

  const docente = await prisma.docentes.findUnique({
    where: { email: normalizedEmail },
    select: { institucion_id: true }
  });
  if (docente?.institucion_id != null) {
    return { role: 'docente', institutionId: docente.institucion_id };
  }

  const institucion = await prisma.instituciones.findUnique({
    where: { email: normalizedEmail },
    select: { id: true }
  });
  if (institucion?.id != null) {
    return { role: 'institucion', institutionId: institucion.id };
  }

  return null;
}

/**
 * Determina el rol a partir del email buscando en las tablas correspondientes.
 * Orden: admin → docente → institución.
 */
export async function getUserRoleByEmail(email: string): Promise<UserRole | null> {
  const info = await getUserRoleAndInstitutionByEmail(email);
  return info?.role ?? null;
}

/**
 * Obtiene el rol del usuario autenticado a partir de la sesión Supabase (cookies).
 * Retorna null si no hay sesión o el usuario no tiene rol asignado.
 */
export async function getAuthUserRole(): Promise<UserRole | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error
    } = await supabase.auth.getUser();

    if (error || !user?.email) return null;

    return getUserRoleByEmail(user.email);
  } catch {
    return null;
  }
}
