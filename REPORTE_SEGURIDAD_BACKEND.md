# Reporte: Seguridad SaaS multi-tenant en Backend

**Fecha:** 20 de febrero de 2025  
**Objetivo:** Implementar seguridad multi-tenant en el backend para prevenir acceso cruzado entre instituciones.

---

## 1. Resumen

Se implementó el helper `enforceTenant` y se aplicó en todas las API routes críticas. El backend ahora valida que el usuario autenticado solo acceda a recursos de su propia institución.

**Regla aplicada:** Antes de devolver o modificar datos, se verifica que `resource.institucionId === userInstitutionId`. Nunca se confía en el frontend.

---

## 2. Archivos creados

| Archivo | Descripción |
|---------|-------------|
| `src/lib/tenant.ts` | `enforceTenant()`, `getAuthInstitutionId()`, `requireAuthInstitutionId()`, `tenantErrorToResponse()` |
| `src/lib/supabase-server.ts` | Cliente Supabase para servidor (lee sesión desde cookies) |

---

## 3. Helper `src/lib/tenant.ts`

```ts
export function enforceTenant(
  userInstitutionId: number,
  resourceInstitutionId: number
): void
```

- Lanza `TenantAccessDeniedError` si no coinciden.
- Previene acceso cruzado.

```ts
export async function getAuthInstitutionId(request?: NextRequest): Promise<number | null>
```

- Obtiene el `institutionId` del usuario autenticado desde la sesión (cookies).
- Retorna `null` si no hay sesión o no se pudo determinar la institución.
- Orden de búsqueda: administrador → docente → institución.

---

## 4. APIs protegidas

### Instituciones
| Ruta | Métodos | Verificación |
|------|---------|--------------|
| `/api/instituciones/[id]` | GET, PUT, DELETE | `enforceTenant(userInstitutionId, params.id)` |
| `/api/instituciones/[id]/branding` | GET, PUT | `enforceTenant(userInstitutionId, institucionId)` |
| `/api/instituciones/[id]/dashboard` | GET | `enforceTenant(userInstitutionId, institucionId)` |
| `/api/instituciones/[id]/perfil` | PUT | `enforceTenant(userInstitutionId, institucionId)` |
| `/api/instituciones/[id]/administradores` | GET, POST | `enforceTenant(userInstitutionId, institucionId)` |
| `/api/instituciones/[id]/administradores/[adminId]` | DELETE, PUT | `enforceTenant(userInstitutionId, administrador.institucion_id)` |

### Administradores
| Ruta | Métodos | Verificación |
|------|---------|--------------|
| `/api/administradores/by-email/[email]` | GET | `enforceTenant(userInstitutionId, administrador.institucion_id)` |

### Docentes
| Ruta | Métodos | Verificación |
|------|---------|--------------|
| `/api/docentes/[id]` | DELETE, PUT | `enforceTenant(userInstitutionId, docente.institucion_id)` |
| `/api/docentes/by-email/[email]` | GET | `enforceTenant(userInstitutionId, docente.institucion_id)` |

### Estudiantes
| Ruta | Métodos | Verificación |
|------|---------|--------------|
| `/api/estudiantes/[id]` | GET, PUT, DELETE | `enforceTenant(userInstitutionId, estudiante.institucion_id)` |
| `/api/estudiantes/by-curso/[cursoId]` | GET | `enforceTenant(userInstitutionId, institucionId)` |

### Cursos
| Ruta | Métodos | Verificación |
|------|---------|--------------|
| `/api/cursos/[id]` | DELETE | `enforceTenant(userInstitutionId, curso.institucion_id)` |

### Recordatorios
| Ruta | Métodos | Verificación |
|------|---------|--------------|
| `/api/recordatorios` | POST | `enforceTenant(userInstitutionId, docente.institucion_id)` |
| `/api/recordatorios/[id]` | PATCH, DELETE | `enforceTenant(userInstitutionId, docente.institucion_id)` |
| `/api/recordatorios/by-institucion/[institucionId]` | GET | `enforceTenant(userInstitutionId, institucionId)` |
| `/api/recordatorios/by-docente/[docenteId]` | GET | `enforceTenant(userInstitutionId, docente.institucion_id)` |

