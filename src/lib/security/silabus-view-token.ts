import { createHmac, timingSafeEqual } from 'crypto';

const VIEW_TTL_MS = 30 * 60 * 1000; // 30 min

function getSecret(): string {
  const secret =
    process.env.PUSH_ACTIVATION_SECRET?.trim() ||
    process.env.REGISTRO_ACCESS_SECRET?.trim();
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

/** Token corto para que Office Online / descarga pública lean el archivo sin cookie. */
export function createSilabusViewToken(
  silabusId: number,
  institucionId: number,
  docenteId: number
): string {
  const exp = Date.now() + VIEW_TTL_MS;
  const payload = `${silabusId}.${institucionId}.${docenteId}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySilabusViewToken(token: string): {
  silabusId: number;
  institucionId: number;
  docenteId: number;
} | null {
  const parts = token.split('.');
  if (parts.length !== 5) return null;
  const [silabusStr, instStr, docenteStr, expStr, receivedSig] = parts;
  const silabusId = Number.parseInt(silabusStr, 10);
  const institucionId = Number.parseInt(instStr, 10);
  const docenteId = Number.parseInt(docenteStr, 10);
  const exp = Number.parseInt(expStr, 10);
  if (
    !silabusId ||
    !institucionId ||
    !docenteId ||
    !Number.isFinite(exp) ||
    Date.now() > exp
  ) {
    return null;
  }
  const expected = sign(`${silabusStr}.${instStr}.${docenteStr}.${expStr}`);
  if (!safeEqual(receivedSig, expected)) return null;
  return { silabusId, institucionId, docenteId };
}
