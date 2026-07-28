/**
 * @deprecated Usa @/lib/security/turnstile-client
 */
export {
  getTurnstileSiteKey as getRecaptchaSiteKey,
  isTurnstileClientEnabled as isRecaptchaClientEnabled,
  isTurnstileVerified as isRecaptchaVerified,
} from './turnstile-client';
