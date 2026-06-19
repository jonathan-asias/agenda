import { prismaBypass } from '@/lib/prisma-bypass';
import {
  getSupabaseAdminClient,
  isSupabaseAdminConfigured,
} from '@/lib/supabase-admin';

type ResetUserType = 'institucion' | 'administrador' | 'docente';

/**
 * Resuelve el UUID de Supabase Auth para actualizar contraseña tras reset.
 */
export async function resolveSupabaseUserIdForReset(
  email: string,
  userType: ResetUserType
): Promise<string | null> {
  const normalized = email.trim().toLowerCase();

  if (userType === 'administrador') {
    const admin = await prismaBypass.administradores.findUnique({
      where: { correo: normalized },
      select: { supabase_user_id: true },
    });
    if (admin?.supabase_user_id) return admin.supabase_user_id;
  }

  if (userType === 'docente') {
    const docente = await prismaBypass.docentes.findFirst({
      where: { email: { equals: normalized, mode: 'insensitive' } },
      select: { auth_user_id: true },
    });
    if (docente?.auth_user_id) return docente.auth_user_id;
  }

  if (!isSupabaseAdminConfigured()) return null;

  const supabase = getSupabaseAdminClient();
  let page = 1;
  const perPage = 200;
  const maxPages = 10;

  while (page <= maxPages) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error || !data?.users?.length) break;

    const match = data.users.find(
      (u) => u.email?.trim().toLowerCase() === normalized
    );
    if (match?.id) return match.id;

    if (data.users.length < perPage) break;
    page += 1;
  }

  return null;
}

/**
 * Comprueba si un email ya existe en Supabase Auth (sin listar todos en logs).
 */
export async function supabaseAuthEmailExists(email: string): Promise<boolean> {
  const id = await resolveSupabaseUserIdForReset(email, 'institucion');
  return id != null;
}
