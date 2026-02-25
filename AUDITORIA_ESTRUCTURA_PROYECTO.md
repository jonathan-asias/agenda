# Auditoría de Estructura del Proyecto — Agenda Virtual

**Fecha de auditoría:** Febrero 2026  
**Alcance:** Estructura, organización, peso, escalabilidad y mantenibilidad  
**Metodología:** Análisis estático sin modificación de archivos

---

## SECCIÓN 1 — Estructura de carpetas

### Árbol completo desde `src/`

```
src/
├── app/
│   ├── api/
│   │   ├── administradores/
│   │   │   └── by-email/[email]/route.ts
│   │   ├── auth/
│   │   │   ├── check-email/route.ts
│   │   │   ├── get-user-institution/route.ts
│   │   │   └── reset-password/
│   │   │       ├── request/route.ts
│   │   │       ├── reset/route.ts
│   │   │       └── validate/[token]/route.ts
│   │   ├── cursos/[id]/route.ts
│   │   ├── docentes/
│   │   │   ├── by-email/[email]/route.ts
│   │   │   └── [id]/route.ts
│   │   ├── estudiantes/
│   │   │   ├── by-curso/[cursoId]/route.ts
│   │   │   └── [id]/route.ts
│   │   ├── instituciones/
│   │   │   ├── by-email/[email]/route.ts
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── administradores/
│   │   │       │   ├── route.ts
│   │   │       │   └── [adminId]/route.ts
│   │   │       ├── branding/route.ts
│   │   │       ├── dashboard/route.ts
│   │   │       ├── perfil/route.ts
│   │   │       └── route.ts
│   │   ├── recordatorios/
│   │   │   ├── by-docente/[docenteId]/route.ts
│   │   │   ├── by-institucion/[institucionId]/route.ts
│   │   │   ├── [id]/route.ts
│   │   │   └── route.ts
│   │   └── setup/
│   │       ├── areas/[institucionId]/route.ts
│   │       ├── areas-materias/route.ts
│   │       ├── docentes/route.ts
│   │       ├── estudiantes/route.ts
│   │       ├── grados/[institucionId]/route.ts
│   │       ├── grados-cursos/route.ts
│   │       ├── materia-grados/route.ts
│   │       ├── materias/route.ts
│   │       ├── materias/[institucionId]/route.ts
│   │       └── materias-grados/[institucionId]/route.ts
│   ├── institucion/[id]/
│   │   ├── AddAdministradorModal.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── InstitucionAuthGuard.tsx
│   │   ├── page.tsx
│   │   ├── admin/
│   │   │   ├── AddItemModal.tsx
│   │   │   ├── AdminAuthGuard.tsx
│   │   │   ├── AdminDashboardContent.tsx
│   │   │   ├── DashboardSections.tsx
│   │   │   ├── DashboardStats.tsx
│   │   │   ├── SetupWizard.tsx
│   │   │   ├── page.tsx
│   │   │   ├── modals/
│   │   │   │   ├── AddCursoModal.tsx
│   │   │   │   ├── AddDocenteModal.tsx
│   │   │   │   ├── AddEstudianteModal.tsx
│   │   │   │   ├── AddGradoModal.tsx
│   │   │   │   ├── AddMateriaModal.tsx
│   │   │   │   ├── DeleteDocenteModal.tsx
│   │   │   │   ├── DeleteEstudianteModal.tsx
│   │   │   │   ├── EditDocenteModal.tsx
│   │   │   │   ├── EditEstudianteModal.tsx
│   │   │   │   ├── ViewDocenteModal.tsx
│   │   │   │   └── ViewEstudianteModal.tsx
│   │   │   ├── areas/page.tsx
│   │   │   ├── cursos/page.tsx
│   │   │   ├── docentes/page.tsx
│   │   │   ├── estudiantes/page.tsx
│   │   │   ├── grados/page.tsx
│   │   │   ├── materias/page.tsx
│   │   │   └── perfil/page.tsx
│   │   ├── configuracion/page.tsx
│   │   ├── docente/
│   │   │   ├── AddRecordatorioModal.tsx
│   │   │   ├── DocenteAuthGuard.tsx
│   │   │   ├── DocenteDashboardContent.tsx
│   │   │   ├── EditRecordatorioModal.tsx
│   │   │   ├── ViewRecordatorioModal.tsx
│   │   │   ├── page.tsx
│   │   │   └── perfil/page.tsx
│   │   └── perfil/page.tsx
│   ├── login/page.tsx
│   ├── recuperar-contrasena/page.tsx
│   ├── registro-institucion/page.tsx
│   ├── resetear-contrasena/[token]/page.tsx
│   ├── test-auth/
│   │   ├── AuthGuard.tsx
│   │   ├── page.tsx
│   │   ├── TestAuthContent.tsx
│   │   └── TestAuthWrapper.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── UnifiedAuthGuard.tsx
├── components/
│   ├── landing/
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   └── HomeHero.tsx
│   └── ui/
│       ├── PhoneInputField.tsx
│       └── Skeleton.tsx
├── contexts/
│   ├── AuthContext.tsx
│   └── UnifiedAuthContext.tsx
├── generated/
│   └── prisma/   (vacío o generado; en .gitignore)
├── lib/
│   ├── env.ts
│   ├── notifications.ts
│   ├── prisma.ts
│   ├── supabase-admin.ts
│   ├── supabase.ts
│   └── ui-constants.ts
└── types/
    ├── curso.ts
    ├── docente.ts
    ├── estudiante.ts
    ├── grado.ts
    ├── index.ts
    ├── institucion.ts
    ├── recordatorio.ts
    └── sede.ts
```

