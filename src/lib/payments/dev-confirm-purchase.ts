import { timingSafeEqual } from 'crypto';
import { isMercadoPagoSandbox } from '@/lib/mercadopago/config';
import { isWompiSandbox } from '@/lib/wompi/config';

function getDevConfirmSecret(): string {
  return process.env.PAYMENT_DEV_CONFIRM_SECRET?.trim() ?? '';
}

/** Habilita la confirmación manual si hay secret, pasarelas en sandbox y no está desactivado explícitamente. */
export function isDevConfirmPurchaseEnabled(): boolean {
  if (!getDevConfirmSecret()) return false;
  if (process.env.PAYMENT_DEV_CONFIRM_ENABLED === 'false') return false;
  return isMercadoPagoSandbox() || isWompiSandbox();
}

export function isValidDevConfirmPurchaseToken(token: string | null | undefined): boolean {
  const secret = getDevConfirmSecret();
  const candidate = token?.trim() ?? '';
  if (!secret || !candidate || secret.length !== candidate.length) return false;
  try {
    return timingSafeEqual(Buffer.from(secret), Buffer.from(candidate));
  } catch {
    return false;
  }
}

export function buildDevConfirmPurchasePath(token?: string): string | null {
  const secret = getDevConfirmSecret();
  if (!isDevConfirmPurchaseEnabled() || !secret) return null;
  return `/prueba/confirmar-compra/${encodeURIComponent(token ?? secret)}`;
}
