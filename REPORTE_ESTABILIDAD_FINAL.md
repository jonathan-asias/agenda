# Reporte de estabilidad final — Producción profesional

**Fecha:** 16 de febrero de 2025  
**Objetivo:** Auditar la aplicación para garantizar que esté lista para producción.  
**Alcance:** AUTH, BRANDING, API, UI, ENV, SECURITY. Sin modificación de lógica sin confirmar.

---

## 1. AUTH

### 1.1 Login

| Aspecto | Estado | Detalle |
|--------|--------|---------|
| **Flujo** | ✅ | Login en `src/app/login/page.tsx`: Supabase `signInWithPassword`, luego redirección según tipo (institución / administrador / docente) vía APIs by-email. |
| **Validación** | ✅ | Email (regex, longitud, caracteres peligrosos), contraseña (longitud 8–128), sanitización de entrada. |
| **Mensajes de error** | ✅ | Errores de Supabase traducidos (credenciales inválidas, email no confirmado, etc.); errores mostrados en UI. |
| **Loading** | ✅ | `loading` durante submit; botón deshabilitado y spinner "Iniciando sesión...". |
| **Tipos de usuario** | ✅ | Radio: institución, administrador, docente; redirección a `/institucion/{id}`, `/institucion/{id}/admin`, `/institucion/{id}/docente`. |

### 1.2 Logout

| Aspecto | Estado | Detalle |
|--------|--------|---------|
| **signOut** | ✅ | `AuthContext.signOut()` llama a `supabase.auth.signOut()`, limpia `user` e `institutionId`, llama a `resetBranding()`. |
| **Sin cliente** | ✅ | Si Supabase no está configurado, se limpia estado y se hace `resetBranding()` sin lanzar. |
| **UI** | ✅ | Header institucional usa `signOut` en el menú de cierre de sesión. |

### 1.3 Refresh de sesión

| Aspecto | Estado | Detalle |
|--------|--------|---------|
| **Supabase** | ✅ | El cliente de Supabase (anon key) gestiona por defecto el refresh del token; no hay lógica custom de refresh. |
| **Inicial** | ✅ | Al montar, `getSession()` obtiene la sesión actual y actualiza `user` e `institutionId`. |
| **Cambios** | ✅ | `onAuthStateChange` actualiza estado en login/logout/refresh. |

### 1.4 Persistencia de sesión

| Aspecto | Estado | Detalle |
|--------|--------|---------|
| **Supabase** | ✅ | Persistencia por defecto (localStorage) del cliente; no se desactiva en el cliente anon. |
| **AuthProvider** | ✅ | Envolviendo toda la app en `layout.tsx`; estado `user`/`institutionId` se rehidrata desde sesión al cargar. |
| **isMounted** | ✅ | Los guards esperan `isMounted` antes de decidir redirección para evitar flash en SSR/hidratación. |

### 1.5 Roles

| Aspecto | Estado | Detalle |
|--------|--------|---------|
| **Distinción** | ✅ | Login distingue institución / administrador / docente y redirige a rutas distintas. |
| **Contexto** | ⚠️ | AuthContext expone `user` e `institutionId`; no expone un "rol" explícito (admin vs institución vs docente). El rol se infiere por ruta y por APIs by-email. |
| **Guards** | ✅ | InstitucionAuthGuard (cualquier usuario logueado), AdminAuthGuard (user + institutionId), DocenteAuthGuard (user + verificación por API de que el docente pertenece a la institución de la ruta). |

**Recomendación (opcional):** Exponer `role: 'institucion' | 'administrador' | 'docente' | null` en AuthContext derivado de la primera API by-email que responda, para simplificar guards y UI. No aplicado para no modificar lógica sin confirmar.

---

## 2. BRANDING

### 2.1 Carga correcta

