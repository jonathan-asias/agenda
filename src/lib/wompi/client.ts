import { randomBytes } from 'crypto';
import { buildWompiIntegritySignature } from '@/lib/wompi/integrity';
import {
  copToWompiCents,
  getWompiApiBaseUrl,
  getWompiCheckoutBaseUrl,
  getWompiIntegritySecret,
  getWompiPrivateKey,
  getWompiPublicKey,
  isWompiConfigured,
} from '@/lib/wompi/config';

export interface WompiTransaction {
  id: string;
  status: string;
  amount_in_cents: number;
  reference: string;
  customer_email: string;
  currency: string;
  payment_link_id?: string | null;
}

interface WompiTransactionResponse {
  data?: WompiTransaction;
}

interface WompiPaymentLinkResponse {
  data?: { id: string };
}

/** Referencia alfanumérica corta (formato recomendado por Wompi). */
export function generateWompiReference(): string {
  return randomBytes(8).toString('hex').toUpperCase();
}

export function wompiPaymentLinkMarker(linkId: string): string {
  return `wompi-pl-${linkId}`;
}

export function parseWompiPaymentLinkMarker(value: string | null | undefined): string | null {
  if (!value?.startsWith('wompi-pl-')) return null;
  return value.slice('wompi-pl-'.length);
}

/**
 * Payment Links API — recomendado (evita 403 de CloudFront en GET /p/ con firma).
 */
export async function createWompiPaymentLink(params: {
  name: string;
  description: string;
  amountCop: number;
  sku: string;
  redirectUrl?: string;
}): Promise<{ id: string; checkoutUrl: string }> {
  const body: Record<string, unknown> = {
    name: params.name.slice(0, 100),
    description: params.description.slice(0, 200),
    single_use: true,
    collect_shipping: false,
    currency: 'COP',
    amount_in_cents: copToWompiCents(params.amountCop),
    sku: params.sku.slice(0, 36),
  };

  if (params.redirectUrl?.startsWith('https://')) {
    body.redirect_url = params.redirectUrl;
  }

  const res = await fetch(`${getWompiApiBaseUrl()}/payment_links`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getWompiPrivateKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.text();
    let reason = detail.slice(0, 300);
    try {
      const parsed = JSON.parse(detail) as { error?: { reason?: string; messages?: Record<string, string[]> } };
      if (parsed.error?.reason) {
        reason = parsed.error.reason;
      } else if (parsed.error?.messages) {
        reason = Object.entries(parsed.error.messages)
          .flatMap(([field, msgs]) => msgs.map((m) => `${field}: ${m}`))
          .join('; ');
      }
    } catch {
      // keep raw detail
    }
    const err = new Error(`Wompi payment_links ${res.status}: ${reason}`);
    (err as Error & { status?: number }).status = res.status;
    throw err;
  }

  const json = (await res.json()) as WompiPaymentLinkResponse;
  const id = json.data?.id;
  if (!id) {
    throw new Error('Wompi no devolvió id de payment link');
  }

  return {
    id,
    checkoutUrl: `https://checkout.wompi.co/l/${id}`,
  };
}

/** Web Checkout GET /p/ — respaldo si payment_links falla. */
export function buildWompiWebCheckoutUrl(params: {
  reference: string;
  amountCop: number;
  redirectUrl?: string;
  customerEmail?: string;
  customerName?: string;
}): string {
  const amountInCents = copToWompiCents(params.amountCop);
  const integrity = buildWompiIntegritySignature({
    reference: params.reference,
    amountInCents,
    integritySecret: getWompiIntegritySecret(),
  });

  const parts = [
    `public-key=${encodeURIComponent(getWompiPublicKey())}`,
    'currency=COP',
    `amount-in-cents=${amountInCents}`,
    `reference=${encodeURIComponent(params.reference)}`,
    `signature%3Aintegrity=${integrity}`,
  ];

  if (params.redirectUrl?.startsWith('https://')) {
    parts.push(`redirect-url=${encodeURIComponent(params.redirectUrl)}`);
  }

  if (params.customerEmail) {
    parts.push(`customer-data%3Aemail=${encodeURIComponent(params.customerEmail)}`);
  }

  if (params.customerName) {
    const safeName = params.customerName.trim().slice(0, 80);
    if (safeName) {
      parts.push(`customer-data%3Afull-name=${encodeURIComponent(safeName)}`);
    }
  }

  return `${getWompiCheckoutBaseUrl()}?${parts.join('&')}`;
}

