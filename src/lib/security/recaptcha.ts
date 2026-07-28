/**
 * @deprecated Usa @/lib/security/turnstile
 */
export {
  isTurnstileServerEnabled as isRecaptchaServerEnabled,
  verifyTurnstileToken as verifyRecaptchaToken,
  requireTurnstileOrError as requireRecaptchaOrError,
  extractCaptchaToken,
} from './turnstile';
