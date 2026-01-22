# Design Tokens - FASE 1

## ¿Qué son los Design Tokens en este contexto?

Los **Design Tokens** son valores semánticos que representan decisiones de diseño fundamentales (colores, tipografía, espaciado, etc.) de forma abstracta y reutilizable. En esta fase, introducimos una capa semántica que envuelve los valores actuales **sin cambiar el resultado visual**.

### Beneficios:

1. **Semántica clara**: `--color-primary` es más descriptivo que `blue-600`
2. **Mantenibilidad**: Cambiar un token afecta todos los usos
3. **Escalabilidad**: Base para personalización institucional, dark mode, accesibilidad
4. **Refactor progresivo**: No disruptivo, compatible con código existente

### Estrategia de implementación:

- **CSS Variables** en `globals.css` para los tokens base
- **Mapeo a Tailwind** usando `@theme` para mantener compatibilidad
- **Refactor incremental** empezando por componentes base (Button, Card, Input)
- **Sin cambios visuales**: Cada token mapea exactamente al valor actual

---

## Tabla de Mapeo: Valor Actual → Design Token

### Colores

#### Colores Principales

| Token Semántico | Valor Actual | Uso Principal |
|----------------|--------------|---------------|
| `--color-primary` | `#2563eb` (blue-600) | Botones primarios, logos, elementos destacados |
| `--color-primary-hover` | `#1d4ed8` (blue-700) | Hover de botones primarios |
| `--color-primary-focus` | `#3b82f6` (blue-500) | Focus rings, elementos activos |
| `--color-primary-light` | `#dbeafe` (blue-50) | Fondos de páginas, alertas informativas |
| `--color-primary-lighter` | `#dbeafe` (blue-100) | Fondos de badges azules |
| `--color-primary-text` | `#1e40af` (blue-800) | Texto en badges azules |

#### Colores Secundarios

| Token Semántico | Valor Actual | Uso Principal |
|----------------|--------------|---------------|
| `--color-secondary` | `#475569` (slate-600) | Botones secundarios |
| `--color-secondary-hover` | `#334155` (slate-700) | Hover de botones secundarios |
| `--color-secondary-focus` | `#64748b` (slate-500) | Focus rings secundarios |
| `--color-secondary-light` | `#f8fafc` (slate-50) | Fondos de cards anidadas |
| `--color-secondary-text` | `#1e293b` (slate-800) | Texto principal |

#### Colores de Fondo y Superficie

| Token Semántico | Valor Actual | Uso Principal |
|----------------|--------------|---------------|
| `--color-background` | `#dbeafe` (blue-50) | Fondo principal de páginas |
| `--color-surface` | `#ffffff` (white) | Fondos de cards, inputs |
| `--color-surface-glass` | `rgba(255, 255, 255, 0.8)` | Glassmorphism (bg-white/80) |
| `--color-surface-nested` | `#f8fafc` (slate-50) | Cards anidadas |

#### Colores de Texto

| Token Semántico | Valor Actual | Uso Principal |
|----------------|--------------|---------------|
| `--color-text-primary` | `#0f172a` (slate-900) | Texto principal en inputs |
| `--color-text-secondary` | `#475569` (slate-600) | Texto secundario, labels |
| `--color-text-tertiary` | `#94a3b8` (slate-400) | Placeholders, texto deshabilitado |
| `--color-text-inverse` | `#ffffff` (white) | Texto sobre fondos oscuros |

#### Colores de Borde

| Token Semántico | Valor Actual | Uso Principal |
|----------------|--------------|---------------|
| `--color-border` | `#cbd5e1` (slate-300) | Bordes de inputs, botones outline |
| `--color-border-light` | `#e2e8f0` (slate-200) | Bordes de cards |
| `--color-border-glass` | `rgba(255, 255, 255, 0.2)` | Bordes glassmorphism |

#### Colores Semánticos: Éxito

| Token Semántico | Valor Actual | Uso Principal |
|----------------|--------------|---------------|
| `--color-success` | `#16a34a` (green-600) | Botones de éxito |
| `--color-success-hover` | `#15803d` (green-700) | Hover de botones de éxito |
| `--color-success-focus` | `#22c55e` (green-500) | Focus rings de éxito |
| `--color-success-light` | `#f0fdf4` (green-50) | Fondos de alertas de éxito |
| `--color-success-lighter` | `#dcfce7` (green-100) | Fondos de badges verdes |
| `--color-success-text` | `#166534` (green-800) | Texto en badges verdes |
| `--color-success-border` | `#bbf7d0` (green-200) | Bordes de alertas de éxito |

