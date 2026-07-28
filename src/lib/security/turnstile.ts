import { NextResponse } from 'next/server';

type TurnstileVerifyResponse = {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
};

function getTurnstileSecret(): string {
  return process.env.TURNSTILE_SECRET_KEY?.trim() || '';
}

function getTurnstileSiteKey(): string {
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || '';
}

/** true si hay claves configuradas (site + secret). */
export function isTurnstileServerEnabled(): boolean {
  return getTurnstileSecret().length > 0 && getTurnstileSiteKey().length > 0;
}

/**
 * Verifica el token de Cloudflare Turnstile.
 * Si no hay claves configuradas, permite el request (útil en desarrollo local).
 */
export async function verifyTurnstileToken(
  token: unknown
): Promise<{ ok: true } | { ok: false; error: string }> {
  const secret = getTurnstileSecret();
  const siteKey = getTurnstileSiteKey();

  if (!secret || !siteKey) {
    if (siteKey && !secret) {
      console.error(
        '[turnstile] NEXT_PUBLIC_TURNSTILE_SITE_KEY está definida pero falta TURNSTILE_SECRET_KEY'
      );
      return {
        ok: false,
        error: 'Verificación anti-robot no disponible. Contacte a soporte.',
      };
    }
    return { ok: true };
  }

  if (typeof token !== 'string' || !token.trim()) {
    return { ok: false, error: 'Debes completar la verificación de seguridad' };
  }

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret,
        response: token.trim(),
      }).toString(),
    });

    const data = (await res.json()) as TurnstileVerifyResponse;
    if (!data.success) {
      return {
        ok: false,
        error: 'Verificación de seguridad fallida. Intenta de nuevo.',
      };
    }
    return { ok: true };
  } catch (err) {
    console.error('[turnstile] Error al verificar con Cloudflare:', err);
    return { ok: false, error: 'No se pudo verificar el captcha. Intenta de nuevo.' };
  }
}

/** Devuelve NextResponse de error o null si el captcha es válido / no aplica. */
export async function requireTurnstileOrError(
  token: unknown
): Promise<NextResponse | null> {
  const result = await verifyTurnstileToken(token);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return null;
}

/** Extrae token Turnstile del body (acepta alias legado recaptchaToken). */
export function extractCaptchaToken(body: {
  turnstileToken?: unknown;
  captchaToken?: unknown;
  recaptchaToken?: unknown;
} | null | undefined): unknown {
  if (!body || typeof body !== 'object') return undefined;
  return body.turnstileToken ?? body.captchaToken ?? body.recaptchaToken;
}
