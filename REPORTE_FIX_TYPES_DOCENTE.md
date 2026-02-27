# Reporte: Corrección de tipado Docente / DocenteResumen

## Problema

Error en build de Vercel:

```
Type 'DocenteResumen | null' is not assignable to type 'Docente | null'.
```

El componente `ViewDocenteModal` esperaba `Docente | null` pero desde `page.tsx` (listado de docentes) se le pasaba `DocenteResumen | null`, ya que el listado usa la respuesta del dashboard (resumen) y no el tipo completo `Docente`.

---

## FASE 1 — Tipos identificados

### Docente (`src/types/docente.ts`)

- `id`, `nombres`, `apellidos`, `email`, `telefono` (obligatorio)
- `sede_id?`, `activo?`, `institucion?`, `sede?`
- `docenteAsignaciones?` con `grado` (id?, nombre, nivel), `curso` (id?, nombre, jornada?), `materia` (id?, nombre, area?)

### DocenteResumen (`src/app/institucion/[id]/admin/docentes/page.tsx`)

- `id`, `nombres`, `apellidos`, `email`
- `sede?` → `{ nombre: string }`
- `docenteAsignaciones` con `grado` (nombre, nivel), `curso` (nombre), `materia` (nombre)
- **No incluye** `telefono` ni `id` en grado/curso/materia de las asignaciones.

Conclusión: el modal de vista no necesita el tipo completo `Docente`; basta un tipo que acepte tanto `Docente` como `DocenteResumen` (con `telefono` opcional).

---

## FASE 2 — Cambios en ViewDocenteModal

**Archivo:** `src/app/institucion/[id]/admin/modals/ViewDocenteModal.tsx`

- Se dejó de usar `Docente | null` en la prop `docente`.
- Se definió y exportó el tipo **`DocenteParaVista`**:
  - `id`, `nombres`, `apellidos`, `email`
  - `telefono?`, `sede?` (opcionales para compatibilidad con `DocenteResumen`)
  - `docenteAsignaciones?` con `grado` (nombre, nivel opcional), `curso` (nombre), `materia` (nombre)
- La prop del modal quedó: `docente: DocenteParaVista | null`.
- En la UI, el teléfono se muestra como `docente.telefono ?? 'No indicado'`.
- El nivel del grado se muestra con comprobación: `asignacion.grado.nivel ? \` - ${asignacion.grado.nivel}\` : ''`.

Con esto, tanto `Docente` (dashboard) como `DocenteResumen` (página de listado) son asignables a `DocenteParaVista` sin usar `as Docente` ni `any`.

---

## FASE 3 — EditDocenteModal y fetch por ID

**EditDocenteModal** sigue recibiendo `docente: Docente | null` (tipo completo), porque necesita `telefono` y asignaciones con `id` en grado/curso/materia para el formulario de edición.

**Cambios en la página de docentes** (`src/app/institucion/[id]/admin/docentes/page.tsx`):

- Estado nuevo: `docenteParaEditar: Docente | null` y `loadingEditDocente`.
- Función **`openEditModal(docente: DocenteResumen)`**:
  - Al hacer clic en "Editar" no se abre el modal con el resumen.
  - Se hace **GET** `/api/docentes/${docente.id}` para obtener el docente completo.
  - Solo al recibir la respuesta se asigna el resultado a `docenteParaEditar` y se llama a `setShowEditModal(true)`.
- El modal de edición recibe `docente={docenteParaEditar}`.
- Al cerrar el modal se limpia `docenteParaEditar`.

**Nuevo endpoint GET** en `src/app/api/docentes/[id]/route.ts`:

- **GET** `/api/docentes/[id]`: devuelve el docente completo (mismo tenant), con:
  - `sede`, `docenteAsignaciones` incluyendo `grado` (id, nombre, nivel), `curso` (id, nombre, jornada), `materia` (id, nombre, area con id y nombre).
- Respuesta tipada como forma compatible con `Docente`; en tipos se usa **`DocenteGetResponse`** (extends `Docente`) para la respuesta del GET.
- En la página se usa `const data: DocenteGetResponse = await res.json(); setDocenteParaEditar(data);` sin `as Docente`.

---

## FASE 4 — DeleteDocenteModal

**Archivo:** `src/app/institucion/[id]/admin/modals/DeleteDocenteModal.tsx`

- El modal solo usa `docente.id`, `docente.nombres`, `docente.apellidos` para la petición DELETE y el mensaje de éxito.
- Se definió y exportó **`DocenteParaEliminar`**: `{ id: number; nombres: string; apellidos: string }`.
- La prop del modal quedó: `docente: DocenteParaEliminar | null`.
- Tanto `Docente` como `DocenteResumen` son asignables a `DocenteParaEliminar`.

---

## Resumen de archivos modificados

| Archivo | Cambio |
|--------|--------|
| `src/app/institucion/[id]/admin/modals/ViewDocenteModal.tsx` | Prop `docente: DocenteParaVista \| null`; tipo `DocenteParaVista`; telefono y nivel opcionales en UI. |
| `src/app/institucion/[id]/admin/modals/EditDocenteModal.tsx` | Sin cambio de tipo; sigue `Docente \| null`. |
| `src/app/institucion/[id]/admin/modals/DeleteDocenteModal.tsx` | Prop `docente: DocenteParaEliminar \| null`; tipo `DocenteParaEliminar`. |
| `src/app/institucion/[id]/admin/docentes/page.tsx` | Estado `docenteParaEditar`, `openEditModal` con fetch GET; `EditDocenteModal` recibe `docenteParaEditar`. |
| `src/app/api/docentes/[id]/route.ts` | Nuevo handler **GET** que devuelve docente completo con asignaciones. |
| `src/types/docente.ts` | Añadido `DocenteGetResponse extends Docente` para la respuesta del GET. |
| `src/types/index.ts` | Export de `DocenteGetResponse`. |

---

## Reglas respetadas

- No se usó `as Docente` en el flujo de datos (sí un tipo explícito `DocenteGetResponse` para la respuesta del GET).
- No se usó `any`.
- No se desactivó `strict` ni opciones de TypeScript.
- La arquitectura se mantiene: modales reciben tipos mínimos necesarios; la edición obtiene el docente completo por API.

---

## Verificación

- Ejecutar `npm run build` y confirmar que no hay errores de tipo.
- En la página de docentes: "Ver" con resumen; "Editar" cargando docente por ID y abriendo el modal con datos completos; "Eliminar" con resumen o docente completo.
