# Reporte: Fix Multi-Tenant — Aislamiento por Institución

**Fecha:** 26 de febrero de 2025  
**Objetivo:** Aislamiento multi-tenant real y seguro. Ninguna institución puede ver o modificar datos de otra.

---

## 1. Modelos Prisma (FASE 1)

**Estado:** ✅ Verificado — sin cambios en schema.

Todos los modelos de dominio ya tenían `institucion_id` y relación con `Instituciones` con `onDelete: Cascade`:

| Modelo       | Campo           | Relación                         |
|-------------|-----------------|-----------------------------------|
| Sedes       | institucion_id  | Instituciones (Cascade)          |
| Administradores | institucion_id | Instituciones (Cascade)      |
| Grados      | institucion_id  | Instituciones (Cascade)          |
| Cursos      | institucion_id  | Instituciones (Cascade)          |
| Areas       | institucion_id  | Instituciones (Cascade)          |
| Materias    | institucion_id  | Instituciones (Cascade)          |
| Docentes    | institucion_id  | Instituciones (Cascade)          |
| Estudiantes | institucion_id  | Instituciones (Cascade)          |

No se modificó el schema para no romper migraciones existentes.

---

## 2. Creación de registros (FASE 2)

**Estado:** ✅ Verificado y asegurado.

- **`getAuthInstitutionId(request)`** ya existía en `src/lib/tenant.ts` y se usa en todas las rutas que crean datos.
- Todos los `create` de Área, Materia, Curso, Grado, Docente y Estudiante usan `institucion_id` obtenido tras validar con `enforceTenant(userInstitutionId, institucionId)` cuando el body trae `institucionId`, o directamente `userInstitutionId` cuando aplica.

**Rutas de creación revisadas:**

- `src/app/api/setup/areas-materias/route.ts` — Áreas y Materias con `institucion_id: institucionId` (tras enforceTenant).
- `src/app/api/setup/grados-cursos/route.ts` — Grados y Cursos con `institucion_id: institucionId`.
- `src/app/api/setup/materias/route.ts` — Áreas y Materias con `institucion_id: institucionId`.
- `src/app/api/setup/estudiantes/route.ts` — Estudiantes con `institucion_id: institucionId`.
- `src/app/api/setup/docentes/route.ts` — Docentes con `institucion_id: institucionId`.

---

## 3. Filtro en GET / findMany (FASE 3)

**Estado:** ✅ Corregido donde faltaba.

- **`src/app/api/recordatorios/route.ts`:** Se añadió `institucion_id: userInstitutionId` al `findMany` de estudiantes que valida estudiantes seleccionados para un recordatorio, para que solo se consideren estudiantes de la institución del usuario.

El resto de `findMany` de áreas, materias, cursos, grados, docentes y estudiantes ya filtraban por `institucion_id` (en dashboard, setup por institución, etc.).

---

## 4. Enforce tenant en API routes (FASE 4)

**Estado:** ✅ Ya implementado.

Todas las rutas que tocan datos por institución:

1. Obtienen `authInstitutionId` con `getAuthInstitutionId(req)`.
2. Si es `null`, responden `401 Unauthorized`.
3. Usan ese id (o validan con `enforceTenant` cuando el cliente envía `institucionId`).

No se modificó auth global ni configuración de Supabase.

---

## 5. Protección de UPDATE y DELETE (FASE 5)

**Estado:** ✅ Aplicado en todas las rutas afectadas.

- **Estudiantes `[id]`:**
  - GET: `findFirst({ where: { id, institucion_id: userInstitutionId } })`.
  - PUT: `update({ where: { id, institucion_id: userInstitutionId }, data: ... })`.
  - DELETE: `findFirst` con `institucion_id` y `delete({ where: { id, institucion_id: userInstitutionId } })`.

- **Docentes `[id]`:**
  - PUT: `update({ where: { id, institucion_id: userInstitutionId }, data: ... })`.
  - DELETE: `findFirst` con `institucion_id` y `delete({ where: { id, institucion_id: userInstitutionId } })`.

- **Cursos `[id]`:**
  - DELETE: ya no usa `institucionId` del query; se usa solo `userInstitutionId` de la sesión. `findFirst({ where: { id, institucion_id: userInstitutionId } })` y `delete({ where: { id, institucion_id: userInstitutionId } })`.

- **Recordatorios `[id]`:**
  - PATCH y DELETE: se usa `findFirst({ where: { id, docente: { institucion_id: userInstitutionId } } })` para asegurar que el recordatorio pertenece a la institución del usuario antes de actualizar o eliminar.

---

## 6. Wizard (FASE 6)

**Estado:** ✅ Revisado.

- `SetupWizard` recibe `institucionId` como prop y lo envía en todas las llamadas de creación (áreas-materias, grados-cursos, materias, estudiantes, docentes).
- Las APIs de setup validan con `enforceTenant(userInstitutionId, institucionId)` antes de usar ese `institucionId` en creaciones.
- No se modificó branding ni flujo global del wizard.

---

## 7. Resumen de archivos tocados

| Archivo | Cambios |
|--------|---------|
| `src/app/api/recordatorios/route.ts` | Filtro `institucion_id: userInstitutionId` en findMany de estudiantes. |
| `src/app/api/estudiantes/[id]/route.ts` | findFirst/update/delete con `institucion_id`; GET con findFirst por tenant. |
| `src/app/api/docentes/[id]/route.ts` | findFirst con `institucion_id`; update/delete con `id` + `institucion_id`. |
| `src/app/api/cursos/[id]/route.ts` | DELETE usa solo `userInstitutionId` (no query param); findFirst y delete con `institucion_id`. |
| `src/app/api/recordatorios/[id]/route.ts` | PATCH/DELETE con findFirst por `docente.institucion_id`; eliminado import no usado. |

---

## 8. Confirmación de seguridad SaaS

- **Institución A** no puede ver datos de **B**: todos los listados y lecturas por id filtran por `institucion_id` del usuario autenticado.
- **Institución B** no puede ver datos de **A**: mismo criterio.
- Creaciones: siempre con `institucion_id` validado (o desde sesión o con `enforceTenant`).
- Actualizaciones y eliminaciones: solo permitidas cuando el recurso pertenece a la institución del usuario (`where: { id, institucion_id: userInstitutionId }` o equivalente vía relación docente).

Sistema listo para aislamiento multi-tenant a nivel de institución en las entidades Área, Materia, Curso, Grado, Docente y Estudiante (y recordatorios vía docente).