### Carpetas bien organizadas

| Carpeta | Valoración |
|--------|------------|
| `src/app/api/` | Rutas API por dominio (auth, instituciones, recordatorios, setup) con segmentos dinámicos coherentes. |
| `src/lib/` | Utilidades compartidas (prisma, supabase, env, notifications) bien separadas. |
| `src/types/` | Tipos centralizados con barrel en `index.ts`. |
| `src/contexts/` | Contextos de autenticación en un solo lugar. |
| `src/components/landing/` y `src/components/ui/` | Separación landing vs UI reutilizable. |

### Carpetas / ubicaciones mejorables

| Ubicación | Observación |
|-----------|-------------|
| `src/app/institucion/[id]/` | Header.tsx y Footer.tsx están dentro de la ruta; podrían vivir en `components/` (p. ej. `components/institucion/`) para reutilizar y testear mejor. |
| `src/app/institucion/[id]/admin/modals/` | Muchos modales (12) en una sola carpeta; podría subdividirse por dominio (docentes, estudiantes, cursos, etc.). |
| `src/app/test-auth/` | Ruta de prueba/debug en `app/`; en producción convendría desactivarla o moverla fuera del bundle. |
| `src/generated/` | Carpeta presente (con `prisma` en .gitignore); vacía en repo. Aceptable si Prisma u otras herramientas la usan; si no, genera duda. |

### Archivos que no deberían estar en su ubicación actual

- **Ninguno crítico.** Los componentes en `app/institucion/[id]/` (Header, Footer, modales) son específicos de esa zona; su ubicación es discutible pero no incorrecta.
- **test-auth:** Carpeta de utilidad de desarrollo; no es código de producto. Aceptable si se excluye o se deshabilita en producción.

---

## SECCIÓN 2 — Peso del proyecto

### Peso total y por carpeta principal

| Carpeta        | Peso (bytes)   | Peso (aprox.) | % del total* |
|----------------|----------------|---------------|---------------|
| **Total proyecto** | 1 577 508 673 | ~1,47 GB      | 100 %         |
| node_modules   | 848 112 796    | ~808 MB       | 53,8 %        |
| .next          | 728 236 211    | ~694 MB       | 46,2 %        |
| src            | 1 129 774      | ~1,08 MB      | 0,07 %        |
| public         | 3 314          | ~3,2 KB       | &lt;0,01 %    |
| prisma         | 26 578         | ~26 KB        | &lt;0,01 %    |

