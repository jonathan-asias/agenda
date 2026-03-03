import { Resend } from 'resend';

export type SendEmailResult = {
  success: boolean;
  error?: unknown;
};

const getEnv = (): { apiKey: string; from: string } | null => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
    return null;
  }
  if (!from || typeof from !== 'string' || from.trim() === '') {
    return null;
  }
  return { apiKey, from };
};

/**
 * Envía un email usando Resend.
 * No lanza errores; retorna siempre { success, error? }.
 */
export async function sendEmail(params: {
  to: string[];
  subject: string;
  html: string;
}): Promise<SendEmailResult> {
  const env = getEnv();
  if (!env) {
    return {
      success: false,
      error: new Error('RESEND_API_KEY o EMAIL_FROM no configurados'),
    };
  }

  try {
    const resend = new Resend(env.apiKey);
    const { error } = await resend.emails.send({
      from: env.from,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });

    if (error) {
      return { success: false, error };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err };
  }
}
