import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

export type SendEmailResult = {
  success: boolean;
  error?: unknown;
};

export type EmailAttachment = {
  filename: string;
  content: Buffer;
  /** Para <img src="cid:..."> en el HTML */
  contentId?: string;
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
  attachments?: EmailAttachment[];
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
      attachments: params.attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
        ...(a.contentId ? { contentId: a.contentId } : {}),
      })),
    });

    if (error) {
      return { success: false, error };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err };
  }
}

/** Lee un archivo de /public para adjuntarlo (CID). En Vercel intenta fetch a la URL pública. */
export async function loadPublicAssetBuffer(
  publicPath: string,
  absoluteUrl?: string
): Promise<Buffer | null> {
  const normalized = publicPath.startsWith('/') ? publicPath.slice(1) : publicPath;
  const localPath = path.join(process.cwd(), 'public', normalized);

  try {
    if (fs.existsSync(localPath)) {
      return fs.readFileSync(localPath);
    }
  } catch {
    // sigue con fetch
  }

  if (absoluteUrl) {
    try {
      const res = await fetch(absoluteUrl);
      if (!res.ok) return null;
      const ab = await res.arrayBuffer();
      return Buffer.from(ab);
    } catch {
      return null;
    }
  }

  return null;
}
