// ⚠ Archivo actualmente no utilizado. Pendiente decisión de eliminación.
/**
 * UI Design Tokens - Constantes de diseño para mantener consistencia
 * 
 * Este archivo centraliza los valores de diseño más utilizados en la aplicación.
 * Facilita el mantenimiento y la futura migración a un sistema de design tokens más robusto.
 * 
 * FASE 0: Mejora de consistencia sin cambiar la identidad visual
 * FASE 1: Introducción de design tokens semánticos (sin cambios visuales)
 * 
 * NOTA: Los tokens están definidos como CSS variables en globals.css.
 * Las clases de Tailwind actuales están mapeadas a estos tokens.
 */

// ============================================================================
// DESIGN TOKENS - Referencias a CSS Variables
// ============================================================================
/**
 * Design Tokens Semánticos
 * 
 * Estos tokens están definidos en globals.css como CSS variables.
 * Se pueden usar directamente en estilos inline o a través de clases de Tailwind
 * que están mapeadas a estos tokens.
 * 
 * Ejemplo de uso:
 * - CSS: `background-color: var(--color-primary);`
 * - Tailwind: `bg-[var(--color-primary)]` (si es necesario)
 * - O usar las clases mapeadas: `bg-blue-600` (mapeado a --color-primary)
 */
export const DESIGN_TOKENS = {
  // Colores principales
  colors: {
    primary: 'var(--color-primary)',
    primaryHover: 'var(--color-primary-hover)',
    primaryFocus: 'var(--color-primary-focus)',
    primaryLight: 'var(--color-primary-light)',
    primaryLighter: 'var(--color-primary-lighter)',
    primaryText: 'var(--color-primary-text)',
    
    // Colores secundarios
    secondary: 'var(--color-secondary)',
    secondaryHover: 'var(--color-secondary-hover)',
    secondaryFocus: 'var(--color-secondary-focus)',
    secondaryLight: 'var(--color-secondary-light)',
    secondaryText: 'var(--color-secondary-text)',
    
    // Fondos y superficies
    background: 'var(--color-background)',
    surface: 'var(--color-surface)',
    surfaceGlass: 'var(--color-surface-glass)',
    surfaceNested: 'var(--color-surface-nested)',
    
    // Texto
    textPrimary: 'var(--color-text-primary)',
    textSecondary: 'var(--color-text-secondary)',
    textTertiary: 'var(--color-text-tertiary)',
    textInverse: 'var(--color-text-inverse)',
    
    // Bordes
    border: 'var(--color-border)',
    borderLight: 'var(--color-border-light)',
    borderGlass: 'var(--color-border-glass)',
    
    // Semánticos: Éxito
    success: 'var(--color-success)',
    successHover: 'var(--color-success-hover)',
    successFocus: 'var(--color-success-focus)',
    successLight: 'var(--color-success-light)',
    successLighter: 'var(--color-success-lighter)',
    successText: 'var(--color-success-text)',
    successBorder: 'var(--color-success-border)',
    
    // Semánticos: Error/Danger
    danger: 'var(--color-danger)',
    dangerHover: 'var(--color-danger-hover)',
    dangerFocus: 'var(--color-danger-focus)',
    dangerLight: 'var(--color-danger-light)',
    dangerLighter: 'var(--color-danger-lighter)',
    dangerText: 'var(--color-danger-text)',
    dangerBorder: 'var(--color-danger-border)',
    dangerBorderInput: 'var(--color-danger-border-input)',
    
    // Semánticos: Advertencia
    warning: 'var(--color-warning)',
    warningLight: 'var(--color-warning-light)',
    warningBorder: 'var(--color-warning-border)',
  },
  
  // Tipografía
  typography: {
    fontFamilyBase: 'var(--font-family-base)',
    fontSizeXs: 'var(--font-size-xs)',
    fontSizeSm: 'var(--font-size-sm)',
    fontSizeBase: 'var(--font-size-base)',
    fontSizeLg: 'var(--font-size-lg)',
    fontSizeXl: 'var(--font-size-xl)',
    fontSize2xl: 'var(--font-size-2xl)',
    fontSize3xl: 'var(--font-size-3xl)',
    fontWeightRegular: 'var(--font-weight-regular)',
    fontWeightMedium: 'var(--font-weight-medium)',
    fontWeightSemibold: 'var(--font-weight-semibold)',
    fontWeightBold: 'var(--font-weight-bold)',
  },
  
  // Border Radius
  radius: {
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-xl)',
    full: 'var(--radius-full)',
  },
} as const;

