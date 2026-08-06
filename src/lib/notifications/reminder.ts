import { loadPublicAssetBuffer, sendEmail } from './email';
import { createPushActivationSig } from '@/lib/security/push-activation-token';
import { buildReminderEmailHtml, COPETON_PUBLIC_PATH as TEMPLATE_COPETON_PATH } from './reminder-email-html';

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
export const COPETON_PUBLIC_PATH = TEMPLATE_COPETON_PATH;
const COPETON_CID = 'copeton';

function isLocalhostUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return host === 'localhost' || host === '127.0.0.1' || host === '[::1]';
  } catch {
    return /localhost|127\.0\.0\.1/i.test(url);
  }
}

function buildAbsoluteUrl(baseUrl: string, pathName: string): string {
  const base = baseUrl.replace(/\/$/, '');
  const normalizedPath = pathName.startsWith('/') ? pathName : `/${pathName}`;
  return `${base}${normalizedPath}`;
}

/**
 * Envía notificación por email a los destinatarios indicados cuando se crea un recordatorio.
 * No lanza; retorna una Promise que resuelve con el resultado del envío.
 * Si hay más de MAX_EMAILS_WARNING destinatarios, se registra advertencia pero se permite el envío.
 */
export async function sendReminderEmailNotification(
  params: SendReminderEmailParams
): Promise<{ success: boolean; error?: unknown }> {
  const {
    emails,
    institucionNombre,
    docenteNombre,
    titulo,
    descripcion,
    fechaLimite,
    baseUrl,
    primerEstudianteId,
  } = params;

  if (emails.length > MAX_EMAILS_WARNING) {
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

  const publicBase =
    process.env.APP_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.NODE_ENV === 'production' ? 'https://ahoritapp.com' : '');
  const linkBase =
    baseUrl && !isLocalhostUrl(baseUrl)
      ? baseUrl
      : publicBase && !isLocalhostUrl(publicBase)
        ? publicBase
        : process.env.NODE_ENV === 'production'
          ? 'https://ahoritapp.com'
          : baseUrl;

  const remoteAssetUrl =
    linkBase && !isLocalhostUrl(linkBase)
      ? buildAbsoluteUrl(linkBase, COPETON_PUBLIC_PATH)
      : publicBase && !isLocalhostUrl(publicBase)
        ? buildAbsoluteUrl(publicBase, COPETON_PUBLIC_PATH)
        : undefined;

  const copetonBuffer = await loadPublicAssetBuffer(
    COPETON_PUBLIC_PATH,
    remoteAssetUrl
  );
  const copetonSrc = copetonBuffer ? `cid:${COPETON_CID}` : remoteAssetUrl || '';

  let pushActivationHref: string | undefined;
  if (linkBase && typeof primerEstudianteId === 'number') {
    try {
      const sig = createPushActivationSig(primerEstudianteId);
      pushActivationHref = `${linkBase.replace(/\/$/, '')}/activar-notificaciones?estudianteId=${primerEstudianteId}&sig=${encodeURIComponent(sig)}`;
    } catch {
      pushActivationHref = undefined;
    }
  }

  const subject = `Nuevo recordatorio - ${institucionNombre}`;
  const html = buildReminderEmailHtml({
    institucionNombre,
    docenteNombre,
    titulo,
    descripcion,
    fechaLimite,
    baseUrl: linkBase || undefined,
    copetonSrc,
    pushActivationHref,
  });

  return sendEmail({
    to: validEmails,
    subject,
    html,
    attachments: copetonBuffer
      ? [
          {
            filename: 'copeton.png',
            content: copetonBuffer,
            contentId: COPETON_CID,
          },
        ]
      : undefined,
  });
}

export { buildReminderEmailHtml, parseLocalDateInput, COPETON_PUBLIC_PATH } from './reminder-email-html';