\*Total = suma de las carpetas medidas (node_modules, .next, src, public, prisma).

### Peso dentro de `src/`

| Carpeta / zona | Peso (bytes) | Peso (aprox.) | % de src |
|----------------|--------------|---------------|----------|
| app            | 1 086 180    | ~1,04 MB      | ~96 %    |
| lib            | 24 261       | ~24 KB        | ~2,1 %   |
| components     | 6 350        | ~6,2 KB       | ~0,6 %   |
| contexts       | 8 741        | ~8,5 KB       | ~0,8 %   |
| types          | 4 242        | ~4,1 KB       | ~0,4 %   |

### Carpetas innecesariamente pesadas

- **node_modules** y **.next**: peso esperado en un proyecto Next.js con Prisma, Supabase, etc. No se detectan dependencias obviamente redundantes que expliquen un peso anómalo.
- **src/app**: concentra casi todo el peso de `src` por cantidad de páginas y componentes; el tamaño es alto pero coherente con la funcionalidad. El problema principal es la concentración en pocos archivos muy grandes (ver siguiente apartado).

### Archivos extremadamente grandes (en `src/`)

| Archivo | Tamaño (aprox.) | Líneas (aprox.) | Observación |
|---------|------------------|-----------------|-------------|
| `app/institucion/[id]/admin/SetupWizard.tsx` | 242,5 KB | ~5 100+ | Archivo crítico: demasiado grande; debería dividirse en pasos, hooks y subcomponentes. |
| `app/registro-institucion/page.tsx` | 73,5 KB | ~1 596 | Wizard de registro en un solo archivo; conviene extraer pasos y lógica. |
| `app/institucion/[id]/admin/AdminDashboardContent.tsx` | 49,9 KB | - | Dashboard con mucha lógica; candidato a extraer secciones y hooks. |
| `app/institucion/[id]/admin/DashboardSections.tsx` | 44,1 KB | - | Mucha UI; podría dividirse por sección (docentes, estudiantes, etc.). |
| `app/institucion/[id]/docente/DocenteDashboardContent.tsx` | 38,5 KB | - | Similar; extraer listados, filtros y modales. |

El resto de archivos se mantiene en rangos razonables (&lt;35 KB).

---

## SECCIÓN 3 — Detección de problemas

### Archivos duplicados

- **No se detectan archivos duplicados** (mismo contenido en dos rutas). Hay lógica repetida (ver reutilización) pero no copia exacta de archivos.

### Interfaces repetidas o muy similares

| Interface | Ubicaciones | Valoración |
|-----------|-------------|------------|
| **BrandingData** | `Header.tsx` (institucion), `perfil/page.tsx` | Duplicada; debería estar en `types/` y reutilizarse. |
| **CursoResumen** | `admin/grados/page.tsx`, `admin/cursos/page.tsx` | Definida dos veces con posible misma forma; unificar en `types/`. |
| **Administrador** (perfil admin) | `admin/perfil/page.tsx`, `admin/AdminDashboardContent.tsx`, `UnifiedAuthContext.tsx` | Tres definiciones locales; unificar en `types/` (o reusar si ya existe un tipo de administrador). |
| **GradoResumen**, **AreaResumen**, **MateriaResumen**, **EstudianteResumen**, **DocenteResumen** | Varias páginas de admin (grados, areas, materias, estudiantes, docentes) | Patrón de “resumen” repetido; centralizar en `types/` (p. ej. `api.ts` o por dominio). |
| **Area**, **Materia** (locales) | `EditDocenteModal.tsx`, `DashboardSections.tsx` | Interfaces locales que podrían alinearse con `types/` o con DTOs de API. |