export async function createWompiCheckout(params: {
  referencia: string;
  amountCop: number;
  planNombre: string;
  billingPeriod: string;
  redirectUrl?: string;
  customerEmail?: string;
}): Promise<{ checkoutUrl: string; paymentLinkId: string; method: 'payment_link' }> {
  const link = await createWompiPaymentLink({
    name: `${params.planNombre} — Agenda Virtual`,
    description: `Suscripción ${params.billingPeriod}`,
    amountCop: params.amountCop,
    sku: params.referencia.replace(/-/g, '').slice(0, 36),
    redirectUrl: params.redirectUrl,
  });
  return { checkoutUrl: link.checkoutUrl, paymentLinkId: link.id, method: 'payment_link' };
}

export async function getWompiTransactionById(id: string): Promise<WompiTransaction | null> {
  if (!isWompiConfigured()) return null;

  const res = await fetch(`${getWompiApiBaseUrl()}/transactions/${encodeURIComponent(id)}`, {
    headers: {
      Authorization: `Bearer ${getWompiPrivateKey()}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) return null;

  const json = (await res.json()) as WompiTransactionResponse;
  return json.data ?? null;
}

export async function findApprovedWompiTransactionByReference(
  reference: string
): Promise<WompiTransaction | null> {
  if (!isWompiConfigured()) return null;

  const res = await fetch(
    `${getWompiApiBaseUrl()}/transactions?reference=${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${getWompiPrivateKey()}`,
      },
      cache: 'no-store',
    }
  );

  if (!res.ok) return null;

  const json = (await res.json()) as { data?: WompiTransaction[] };
  const approved = json.data?.find((tx) => tx.status === 'APPROVED');
  return approved ?? null;
}

/** Payment Links no usan nuestra referencia; busca por link, email y monto. */
export async function findApprovedWompiTransactionForPago(params: {
  referencia: string;
  email: string;
  monto: number;
  paymentLinkMarker?: string | null;
  createdAfter?: Date;
}): Promise<WompiTransaction | null> {
  const byRef = await findApprovedWompiTransactionByReference(params.referencia);
  if (byRef) return byRef;

  const linkId = parseWompiPaymentLinkMarker(params.paymentLinkMarker);
  const email = params.email.trim().toLowerCase();
  const maxPages = 5;

  for (let page = 1; page <= maxPages; page += 1) {
    const res = await fetch(
      `${getWompiApiBaseUrl()}/transactions?page=${page}&page_size=50`,
      {
        headers: { Authorization: `Bearer ${getWompiPrivateKey()}` },
        cache: 'no-store',
      }
    );
    if (!res.ok) break;

    const json = (await res.json()) as { data?: WompiTransaction[] };
    const txs = json.data ?? [];
    if (txs.length === 0) break;

    const approved = txs.find((tx) => {
      if (tx.status !== 'APPROVED') return false;
      if (tx.customer_email?.trim().toLowerCase() !== email) return false;
      if (Math.round(tx.amount_in_cents / 100) !== params.monto) return false;
      if (linkId && tx.payment_link_id && tx.payment_link_id !== linkId) return false;
      if (params.createdAfter && tx.reference) {
        // Wompi no expone created_at en listado; filtrar por link/email/monto es suficiente
      }
      return true;
    });

    if (approved) return approved;
    if (txs.length < 50) break;
  }

  return null;
}
