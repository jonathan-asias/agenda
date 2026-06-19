import { createHash } from 'crypto';

export function buildWompiIntegritySignature(params: {
  reference: string;
  amountInCents: number;
  currency?: string;
  integritySecret: string;
  expirationTime?: string;
}): string {
  const currency = params.currency ?? 'COP';
  const base = `${params.reference}${params.amountInCents}${currency}`;
  const payload = params.expirationTime
    ? `${base}${params.expirationTime}${params.integritySecret}`
    : `${base}${params.integritySecret}`;

  return createHash('sha256').update(payload).digest('hex');
}