| Aspecto | Estado | Detalle |
|--------|--------|---------|
| **AuthContext** | ✅ | Cuando hay `institutionId`, `useEffect` hace GET `/api/instituciones/{id}/branding` y llama a `applyBranding({ colorPrimario, colorSecundario })`. |
| **applyBranding** | ✅ | `src/lib/applyBranding.ts`: asigna `--color-primary`, `--color-secondary` y variantes (hover, focus, light, background) en `document.documentElement`. Acepta hex y deriva variantes. |
| **Login** | ✅ | En login, si hay `institutionId` (usuario ya logueado), se hace fetch de branding y se aplica. |
| **SSR** | ✅ | `applyBranding` y `resetBranding` comprueban `typeof document === 'undefined'` y no ejecutan en servidor. |
| **Cancelación** | ✅ | Efectos usan `cancelled` para evitar aplicar branding tras desmontaje. |

### 2.2 Reset correcto

| Aspecto | Estado | Detalle |
|--------|--------|---------|
| **resetBranding()** | ✅ | Restaura todas las variables CSS de branding a valores por defecto (azul/slate). |
| **signOut** | ✅ | Se llama a `resetBranding()` en `signOut()` y cuando no hay sesión en `onAuthStateChange`. |
| **Sin sesión** | ✅ | Al poner `institutionId` a `null` se llama a `resetBranding()`. |

---

## 3. API

### 3.1 try/catch

| Aspecto | Estado | Detalle |
|--------|--------|---------|
| **Rutas auditadas** | ✅ | Todas las rutas en `src/app/api` que se revisaron usan `try { ... } catch (error) { ... }` en el handler. |
| **Respuestas** | ✅ | En catch se suele devolver 500 con mensaje genérico y `console.error` del error real. |
| **get-user-institution** | ✅ | En error devuelve 200 con `institutionId: null` para no generar 404/5xx en consola durante login. |

### 3.2 Validaciones

| Aspecto | Estado | Detalle |
|--------|--------|---------|
| **IDs** | ✅ | Rutas con `[id]` o `[institucionId]` parsean y validan (isNaN, etc.) y devuelven 400 si es inválido. |
| **Body** | ✅ | Donde aplica se valida presencia y tipo de campos (ej. email en get-user-institution, body en POST/PUT). |
| **404** | ✅ | Recursos no encontrados devuelven 404 con mensaje (ej. institución, docente). |
| **Autorización** | ⚠️ | Las APIs no verifican que el usuario autenticado tenga derecho a ese recurso; asumen que el frontend (guards) restringe el acceso. Ver sección SECURITY. |

---

## 4. UI

### 4.1 Loading states

| Aspecto | Estado | Detalle |
|--------|--------|---------|
| **Auth guards** | ✅ | InstitucionAuthGuard, AdminAuthGuard, DocenteAuthGuard muestran spinner y mensaje ("Verificando acceso...", "Verificando autenticación...") mientras `loading` o `verifying`. |
| **Páginas** | ✅ | Páginas con fetch (ej. institución, estudiantes, docentes, grados, cursos) usan estado `loading` y muestran LoaderPage o skeleton/spinner. |
| **Modales** | ✅ | Modales de creación (AddGradoModal, AddCursoModal, etc.) deshabilitan botón y muestran spinner en submit. |
| **Login** | ✅ | Botón "Iniciando sesión..." con spinner durante submit. |

### 4.2 Errores visibles

| Aspecto | Estado | Detalle |
|--------|--------|---------|
| **Login** | ✅ | `error` y `validationErrors` se muestran en pantalla (bloque rojo, mensajes por campo). |
| **Páginas** | ✅ | Mensajes tipo "Error al cargar...", "No se pudieron cargar los estudiantes", etc., en texto rojo o bloque de error. |
| **Modales** | ✅ | Errores de API en formularios (ej. "Error al crear el grado") mostrados dentro del modal. |
| **Notificaciones** | ✅ | Uso de SweetAlert2 / `showError` en varias pantallas para errores críticos. |

---

## 5. ENV

### 5.1 Variables necesarias

