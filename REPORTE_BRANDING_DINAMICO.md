# Reporte: Branding dinámico conectado a design tokens

**Objetivo:** Conectar el branding de la institución (guardado en BD) con el sistema de design tokens para que los colores se apliquen automáticamente en toda la app.

---

## Contexto

- **Design tokens:** `src/design/tokens.ts` y variables CSS en `globals.css` (`--color-primary`, `--color-secondary`, etc.).
- **Branding en BD:** La tabla de instituciones tiene `color_primario` y `color_secundario`. La API `GET /api/instituciones/[id]/branding` devuelve `color_primario`, `color_secundario`, `logoUrl`, `bannerUrl`.

---

## 1. `src/lib/applyBranding.ts`

### Función `applyBranding(branding)`

- **Entrada:** Objeto con colores primario y secundario:
  - `primaryColor` / `colorPrimario`
  - `secondaryColor` / `colorSecundario`
- **Comportamiento:** En el cliente (`document.documentElement`), asigna las variables CSS usadas por los tokens y por los componentes:
  - **Primario:** `--color-primary`, `--color-primary-hover`, `--color-primary-focus`, `--color-primary-light`, `--color-primary-lighter`, `--color-primary-text`.
  - **Secundario:** `--color-secondary`, `--color-secondary-hover`, `--color-secondary-focus`, `--color-secondary-light`, `--color-secondary-text`.
  - **Fondo:** `--color-background` (derivado del secundario para coherencia de tema).

Para colores en hex (`#RRGGBB`) se calculan automáticamente variantes más oscuras (hover) y más claras (focus, light) para mantener contraste y usabilidad. Si el valor no es hex, se usa el mismo valor para todas las variantes.

### Función `resetBranding()`

- Restaura todas las variables anteriores a los valores por defecto del proyecto (azul/slate originales).
- Se usa al cerrar sesión para volver al tema neutro.

### Seguridad SSR

- Ambas funciones comprueban `typeof document === 'undefined'` y no hacen nada en servidor, evitando errores en SSR.

---

## 2. Uso en AuthContext

- **Dónde:** `src/contexts/AuthContext.tsx`.
- **Cuándo:** Cuando existe `institutionId` (usuario logueado y asociado a una institución).
- **Qué se hace:**
  - Un `useEffect` depende de `institutionId`.
  - Si hay `institutionId`, se llama a `GET /api/instituciones/${institutionId}/branding`.
  - Con la respuesta se llama a `applyBranding({ colorPrimario, colorSecundario })`.
- **Cierre de sesión:**
  - En `signOut()` se llama a `resetBranding()` después de limpiar usuario e institución.
  - En el listener de `onAuthStateChange`, cuando no hay sesión se llama a `resetBranding()` al poner `institutionId` a `null`.

Con esto, al iniciar sesión y tener institución se aplica el branding; al cerrar sesión se restaura el tema por defecto.

---

## 3. Uso en login

- **Dónde:** `src/app/login/page.tsx`.
- **Cuándo:** En la página de login, si ya hay sesión y por tanto `institutionId` en el contexto (ej. usuario que vuelve a la ruta de login).
- **Qué se hace:**
  - Se usa `useAuth()` para leer `institutionId`.
  - Un `useEffect` con dependencia `[institutionId]` hace fetch a `/api/instituciones/${institutionId}/branding` y llama a `applyBranding(...)` con los colores devueltos.

Así, la pantalla de login también muestra los colores de la institución cuando el usuario ya está autenticado.

---

## 4. No romper lógica ni diseño

- **Lógica:** No se ha cambiado flujo de login, guards, ni obtención de institución. Solo se añaden efectos que aplican o resetean variables CSS.
- **Diseño:** Los componentes siguen usando las mismas variables CSS (`var(--color-primary)`, etc.). Si no hay branding aplicado, siguen viendo los valores por defecto de `globals.css`. El cambio es solo el valor de esas variables en runtime cuando hay institución y branding desde la BD.

---

## 5. Flujo resumido

1. Usuario inicia sesión → AuthContext obtiene `institutionId` → fetch branding → `applyBranding()` → variables CSS actualizadas → toda la app (Button, Card, fondos, etc.) usa los colores de la institución.
2. Usuario cierra sesión → `resetBranding()` → variables CSS vuelven al default.
3. Usuario ya logueado entra en `/login` → `institutionId` existe → fetch branding en login → `applyBranding()` → la propia pantalla de login usa los colores de la institución.

---

## Archivos tocados

| Archivo | Cambio |
|--------|--------|
| `src/lib/applyBranding.ts` | **Nuevo.** `applyBranding()`, `resetBranding()`, tipos y helpers hex. |
| `src/contexts/AuthContext.tsx` | Import de applyBranding/resetBranding; useEffect que aplica branding cuando hay institutionId; resetBranding en signOut y cuando no hay sesión. |
| `src/app/login/page.tsx` | Import de useAuth y applyBranding; useEffect que aplica branding cuando hay institutionId en login. |

No se ha modificado la estructura de la BD, ni las APIs, ni la UI de los componentes; solo se ha conectado el branding de la institución con el sistema de design tokens existente.
