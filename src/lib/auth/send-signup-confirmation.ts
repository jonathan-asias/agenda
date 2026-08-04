import { resolveEmailConfirmationRedirectUrl } from '@/lib/app-url';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';

/**
 * Un solo correo de confirmación de registro (Supabase Auth).
 * No usar generateLink como fallback: duplica envíos y empeora rate limit 429.
 */
export async function sendSignupConfirmationEmail(
  email: string,
  redirectTo: string = resolveEmailConfirmationRedirectUrl()
): Promise<{ sent: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { sent: false, error: 'Supabase no configurado' };
  }

  const normalized = email.trim().toLowerCase();
  const supabase = getSupabaseClient();
  const safeRedirect =
    process.env.NODE_ENV === 'production' &&
    (/localhost|127\.0\.0\.1/i.test(redirectTo) || !redirectTo.startsWith('http'))
      ? resolveEmailConfirmationRedirectUrl()
      : redirectTo;

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: normalized,
    options: { emailRedirectTo: safeRedirect },
  });

  if (error) {
    console.error('Correo de confirmación no enviado:', error.message);
    return { sent: false, error: error.message };
  }

  return { sent: true };
}