### Componentes duplicados

- **Header / Footer:** Existen dos conjuntos con roles distintos y correctos:
  - **Landing:** `components/landing/Header.tsx`, `Footer.tsx` (login, registro-institucion, home).
  - **Institución:** `app/institucion/[id]/Header.tsx`, `Footer.tsx` (área institucional).
- No hay duplicación incorrecta; sí oportunidad de extraer a `components/institucion/` si se busca mayor reutilización y tests.

### Código muerto

- No se ha ejecutado un análisis estático exhaustivo (tree-shaking); no se reportan archivos completos claramente muertos.
- **test-auth:** Ruta de desarrollo; si no se usa en producción, podría considerarse “código muerto” en deploy.

### Archivos no utilizados

- **src/generated/prisma/:** En `.gitignore`; si el proyecto usa solo `@prisma/client` desde `node_modules`, la carpeta generada puede no usarse. Revisar configuración de Prisma (output de `generator`).

### Archivos temporales

- No se detectan archivos con nombres típicos de temporales (`.tmp`, `.temp`, `*.bak`) en `src/`.

### Archivos generados versionados por error

| Elemento | Estado |
|----------|--------|
| `.next/` | Correctamente en `.gitignore`. |
| `node_modules/` | Correctamente en `.gitignore`. |
| `src/generated/prisma/` | En `.gitignore`; no versionado. |
| `prisma/migrations/` | Incluido en `.gitignore`; las migraciones **no** se versionan. Riesgo: el resto del equipo o los despliegues podrían no tener el mismo historial de esquema. Conviene valorar versionar migraciones. |
| `tsconfig.tsbuildinfo` | No encontrado en `.gitignore`; si se genera, es buena práctica ignorarlo. |
| `dist/`, `build/`, `out/` | En `.gitignore`. |

---

## SECCIÓN 4 — Arquitectura

Evaluación para un **SaaS escalable** (multi-tenant por institución, Next.js App Router, API routes, Prisma, Supabase).

