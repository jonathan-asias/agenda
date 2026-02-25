# Reporte: Mejora de arquitectura del sistema UI

**Fecha:** 16 de febrero de 2025  
**Rol:** Arquitecto Frontend Senior (SaaS)  
**Objetivo:** Profesionalizar el sistema UI en `src/components/ui/` sin romper nada ni cambiar lógica; solo mejorar arquitectura.

---

## Resumen ejecutivo

Se ha introducido una capa de **design tokens** (`src/design/tokens.ts`), se han actualizado **Button** y **Card** para usarlos (sin colores hardcodeados), y se han creado **componentes de layout** y **formularios** reutilizables. Todo es compatible con el código existente: no se ha modificado lógica ni comportamiento.

---

## PASO 1 — Design tokens

**Creado:** `src/design/tokens.ts`

- **colors:** Referencias a variables CSS ya definidas en `globals.css`:
  - `primary`, `primaryHover`, `primaryFocus`
  - `secondary`, `secondaryHover`, `secondaryFocus`
  - `background`, `surface`, `surfaceNested`, `surfaceGlass`
  - `text`, `textSecondary`, `textInverse`
  - `border`, `borderLight`, `borderGlass`
  - `danger`, `dangerHover`, `dangerFocus`
  - `success`, `successHover`, `successFocus`
- **radius:** Valores fijos para bordes (sm: 6px, md: 10px, lg: 16px).

Para que `var(--surface)` y `var(--text)` existan, se añadieron en `globals.css` los alias:

- `--surface: var(--color-surface);`
- `--text: var(--color-text-primary);`

Así los tokens no dependen de colores hardcodeados y la única fuente de verdad sigue siendo `globals.css`.

---

## PASO 2 — Button con tokens

**Actualizado:** `src/components/ui/Button.tsx`

- **Colores:** Todas las variantes usan variables CSS en lugar de clases tipo `bg-blue-600`:
  - `primary` → `var(--color-primary)`, `var(--color-primary-hover)`, `var(--color-primary-focus)`
  - `secondary` → `var(--color-secondary)` y sus estados
  - `destructive` → `var(--color-danger)` y estados
  - `success` → `var(--color-success)` y estados
  - `outline` / `ghost` → `var(--color-surface)`, `var(--color-border)`, `var(--color-text-secondary)`, etc.
- **Radius:** El `border-radius` se aplica por tamaño desde `tokens.radius` (sm/md/lg) vía `style`, para no mezclar con clases arbitrarias y mantener una sola fuente de verdad para el radio.

La API del componente (props, variantes, tamaños) no cambia; solo la implementación interna usa tokens.

---

## PASO 3 — Card con tokens

**Actualizado:** `src/components/ui/Card.tsx`

- **Fondos y bordes:** Sustitución de clases hardcodeadas por variables CSS:
  - `default` / `outlined` → `bg-[var(--color-surface)]`, `border-[var(--color-border-light)]`
  - `elevated` → `bg-[var(--color-surface-glass)]`, `border-[var(--color-border-glass)]`
  - `nested` → `bg-[var(--color-surface-nested)]`, `border-[var(--color-border-light)]`
- **Radius:** `border-radius` con `tokens.radius.lg` (default/elevated/outlined) y `tokens.radius.md` (nested), aplicado por `style`.
- **CardHeader:** Títulos y subtítulos usan `var(--color-text-primary)` y `var(--color-text-secondary)`.

Comportamiento y API de Card y CardHeader se mantienen.

---

## PASO 4 — Layout

**Creado:** `src/components/layout/`

| Archivo      | Descripción |
|-------------|-------------|
| **Layout.tsx** | Layout principal: slots opcionales `header`, `sidebar`, `main` (children), `footer`. Columna central flexible; sidebar opcional a la izquierda (oculta en móvil con `hidden lg:block`). Fondo `var(--color-background)`. |
| **Header.tsx** | Barra superior (LayoutHeader): contenido principal + slot `actions` a la derecha. Fondo y borde con variables CSS. Exportado como `LayoutHeader` para no chocar con el Header de la app. |
| **Sidebar.tsx** | Barra lateral: ancho fijo, borde y fondo con tokens. Pensado para ser usado dentro del slot `sidebar` de Layout. |
| **Footer.tsx** | Barra inferior (LayoutFooter): fondo y texto con variables CSS. Exportado como `LayoutFooter`. |

