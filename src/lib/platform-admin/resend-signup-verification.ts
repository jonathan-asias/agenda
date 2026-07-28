import { APP_URL } from '@/lib/env';
import { sendSignupConfirmationEmail } from '@/lib/auth/send-signup-confirmation';
import {
  getSupabaseAdminClient,
  isSupabaseAdminConfigured,
} from '@/lib/supabase-admin';
import { resolveSupabaseUserIdForReset } from '@/lib/auth/resolveSupabaseUserId';

export type ResendVerificationResult =
  | { ok: true; alreadyConfirmed?: boolean; message: string }
  | { ok: false; error: string };

/**
 * Reenvía el correo de confirmación de signup (Supabase Auth) para un email.
 * Pensado para uso interno desde Gestión Vortico.
 */
export async function resendSignupVerificationEmail(
  email: string
): Promise<ResendVerificationResult> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) {
    return { ok: false, error: 'Correo inválido' };
  }

  if (!isSupabaseAdminConfigured()) {
    return { ok: false, error: 'Supabase admin no está configurado' };
  }

  const supabaseAdmin = getSupabaseAdminClient();
  const userId = await resolveSupabaseUserIdForReset(normalized, 'institucion');

  if (!userId) {
    return {
      ok: false,
      error: 'No se encontró un usuario de autenticación con ese correo',
    };
  }

  const { data: userData, error: getUserError } =
    await supabaseAdmin.auth.admin.getUserById(userId);

  if (getUserError || !userData.user) {
    return {
      ok: false,
      error: getUserError?.message ?? 'No se pudo consultar el usuario en Auth',
    };
  }

  if (userData.user.email_confirmed_at) {
    return {
      ok: true,
      alreadyConfirmed: true,
      message: 'Este correo ya está verificado; no es necesario reenviar.',
    };
  }

  const result = await sendSignupConfirmationEmail(normalized, `${APP_URL}/login`);
  if (!result.sent) {
    return {
      ok: false,
      error: result.error ?? 'No se pudo reenviar el correo de verificación',
    };
  }

  return {
    ok: true,
    message: 'Correo de verificación reenviado correctamente',
  };
}
