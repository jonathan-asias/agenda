export const TRIAL_REFERENCIA_PREFIX = 'trial-';

export const TRIAL_LINK_TTL_HOURS = Number.parseInt(
  process.env.TRIAL_LINK_TTL_HOURS?.trim() || '24',
  10
);

export const TRIAL_DAYS_DEFAULT = Number.parseInt(
  process.env.TRIAL_DAYS_DEFAULT?.trim() || '30',
  10
);

export function isTrialReferencia(referencia: string): boolean {
  return referencia.startsWith(TRIAL_REFERENCIA_PREFIX);
}
