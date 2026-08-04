import { sendEmail } from './email';
import { createPushActivationSig } from '@/lib/security/push-activation-token';

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

/** Ruta pública de la mascota Copetón (sirve desde /public). */
export const COPETON_PUBLIC_PATH = '/branding/copeton.png';

function toFechaISODate(fecha: Date): string {
  return fecha.toISOString().slice(0, 10);
}

function buildAbsoluteUrl(baseUrl: string, path: string): string {
  const base = baseUrl.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

function buildConsultarRecordatoriosUrl(baseUrl: string, fechaLimite?: Date | null): string {
  const base = baseUrl.replace(/\/$/, '');
  const fecha = fechaLimite ? toFechaISODate(fechaLimite) : '';
  return fecha
    ? `${base}/consultar-recordatorios?fecha=${encodeURIComponent(fecha)}`
    : `${base}/consultar-recordatorios`;
}

function buildReminderHtml(params: SendReminderEmailParams): string {
  const {
    institucionNombre,
    docenteNombre,
    titulo,
    descripcion,
    fechaLimite,
    baseUrl,
    primerEstudianteId,
  } = params;
  const fechaTexto = fechaLimite
    ? fechaLimite.toLocaleDateString('es-CO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
      })
    : '';
  const consultarUrl = baseUrl ? buildConsultarRecordatoriosUrl(baseUrl, fechaLimite) : '';
  const copetonUrl = baseUrl ? buildAbsoluteUrl(baseUrl, COPETON_PUBLIC_PATH) : '';
  const docenteNombreSafe = docenteNombre.trim();
  const docenteIntro = docenteNombreSafe
    ? `Me lo compartió el docente <strong style="color:#334155;">${escapeHtml(docenteNombreSafe)}</strong> de <strong style="color:#334155;">${escapeHtml(institucionNombre)}</strong>.`
    : `Me lo compartieron desde <strong style="color:#334155;">${escapeHtml(institucionNombre)}</strong>.`;

  const pushButton =
    baseUrl && typeof primerEstudianteId === 'number'
      ? (() => {
          try {
            const sig = createPushActivationSig(primerEstudianteId);
            return `<a href="${escapeHtml(baseUrl)}/activar-notificaciones?estudianteId=${primerEstudianteId}&sig=${encodeURIComponent(sig)}" style="display:inline-block;padding:12px 20px;background:#0f172a;color:#ffffff;border-radius:8px;font-weight:600;font-size:0.875rem;text-decoration:none;mso-padding-alt:0;">Activar notificaciones push</a>`;
          } catch {
            return '';
          }
        })()
      : '';

  const mascotImg = copetonUrl
    ? `<img src="${escapeHtml(copetonUrl)}" width="120" height="120" alt="Copetón, mascota de Agenda Virtual" style="display:block;width:120px;height:120px;border:0;outline:none;text-decoration:none;margin:0 auto;" />`
    : `<div style="width:120px;height:120px;margin:0 auto;border-radius:999px;background:#dbeafe;color:#1d4ed8;font-weight:700;font-size:2rem;line-height:120px;text-align:center;">C</div>`;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Nuevo recordatorio</title>
</head>
<body style="margin:0;padding:0;background:#e8eef5;font-family:Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#e8eef5;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(15,23,42,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#1d4ed8 0%,#2563eb 55%,#0ea5e9 100%);background-color:#2563eb;color:#ffffff;padding:22px 24px;">
              <p style="margin:0;font-size:0.75rem;letter-spacing:0.04em;text-transform:uppercase;opacity:0.9;">Mensaje de Copetón</p>
              <h1 style="margin:6px 0 0;font-size:1.25rem;font-weight:700;line-height:1.3;">${escapeHtml(institucionNombre)}</h1>
              <p style="margin:8px 0 0;font-size:0.875rem;opacity:0.92;">Te traigo un recordatorio escolar</p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 24px 8px;background:#ffffff;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="132" valign="top" style="width:132px;padding-right:12px;">
                    ${mascotImg}
                    <p style="margin:8px 0 0;text-align:center;font-size:0.8125rem;font-weight:700;color:#0f172a;">Copetón</p>
                  </td>
                  <td valign="top">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:14px;">
                      <tr>
                        <td style="padding:16px 18px;">
                          <p style="margin:0 0 10px;font-size:0.9375rem;color:#0f172a;font-weight:600;line-height:1.4;">¡Hola! Soy Copetón 👋</p>
                          <p style="margin:0;font-size:0.875rem;color:#334155;line-height:1.55;">${docenteIntro}</p>
                          <p style="margin:10px 0 0;font-size:0.875rem;color:#334155;line-height:1.55;">Te lo cuento así:</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 24px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;">
                <tr>
                  <td style="padding:18px 20px 6px;">
                    <p style="margin:0 0 4px;font-size:0.75rem;letter-spacing:0.03em;text-transform:uppercase;color:#64748b;font-weight:600;">Sobre qué va</p>
                    <h2 style="margin:0;font-size:1.125rem;color:#0f172a;line-height:1.35;">${escapeHtml(titulo)}</h2>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 20px 18px;">
                    <p style="margin:0 0 8px;font-size:0.75rem;letter-spacing:0.03em;text-transform:uppercase;color:#64748b;font-weight:600;">Lo que te quiero decir</p>
                    <div style="color:#475569;line-height:1.65;font-size:0.9375rem;white-space:pre-wrap;">${escapeHtml(descripcion)}</div>
                    ${
                      fechaLimite
                        ? `<p style="margin:16px 0 0;padding:10px 12px;background:#ffffff;border-radius:8px;border:1px solid #e2e8f0;color:#334155;font-size:0.875rem;line-height:1.45;">📅 <strong>No lo olvides:</strong> este recordatorio es para el <strong>${escapeHtml(fechaTexto)}</strong>.</p>`
                        : ''
                    }
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 24px 0;">
              <p style="margin:0;color:#64748b;font-size:0.8125rem;line-height:1.5;">Si quieres ver más detalles, puedes consultar los recordatorios del estudiante con su nombre completo o código estudiantil y la fecha. ¡Yo te acompaño!</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:20px 24px 28px;">
              ${
                consultarUrl
                  ? `<a href="${escapeHtml(consultarUrl)}" style="display:inline-block;padding:12px 20px;background:#2563eb;color:#ffffff;border-radius:8px;font-weight:600;font-size:0.875rem;text-decoration:none;mso-padding-alt:0;">Ver el recordatorio conmigo</a>`
                  : `<span style="display:inline-block;padding:12px 20px;background:#2563eb;color:#ffffff;border-radius:8px;font-weight:600;font-size:0.875rem;">Ver el recordatorio conmigo</span>`
              }
              ${pushButton ? `<span style="display:inline-block;width:10px;"></span>${pushButton}` : ''}
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px;background:#f1f5f9;border-top:1px solid #e2e8f0;">
              <p style="margin:0;text-align:center;color:#64748b;font-size:0.8125rem;line-height:1.5;">Con cariño,<br /><strong style="color:#0f172a;">Copetón</strong> · Agenda Virtual</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
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
  const { emails, institucionNombre, docenteNombre, titulo, descripcion, fechaLimite, baseUrl, primerEstudianteId } = params;

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
    baseUrl,
    primerEstudianteId,
  });

  return sendEmail({
    to: validEmails,
    subject,
    html,
  });
}
