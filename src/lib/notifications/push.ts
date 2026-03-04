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
interface WebPushError extends Error {
  statusCode?: number;
  body?: string | Buffer;
}

export async function sendPushNotification(params: SendPushParams): Promise<{ sent: number; failed: number; removed: number }> {
  const { institucionId, title, body, acudienteIds, data = {} } = params;

  const publicKey = process.env.WEB_PUSH_PUBLIC_KEY;
  const privateKey = process.env.WEB_PUSH_PRIVATE_KEY;
  if (!publicKey || !privateKey) {
    if (process.env.NODE_ENV !== 'test') {
      console.warn('⚠️ [push] WEB_PUSH_PUBLIC_KEY o WEB_PUSH_PRIVATE_KEY no configuradas; se omite envío.');
    }
    return { sent: 0, failed: 0, removed: 0 };
  }

  try {
    ensureVapidKeys();
  } catch {
    return { sent: 0, failed: 0, removed: 0 };
  }

  if (process.env.NODE_ENV !== 'test') {
    console.log('🔔 Iniciando proceso de envío push...');
    console.log('Institución ID:', institucionId);
    console.log('Acudientes destino:', acudienteIds ?? '(todos los suscritos)');
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

  if (process.env.NODE_ENV !== 'test') {
    console.log('📦 Subscriptions encontradas:', subscriptions.length);
    if (subscriptions.length === 0) {
      console.warn('⚠️ No se encontraron subscriptions para enviar push');
    }
  }

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
    if (process.env.NODE_ENV !== 'test') {
      console.log('🚀 Enviando push a endpoint:', sub.endpoint);
    }
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
      if (process.env.NODE_ENV !== 'test') {
        console.log('✅ Push enviado correctamente');
      }
    } catch (err: unknown) {
      failed++;
      const pushErr = err as WebPushError;
      const statusCode = pushErr?.statusCode;
      if (process.env.NODE_ENV !== 'test') {
        console.error('❌ Error enviando push:');
        console.error(err);
        console.error('StatusCode:', statusCode);
        console.error('Body:', pushErr?.body ?? '(n/a)');
      }
      if (statusCode === 410 || statusCode === 404 || statusCode === 403) {
        await prisma.pushSubscriptions.delete({ where: { id: sub.id } }).catch(() => {});
        removed++;
      }
    }
  }

  return { sent, failed, removed };
}
