# Reporte: Fix endpoints generalizados — Aislamiento por sesión

**Fecha:** 26 de febrero de 2025  
**Problema:** Una materia creada en Institución B aparecía en el dashboard de Institución A. Los listados dependían del `institucionId` enviado por el frontend (URL o query), manipulable.

**Objetivo:** Que **todo** el filtrado dependa **exclusivamente** de `getAuthInstitutionId(req)`. Cero dependencia de query params ni del frontend para decidir qué datos se devuelven.

---

## 1. Endpoints corregidos

### Dashboard (origen del bug: materias/áreas visibles entre instituciones)

| Archivo | Cambio |
|--------|--------|
| `src/app/api/instituciones/[id]/dashboard/route.ts` | Todos los `count()` y `findMany()` (áreas, materias, grados, cursos, docentes, estudiantes) pasan a usar **solo** `userInstitutionId` (sesión). El `id` de la URL se usa solo para `enforceTenant` (que la ruta sea de la misma institución del usuario), no para filtrar datos. |

### GET de materias y áreas (setup)

| Archivo | Cambio |
|--------|--------|
| `src/app/api/setup/materias/[institucionId]/route.ts` | `findMany` ahora usa `where: { institucion_id: userInstitutionId }`. El parámetro de URL solo se usa para `enforceTenant`, no para el filtro de datos. |
| `src/app/api/setup/areas/[institucionId]/route.ts` | Mismo patrón: `where: { institucion_id: userInstitutionId }`. |

### Otros listados

| Archivo | Cambio |
|--------|--------|
| `src/app/api/setup/grados/[institucionId]/route.ts` | `findMany` grados con `where: { institucion_id: userInstitutionId }`. |
| `src/app/api/setup/materias-grados/[institucionId]/route.ts` | `findMany` con `materia: { institucion_id: userInstitutionId }`. |
| `src/app/api/recordatorios/by-institucion/[institucionId]/route.ts` | `findMany` con `docente: { institucion_id: userInstitutionId }`. |
| `src/app/api/instituciones/[id]/administradores/route.ts` | GET: `findMany` con `institucion_id: userInstitutionId`. |

### Eliminación de dependencia del frontend (query params)

| Archivo | Cambio |
|--------|--------|
| `src/app/api/estudiantes/by-curso/[cursoId]/route.ts` | **Eliminado** el uso de `searchParams.get('institucionId')`. El listado de estudiantes por curso usa solo `userInstitutionId` en el `where` (`curso_id`, `institucion_id: userInstitutionId`, `activo: true`). Import de `enforceTenant` eliminado (ya no se usa). |

---

## 2. Patrón aplicado

En todos los GET de listado:

1. `const userInstitutionId = await getAuthInstitutionId(req);`
2. `if (!userInstitutionId) return Response.json({ error: "Unauthorized" }, { status: 401 });`
3. En los `findMany` / `count`: **siempre** `where: { institucion_id: userInstitutionId }` (o equivalente por relación, p. ej. `docente: { institucion_id: userInstitutionId }`).

El `institucionId` (o `id`) que viene en la **URL** se sigue usando solo para:

- Validar que la ruta corresponde a la institución del usuario: `enforceTenant(userInstitutionId, institucionIdFromUrl)`.
- Devolver 403 si el usuario intenta acceder a la URL de otra institución.

**Los datos devueltos se filtran siempre por la sesión (`userInstitutionId`), no por el parámetro de la URL.**

---

## 3. Prohibición de uso de datos del frontend para filtrar

- **No** se usa `req.nextUrl.searchParams.get("institucionId")` para decidir qué datos se devuelven.
- **No** se confía en el `institucionId` del body o de la URL para el `where` de los listados; solo para `enforceTenant` cuando aplica.

En `estudiantes/by-curso/[cursoId]` se eliminó por completo la lectura de `institucionId` desde query params.

---

## 4. Frontend (FASE 7)

- Las páginas siguen llamando a `/api/instituciones/${institucionId}/dashboard`, `/api/setup/areas/${institucionId}`, `/api/setup/materias/${institucionId}`, etc., con el `id` de la ruta.
- **No es necesario cambiar el frontend:** el backend ignora ese id para el contenido de la respuesta y usa solo la sesión. Si el usuario está en la URL de otra institución, `enforceTenant` responde 403.

---

## 5. Confirmación de aislamiento

- **Institución A** solo ve sus materias, áreas, grados, cursos, docentes, estudiantes y recordatorios: todos los listados se filtran por `userInstitutionId`.
- **Institución B** solo ve los suyos.
- Sesiones distintas (p. ej. incógnito vs normal) no comparten datos: cada una obtiene los datos de la institución asociada a su sesión.
- No hay dependencia de `institucionId` enviado por el cliente para los listados; todo se resuelve con `getAuthInstitutionId(req)`.

**No se ha modificado:** branding, auth global ni configuración de Supabase; solo la lógica de los endpoints de listado y el uso de query params.