// ============================================================================
// BORDER RADIUS
// ============================================================================
export const BORDER_RADIUS = {
  // Botones y elementos pequeños
  button: 'rounded-lg', // 0.5rem (8px)
  
  // Inputs y elementos medianos
  input: 'rounded-lg', // 0.5rem (8px)
  
  // Cards y contenedores medianos
  card: 'rounded-xl', // 0.75rem (12px)
  
  // Cards principales y modales
  cardLarge: 'rounded-2xl', // 1rem (16px)
  
  // Badges y elementos circulares
  badge: 'rounded-full', // 9999px
} as const;

// ============================================================================
// SHADOWS
// ============================================================================
export const SHADOWS = {
  // Elementos sutiles (header, separadores)
  subtle: 'shadow-sm',
  
  // Cards secundarias
  card: 'shadow-sm',
  
  // Cards principales
  cardLarge: 'shadow-lg',
  
  // Modales y elementos flotantes
  modal: 'shadow-xl',
  
  // Hover en cards
  hover: 'hover:shadow-md',
} as const;

// ============================================================================
// PADDING
// ============================================================================
export const PADDING = {
  // Botones pequeños
  buttonSmall: 'px-3 py-1.5',
  
  // Botones estándar
  button: 'px-4 py-2',
  
  // Botones grandes
  buttonLarge: 'px-6 py-3',
  
  // Inputs estándar
  input: 'px-4 py-2.5',
  
  // Cards pequeñas
  cardSmall: 'p-3',
  
  // Cards estándar
  card: 'p-4',
  
  // Cards grandes
  cardLarge: 'p-6',
  
  // Cards extra grandes
  cardXLarge: 'p-8',
  
  // Badges
  badge: 'px-3 py-1',
  
  // Contenedores principales
  container: 'px-4 sm:px-6 lg:px-8 py-8',
} as const;

// ============================================================================
// GAPS
// ============================================================================
export const GAPS = {
  // Gaps pequeños (flex, elementos cercanos)
  small: 'gap-2',
  
  // Gaps estándar (flex, elementos normales)
  standard: 'gap-3',
  
  // Gaps medianos (grids, elementos con espacio)
  medium: 'gap-4',
  
  // Gaps grandes (secciones, elementos separados)
  large: 'gap-6',
  
  // Gaps extra grandes (secciones principales)
  xLarge: 'gap-8',
} as const;

// ============================================================================
// BUTTON STYLES
// ============================================================================
/**
 * Estilos de botones usando design tokens
 * 
 * NOTA: Las clases de Tailwind están mapeadas a los design tokens definidos en globals.css:
 * - bg-blue-600 → --color-primary
 * - bg-slate-600 → --color-secondary
 * - bg-red-600 → --color-danger
 * - bg-green-600 → --color-success
 */
export const BUTTON_STYLES = {
  // Botón primario (usa --color-primary)
  primary: [
    'inline-flex items-center',
    'px-4 py-2',
    'bg-blue-600', // Mapeado a --color-primary
    'hover:bg-blue-700', // Mapeado a --color-primary-hover
    'text-white', // Mapeado a --color-text-inverse
    'rounded-lg', // Mapeado a --radius-md
    'text-sm font-medium', // Mapeado a --font-size-sm y --font-weight-medium
    'transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500', // Mapeado a --color-primary-focus
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),
  
  // Botón secundario (usa --color-secondary)
  secondary: [
    'inline-flex items-center',
    'px-4 py-2',
    'bg-slate-600', // Mapeado a --color-secondary
    'hover:bg-slate-700', // Mapeado a --color-secondary-hover
    'text-white', // Mapeado a --color-text-inverse
    'rounded-lg', // Mapeado a --radius-md
    'text-sm font-medium', // Mapeado a --font-size-sm y --font-weight-medium
    'transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500', // Mapeado a --color-secondary-focus
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),
  
  // Botón destructivo (usa --color-danger)
  destructive: [
    'inline-flex items-center',
    'px-4 py-2',
    'bg-red-600', // Mapeado a --color-danger
    'hover:bg-red-700', // Mapeado a --color-danger-hover
    'text-white', // Mapeado a --color-text-inverse
    'rounded-lg', // Mapeado a --radius-md
    'text-sm font-medium', // Mapeado a --font-size-sm y --font-weight-medium
    'transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500', // Mapeado a --color-danger-focus
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),
  
  // Botón de éxito (usa --color-success)
  success: [
    'inline-flex items-center',
    'px-4 py-2',
    'bg-green-600', // Mapeado a --color-success
    'hover:bg-green-700', // Mapeado a --color-success-hover
    'text-white', // Mapeado a --color-text-inverse
    'rounded-lg', // Mapeado a --radius-md
    'text-sm font-medium', // Mapeado a --font-size-sm y --font-weight-medium
    'transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500', // Mapeado a --color-success-focus
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),
  
  // Botón outline (usa --color-surface y --color-border)
  outline: [
    'inline-flex items-center',
    'px-4 py-2',
    'bg-white', // Mapeado a --color-surface
    'border border-slate-300', // Mapeado a --color-border
    'text-slate-700', // Mapeado a --color-text-secondary
    'hover:bg-slate-50', // Mapeado a --color-secondary-light
    'rounded-lg', // Mapeado a --radius-md
    'text-sm font-medium', // Mapeado a --font-size-sm y --font-weight-medium
    'transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500', // Mapeado a --color-secondary-focus
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),
} as const;

