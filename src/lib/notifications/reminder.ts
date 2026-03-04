import { sendEmail } from './email';

export type SendReminderEmailParams = {
  institucionNombre: string;
  docenteNombre: string;
  titulo: string;
  descripcion: string;
  fechaLimite?: Date | null;
  emails: string[];
  /** URL base para enlace de activar push (ej. https://app.example.com) */
  baseUrl?: string;
  /** ID del primer estudiante para link de activar push (?estudianteId=X) */
  primerEstudianteId?: number;
};

const MAX_EMAILS_WARNING = 200;

function buildReminderHtml(params: SendReminderEmailParams): string {
  const { institucionNombre, titulo, descripcion, fechaLimite, baseUrl, primerEstudianteId } = params;
  const fechaTexto = fechaLimite
    ? fechaLimite.toLocaleDateString('es-CO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nuevo recordatorio</title>
</head>
<body style="margin:0;font-family:system-ui,-apple-system,sans-serif;background:#f1f5f9;padding:24px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.07);">
    <div style="background:#2563eb;color:#fff;padding:20px 24px;">
      <h1 style="margin:0;font-size:1.25rem;font-weight:600;">${escapeHtml(institucionNombre)}</h1>
      <p style="margin:8px 0 0;font-size:0.875rem;opacity:0.9;">Nuevo recordatorio</p>
    </div>
    <div style="padding:24px;">
      <h2 style="margin:0 0 16px;font-size:1.125rem;color:#0f172a;">${escapeHtml(titulo)}</h2>
      <div style="color:#475569;line-height:1.6;white-space:pre-wrap;">${escapeHtml(descripcion)}</div>
      ${fechaLimite ? `<p style="margin:20px 0 0;padding:12px;background:#f8fafc;border-radius:8px;color:#64748b;font-size:0.875rem;"><strong>Fecha límite:</strong> ${escapeHtml(fechaTexto)}</p>` : ''}
      <div style="margin-top:24px;display:flex;flex-wrap:wrap;gap:12px;">
        <span style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;border-radius:8px;font-weight:500;">Ver en la plataforma</span>
        ${baseUrl && typeof primerEstudianteId === 'number' ? `<a href="${escapeHtml(baseUrl)}/activar-notificaciones?estudianteId=${primerEstudianteId}" style="display:inline-block;padding:12px 24px;background:#0f172a;color:#fff;border-radius:8px;font-weight:500;text-decoration:none;">Activar notificaciones push</a>` : ''}
      </div>
    </div>
  </div>
</body>
</html>
`.trim();
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (ch) => map[ch] ?? ch);
}

/**
 * Envía notificación por email a los destinatarios indicados cuando se crea un recordatorio.
 * No lanza; retorna una Promise que resuelve con el resultado del envío.
 * Si hay más de MAX_EMAILS_WARNING destinatarios, se registra advertencia pero se permite el envío.
 */
export async function sendReminderEmailNotification(
  params: SendReminderEmailParams
): Promise<{ success: boolean; error?: unknown }> {
  const { emails, institucionNombre, docenteNombre, titulo, descripcion, fechaLimite } = params;

  if (emails.length > MAX_EMAILS_WARNING) {
    // TODO: implementar batching (ej. envío por lotes de N para evitar límites del proveedor)
    if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'test') {
      // eslint-disable-next-line no-console -- advertencia de envío masivo en servidor
      console.warn(
        `[notifications] Envío masivo: ${emails.length} destinatarios (umbral: ${MAX_EMAILS_WARNING})`
      );
    }
  }

  const validEmails = emails.filter(
    (e): e is string => typeof e === 'string' && e.trim().length > 0
  );
  if (validEmails.length === 0) {
    return { success: true };
  }

  const subject = `Nuevo recordatorio - ${institucionNombre}`;
  const html = buildReminderHtml({
    institucionNombre,
    docenteNombre,
    titulo,
    descripcion,
    fechaLimite,
    emails: validEmails,
  });

  return sendEmail({
    to: validEmails,
    subject,
    html,
  });
}
