import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Valida firma x-signature de notificaciones Mercado Pago (HMAC SHA256).
 * @see https://www.mercadopago.com.co/developers/es/docs/your-integrations/notifications/webhooks
 */
export function validateMercadoPagoWebhookSignature(params: {
  secret: string;
  xSignature: string | null;
  xRequestId: string | null;
  dataId: string;
}): boolean {
  const { secret, xSignature, xRequestId, dataId } = params;

  if (!secret || !xSignature || !xRequestId || !dataId) {
    return false;
  }

  const parts = xSignature.split(',');
  let ts = '';
  let receivedHash = '';

  for (const part of parts) {
    const [key, value] = part.split('=').map((s) => s.trim());
    if (key === 'ts') ts = value ?? '';
    if (key === 'v1') receivedHash = value ?? '';
  }

  if (!ts || !receivedHash) {
    return false;
  }

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  const expectedHash = createHmac('sha256', secret).update(manifest).digest('hex');

  try {
    const a = Buffer.from(expectedHash, 'utf8');
    const b = Buffer.from(receivedHash, 'utf8');
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
