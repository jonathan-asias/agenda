import type { NextRequest } from 'next/server';
import { APP_URL, publicEnv } from '@/lib/env';

const PRODUCTION_APP_URL = 'https://ahoritapp.com';

/** Hosts que no sirven como enlace en el navegador (bind-all / loopback). */
function isNonBrowsableHost(hostname: string): boolean {
  const host = hostname.replace(/^\[|\]$/g, '').toLowerCase();
  return (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '::1' ||
    host === '0.0.0.0' ||
    host === '::'
  );
}

function isLocalhostUrl(url: string): boolean {
  try {
    return isNonBrowsableHost(new URL(url).hostname);
  } catch {
    return /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\]|0\.0\.0\.0|\[::\])(:\d+)?$/i.test(url);
  }
}

/**
 * Next a veces reporta origin como http://0.0.0.0:3000 (dirección de bind).
 * Eso produce ERR_ADDRESS_INVALID en el navegador; se reescribe a localhost.
 */
export function rewriteBindAllHostToLocalhost(url: string): string {
  const trimmed = url.trim().replace(/\/$/, '');
  if (!trimmed) return trimmed;
  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^\[|\]$/g, '');
    if (host === '0.0.0.0' || host === '::') {
      parsed.hostname = 'localhost';
      return parsed.toString().replace(/\/$/, '');
    }
    return trimmed;
  } catch {
    return trimmed
      .replace(/^https?:\/\/0\.0\.0\.0(?=:\d+|\/|$)/i, (m) => m.replace('0.0.0.0', 'localhost'))
      .replace(/^https?:\/\/\[::\](?=:\d+|\/|$)/i, (m) => m.replace('[::]', 'localhost'));
  }
}

function normalizeBaseUrl(raw: string | undefined | null): string | null {
  const trimmed = raw?.trim().replace(/\/$/, '');
  if (!trimmed) return null;
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  return rewriteBindAllHostToLocalhost(withProtocol);
}

/**
 * URL pública para enlaces en correos (confirmación, reset, registro).
 * Nunca debe devolver localhost en producción: el usuario abre el correo fuera de su máquina.
 */
export function resolvePublicAppUrl(): string {
  const candidates = [
    process.env.APP_URL,
    publicEnv.NEXT_PUBLIC_APP_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ];

  for (const raw of candidates) {
    const base = normalizeBaseUrl(raw);
    if (!base || isLocalhostUrl(base)) continue;
    return base;
  }

  if (process.env.NODE_ENV === 'production') {
    return PRODUCTION_APP_URL;
  }

  const local =
    normalizeBaseUrl(publicEnv.NEXT_PUBLIC_APP_URL) ||
    normalizeBaseUrl(APP_URL) ||
    'http://localhost:3000';
  return rewriteBindAllHostToLocalhost(local);
}

/**
 * Base URL para enlaces en correos (autorización, push, consultar).
 * Prioriza URL pública de entorno; en local usa Origin/Host del request
 * y nunca deja 0.0.0.0 (no navegable).
 */
export function resolveEmailLinkBaseUrl(request?: NextRequest): string {
  const publicUrl = resolvePublicAppUrl();
  if (publicUrl && !isLocalhostUrl(publicUrl)) {
    return rewriteBindAllHostToLocalhost(publicUrl);
  }

  if (request) {
    const headerOrigin = request.headers.get('origin')?.trim().replace(/\/$/, '');
    if (headerOrigin) {
      return rewriteBindAllHostToLocalhost(headerOrigin);
    }

    const host = (request.headers.get('x-forwarded-host') || request.headers.get('host') || '')
      .trim()
      .split(',')[0]
      ?.trim();
    const proto = (request.headers.get('x-forwarded-proto') || 'http').split(',')[0]?.trim() || 'http';
    if (host && !isNonBrowsableHost(host.split(':')[0] || host)) {
      return `${proto}://${host}`.replace(/\/$/, '');
    }
    if (host) {
      return rewriteBindAllHostToLocalhost(`${proto}://${host}`);
    }

    return rewriteBindAllHostToLocalhost(request.nextUrl.origin.replace(/\/$/, ''));
  }

  return rewriteBindAllHostToLocalhost(publicUrl || 'http://localhost:3000');
}

/** Destino tras confirmar correo en Supabase Auth. */
export function resolveEmailConfirmationRedirectUrl(): string {
  return `${resolvePublicAppUrl()}/login`;
}

/** URL base para enlaces en correos (reset, confirmación, etc.). */
export function resolveAppUrl(request?: NextRequest): string {
  const publicUrl = resolvePublicAppUrl();
  if (!isLocalhostUrl(publicUrl)) return publicUrl;

  const fromEnv = APP_URL?.trim().replace(/\/$/, '');
  if (fromEnv && !isLocalhostUrl(fromEnv)) return fromEnv;

  if (request) {
    return resolveEmailLinkBaseUrl(request);
  }

  return (
    rewriteBindAllHostToLocalhost(
      publicEnv.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, '') || 'http://localhost:3000'
    )
  );
}

