import type { SupabaseClient } from '@supabase/supabase-js';
import { prismaBypass } from '@/lib/prisma-bypass';

/**
 * Revoca refresh tokens y sesiones DB del usuario (tras reset admin o cambio de contraseña).
 */
export async function invalidateUserRefreshSessions(userId: string): Promise<void> {
  try {
    await prismaBypass.$executeRaw`
      DELETE FROM auth.refresh_tokens WHERE user_id = ${userId}::uuid
    `;
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('invalidateUserRefreshSessions (refresh_tokens):', err);
    }
  }

  try {
    await prismaBypass.$executeRaw`
      DELETE FROM auth.sessions WHERE user_id = ${userId}::uuid
    `;
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('invalidateUserRefreshSessions (sessions):', err);
    }
  }
}

/** Invalida sesiones globales vía Admin API + limpieza de refresh tokens en BD. */
export async function invalidateUserAuthSessions(
  supabaseAdmin: SupabaseClient,
  userId: string
): Promise<void> {
  const { error } = await supabaseAdmin.auth.admin.signOut(userId, 'global');
  if (error && process.env.NODE_ENV !== 'production') {
    console.warn('auth.admin.signOut global:', error.message);
  }

  await invalidateUserRefreshSessions(userId);
}