| Área | Estado | Comentario |
|------|--------|------------|
| **components/** | **Correcto** | Separación landing vs ui; uso de alias `@/`. Falta una capa opcional `components/institucion/` para Header/Footer de institución. |
| **lib/** | **Correcto** | Prisma, Supabase (cliente y admin), env, notificaciones y constantes UI bien separados. |
| **types/** | **Correcto** | Tipos de dominio centralizados y barrel; algunas interfaces siguen definidas en páginas/modales. |
| **contexts/** | **Correcto** | Auth y UnifiedAuth bien ubicados; dos contextos de auth pueden simplificarse a largo plazo. |
| **app/api/** | **Correcto** | Rutas por recurso e institución; uso de `institucionId`/segmentos dinámicos coherente con multi-institución. |
| **prisma/** | **Correcto** | Schema único; modelos alineados con dominios (Instituciones, Docentes, Estudiantes, Recordatorios, etc.). |
| **app/institucion/[id]/** | **Aceptable** | Estructura por rol (admin, docente, perfil, configuracion) es clara. Contiene muchos componentes que podrían vivir en `components/` para mejorar reutilización y tests. |
| **Modales en app/** | **Necesita mejora** | Gran cantidad de modales en `admin/modals/` sin subcarpetas por dominio; archivos muy grandes (SetupWizard, registro-institucion, dashboards). |
| **test-auth en app/** | **Necesita mejora** | Ruta de desarrollo expuesta en el mismo árbol que producción; debería estar deshabilitada o excluida en producción. |
| **Migrations no versionadas** | **Crítico** | `prisma/migrations/` en `.gitignore` impide reproducir el mismo esquema en todos los entornos; bloquea despliegues y trabajo en equipo de forma predecible. |

**Resumen arquitectura:** Base sólida para SaaS (multi-institución, API por recurso, tipos y lib ordenados). Puntos críticos: versionado de migraciones y tamaño de archivos; mejoras: organización de modales, extracción de componentes y manejo de test-auth.

---

## SECCIÓN 5 — Organización de tipos

### Centralización en `src/types/`

- **Correcto:** `curso`, `docente`, `estudiante`, `grado`, `institucion`, `recordatorio`, `sede` y barrel `index.ts`.
- Uso consistente de `@/types` en gran parte del código.

### Tipos mezclados en archivos TSX

- **SetupWizard.tsx:** `Curso`, `Materia`, `MateriaCurso`, `DocenteForm`, `EstudianteForm`, `AsignacionDocente` (y props) definidos en el mismo archivo.
- **Páginas admin:** `*Resumen` (GradoResumen, CursoResumen, AreaResumen, MateriaResumen, EstudianteResumen, DocenteResumen) en cada página.
- **Modales:** Varias interfaces de props y DTOs locales (AddDocenteModal, EditDocenteModal, DashboardSections, etc.).
- **Header / perfil:** `BrandingData` definida en dos sitios.
- **Contextos y admin:** `Administrador` definido en UnifiedAuthContext, admin/perfil y AdminDashboardContent.

### Oportunidades de mejora

1. Mover todos los tipos de dominio y DTOs de API a `src/types/` (o `src/types/api/`) y reutilizarlos en páginas y modales.
2. Unificar interfaces “Resumen” en tipos genéricos o por recurso (p. ej. `GradoResumen`, `CursoResumen`) en un único módulo.
3. Definir `BrandingData` una sola vez en `types/` e importarla en Header y perfil.
4. Unificar el tipo “Administrador” (perfil/contexto/dashboard) en un solo tipo en `types/` y reutilizarlo en contextos y páginas.

---

## SECCIÓN 6 — Reutilización de componentes

### Componentes ya reutilizados

- **PhoneInputField** (`components/ui/PhoneInputField.tsx`): Usado en AddDocenteModal, AddEstudianteModal, AddAdministradorModal, SetupWizard, registro-institucion.
- **Skeleton** (`components/ui/Skeleton.tsx`): Usado en varias páginas de admin (areas, cursos, docentes, estudiantes, grados, materias).
- **notifications** (`lib/notifications.ts`): showSuccess, showError, showConfirm usados en lugar de Swal directo en múltiples pantallas.

### Oportunidades detectadas

| Patrón | Dónde aparece | Sugerencia |
|--------|----------------|------------|
| **Inputs de formulario** | Modales y registro (text, email, password, select) | Componentes genéricos `Input`, `Select`, `PasswordInput` en `components/ui/` para estilos y validación unificados. |
| **Modales de confirmación** | DeleteDocente, DeleteEstudiante, confirmaciones en dashboard | Ya se usa `showConfirm`; opcionalmente un componente `ConfirmModal` reutilizable para casos con UI custom. |
| **Header/Footer institución** | Todas las páginas bajo `institucion/[id]/` | Ya reutilizados como componentes; opcional mover a `components/institucion/` para claridad y tests. |
| **Listas de recursos (tablas/tarjetas)** | Docentes, estudiantes, cursos, áreas, materias, grados | Patrones similares (tabla, acciones, filtros); un componente genérico `ResourceList` o composables podrían reducir duplicación. |

No se detectan ya “phone inputs duplicados” ni “alerts duplicadas” como código repetido; la centralización en PhoneInputField y notifications está bien.

---

## SECCIÓN 7 — Preparación para producción

| Criterio | Evaluación | Notas |
|----------|------------|--------|
| **Producción** | **Aceptable** | Build Next.js correcto; variables en `.env`/`.env.local`; Prisma y Supabase configurados. Falta: versionar migraciones y revisar que test-auth no esté accesible o esté deshabilitada. |
| **Escalabilidad** | **Aceptable** | API stateless; uso de institucion_id en rutas y datos; Prisma con PostgreSQL. Limitaciones: archivos muy grandes (SetupWizard, registro, dashboards) y posible necesidad de caché/paginación en listados grandes. |
| **Multi-institución** | **Correcto** | Diseño por institución (segmento [id], institucionId en APIs y contexto); datos aislados por institución en las rutas revisadas. |
| **Despliegue serverless** | **Aceptable** | Next.js y API routes compatibles con serverless (Vercel, Netlify, etc.). Prisma con adapter pg y connection pooling (ej. PgBouncer o proveedor serverless DB) será necesario en producción. |

---

## SECCIÓN 8 — Recomendaciones

### CRÍTICO

1. **Versionar `prisma/migrations/`**  
   Quitar `prisma/migrations/` del `.gitignore` (o usar un flujo donde las migraciones se generan y commitean en un único lugar) para que todos los entornos y el equipo tengan el mismo historial de esquema.

2. **Reducir el tamaño de `SetupWizard.tsx`**  
   Dividir en componentes por paso, hooks de lógica y posiblemente subcarpetas por paso (paso 0, 1, 2, …) para mejorar mantenibilidad y rendimiento.

3. **Controlar la ruta `test-auth` en producción**  
   Excluirla del build, deshabilitarla por variable de entorno o moverla a una ruta protegida/inexistente en producción.

### IMPORTANTE

4. **Centralizar tipos duplicados**  
   Mover a `src/types/`: BrandingData, CursoResumen, GradoResumen, AreaResumen, MateriaResumen, EstudianteResumen, DocenteResumen, Administrador (perfil/contexto) y tipos locales de SetupWizard que sean de dominio.

5. **Extraer pasos del registro de institución**  
   Dividir `registro-institucion/page.tsx` en componentes por paso y hooks (validación, envío) para alinear con el resto del proyecto y reducir complejidad por archivo.

6. **Subdividir `admin/modals/`**  
   Crear subcarpetas por dominio (p. ej. `modals/docentes/`, `modals/estudiantes/`, `modals/cursos/`) para mejorar navegación y ownership.

7. **Documentar uso de `src/generated`**  
   Si Prisma u otras herramientas generan ahí, documentarlo en README o en el schema; si no se usa, considerar eliminar la carpeta del árbol para evitar dudas.

### OPCIONAL

8. **Componentes UI genéricos**  
   Introducir `Input`, `Select`, `Button`, `Card` en `components/ui/` para unificar estilos y accesibilidad en formularios.

9. **Unificar contextos de autenticación**  
   Valorar un único contexto de auth (o un facade) que integre AuthContext y UnifiedAuthContext para simplificar el árbol de proveedores y la lógica de roles.

10. **Mover Header/Footer de institución**  
    De `app/institucion/[id]/` a `components/institucion/` para homogeneizar con landing y facilitar tests y reutilización.

11. **Añadir `tsconfig.tsbuildinfo` a .gitignore**  
    Si TypeScript genera este archivo, ignorarlo para no versionar artefactos de compilación.

---

## SECCIÓN 9 — Score profesional

| Criterio | Puntuación | Justificación breve |
|----------|------------|---------------------|
| **Arquitectura** | **7/10** | Buena separación app/api/lib/types/contexts y diseño multi-institución; lastre por archivos gigantes y migraciones no versionadas. |
| **Organización** | **6,5/10** | Estructura de carpetas clara; tipos e interfaces repetidos y muchos modales en una sola carpeta sin subdivisión. |
| **Escalabilidad** | **7/10** | API y modelo de datos preparados para crecer; archivos monolíticos y falta de versionado de schema pueden limitar evolución y despliegues. |
| **Mantenibilidad** | **6/10** | Mejora reciente (PhoneInputField, notifications, tipos en @/types); SetupWizard y registro-institucion muy grandes y difíciles de mantener; interfaces duplicadas. |

**Score final: 6,6/10**  
*(Media de los cuatro criterios.)*

---

*Documento generado por auditoría estática. No se ha modificado ningún archivo del proyecto.*