/** Webhooks MP: debe ser URL pública alcanzable (túnel/ngrok/producción). */
export function resolveWebhookUrl(request?: NextRequest): string {
  return resolveAppUrl(request);
}

/**
 * Retorno desde Checkout Pro (success/failure/pending).
 * Prioriza el origen del navegador para no mandar a un túnel privado si el usuario entró por localhost.
 */
export function resolveCheckoutReturnUrl(request?: NextRequest): string {
  if (request) {
    const origin = request.headers.get('origin')?.trim().replace(/\/$/, '');
    if (origin) return origin;

    const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
    const proto = request.headers.get('x-forwarded-proto') || 'http';
    if (host) return `${proto}://${host}`.replace(/\/$/, '');

    return request.nextUrl.origin.replace(/\/$/, '');
  }

  const fromPublic = publicEnv.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, '');
  if (fromPublic) return fromPublic;

  return resolveAppUrl(request);
}

function isHttpsUrl(url: string): boolean {
  return url.startsWith('https://');
}

/** Túneles dev que suelen devolver CloudFront 403 si están caídos o bloqueados. */
function isDevTunnelUrl(url: string): boolean {
  return /devtunnels\.ms|ngrok|trycloudflare|loca\.lt|localhost\.run/i.test(url);
}

/**
 * Retorno post-pago Wompi. En sandbox evita devtunnels como redirect-url
 * (CloudFront 403). Wompi añade ?id= y resolvemos ref/email en el servidor.
 */
export function resolveWompiPaymentReturnBase(
  request: NextRequest,
  clientOrigin?: string
): string {
  const base = resolvePaymentReturnBase(request, clientOrigin);

  if (process.env.WOMPI_SANDBOX === 'false') {
    return base;
  }

  if (isLocalhostUrl(base)) {
    return base;
  }

  if (isDevTunnelUrl(base)) {
    return 'http://localhost:3000';
  }

  return base;
}

/** URL de retorno post-pago Wompi con ref/email para sync en sandbox (http localhost permitido). */
export function buildWompiSuccessRedirectUrl(
  returnBase: string,
  referencia: string,
  email: string
): string | undefined {
  const base = returnBase.trim().replace(/\/$/, '');
  const isHttps = base.startsWith('https://');
  const isLocalHttp = /^http:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i.test(base);
  if (!isHttps && !isLocalHttp) return undefined;

  const params = new URLSearchParams({
    gateway: 'wompi',
    ref: referencia,
    email: email.trim().toLowerCase(),
  });
  return `${base}/pago-exitoso?${params.toString()}`;
}

/**
 * MP exige back_urls HTTPS válidas con auto_return (especialmente en producción).
 * Si el usuario entra por localhost, usamos APP_URL (túnel/dominio) para las redirecciones MP.
 */
export function resolveMercadoPagoBackUrlBase(request?: NextRequest): string {
  const checkoutReturn = resolveCheckoutReturnUrl(request);
  const appUrl = APP_URL?.trim().replace(/\/$/, '');

  if (isHttpsUrl(checkoutReturn) && !isLocalhostUrl(checkoutReturn)) {
    return checkoutReturn;
  }

  if (appUrl && isHttpsUrl(appUrl)) {
    return appUrl;
  }

  return checkoutReturn;
}

export function canUseMercadoPagoAutoReturn(successUrl: string): boolean {
  return isHttpsUrl(successUrl);
}

/**
 * URL de retorno tras Checkout Pro.
 * Prioriza el origen del navegador (localhost en dev) sobre APP_URL (túnel/webhooks).
 */
export function resolvePaymentReturnBase(
  request: NextRequest,
  clientOrigin?: string
): string {
  const candidates: string[] = [];

  const client = clientOrigin?.trim().replace(/\/$/, '');
  if (client) candidates.push(client);

  const referer = request.headers.get('referer')?.trim();
  if (referer) {
    try {
      candidates.push(new URL(referer).origin);
    } catch {
      // ignore
    }
  }

  const origin = request.headers.get('origin')?.trim().replace(/\/$/, '');
  if (origin) candidates.push(origin);

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const proto = request.headers.get('x-forwarded-proto') || 'http';
  if (host) candidates.push(`${proto}://${host}`.replace(/\/$/, ''));

  candidates.push(request.nextUrl.origin.replace(/\/$/, ''));

  const allowedOrigins = new Set<string>();
  for (const raw of [
    publicEnv.NEXT_PUBLIC_APP_URL,
    APP_URL,
    PRODUCTION_APP_URL,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ]) {
    const base = raw?.trim().replace(/\/$/, '');
    if (!base) continue;
    try {
      allowedOrigins.add(new URL(base).origin);
    } catch {
      allowedOrigins.add(base);
    }
  }

  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      const url = new URL(candidate);
      const isLocal = isLocalhostUrl(url.origin);
      if (isLocal) return url.origin;
      if (allowedOrigins.has(url.origin)) return url.origin;
    } catch {
      // ignore
    }
  }

  return resolveCheckoutReturnUrl(request);
}
