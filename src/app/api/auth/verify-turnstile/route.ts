import { NextRequest, NextResponse } from 'next/server';
import {
  extractCaptchaToken,
  requireTurnstileOrError,
} from '@/lib/security/turnstile';
import { checkRateLimit, rateLimitResponse } from '@/lib/security/rate-limit';

/**
 * Verifica un token Cloudflare Turnstile (flujos públicos: login, etc.).
 * POST { turnstileToken: string }
 */
export async function POST(request: NextRequest) {
  const rate = checkRateLimit(request, 'auth-verify-turnstile', { max: 30, windowSec: 60 });
  if (!rate.ok) {
    return rateLimitResponse(rate.retryAfterSec ?? 60);
  }

  try {
    const body = await request.json();
    const captchaError = await requireTurnstileOrError(extractCaptchaToken(body));
    if (captchaError) return captchaError;
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error verificando turnstile:', error);
    return NextResponse.json({ error: 'No se pudo verificar el captcha' }, { status: 500 });
  }
}
