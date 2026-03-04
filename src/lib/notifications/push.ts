import webpush from 'web-push';
import { prisma } from '@/lib/prisma';

function ensureVapidKeys(): void {
  const publicKey = process.env.WEB_PUSH_PUBLIC_KEY;
  const privateKey = process.env.WEB_PUSH_PRIVATE_KEY;
  if (!publicKey || !privateKey) {
    throw new Error('WEB_PUSH_PUBLIC_KEY y WEB_PUSH_PRIVATE_KEY deben estar configuradas');
  }
  webpush.setVapidDetails(
    'mailto:soporte@agendavirtual.com',
    publicKey,
    privateKey
  );
}

export interface SendPushParams {
  institucionId: number;
  title: string;
  body: string;
  acudienteIds?: number[];
  data?: Record<string, unknown>;
}

/**
 * Envía notificación push a los acudientes de la institución.
 * Si una subscription es inválida (410, 404), la elimina de la BD.
 */
export async function sendPushNotification(params: SendPushParams): Promise<{ sent: number; failed: number; removed: number }> {
  const { institucionId, title, body, acudienteIds, data = {} } = params;

  const publicKey = process.env.WEB_PUSH_PUBLIC_KEY;
  const privateKey = process.env.WEB_PUSH_PRIVATE_KEY;
  if (!publicKey || !privateKey) {
    return { sent: 0, failed: 0, removed: 0 };
  }

  try {
    ensureVapidKeys();
  } catch {
    return { sent: 0, failed: 0, removed: 0 };
  }

  const where: { institucion_id: number; acudiente_id?: { in: number[] } } = {
    institucion_id: institucionId,
  };
  if (acudienteIds && acudienteIds.length > 0) {
    where.acudiente_id = { in: acudienteIds };
  }

  const subscriptions = await prisma.pushSubscriptions.findMany({
    where,
  });

  let sent = 0;
  let failed = 0;
  let removed = 0;

  const payload = JSON.stringify({
    title,
    body,
    tag: 'recordatorio',
    data: { ...data, url: data.url ?? '/' },
  });

  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        },
        payload
      );
      sent++;
    } catch (err: unknown) {
      failed++;
      const status = err && typeof err === 'object' && 'statusCode' in err ? (err as { statusCode?: number }).statusCode : null;
      if (status === 410 || status === 404 || status === 403) {
        await prisma.pushSubscriptions.delete({ where: { id: sub.id } }).catch(() => {});
        removed++;
      }
    }
  }

  return { sent, failed, removed };
}
