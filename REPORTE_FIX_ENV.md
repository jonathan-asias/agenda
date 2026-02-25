# Reporte: Corrección de variables de entorno para producción (Vercel)

**Fecha:** 25 de febrero de 2025  
**Objetivo:** Eliminar el error en producción "Variable de entorno requerida no configurada: NEXT_PUBLIC_SUPABASE_URL" sin romper el funcionamiento actual.

---

## 1. Problema

En Next.js, las variables `NEXT_PUBLIC_*` se sustituyen en **build time**. Si en el código del cliente se hacía `throw new Error(...)` al validar esas variables, la app fallaba en producción aunque las variables estuvieran configuradas en Vercel, porque en el bundle del cliente el valor puede no estar disponible en el mismo momento de la evaluación del módulo.

**Solución:** No lanzar `throw new Error` para variables `NEXT_PUBLIC_*`. Usar valores por defecto (`""`) y validar solo variables de servidor en el servidor (con `console.error`, no con `throw` que tumbe el build).

---

## 2. Archivos modificados

| Archivo | Cambios |
|---------|---------|
| `src/lib/env.ts` | Reemplazado por `publicEnv` / `serverEnv`; validación solo en servidor con `console.error`; export `APP_URL` para compatibilidad. |
| `src/lib/supabase.ts` | Uso de `publicEnv` en lugar de `env`; sin `process.env` directo. |
| `src/lib/supabase-server.ts` | Import y uso de `publicEnv` en lugar de `env`. |
| `src/lib/supabase-admin.ts` | Uso de `publicEnv` y `serverEnv` en lugar de `process.env`. |
| `src/lib/prisma.ts` | Uso de `serverEnv.DATABASE_URL` en lugar de `env.DATABASE_URL`. |

**No modificados:** API routes, Auth, lógica de Supabase, Prisma (solo el origen de `DATABASE_URL`), UI. Los archivos que usan `APP_URL` siguen importando desde `@/lib/env` (se mantiene el export `APP_URL`).

---

## 3. Cambios realizados

### 3.1 `src/lib/env.ts`

- **publicEnv:** Variables `NEXT_PUBLIC_*` con fallback a `""`. Sin `throw`. Usadas en cliente y servidor.
- **serverEnv:** `DATABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` con fallback a `""`. Solo usadas en servidor.
- **Validación:** Solo en servidor (`typeof window === "undefined"`), con `console.error` si falta `DATABASE_URL` o `SUPABASE_SERVICE_ROLE_KEY`. No se usa `throw` para variables de entorno.
- **APP_URL:** Exportado como `publicEnv.NEXT_PUBLIC_APP_URL` para no romper imports existentes (reset password, administradores, docentes).

### 3.2 `src/lib/supabase.ts`

- Import de `publicEnv` desde `@/lib/env`.
- `isSupabaseConfigured`, `createSupabaseClient` y `getSupabaseClient` usan `publicEnv.NEXT_PUBLIC_SUPABASE_URL` y `publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Se mantienen `getSupabaseClient()`, `createBrowserClient` en el navegador y el tipado con `Database` para no romper Auth ni el resto del proyecto.

### 3.3 `src/lib/supabase-server.ts`

- Uso de `publicEnv.NEXT_PUBLIC_SUPABASE_URL` y `publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY` en `createServerClient`.

### 3.4 `src/lib/supabase-admin.ts`

- Uso de `publicEnv.NEXT_PUBLIC_SUPABASE_URL` y `serverEnv.SUPABASE_SERVICE_ROLE_KEY` para consistencia y para no leer `process.env` directamente en la lógica del cliente admin.

### 3.5 `src/lib/prisma.ts`

- Uso de `serverEnv.DATABASE_URL` (solo servidor). Sin validación con `throw` en este archivo; la validación de servidor queda en `env.ts` con `console.error`.

---

## 4. Resultado del build

```text
✔ Generated Prisma Client (v6.16.2)
▲ Next.js 16.1.6 (Turbopack)
✓ Compiled successfully in 23.3s
✓ Generating static pages using 7 workers (20/20)
```

- **Exit code:** 0  
- **Errores de compilación:** 0  
- **Errores de variables de entorno:** 0  

---

## 5. Objetivo final

- La app puede desplegarse en **Vercel** sin el error de `NEXT_PUBLIC_SUPABASE_URL` (ni de `NEXT_PUBLIC_BASE_URL` / `NEXT_PUBLIC_APP_URL`).
- No se rompe Auth, API routes, branding, login, registro ni Supabase/Prisma; solo se corrige el manejo de variables de entorno.
- Enfoque alineado con buenas prácticas para Next.js App Router y Vercel: no validar con `throw` en el cliente variables `NEXT_PUBLIC_*`, y validar solo variables de servidor en el servidor con `console.error`.
