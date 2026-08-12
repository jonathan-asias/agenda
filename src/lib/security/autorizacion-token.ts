import { createHmac, timingSafeEqual } from 'crypto';

function getSecret(): string {
  const secret =
    process.env.PUSH_ACTIVATION_SECRET?.trim() ||
    process.env.REGISTRO_ACCESS_SECRET?.trim();
  if (!secret) {
    throw new Error('PUSH_ACTIVATION_SECRET o REGISTRO_ACCESS_SECRET no configurado');
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

/** Caduca exactamente en la hora límite de respuesta de la autorización. */
function resolveExpMs(fechaVencimiento?: Date | null): number {
  if (fechaVencimiento && !Number.isNaN(fechaVencimiento.getTime())) {
    return fechaVencimiento.getTime();
  }
  // Sin vencimiento explícito: no emitir enlaces de larga duración.
  return Date.now();
}

export type AutorizacionTokenOk = {
  ok: true;
  recordatorioId: number;
  estudianteId: number;
  exp: number;
};

export type AutorizacionTokenFail = {
  ok: false;
  reason: 'invalid' | 'expired';
  recordatorioId?: number;
  estudianteId?: number;
  exp?: number;
};

export type AutorizacionTokenResult = AutorizacionTokenOk | AutorizacionTokenFail;

/** Token firmado: recordatorioId.estudianteId.exp.sig */
export function createAutorizacionToken(
  recordatorioId: number,
  estudianteId: number,
  fechaVencimiento?: Date | null
): string {
  const exp = resolveExpMs(fechaVencimiento);
  const payload = `${recordatorioId}.${estudianteId}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

/**
 * Verifica firma y caducidad.
 * Caducidad = hora límite para responder la autorización.
 */
export function verifyAutorizacionToken(token: string): AutorizacionTokenResult {
  const parts = String(token || '').split('.');
  if (parts.length !== 4) return { ok: false, reason: 'invalid' };

  const [recStr, estStr, expStr, receivedSig] = parts;
  const recordatorioId = Number.parseInt(recStr, 10);
  const estudianteId = Number.parseInt(estStr, 10);
  const exp = Number.parseInt(expStr, 10);

  if (
    !Number.isFinite(recordatorioId) ||
    recordatorioId <= 0 ||
    !Number.isFinite(estudianteId) ||
    estudianteId <= 0 ||
    !Number.isFinite(exp)
  ) {
    return { ok: false, reason: 'invalid' };
  }

  const expected = sign(`${recStr}.${estStr}.${expStr}`);
  if (!safeEqual(receivedSig, expected)) {
    return { ok: false, reason: 'invalid' };
  }

  if (Date.now() > exp) {
    return {
      ok: false,
      reason: 'expired',
      recordatorioId,
      estudianteId,
      exp,
    };
  }

  return { ok: true, recordatorioId, estudianteId, exp };
}

export function buildAutorizacionResponderUrl(
  baseUrl: string,
  token: string
): string {
  const base = baseUrl.replace(/\/$/, '');
  return `${base}/autorizar-recordatorio?token=${encodeURIComponent(token)}`;
}
