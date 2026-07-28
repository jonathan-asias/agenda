/** Site key pública (cliente). Vacía = Turnstile desactivado en UI. */
export function getTurnstileSiteKey(): string {
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || '';
}

export function isTurnstileClientEnabled(): boolean {
  return getTurnstileSiteKey().length > 0;
}

/**
 * true si el captcha está OK para habilitar el botón de continuar:
 * - si no hay site key configurada, no bloquea
 * - si hay site key, exige un token no vacío
 */
export function isTurnstileVerified(token: string | null | undefined): boolean {
  if (!isTurnstileClientEnabled()) return true;
  return typeof token === 'string' && token.trim().length > 0;
}