// ============================================================================
// CARD STYLES
// ============================================================================
/**
 * Estilos de cards usando design tokens
 * 
 * NOTA: Las clases de Tailwind están mapeadas a los design tokens:
 * - bg-white/80 → --color-surface-glass
 * - bg-white → --color-surface
 * - bg-slate-50 → --color-surface-nested
 * - border-slate-200 → --color-border-light
 */
export const CARD_STYLES = {
  // Card principal con glassmorphism (usa --color-surface-glass)
  primary: [
    'bg-white/80', // Mapeado a --color-surface-glass
    'backdrop-blur-sm',
    'rounded-2xl', // Mapeado a --radius-xl
    'shadow-lg', // Mapeado a --shadow-lg
    'border border-white/20', // Mapeado a --color-border-glass
    'p-6', // Mapeado a PADDING.cardLarge
  ].join(' '),
  
  // Card secundaria simple (usa --color-surface)
  secondary: [
    'bg-white', // Mapeado a --color-surface
    'rounded-xl', // Mapeado a --radius-lg
    'shadow-sm', // Mapeado a --shadow-sm
    'border border-slate-200', // Mapeado a --color-border-light
    'p-4', // Mapeado a PADDING.card
  ].join(' '),
  
  // Card con hover (usa --color-surface)
  interactive: [
    'bg-white', // Mapeado a --color-surface
    'rounded-xl', // Mapeado a --radius-lg
    'shadow-sm', // Mapeado a --shadow-sm
    'border border-slate-200', // Mapeado a --color-border-light
    'p-4', // Mapeado a PADDING.card
    'hover:shadow-md', // Mapeado a --shadow-md
    'transition-shadow',
  ].join(' '),
  
  // Card pequeña (dentro de otras cards) (usa --color-surface-nested)
  nested: [
    'bg-slate-50', // Mapeado a --color-surface-nested
    'rounded-lg', // Mapeado a --radius-md
    'border border-slate-200', // Mapeado a --color-border-light
    'p-4', // Mapeado a PADDING.card
  ].join(' '),
} as const;

// ============================================================================
// INPUT STYLES
// ============================================================================
/**
 * Estilos de inputs usando design tokens
 * 
 * NOTA: Las clases de Tailwind están mapeadas a los design tokens:
 * - border-slate-300 → --color-border
 * - border-red-300 → --color-danger-border-input
 * - bg-white → --color-surface
 * - text-slate-900 → --color-text-primary
 * - text-slate-400 → --color-text-tertiary
 * - focus:ring-blue-500 → --color-primary-focus
 */
export const INPUT_STYLES = {
  // Input estándar (usa --color-border, --color-surface, --color-text-primary)
  standard: [
    'w-full',
    'px-4 py-2.5', // Mapeado a PADDING.input
    'text-sm', // Mapeado a --font-size-sm
    'border border-slate-300', // Mapeado a --color-border
    'rounded-lg', // Mapeado a --radius-md
    'bg-white', // Mapeado a --color-surface
    'text-slate-900', // Mapeado a --color-text-primary
    'focus:outline-none',
    'focus:ring-2 focus:ring-blue-500', // Mapeado a --color-primary-focus
    'focus:border-blue-500', // Mapeado a --color-primary-focus
    'transition-all duration-200',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'placeholder:text-slate-400', // Mapeado a --color-text-tertiary
  ].join(' '),
  
  // Input con error (usa --color-danger-border-input)
  error: [
    'w-full',
    'px-4 py-2.5', // Mapeado a PADDING.input
    'text-sm', // Mapeado a --font-size-sm
    'border border-red-300', // Mapeado a --color-danger-border-input
    'rounded-lg', // Mapeado a --radius-md
    'bg-white', // Mapeado a --color-surface
    'text-slate-900', // Mapeado a --color-text-primary
    'focus:outline-none',
    'focus:ring-2 focus:ring-red-500', // Mapeado a --color-danger-focus
    'focus:border-red-500', // Mapeado a --color-danger-focus
    'transition-all duration-200',
  ].join(' '),
} as const;

