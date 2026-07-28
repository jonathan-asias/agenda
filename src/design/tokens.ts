/**
 * Design tokens - única fuente de verdad para diseño.
 * Referencian variables CSS definidas en globals.css.
 */

export const tokens = {
  colors: {
    primary: 'var(--color-primary)',
    primaryHover: 'var(--color-primary-hover)',
    primaryFocus: 'var(--color-primary-focus)',
    secondary: 'var(--color-secondary)',
    secondaryHover: 'var(--color-secondary-hover)',
    secondaryFocus: 'var(--color-secondary-focus)',
    /** Identidad visual de la institución (no usar en botones de plataforma) */
    brandPrimary: 'var(--brand-primary)',
    brandPrimaryHover: 'var(--brand-primary-hover)',
    brandPrimaryLight: 'var(--brand-primary-light)',
    brandSecondary: 'var(--brand-secondary)',
    background: 'var(--background)',
    surface: 'var(--surface)',
    surfaceNested: 'var(--color-surface-nested)',
    text: 'var(--text)',
    textSecondary: 'var(--color-text-secondary)',
    textInverse: 'var(--color-text-inverse)',
    border: 'var(--color-border)',
    danger: 'var(--color-danger)',
    dangerHover: 'var(--color-danger-hover)',
    dangerFocus: 'var(--color-danger-focus)',
    success: 'var(--color-success)',
    successHover: 'var(--color-success-hover)',
    successFocus: 'var(--color-success-focus)',
    borderLight: 'var(--color-border-light)',
    surfaceGlass: 'var(--color-surface-glass)',
    borderGlass: 'var(--color-border-glass)',
  },
  radius: {
    sm: '6px',
    md: '10px',
    lg: '16px',
  },
} as const;
