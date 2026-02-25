# Reporte: Seguridad SaaS multi-tenant

**Fecha:** 20 de febrero de 2025  
**Objetivo:** Convertir la aplicación en un SaaS multi-tenant seguro, eliminando acceso cruzado entre instituciones.

---

## 1. Gaps críticos corregidos

Se identificaron y corrigieron los siguientes riesgos:

| Guard | Problema | Riesgo |
|-------|----------|--------|
| **InstitucionAuthGuard** | No se verificaba que `params.id === institutionId` | Usuario de institución 1 podía acceder a `/institucion/2` |
| **AdminAuthGuard** | No se verificaba que `params.id === institutionId` | Admin de institución 1 podía acceder a `/institucion/2/admin` |
| **DocenteAuthGuard** | No se validaba explícitamente `docente.institucionId === params.id` | Posible acceso a rutas de otra institución |

**Regla aplicada:** La institución de la ruta (`params.id`) debe coincidir siempre con la institución del usuario/docente. Nunca se permite acceso cruzado.

---

## 2. Cambios realizados

### 2.1 Helper reutilizable: `src/lib/security.ts`

```ts
export function verifyInstitutionAccess(
  userInstitutionId: number | null | undefined,
  routeInstitutionId: string | number | null | undefined
): boolean
```

- **Uso:** Todos los guards de institución (InstitucionAuthGuard, AdminAuthGuard, DocenteAuthGuard).
- **Comportamiento:** Devuelve `true` solo cuando `userInstitutionId === routeInstitutionId` (comparación numérica).
- **Seguridad:** Devuelve `false` si alguno es `null`/`undefined` o si `routeInstitutionId` no es un número válido.

Centraliza el criterio para evitar inconsistencias entre guards.

### 2.2 InstitucionAuthGuard (`src/components/auth/InstitucionAuthGuard.tsx`)

- Se obtiene `params.id` con `useParams()` y `institutionId` del contexto de auth.
- **Verificación crítica:**  
  `institutionId !== Number(params.id)` **o** `!verifyInstitutionAccess(institutionId, params.id)` → acceso denegado.
- **Redirección:**  
  - Si el usuario tiene institución → `router.replace('/institucion/${institutionId}')`.  
  - Si no tiene institución → `router.push('/login')`.
- No se muestra contenido hasta que la verificación sea correcta.

### 2.3 AdminAuthGuard (`src/components/auth/AdminAuthGuard.tsx`)

- Misma lógica: `params.id` debe coincidir con la institución del admin.
- **Verificación:**  
  `institutionId !== Number(params.id)` **o** `!verifyInstitutionAccess(institutionId, params.id)` → redirigir.
- **Redirección:**  
  `router.replace('/institucion/${institutionId}/admin')` para enviar al admin a su propia institución.

### 2.4 DocenteAuthGuard (`src/components/auth/DocenteAuthGuard.tsx`)

- Se obtiene el docente por email (`/api/docentes/by-email/...`).
- **Identificación de institución del docente:**  
  `docente.institucion_id` (si la API lo expone) o `docente.institucion.id`.
- **Verificación crítica:**  
  `docenteInstitucionId === Number(params.id)` y `verifyInstitutionAccess(docenteInstitucionId, params.id)`.
- **Redirección:**  
  - Si el docente tiene institución pero la ruta no coincide → `router.replace('/institucion/${docenteInstitucionId}/docente')`.  
  - Si no hay institución válida → `router.push('/login')`.

Con esto se garantiza que un docente solo acceda a la ruta de su institución (`docente.institucionId === params.id`).

### 2.5 Aplicación en todos los guards

| Guard | Origen del ID de institución | Verificación | Redirección si no coincide |
|-------|------------------------------|--------------|----------------------------|
| InstitucionAuthGuard | `institutionId` (AuthContext) | `institutionId === Number(params.id)` + helper | `/institucion/${institutionId}` o `/login` |
| AdminAuthGuard | `institutionId` (AuthContext) | Igual | `/institucion/${institutionId}/admin` |
| DocenteAuthGuard | Docente por API (`institucion.id` / `institucion_id`) | `docenteInstitucionId === Number(params.id)` + helper | `/institucion/${docenteInstitucionId}/docente` o `/login` |

Todos usan `verifyInstitutionAccess` para un criterio único y evitan acceso cruzado.

---

## 3. Comportamiento antes / después

| Escenario | Antes (gap) | Después |
|-----------|-------------|---------|
| Usuario institución 1 abre `/institucion/2` | Podía ver contenido de institución 2 | Redirigido a `/institucion/1` |
| Admin institución 1 abre `/institucion/2/admin` | Podía ver admin de institución 2 | Redirigido a `/institucion/1/admin` |
| Docente institución 1 abre `/institucion/2/docente` | Riesgo de acceso cruzado | Redirigido a `/institucion/1/docente` |
| Usuario sin institución abre `/institucion/5` | Podía entrar si estaba logueado | Redirigido a `/login` |

---

## 4. Funcionalidad existente preservada

- Flujo de login/logout y persistencia de sesión sin cambios.
- Redirecciones post-login (institución / admin / docente) sin cambios.
- Loading y mensajes de los guards se mantienen.
- DocenteAuthGuard sigue validando por API que el docente exista; se añade la validación explícita de institución de la ruta.

---

## 5. Estructura de archivos

```
src/
├── lib/
│   └── security.ts              # verifyInstitutionAccess()
└── components/
    └── auth/
        ├── index.ts
        ├── InstitucionAuthGuard.tsx
        ├── AdminAuthGuard.tsx
        └── DocenteAuthGuard.tsx
```

Con estos cambios, la aplicación evita el acceso cruzado entre instituciones y cumple con un modelo SaaS multi-tenant seguro a nivel de rutas protegidas por estos guards.
