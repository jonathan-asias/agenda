import { APP_URL } from '@/lib/env';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';

/**
 * Un solo correo de confirmación de registro (Supabase Auth).
 * No usar generateLink como fallback: duplica envíos y empeora rate limit 429.
 */
export async function sendSignupConfirmationEmail(
  email: string,
  redirectTo: string = `${APP_URL}/login`
): Promise<{ sent: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { sent: false, error: 'Supabase no configurado' };
  }

  const normalized = email.trim().toLowerCase();
  const supabase = getSupabaseClient();

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: normalized,
    options: { emailRedirectTo: redirectTo },
  });

  if (error) {
    console.error('Correo de confirmación no enviado:', error.message);
    return { sent: false, error: error.message };
  }

  return { sent: true };
}
