import { createHash, timingSafeEqual } from 'crypto';

function getNestedValue(obj: unknown, path: string): string {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (!current || typeof current !== 'object') return '';
    current = (current as Record<string, unknown>)[part];
  }
  if (current == null) return '';
  return String(current);
}

export function validateWompiEventChecksum(params: {
  data: unknown;
  properties: string[];
  timestamp: number;
  checksum: string;
  eventsSecret: string;
}): boolean {
  const values = params.properties.map((prop) => getNestedValue(params.data, prop)).join('');
  const payload = `${values}${params.timestamp}${params.eventsSecret}`;
  const expected = createHash('sha256').update(payload).digest('hex').toUpperCase();
  const received = params.checksum.trim().toUpperCase();

  try {
    const a = Buffer.from(expected, 'utf8');
    const b = Buffer.from(received, 'utf8');
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
