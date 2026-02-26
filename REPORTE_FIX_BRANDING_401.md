# Reporte: Fix error 401 en API Branding

## Problema detectado

- **Error:** `401 Unauthorized` en `GET /api/instituciones/[id]/branding`.
- **Causa:** La ruta exigía autenticación (`getAuthInstitutionId`) para leer el branding. En entornos como Vercel (o cuando la sesión no llega en la petición), eso devolvía 401 y bloqueaba la carga de logo/banner/colores.
- **Contexto:** El branding (logo, banner, colores) es dato público por institución; la lectura no debe depender de sesión. La escritura (PUT) sí debe seguir protegida por tenant.

## Archivos modificados

| Archivo | Cambios |
|--------|---------|
| `src/lib/supabase-admin.ts` | Añadida función `createAdminClient()` que usa `NEXT_PUBLIC_SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`, con `persistSession: false` y `autoRefreshToken: false`. Se mantienen `getSupabaseAdminClient` y el resto del módulo. |
| `src/app/api/instituciones/[id]/branding/route.ts` | Import de `createAdminClient` desde `@/lib/supabase-admin`. Eliminado el `createClient` local y `getSupabaseAdminClient` duplicado. **GET:** ya no requiere autenticación; usa solo `createAdminClient()` para generar signed URLs con SERVICE ROLE. **PUT:** sigue usando `getAuthInstitutionId` y `enforceTenant`. Añadido `console.error('Error branding upload:', error)` en ambos `catch`. |

## Storage

- Uso de `.storage.from(bucket)` con `bucket` definido por `SUPABASE_STORAGE_BUCKET` / `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET` o por defecto `'instituciones'`. No se ha cambiado el nombre del bucket (se deja el existente).

## Variables de entorno

- **Requeridas en `.env.local` y en Vercel:**
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
- No se han modificado valores; solo verificación. Si `.env.local` no está en el repo, hay que configurarlas en el panel de Vercel.

## Resultado

- **GET** `/api/instituciones/[id]/branding`: responde **200 OK** sin requerir sesión; permite cargar logo, banner y colores en login y en todas las vistas.
- **PUT** sigue protegido: solo la institución autenticada puede actualizar su branding (multi-tenant intacto).
- Supabase Storage se usa exclusivamente con cliente SERVICE ROLE en esta API; no se usa `supabase.auth.getUser()`.
- Build local: `npm run build` completado correctamente.

## Compatibilidad

- SaaS multi-tenant mantenido: PUT con enforceTenant; GET público por `id` de institución.
- No se ha tocado auth general, cliente público de Supabase ni otras APIs.
