/**
 * @deprecated Usa TurnstileField. Reexport para compatibilidad.
 */
export {
  default,
  isTurnstileClientEnabled as isRecaptchaClientEnabled,
  isTurnstileVerified as isRecaptchaVerified,
} from './TurnstileField';
export type { TurnstileFieldProps as RecaptchaFieldProps } from './TurnstileField';
