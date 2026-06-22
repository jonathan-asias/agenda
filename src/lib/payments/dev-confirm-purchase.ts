import { timingSafeEqual } from 'crypto';
import { isMercadoPagoSandbox } from '@/lib/mercadopago/config';
import { isWompiSandbox } from '@/lib/wompi/config';

function getDevConfirmSecret(): string {
  return process.env.PAYMENT_DEV_CONFIRM_SECRET?.trim() ?? '';
}

function isExplicitSandboxMode(): boolean {
  const mpFlag = process.env.MERCADOPAGO_SANDBOX?.trim().toLowerCase();
  const wompiFlag = process.env.WOMPI_SANDBOX?.trim().toLowerCase();
  return mpFlag === 'true' || mpFlag === '1' || wompiFlag === 'true' || wompiFlag === '1';
}

/** Habilita la confirmación manual si hay secret y modo prueba (sandbox explícito o detectado). */
export function isDevConfirmPurchaseEnabled(): boolean {
  if (!getDevConfirmSecret()) return false;
  if (process.env.PAYMENT_DEV_CONFIRM_ENABLED === 'false') return false;
  if (process.env.PAYMENT_DEV_CONFIRM_ENABLED === 'true') return true;
  if (isExplicitSandboxMode()) return true;
  return isMercadoPagoSandbox() || isWompiSandbox();
}

export function getDevConfirmPurchaseStatus(): {
  enabled: boolean;
  hasSecret: boolean;
  explicitSandbox: boolean;
  mercadoPagoSandbox: boolean;
  wompiSandbox: boolean;
} {
  const hasSecret = Boolean(getDevConfirmSecret());
  const explicitSandbox = isExplicitSandboxMode();
  const mercadoPagoSandbox = isMercadoPagoSandbox();
  const wompiSandbox = isWompiSandbox();
  return {
    enabled: isDevConfirmPurchaseEnabled(),
    hasSecret,
    explicitSandbox,
    mercadoPagoSandbox,
    wompiSandbox,
  };
}

export function isValidDevConfirmPurchaseToken(token: string | null | undefined): boolean {
  const secret = getDevConfirmSecret();
  let candidate = token?.trim() ?? '';
  try {
    candidate = decodeURIComponent(candidate);
  } catch {
    // usar valor original
  }
  candidate = candidate.trim();
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