#### Colores Semánticos: Error/Danger

| Token Semántico | Valor Actual | Uso Principal |
|----------------|--------------|---------------|
| `--color-danger` | `#dc2626` (red-600) | Botones destructivos |
| `--color-danger-hover` | `#b91c1c` (red-700) | Hover de botones destructivos |
| `--color-danger-focus` | `#ef4444` (red-500) | Focus rings de error |
| `--color-danger-light` | `#fef2f2` (red-50) | Fondos de alertas de error |
| `--color-danger-lighter` | `#fee2e2` (red-100) | Fondos de badges rojos |
| `--color-danger-text` | `#991b1b` (red-800) | Texto en badges rojos |
| `--color-danger-border` | `#fecaca` (red-200) | Bordes de alertas de error |
| `--color-danger-border-input` | `#fca5a5` (red-300) | Bordes de inputs con error |

#### Colores Semánticos: Advertencia

| Token Semántico | Valor Actual | Uso Principal |
|----------------|--------------|---------------|
| `--color-warning` | `#eab308` (yellow-600) | Elementos de advertencia |
| `--color-warning-light` | `#fefce8` (yellow-50) | Fondos de alertas de advertencia |
| `--color-warning-border` | `#fef08a` (yellow-200) | Bordes de alertas de advertencia |

### Tipografía

| Token Semántico | Valor Actual | Uso Principal |
|----------------|--------------|---------------|
| `--font-family-base` | `Arial, Helvetica, sans-serif` | Fuente base del sistema |
| `--font-size-xs` | `0.75rem` (12px) | Badges, etiquetas pequeñas |
| `--font-size-sm` | `0.875rem` (14px) | Inputs, botones, texto secundario |
| `--font-size-base` | `1rem` (16px) | Texto normal |
| `--font-size-lg` | `1.125rem` (18px) | Títulos de secciones |
| `--font-size-xl` | `1.25rem` (20px) | Títulos medianos |
| `--font-size-2xl` | `1.5rem` (24px) | Títulos grandes |
| `--font-size-3xl` | `1.875rem` (30px) | Números grandes |
| `--font-weight-regular` | `400` | Texto normal |
| `--font-weight-medium` | `500` | Botones, badges, texto destacado |
| `--font-weight-semibold` | `600` | Títulos de secciones |
| `--font-weight-bold` | `700` | Títulos principales |

### Border Radius

| Token Semántico | Valor Actual | Uso Principal |
|----------------|--------------|---------------|
| `--radius-sm` | `0.375rem` (6px) | Elementos pequeños |
| `--radius-md` | `0.5rem` (8px) | Botones, inputs (rounded-lg) |
| `--radius-lg` | `0.75rem` (12px) | Cards medianas (rounded-xl) |
| `--radius-xl` | `1rem` (16px) | Cards grandes, modales (rounded-2xl) |
| `--radius-full` | `9999px` | Badges, elementos circulares |

### Sombras

| Token Semántico | Valor Actual | Uso Principal |
|----------------|--------------|---------------|
| `--shadow-sm` | `shadow-sm` | Cards secundarias, header |
| `--shadow-md` | `shadow-md` | Hover en cards |
| `--shadow-lg` | `shadow-lg` | Cards principales |
| `--shadow-xl` | `shadow-xl` | Modales, elementos flotantes |

---

## Plan de Implementación

### Paso 1: Definir CSS Variables en `globals.css`
- Crear todas las variables CSS con los valores actuales
- Mapear a Tailwind usando `@theme` para compatibilidad

### Paso 2: Actualizar `ui-constants.ts`
- Reemplazar valores hardcodeados por referencias a tokens
- Mantener compatibilidad con código existente

### Paso 3: Refactorizar Componentes Base (incremental)
- Button: Usar tokens para colores
- Card: Usar tokens para fondos y bordes
- Input: Usar tokens para bordes y focus

### Paso 4: Verificación
- Asegurar que no hay cambios visuales
- Verificar compatibilidad con dark mode existente

---

## Notas Importantes

1. **Sin cambios visuales**: Cada token mapea exactamente al valor actual
2. **Refactor progresivo**: No todos los componentes se actualizan de inmediato
3. **Compatibilidad**: El código existente sigue funcionando
4. **Preparación**: Base para futuras mejoras (MD3, accesibilidad, personalización)