// ============================================================================
// BADGE STYLES
// ============================================================================
/**
 * Estilos de badges usando design tokens
 * 
 * NOTA: Las clases de Tailwind están mapeadas a los design tokens:
 * - bg-blue-100 → --color-primary-lighter
 * - text-blue-800 → --color-primary-text
 * - bg-green-100 → --color-success-lighter
 * - text-green-800 → --color-success-text
 * - bg-red-100 → --color-danger-lighter
 * - text-red-800 → --color-danger-text
 */
export const BADGE_STYLES = {
  // Base para todos los badges
  base: 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium', // Mapeado a PADDING.badge, --radius-full, --font-size-xs, --font-weight-medium
  
  // Variantes de color
  blue: 'bg-blue-100 text-blue-800', // Mapeado a --color-primary-lighter y --color-primary-text
  green: 'bg-green-100 text-green-800', // Mapeado a --color-success-lighter y --color-success-text
  red: 'bg-red-100 text-red-800', // Mapeado a --color-danger-lighter y --color-danger-text
  slate: 'bg-slate-100 text-slate-800', // Mapeado a --color-secondary-light y --color-secondary-text
  indigo: 'bg-indigo-100 text-indigo-800', // Color adicional (no mapeado a token principal)
} as const;

// ============================================================================
// ALERT STYLES
// ============================================================================
/**
 * Estilos de alertas usando design tokens
 * 
 * NOTA: Las clases de Tailwind están mapeadas a los design tokens:
 * - bg-red-50 → --color-danger-light
 * - border-red-200 → --color-danger-border
 * - bg-green-50 → --color-success-light
 * - border-green-200 → --color-success-border
 * - bg-blue-50 → --color-primary-light
 * - bg-yellow-50 → --color-warning-light
 * - border-yellow-200 → --color-warning-border
 */
export const ALERT_STYLES = {
  // Alerta de error (usa --color-danger-light y --color-danger-border)
  error: [
    'bg-red-50', // Mapeado a --color-danger-light
    'border border-red-200', // Mapeado a --color-danger-border
    'rounded-lg', // Mapeado a --radius-md
    'p-4', // Mapeado a PADDING.card
  ].join(' '),
  
  // Alerta de éxito (usa --color-success-light y --color-success-border)
  success: [
    'bg-green-50', // Mapeado a --color-success-light
    'border border-green-200', // Mapeado a --color-success-border
    'rounded-lg', // Mapeado a --radius-md
    'p-4', // Mapeado a PADDING.card
  ].join(' '),
  
  // Alerta informativa (usa --color-primary-light)
  info: [
    'bg-blue-50', // Mapeado a --color-primary-light
    'border border-blue-200', // Mapeado a --color-primary (variante de borde)
    'rounded-lg', // Mapeado a --radius-md
    'p-4', // Mapeado a PADDING.card
  ].join(' '),
  
  // Alerta de advertencia (usa --color-warning-light y --color-warning-border)
  warning: [
    'bg-yellow-50', // Mapeado a --color-warning-light
    'border border-yellow-200', // Mapeado a --color-warning-border
    'rounded-lg', // Mapeado a --radius-md
    'p-4', // Mapeado a PADDING.card
  ].join(' '),
} as const;

// ============================================================================
// TRANSITIONS
// ============================================================================
export const TRANSITIONS = {
  // Transición de colores (rápida)
  colors: 'transition-colors',
  
  // Transición completa (200ms)
  all: 'transition-all duration-200',
  
  // Transición de sombras
  shadow: 'transition-shadow',
  
  // Transición completa (300ms)
  allSlow: 'transition-all duration-300',
} as const;

// ============================================================================
// LOADING SPINNER
// ============================================================================
export const LOADING_STYLES = {
  // Spinner estándar
  spinner: 'animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600',
  
  // Spinner pequeño
  spinnerSmall: 'animate-spin rounded-full h-4 w-4 border-b-2 border-white',
} as const;

// ============================================================================
// BACKGROUNDS
// ============================================================================
/**
 * Fondos usando design tokens
 * 
 * NOTA: Las clases de Tailwind están mapeadas a los design tokens:
 * - bg-blue-50 → --color-background
 * - bg-white/80 → --color-surface-glass
 */
export const BACKGROUNDS = {
  // Fondo principal de páginas (usa --color-background)
  page: 'bg-blue-50', // Mapeado a --color-background
  
  // Fondo de cards con glassmorphism (usa --color-surface-glass)
  cardGlass: 'bg-white/80 backdrop-blur-sm', // Mapeado a --color-surface-glass
} as const;

