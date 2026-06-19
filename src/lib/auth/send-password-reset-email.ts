import { sendEmail } from '@/lib/notifications/email';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';

function buildResetEmailHtml(resetLink: string): string {
  return `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px">
      <h2 style="color:#1e293b;margin:0 0 16px">Recuperar contraseña</h2>
      <p style="color:#475569;line-height:1.6">
        Recibimos una solicitud para restablecer tu contraseña en Agenda Virtual.
        El enlace expira en 1 hora.
      </p>
      <p style="margin:24px 0">
        <a href="${resetLink}"
           style="display:inline-block;background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">
          Restablecer contraseña
        </a>
      </p>
      <p style="color:#64748b;font-size:14px;line-height:1.5">
        Si no solicitaste este cambio, ignora este correo.
      </p>
      <p style="color:#94a3b8;font-size:12px;word-break:break-all">${resetLink}</p>
    </div>
  `;
}

/**
 * Envía el enlace de recuperación (token propio en /resetear-contrasena/[token]).
 * 1) Resend con el enlace exacto de la app.
 * 2) Fallback: correo de Supabase Auth con redirectTo al mismo enlace.
 */
export async function sendPasswordResetEmail(
  email: string,
  resetLink: string
): Promise<{ sent: boolean; error?: string }> {
  const normalized = email.trim().toLowerCase();

  const resendResult = await sendEmail({
    to: [normalized],
    subject: 'Recuperar contraseña - Agenda Virtual',
    html: buildResetEmailHtml(resetLink),
  });

  if (resendResult.success) {
    return { sent: true };
  }

  if (!isSupabaseConfigured()) {
    const resendErr =
      resendResult.error instanceof Error
        ? resendResult.error.message
        : 'Resend no configurado';
    return {
      sent: false,
      error: `${resendErr}. Configure RESEND_API_KEY y EMAIL_FROM, o Supabase Auth.`,
    };
  }

  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.resetPasswordForEmail(normalized, {
    redirectTo: resetLink,
  });

  if (error) {
    console.error('Supabase resetPasswordForEmail:', error.message, error.code);
    const resendHint =
      resendResult.error instanceof Error ? resendResult.error.message : '';
    return {
      sent: false,
      error: [error.message, resendHint].filter(Boolean).join(' | '),
    };
  }

  return { sent: true };
}
