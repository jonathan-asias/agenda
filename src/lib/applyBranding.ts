/**
 * Aplica el branding de la institución a las variables CSS del documento.
 * Conecta los colores guardados en BD con el sistema de design tokens (globals.css).
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

const DEFAULT_PRIMARY = '#2563eb';
const DEFAULT_PRIMARY_HOVER = '#1d4ed8';
const DEFAULT_PRIMARY_FOCUS = '#3b82f6';
const DEFAULT_PRIMARY_LIGHT = '#dbeafe';
const DEFAULT_PRIMARY_TEXT = '#1e40af';
const DEFAULT_SECONDARY = '#475569';
const DEFAULT_SECONDARY_HOVER = '#334155';
const DEFAULT_SECONDARY_FOCUS = '#64748b';
const DEFAULT_SECONDARY_LIGHT = '#f8fafc';
const DEFAULT_SECONDARY_TEXT = '#1e293b';
const DEFAULT_BACKGROUND = '#dbeafe';

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

/**
 * Aplica los colores de branding a las variables CSS globales.
 * Acepta primaryColor/secondaryColor o colorPrimario/colorSecundario.
 */
export function applyBranding(branding: BrandingColors | null | undefined): void {
  if (typeof document === 'undefined') return;

  const primary =
    branding?.primaryColor ??
    branding?.colorPrimario ??
    null;
  const secondary =
    branding?.secondaryColor ??
    branding?.colorSecundario ??
    null;

  if (primary && /^#[0-9A-Fa-f]{6}$/.test(primary)) {
    setVar('--color-primary', primary);
    setVar('--color-primary-hover', darkenHex(primary, 0.88));
    setVar('--color-primary-focus', lightenHex(primary, 1.12));
    setVar('--color-primary-light', lightenHex(primary, 2.2));
    setVar('--color-primary-lighter', lightenHex(primary, 2.2));
    setVar('--color-primary-text', darkenHex(primary, 0.55));
  }

  if (secondary && /^#[0-9A-Fa-f]{6}$/.test(secondary)) {
    setVar('--color-secondary', secondary);
    setVar('--color-secondary-hover', darkenHex(secondary, 0.88));
    setVar('--color-secondary-focus', lightenHex(secondary, 1.1));
    setVar('--color-secondary-light', lightenHex(secondary, 2.2));
    setVar('--color-secondary-text', darkenHex(secondary, 0.6));
    setVar('--color-background', lightenHex(secondary, 2.8));
  }
}

/**
 * Restaura las variables CSS a los valores por defecto (sin branding).
 */
export function resetBranding(): void {
  if (typeof document === 'undefined') return;

  setVar('--color-primary', DEFAULT_PRIMARY);
  setVar('--color-primary-hover', DEFAULT_PRIMARY_HOVER);
  setVar('--color-primary-focus', DEFAULT_PRIMARY_FOCUS);
  setVar('--color-primary-light', DEFAULT_PRIMARY_LIGHT);
  setVar('--color-primary-lighter', DEFAULT_PRIMARY_LIGHT);
  setVar('--color-primary-text', DEFAULT_PRIMARY_TEXT);
  setVar('--color-secondary', DEFAULT_SECONDARY);
  setVar('--color-secondary-hover', DEFAULT_SECONDARY_HOVER);
  setVar('--color-secondary-focus', DEFAULT_SECONDARY_FOCUS);
  setVar('--color-secondary-light', DEFAULT_SECONDARY_LIGHT);
  setVar('--color-secondary-text', DEFAULT_SECONDARY_TEXT);
  setVar('--color-background', DEFAULT_BACKGROUND);
}
