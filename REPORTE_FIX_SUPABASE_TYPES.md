# Reporte: Corrección de tipos Supabase Client

**Fecha:** 20 de febrero de 2025  
**Objetivo:** Corregir el tipado del cliente Supabase, eliminar errores de tipos y preparar para producción en Vercel.

---

## 1. Problema corregido

**Error original:**
```ts
Type 'SupabaseClient<any, any, GenericSchema>' is not assignable to type 'SupabaseClient<any, "public">'
```

Ocurría porque los clientes no usaban un tipo `Database` explícito, generando incompatibilidad entre el tipo genérico por defecto y el esperado en algunos usos.

---

## 2. Cambios realizados

### 2.1 `src/types/supabase.ts` (nuevo)

- **Exportado:** `Database` y `Json`.
- **Database:** Definición mínima compatible con `createClient<Database>` y `createBrowserClient<Database>`:
  - `public.Tables`, `Views`, `Functions`, `Enums` como estructuras base.
- **Uso en producción:** Se puede reemplazar el contenido con los tipos generados por Supabase CLI:
  ```bash
  npx supabase gen types typescript --project-id <PROJECT_ID> > src/types/supabase.ts
  ```

### 2.2 `src/lib/supabase.ts`

- **Antes:** `SupabaseClient` sin genérico (por defecto `any`).
- **Después:**
  - Import de `Database` desde `@/types/supabase`.
  - `createClient<Database>` y `createBrowserClient<Database>`.
  - Variable y retornos tipados como `SupabaseClient<Database>`.
- **Mantenido:** `getSupabaseClient()`, `tryGetSupabaseClient()`, `isSupabaseConfigured()`, uso de `createBrowserClient` en el navegador y `createClient` en servidor para no romper auth ni cookies.

### 2.3 `src/lib/supabase-server.ts`

- Import de `Database` desde `@/types/supabase`.
- Uso de `createServerClient<Database>(...)` con el mismo tipo `Database`.

### 2.4 `src/lib/supabase-admin.ts`

- Import de `Database`.
- `createSupabaseAdminClient` y retornos de `getSupabaseAdminClient` / `tryGetSupabaseAdminClient` tipados como `SupabaseClient<Database>`.

---

## 3. Archivos modificados

| Archivo | Acción |
|---------|--------|
| `src/types/supabase.ts` | Creado (tipos `Database` y `Json`) |
| `src/lib/supabase.ts` | Tipado con `Database`, misma API pública |
| `src/lib/supabase-server.ts` | Uso de `createServerClient<Database>` |
| `src/lib/supabase-admin.ts` | Tipado con `SupabaseClient<Database>` |

**No modificados (compatibilidad):**  
AuthContext, API routes, branding, login, registro siguen usando `getSupabaseClient()` / `getSupabaseAdminClient()` / `createServerSupabaseClient()` sin cambios de interfaz.

---

## 4. Verificaciones

- No existe uso de `SupabaseClient<any, "public">` en el proyecto.
- Ningún archivo se ha cambiado para usar un literal `"public"` en el genérico.
- Lógica de negocio, auth, branding y APIs se mantienen; solo se ajustó el tipado.

---

## 5. Código final de `src/lib/supabase.ts`

```ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';
import { env } from '@/lib/env';

let supabaseClient: SupabaseClient<Database> | null = null;

export const isSupabaseConfigured = (): boolean =>
  Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

function createSupabaseClient(): SupabaseClient<Database> {
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (typeof window !== 'undefined') {
    return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
  }
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}

export function getSupabaseClient(): SupabaseClient<Database> {
  if (!supabaseClient) {
    supabaseClient = createSupabaseClient();
  }
  return supabaseClient;
}

export function tryGetSupabaseClient(): SupabaseClient<Database> | null {
  try {
    return getSupabaseClient();
  } catch {
    return null;
  }
}
```

**Nota:** Se mantiene `getSupabaseClient()` (y no un único export `supabase`) para no romper AuthContext, login, registro y branding, que dependen de esta API.

---

## 6. Compatibilidad con Vercel

- **Build:** Next.js y Prisma no dependen del tipo `Database`; el build es compatible.
- **Runtime:** Misma configuración de env (NEXT_PUBLIC_SUPABASE_*, etc.); sin cambios de comportamiento.
- **SSR / cookies:** Sigue usándose `createBrowserClient` en cliente y `createServerClient` en servidor; el tipado con `Database` no afecta a Vercel.

El proyecto queda listo para desplegar en Vercel con los tipos de Supabase corregidos.
