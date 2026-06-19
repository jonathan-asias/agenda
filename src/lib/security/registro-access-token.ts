import { createHmac, timingSafeEqual } from 'crypto';

const DEFAULT_TTL_HOURS = 48;

export type RegistroAccessVerifyResult =
  | { ok: true; email: string; referencia: string }
  | { ok: false; reason: 'expired' | 'invalid' };

function getSecret(): string {
  const secret =
    process.env.REGISTRO_ACCESS_SECRET?.trim() ||
    process.env.PUSH_ACTIVATION_SECRET?.trim();
  if (!secret) {
    throw new Error('REGISTRO_ACCESS_SECRET o PUSH_ACTIVATION_SECRET no configurado');
  }
  return secret;
}

export function getRegistroAccessTtlHours(): number {
  const raw = process.env.REGISTRO_ACCESS_TTL_HOURS?.trim();
  if (!raw) return DEFAULT_TTL_HOURS;
  const hours = Number.parseInt(raw, 10);
  return Number.isFinite(hours) && hours > 0 ? hours : DEFAULT_TTL_HOURS;
}

function getTtlMs(): number {
  return getRegistroAccessTtlHours() * 60 * 60 * 1000;
}

function sign(payload: string): string {
  return createHmac('sha256', getSecret()).update(payload).digest('hex');
}

function safeEqual(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, 'utf8');
    const bufB = Buffer.from(b, 'utf8');
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

/** Token firmado para enlace de registro post-pago (email + referencia + expiración). */
export function createRegistroAccessToken(email: string, referencia: string): string {
  const exp = Date.now() + getTtlMs();
  const data = JSON.stringify({
    e: email.trim().toLowerCase(),
    r: referencia.trim(),
    exp,
  });
  const encoded = Buffer.from(data, 'utf8').toString('base64url');
  return `${encoded}.${sign(encoded)}`;
}

export function verifyRegistroAccessToken(token: string): RegistroAccessVerifyResult {
  const trimmed = token.trim();
  const dot = trimmed.lastIndexOf('.');
  if (dot <= 0) return { ok: false, reason: 'invalid' };

  const encoded = trimmed.slice(0, dot);
  const receivedSig = trimmed.slice(dot + 1);
  if (!receivedSig || !safeEqual(sign(encoded), receivedSig)) {
    return { ok: false, reason: 'invalid' };
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(encoded, 'base64url').toString('utf8')
    ) as { e?: string; r?: string; exp?: number };

    if (!parsed.e || !parsed.r || typeof parsed.exp !== 'number') {
      return { ok: false, reason: 'invalid' };
    }
    if (Date.now() > parsed.exp) {
      return { ok: false, reason: 'expired' };
    }

    return { ok: true, email: parsed.e, referencia: parsed.r };
  } catch {
    return { ok: false, reason: 'invalid' };
  }
}

export function buildRegistroInstitucionUrl(baseUrl: string, token: string): string {
  const base = baseUrl.trim().replace(/\/$/, '');
  return `${base}/registro-institucion?token=${encodeURIComponent(token)}`;
}