| Variable | Uso | Obligatoria |
|----------|-----|-------------|
| **DATABASE_URL** | Prisma (`src/lib/prisma.ts`) | ✅ Sí; error al cargar si falta. |
| **NEXT_PUBLIC_SUPABASE_URL** | Cliente Supabase (auth, cliente anon) | ✅ Sí para auth. |
| **NEXT_PUBLIC_SUPABASE_ANON_KEY** | Cliente Supabase | ✅ Sí para auth. |
| **SUPABASE_SERVICE_ROLE_KEY** | Supabase admin (branding signed URLs, etc.) | ✅ Sí para branding con storage y operaciones server-side. |
| **NEXT_PUBLIC_APP_URL** | Enlaces de recuperación de contraseña, redirects | ✅ Sí; `env.ts` lanza si falta. |
| **SUPABASE_URL** | Algunas APIs (branding); fallback a NEXT_PUBLIC_SUPABASE_URL | Opcional si está la pública. |
| **SUPABASE_STORAGE_BUCKET** / **NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET** | Bucket de storage (logos, banners) | Opcional; default `instituciones`. |

**Recomendación:** Documentar en README o en `.env.example` las variables anteriores y marcar las obligatorias para producción.

---

## 6. SECURITY — Proteger rutas

### 6.1 Guards en frontend

| Ruta / Área | Guard | Comportamiento |
|-------------|--------|----------------|
| `/institucion/[id]` (dashboard, perfil, config) | InstitucionAuthGuard | Exige `user`; si no hay, redirige a `/login`. Muestra loading mientras verifica. |
| `/institucion/[id]/admin/*` | AdminAuthGuard | Exige `user` e `institutionId`; si falta alguno, redirige a `/login`. |
| `/institucion/[id]/docente/*` | DocenteAuthGuard | Exige `user` y verifica por API que el docente pertenece a la institución `params.id`; si no, redirige a `/login`. |

### 6.2 Gaps identificados (sin cambiar lógica)

| Gap | Severidad | Descripción |
|-----|-----------|-------------|
| **InstitucionAuthGuard no comprueba institución** | Media | Solo comprueba que haya `user`. No verifica que `institutionId` del contexto coincida con `params.id`. Un usuario logueado (cualquier institución) podría acceder a `/institucion/999` y ver datos de otra institución si conoce la URL. **Recomendación:** Añadir comprobación `institutionId === Number(params.id)` y redirigir a `/login` o a `/institucion/${institutionId}` si no coincide. |
| **AdminAuthGuard no comprueba params.id** | Media | Comprueba `user` e `institutionId` pero no que `institutionId === Number(params.id)`. Un admin de institución 1 podría intentar acceder a `/institucion/2/admin`. **Recomendación:** Redirigir a `/institucion/${institutionId}/admin` si `params.id` no coincide con `institutionId`. |
| **APIs sin autorización** | Media | Las rutas API (dashboard, instituciones, docentes, etc.) no reciben token ni sesión y no comprueban que el solicitante tenga derecho al recurso. La protección depende del frontend. **Recomendación (producción):** Añadir middleware o comprobación en cada ruta sensible (ej. cabecera de sesión o token, y verificar que el usuario/rol tenga acceso al recurso). |

### 6.3 Lo que sí está bien

- DocenteAuthGuard sí verifica que el docente pertenezca a la institución de la ruta.
- Login sanitiza y valida entrada; no se modifican contraseñas en cliente.
- Supabase gestiona sesión y tokens; no hay almacenamiento manual de credenciales.

---

## 7. Resumen ejecutivo

| Área | Estado global | Acción sugerida |
|------|----------------|------------------|
| **AUTH** | ✅ Estable | Opcional: exponer rol en contexto. |
| **BRANDING** | ✅ Estable | Ninguna. |
| **API** | ✅ try/catch y validaciones | Producción: añadir autorización en rutas sensibles. |
| **UI** | ✅ Loading y errores visibles | Ninguna. |
| **ENV** | ✅ Definidas y usadas | Documentar en README/.env.example. |
| **SECURITY** | ⚠️ Gaps en guards y API | Reforzar InstitucionAuthGuard y AdminAuthGuard con comprobación de `params.id`; planificar autorización en API. |

**Conclusión:** La aplicación está en buen estado para avanzar hacia producción. Los puntos críticos para “producción profesional” son: (1) que los guards de institución y admin verifiquen que la ruta corresponde al usuario actual, y (2) que las APIs sensibles verifiquen autorización. No se ha modificado lógica en esta auditoría; solo se documentan hallazgos y recomendaciones.
