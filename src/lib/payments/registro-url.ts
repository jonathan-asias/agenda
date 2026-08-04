import { APP_URL, publicEnv } from '@/lib/env';
import {
  buildRegistroInstitucionUrl,
  createRegistroAccessToken,
  getRegistroAccessTtlHours,
} from '@/lib/security/registro-access-token';

export function isLocalhostBase(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return host === 'localhost' || host === '127.0.0.1' || host === '[::1]';
  } catch {
    return /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?/i.test(url);
  }
}

export function isDevTunnelBase(url: string): boolean {
  return /devtunnels\.ms|ngrok|trycloudflare|loca\.lt|localhost\.run/i.test(url);
}

export function resolveLocalhostRegistroBase(publicBase: string): string {
  const fromEnv = process.env.LOCAL_REGISTRATION_URL?.trim().replace(/\/$/, '');
  if (fromEnv && isLocalhostBase(fromEnv)) return fromEnv;

  const fromPublic = publicEnv.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, '');
  if (fromPublic && isLocalhostBase(fromPublic)) return fromPublic;

  try {
    const port = new URL(publicBase).port || '3000';
    return `http://localhost:${port}`;
  } catch {
    return 'http://localhost:3000';
  }
}

export function resolveRegistroBaseUrl(): string {
  const appUrl = APP_URL?.trim().replace(/\/$/, '');
  const publicUrl = publicEnv.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, '');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '');

  // Preferir dominio público (ahoritapp); localhost solo como fallback de desarrollo.
  for (const candidate of [appUrl, publicUrl, siteUrl]) {
    if (candidate && !isLocalhostBase(candidate) && !isDevTunnelBase(candidate)) {
      return candidate;
    }
  }

  if (process.env.NODE_ENV === 'production') {
    return 'https://ahoritapp.com';
  }

  if (publicUrl && isLocalhostBase(publicUrl)) return publicUrl;
  if (appUrl && isLocalhostBase(appUrl)) return appUrl;
  return resolveLocalhostRegistroBase(appUrl || publicUrl || 'http://localhost:3000');
}

export function buildRegistroInstitucionUrlPair(
  email: string,
  referencia: string,
  ttlHours?: number
): { registroUrl: string; registroUrlLocalhost?: string } {
  const base = resolveRegistroBaseUrl();
  const hours =
    ttlHours != null && Number.isFinite(ttlHours) && ttlHours > 0
      ? ttlHours
      : getRegistroAccessTtlHours();
  const token = createRegistroAccessToken(email, referencia, hours);
  const registroUrl = buildRegistroInstitucionUrl(base, token);
  const registroUrlLocalhost = !isLocalhostBase(base)
    ? buildRegistroInstitucionUrl(resolveLocalhostRegistroBase(base), token)
    : undefined;

  return { registroUrl, registroUrlLocalhost };
}