Uso típico:

```tsx
import { Layout, LayoutHeader, Sidebar, LayoutFooter, Container } from '@/components/layout';

<Layout header={<LayoutHeader actions={...}>Título</LayoutHeader>} sidebar={<Sidebar>...</Sidebar>} footer={<LayoutFooter>...</LayoutFooter>}>
  <Container><p>Contenido</p></Container>
</Layout>
```

No reemplazan de forma automática los Header/Footer actuales de la app; son piezas nuevas para usar donde convenga.

---

## PASO 5 — Container

**Creado:** `src/components/layout/Container.tsx`

- Contenedor con ancho máximo y padding horizontal estándar (`px-4 sm:px-6 lg:px-8`).
- **size:** `narrow` (max-w-3xl), `default` (max-w-7xl), `wide` (max-w-[1600px]).
- Exportado desde `@/components/layout` junto con Layout, Header, Sidebar, Footer.

Sirve para centrar y limitar el ancho del contenido dentro de Layout o en cualquier página.

---

## PASO 6 — Form y FormField

**Creado:** `src/components/ui/Form.tsx` y `FormField.tsx`

- **Form:** Envuelve el contenido en un `<form>` con `space-y-4`. Acepta todas las props nativas de formulario (`onSubmit`, etc.) y `className`. No añade lógica de validación ni envío.
- **FormField:** Envuelve un campo con:
  - `label` opcional (con `htmlFor` si se pasa `id`)
  - `children` (Input, select, etc.)
  - `error` y `hint` opcionales
  - `required` (muestra * en rojo usando token danger)

Colores de label, error y hint usan `var(--color-text-secondary)` y `var(--color-danger)`, `var(--color-text-tertiary)`.

Exportados desde `@/components/ui` junto con Button, Input, Card, etc.

---

## PASO 7 — No romper nada

- **Lógica:** No se ha cambiado ningún flujo, estado ni regla de negocio.
- **Páginas existentes:** Siguen usando los mismos componentes (Button, Card, etc.) con la misma API; solo cambia la implementación interna a tokens.
- **Compatibilidad:** Los alias `--surface` y `--text` en `globals.css` hacen que cualquier uso futuro de estos nombres siga alineado con el sistema actual.

Recomendación: ejecutar `npm run build` y las pruebas existentes para validar que todo sigue en verde.

---

## Estructura final relevante

```
src/
├── design/
│   └── tokens.ts              # Tokens (colors, radius)
├── components/
│   ├── layout/
│   │   ├── index.ts
│   │   ├── Layout.tsx
│   │   ├── Header.tsx         # Exportado como LayoutHeader
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx         # Exportado como LayoutFooter
│   │   └── Container.tsx
│   └── ui/
│       ├── index.ts           # Incluye Form, FormField
│       ├── Button.tsx         # Usa tokens
│       ├── Card.tsx           # Usa tokens
│       ├── Form.tsx
│       ├── FormField.tsx
│       └── ... (resto sin cambios)
```

---

## Cómo seguir profesionalizando

1. **Ir migrando más componentes UI** (Input, Modal, Badge, etc.) a variables CSS referenciadas desde `tokens` o directamente `var(--color-*)`, sin cambiar APIs.
2. **Usar Layout + Container** en nuevas pantallas o al refactorizar páginas para unificar estructura.
3. **Form + FormField** en formularios nuevos o al sustituir bloques label+input+error repetidos.
4. **Ampliar `tokens.ts`** con espaciado, sombras o tipografía si se quiere centralizar más el diseño en un solo archivo.

Todo lo anterior se puede hacer de forma incremental sin romper el comportamiento actual.
