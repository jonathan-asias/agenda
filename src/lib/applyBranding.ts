/**
 * Aplica el branding de la institución a variables CSS `--brand-*`.
 * No modifica `--color-*` (colores fijos de la plataforma / botones / UI interna).
 * Solo debe ejecutarse en el cliente (document.documentElement).
 */

export interface BrandingColors {
  /** Color primario (hex o CSS válido) */
  primaryColor?: string | null;
  /** Color secundario (hex o CSS válido) */
  secondaryColor?: string | null;
  /** Alias compatibles con BrandingData */
  colorPrimario?: string | null;
  colorSecundario?: string | null;
}

const PLATFORM_PRIMARY = '#2563eb';
const PLATFORM_PRIMARY_HOVER = '#1d4ed8';
const PLATFORM_PRIMARY_FOCUS = '#3b82f6';
const PLATFORM_PRIMARY_LIGHT = '#dbeafe';
const PLATFORM_PRIMARY_TEXT = '#1e40af';
const PLATFORM_SECONDARY = '#475569';
const PLATFORM_SECONDARY_HOVER = '#334155';
const PLATFORM_SECONDARY_FOCUS = '#64748b';
const PLATFORM_SECONDARY_LIGHT = '#f8fafc';
const PLATFORM_SECONDARY_TEXT = '#1e293b';
const PLATFORM_BACKGROUND = '#dbeafe';

/** Oscurece un color hex (para hover). Factor 0–1 (ej. 0.9 = 10% más oscuro). */
function darkenHex(hex: string, factor: number): string {
  const match = hex.replace(/^#/, '').match(/.{2}/g);
  if (!match || match.length < 3) return hex;
  const r = Math.max(0, Math.round(parseInt(match[0], 16) * factor));
  const g = Math.max(0, Math.round(parseInt(match[1], 16) * factor));
  const b = Math.max(0, Math.round(parseInt(match[2], 16) * factor));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/** Aclara un color hex (para focus/light). Factor > 1 (ej. 1.15 = 15% más claro). */
function lightenHex(hex: string, factor: number): string {
  const match = hex.replace(/^#/, '').match(/.{2}/g);
  if (!match || match.length < 3) return hex;
  const r = Math.min(255, Math.round(parseInt(match[0], 16) * factor));
  const g = Math.min(255, Math.round(parseInt(match[1], 16) * factor));
  const b = Math.min(255, Math.round(parseInt(match[2], 16) * factor));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function setVar(name: string, value: string): void {
  if (typeof document === 'undefined') return;
  document.documentElement.style.setProperty(name, value);
}

function clearVar(name: string): void {
  if (typeof document === 'undefined') return;
  document.documentElement.style.removeProperty(name);
}

/** Restaura `--color-*` a los defaults de plataforma (por si una sesión previa los sobrescribió). */
function restorePlatformColors(): void {
  // Quitar overrides inline para que vuelvan a mandar :root de globals.css
  [
    '--color-primary',
    '--color-primary-hover',
    '--color-primary-focus',
    '--color-primary-light',
    '--color-primary-lighter',
    '--color-primary-text',
    '--color-secondary',
    '--color-secondary-hover',
    '--color-secondary-focus',
    '--color-secondary-light',
    '--color-secondary-text',
    '--color-background',
  ].forEach(clearVar);

  // Asegurar valores explícitos (por si :root no alcanzó a cargar)
  setVar('--color-primary', PLATFORM_PRIMARY);
  setVar('--color-primary-hover', PLATFORM_PRIMARY_HOVER);
  setVar('--color-primary-focus', PLATFORM_PRIMARY_FOCUS);
  setVar('--color-primary-light', PLATFORM_PRIMARY_LIGHT);
  setVar('--color-primary-lighter', PLATFORM_PRIMARY_LIGHT);
  setVar('--color-primary-text', PLATFORM_PRIMARY_TEXT);
  setVar('--color-secondary', PLATFORM_SECONDARY);
  setVar('--color-secondary-hover', PLATFORM_SECONDARY_HOVER);
  setVar('--color-secondary-focus', PLATFORM_SECONDARY_FOCUS);
  setVar('--color-secondary-light', PLATFORM_SECONDARY_LIGHT);
  setVar('--color-secondary-text', PLATFORM_SECONDARY_TEXT);
  setVar('--color-background', PLATFORM_BACKGROUND);
}

/**
 * Aplica los colores de branding institucional a `--brand-*`.
 * Los botones y UI interna siguen usando `--color-*` (plataforma).
 */
export function applyBranding(branding: BrandingColors | null | undefined): void {
  if (typeof document === 'undefined') return;

  restorePlatformColors();

  const primary =
    branding?.primaryColor ??
    branding?.colorPrimario ??
    null;
  const secondary =
    branding?.secondaryColor ??
    branding?.colorSecundario ??
    null;

  const brandPrimary =
    primary && /^#[0-9A-Fa-f]{6}$/.test(primary) ? primary : PLATFORM_PRIMARY;
  const brandSecondary =
    secondary && /^#[0-9A-Fa-f]{6}$/.test(secondary) ? secondary : PLATFORM_SECONDARY;

  setVar('--brand-primary', brandPrimary);
  setVar('--brand-primary-hover', darkenHex(brandPrimary, 0.88));
  setVar('--brand-primary-focus', lightenHex(brandPrimary, 1.12));
  setVar('--brand-primary-light', lightenHex(brandPrimary, 2.2));
  setVar('--brand-primary-text', darkenHex(brandPrimary, 0.55));

  setVar('--brand-secondary', brandSecondary);
  setVar('--brand-secondary-hover', darkenHex(brandSecondary, 0.88));
  setVar('--brand-secondary-light', lightenHex(brandSecondary, 2.2));
  setVar('--brand-secondary-text', darkenHex(brandSecondary, 0.6));
}

/**
 * Restaura branding y colores de plataforma a los valores por defecto.
 */
export function resetBranding(): void {
  if (typeof document === 'undefined') return;

  restorePlatformColors();

  setVar('--brand-primary', PLATFORM_PRIMARY);
  setVar('--brand-primary-hover', PLATFORM_PRIMARY_HOVER);
  setVar('--brand-primary-focus', PLATFORM_PRIMARY_FOCUS);
  setVar('--brand-primary-light', PLATFORM_PRIMARY_LIGHT);
  setVar('--brand-primary-text', PLATFORM_PRIMARY_TEXT);
  setVar('--brand-secondary', PLATFORM_SECONDARY);
  setVar('--brand-secondary-hover', PLATFORM_SECONDARY_HOVER);
  setVar('--brand-secondary-light', PLATFORM_SECONDARY_LIGHT);
  setVar('--brand-secondary-text', PLATFORM_SECONDARY_TEXT);
}
