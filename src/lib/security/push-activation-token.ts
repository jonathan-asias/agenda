import { createHmac, timingSafeEqual } from 'crypto';

const ACTIVATION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 días
const SUBSCRIBE_TTL_MS = 60 * 60 * 1000; // 1 hora

function getSecret(): string {
  const secret = process.env.PUSH_ACTIVATION_SECRET?.trim();
  if (!secret) {
    throw new Error('PUSH_ACTIVATION_SECRET no configurado');
  }
  return secret;
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

/** Token firmado para enlaces de email (?estudianteId=X&sig=...) */
export function createPushActivationSig(estudianteId: number): string {
  const exp = Date.now() + ACTIVATION_TTL_MS;
  const payload = `${estudianteId}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyPushActivationSig(
  sig: string,
  estudianteId: number
): boolean {
  const parts = sig.split('.');
  if (parts.length !== 3) return false;
  const [idStr, expStr, receivedSig] = parts;
  if (Number.parseInt(idStr, 10) !== estudianteId) return false;
  const exp = Number.parseInt(expStr, 10);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  const expected = sign(`${idStr}.${expStr}`);
  return safeEqual(receivedSig, expected);
}

/** Token de corta duración devuelto por /api/push/activate para usar en subscribe */
export function createPushSubscribeToken(
  acudienteId: number,
  institucionId: number
): string {
  const exp = Date.now() + SUBSCRIBE_TTL_MS;
  const payload = `${acudienteId}.${institucionId}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyPushSubscribeToken(
  token: string,
  acudienteId: number,
  institucionId: number
): boolean {
  const parts = token.split('.');
  if (parts.length !== 4) return false;
  const [acudStr, instStr, expStr, receivedSig] = parts;
  if (
    Number.parseInt(acudStr, 10) !== acudienteId ||
    Number.parseInt(instStr, 10) !== institucionId
  ) {
    return false;
  }
  const exp = Number.parseInt(expStr, 10);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  const expected = sign(`${acudStr}.${instStr}.${expStr}`);
  return safeEqual(receivedSig, expected);
}