### Setup
| Ruta | Métodos | Verificación |
|------|---------|--------------|
| `/api/setup/areas/[institucionId]` | GET | `enforceTenant(userInstitutionId, id)` |
| `/api/setup/grados/[institucionId]` | GET | `enforceTenant(userInstitutionId, institucionIdNum)` |
| `/api/setup/materias/[institucionId]` | GET | `enforceTenant(userInstitutionId, institucionId)` |
| `/api/setup/materias-grados/[institucionId]` | GET | `enforceTenant(userInstitutionId, institucionId)` |
| `/api/setup/docentes` | POST | `enforceTenant(userInstitutionId, institucionId)` |
| `/api/setup/estudiantes` | POST | `enforceTenant(userInstitutionId, institucionId)` |
| `/api/setup/materias` | POST | `enforceTenant(userInstitutionId, institucionId)` |
| `/api/setup/grados-cursos` | POST | `enforceTenant(userInstitutionId, institucionId)` |
| `/api/setup/areas-materias` | POST | `enforceTenant(userInstitutionId, institucionId)` |
| `/api/setup/materia-grados` | POST | `enforceTenant(userInstitutionId, institucionId)` |

---

## 5. APIs pendientes / exentas (por diseño)

| Ruta | Motivo |
|------|--------|
| `/api/auth/*` | Login, reset password, check-email, get-user-institution: no requieren tenant |
| `/api/instituciones` (POST) | Registro de nueva institución: endpoint público |
| `/api/instituciones/by-email/[email]` | Usado en login para determinar tipo de usuario: requiere revisión* |
| `/api/auth/reset-password/validate/[token]` | Validación de token: no requiere sesión |
| `/api/auth/reset-password/reset` | Reset de contraseña: no requiere sesión activa |

\* `instituciones/by-email` devuelve datos de institución por email. Podría exponer información a usuarios no autenticados. Considerar restringir si es sensible.

---

## 6. Cambios adicionales

### Cliente Supabase (`src/lib/supabase.ts`)
- En el navegador se usa `createBrowserClient` de `@supabase/ssr` para almacenar la sesión en cookies, permitiendo que el servidor lea la sesión en API routes.

### Dependencia
- Añadido `@supabase/ssr` en `package.json`. Ejecutar `npm install` para instalarlo.

---

## 7. Flujo de seguridad

1. El frontend (con `createBrowserClient`) almacena la sesión en cookies.
2. Las API routes llaman a `getAuthInstitutionId(request)` que:
   - Crea un cliente Supabase servidor que lee cookies.
   - Obtiene el usuario con `supabase.auth.getUser()`.
   - Busca el `institutionId` por email (admin, docente o institución).
3. Si no hay sesión → `401 Unauthorized`.
4. Se obtiene el recurso y su `institucion_id` (o equivalente).
5. Se llama a `enforceTenant(userInstitutionId, resourceInstitutionId)`.
6. Si no coinciden → `403 Forbidden` (vía `TenantAccessDeniedError`).
7. Si todo es correcto → se devuelve el dato.

---

## 8. Archivos modificados

- `package.json` – añadido `@supabase/ssr`
- `src/lib/supabase.ts` – uso de `createBrowserClient` en navegador
- `src/lib/supabase-server.ts` – nuevo
- `src/lib/tenant.ts` – nuevo
- `src/app/api/instituciones/[id]/route.ts`
- `src/app/api/instituciones/[id]/branding/route.ts`
- `src/app/api/instituciones/[id]/dashboard/route.ts`
- `src/app/api/instituciones/[id]/perfil/route.ts`
- `src/app/api/instituciones/[id]/administradores/route.ts`
- `src/app/api/instituciones/[id]/administradores/[adminId]/route.ts`
- `src/app/api/administradores/by-email/[email]/route.ts`
- `src/app/api/docentes/[id]/route.ts`
- `src/app/api/docentes/by-email/[email]/route.ts`
- `src/app/api/estudiantes/[id]/route.ts`
- `src/app/api/estudiantes/by-curso/[cursoId]/route.ts`
- `src/app/api/cursos/[id]/route.ts`
- `src/app/api/recordatorios/route.ts`
- `src/app/api/recordatorios/[id]/route.ts`
- `src/app/api/recordatorios/by-institucion/[institucionId]/route.ts`
- `src/app/api/recordatorios/by-docente/[docenteId]/route.ts`
- `src/app/api/setup/areas/[institucionId]/route.ts`
- `src/app/api/setup/grados/[institucionId]/route.ts`
- `src/app/api/setup/materias/[institucionId]/route.ts`
- `src/app/api/setup/materias-grados/[institucionId]/route.ts`
- `src/app/api/setup/docentes/route.ts`
- `src/app/api/setup/estudiantes/route.ts`
- `src/app/api/setup/materias/route.ts`
- `src/app/api/setup/grados-cursos/route.ts`
- `src/app/api/setup/areas-materias/route.ts`
- `src/app/api/setup/materia-grados/route.ts`

---

## 9. Funcionalidad preservada

- No se modificó la UX.
- No se modificó la lógica de negocio.
- Solo se añadió la validación de tenant antes de devolver o modificar datos.
- El frontend debe tener sesión válida (cookies) para acceder a las APIs protegidas.
