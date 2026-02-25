# Reporte de duplicados

**Fecha:** 16 de febrero de 2025  
**Alcance:** Componentes, interfaces y tipos duplicados o repetidos.

---

## 1. Interfaces duplicadas (misma forma en varios archivos)

### 1.1 BrandingData

Definida dos veces con forma casi idéntica:

| Archivo | Uso |
|---------|-----|
| `src/app/institucion/[id]/perfil/page.tsx` | `logoUrl`, `bannerUrl`, `colorPrimario`, `colorSecundario` (requeridos) |
| `src/app/institucion/[id]/Header.tsx` | Misma forma; en Header `colorPrimario`/`colorSecundario` son opcionales (`string \| null`) |

**Recomendación:** Unificar en `src/types` (p. ej. `src/types/branding.ts`) con campos opcionales donde aplique, e importar en ambos archivos. No aplicado en esta optimización para no modificar lógica.

---

### 1.2 Administrador (vista de administrador logueado)

Definida tres veces con la misma estructura:

| Archivo | Línea aprox. |
|---------|----------------|
| `src/contexts/UnifiedAuthContext.tsx` | 9 |
| `src/app/institucion/[id]/admin/perfil/page.tsx` | 11 |
| `src/app/institucion/[id]/admin/AdminDashboardContent.tsx` | 13 |

Estructura común: `id`, `nombre`, `apellido`, `correo`, `cargo`, `institucion: { id, nombre }`, `sede?: { id, nombre }`.

**Nota:** En `src/types/institucion.ts` existe `InstitucionAdministrador`, que es distinto (incluye `telefono`, `email`, `sede_id`, etc.). No sustituye a esta interfaz de “administrador en sesión”.

**Recomendación:** Crear un tipo en `src/types` (p. ej. `AdministradorSession` o reutilizar nombre `Administrador`) y usarlo en los tres archivos. No aplicado en esta optimización para no modificar lógica.

---

## 2. Interfaces con variantes (mismo nombre, forma distinta)

### 2.1 CursoResumen

- **`src/app/institucion/[id]/admin/grados/page.tsx`:** `id`, `nombre`, `jornada?`
- **`src/app/institucion/[id]/admin/cursos/page.tsx`:** `id`, `nombre`, `jornada?`, `grado?`, `_count?`

Son variantes por contexto (lista en grados vs lista en cursos). No son duplicados exactos; unificar requeriría un tipo base + extensiones.

---

## 3. Interfaces locales (una sola definición por archivo)

Definidas una vez y usadas solo en ese archivo; no se consideran duplicados:

- `MateriaResumen` (materias/page.tsx)
- `EstudianteResumen` (estudiantes/page.tsx)
- `DocenteResumen` (docentes/page.tsx)
- `AreaResumen` (areas/page.tsx)
- `GradoResumen` (grados/page.tsx)
- Props de modales y guards (`*ModalProps`, `*AuthGuardProps`, etc.)

---

## 4. Componentes duplicados

No se detectaron componentes con el mismo nombre o la misma implementación en distintos archivos. Los nombres de componentes son únicos por ruta/uso.

---

## 5. Resumen

| Tipo | Cantidad | Acción sugerida (futura) |
|------|----------|---------------------------|
| Interfaces duplicadas exactas | 2 (BrandingData, Administrador) | Mover a `src/types` e importar |
| Interfaces con variantes | 1 (CursoResumen) | Opcional: tipo base en `src/types` |
| Componentes duplicados | 0 | — |

En esta optimización no se ha modificado lógica ni imports; solo se documentan duplicados para una posible refactor posterior.
