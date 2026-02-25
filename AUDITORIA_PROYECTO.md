# Auditoría del Proyecto - Agenda Virtual

**Fecha:** Febrero 2025  
**Alcance:** Peso, dependencias, código muerto/duplicado, estructura, mejores prácticas.  
**Restricciones:** No modificar lógica de negocio, autenticación ni rutas; priorizar estabilidad.

./src/app/institucion/[id]/admin/DashboardSections.tsx:258:11
Type error: 'estudiante.nombre_acudiente' is possibly 'undefined'.

  256 |       estudiantesFiltrados = estudiantesFiltrados.filter(
  257 |         estudiante =>
> 258 |           estudiante.nombre_acudiente.toLowerCase().includes(filtrosEstudiantes.acudiente.toLowerCase())
      |           ^
  259 |       );
  260 |     }
  261 |


---

## 1. Auditoría de Peso

### 1.1 Carpetas que generan mayor peso

| Carpeta / archivo     | Comentario |
|-----------------------|------------|
| **node_modules/**     | Dependencias npm. No debe versionarse. |
| **.next/**            | Build y caché de Next.js. No debe versionarse. |
| **out/**              | Export estático (si se usara). Ya en .gitignore. |
| **prisma/migrations/**| Migraciones; suelen versionarse (ver 1.2). |

### 1.2 .gitignore

- **.next/** y **node_modules/**:** Correctamente ignorados (líneas 2 y 8).
- **.next** (sin barra) y **.next/** están ambos listados; redundante pero inocuo.
- **prisma/migrations/** está en .gitignore:** Las migraciones no se versionan. Si el equipo quiere historial de esquema en repo, conviene **quitar** `prisma/migrations/` del .gitignore y commitear las migraciones. Si es intencional (por ejemplo, migraciones solo en CI), dejarlo.
- **.env** aparece dos veces (Environment y Prisma); redundancia menor.

**Recomendación:** Confirmar si `prisma/migrations/` debe versionarse. Si sí, eliminar esa línea del .gitignore.

---

## 2. Dependencias

### 2.1 Uso verificado en código

| Dependencia | Uso en código |
|-------------|----------------|
| @prisma/adapter-pg | `src/lib/prisma.ts` |
| @prisma/client | Prisma (generado + imports) |
| @supabase/supabase-js | Múltiples archivos (auth, storage) |
| bcryptjs | `administradores/route.ts`, `reset-password/reset/route.ts`, `[adminId]/route.ts` |
| next, react, react-dom | Core del proyecto |
| react-phone-number-input | AddDocenteModal, AddEstudianteModal, SetupWizard, registro-institucion, AddAdministradorModal |
| sweetalert2 | Varios modales y páginas (login, institucion, docente, admin) |
| pg | Usado indirectamente por @prisma/adapter-pg |

### 2.2 Dependencias potencialmente no usadas

| Paquete | Justificación | Riesgo al eliminar |
|---------|----------------|---------------------|
| **jsonwebtoken** | No hay `import` ni `require` de `jsonwebtoken` ni uso de `jwt.` en el proyecto. Auth vía Supabase. | Bajo. Si en el futuro se usan JWTs propios, se puede volver a instalar. |
| **@types/jsonwebtoken** | Tipos para `jsonwebtoken`; si se quita `jsonwebtoken`, este sobra. | Bajo. |
| **dotenv** | Next.js carga `.env*` automáticamente. No hay `require('dotenv')` ni `config()` en el código. | Bajo. Útil solo si hubiera scripts Node fuera de Next (ej. `tsx scripts/xxx.ts`) que lean `.env`. |

**Recomendación:**  
- Valorar eliminar **jsonwebtoken** y **@types/jsonwebtoken** si no hay planes de usar JWTs propios.  
- Valorar eliminar **dotenv** si no hay scripts que lo usen; si se usa `tsx` para scripts que lean `.env`, mantener `dotenv` o usar `dotenv` en ese script.

### 2.3 DevDependencies

| Paquete | Uso |
|---------|-----|
| @netlify/plugin-nextjs | Despliegue en Netlify (configuración de build, no import en código). Mantener si despliegan en Netlify. |
| tsx | No hay scripts en `package.json` que invoquen `tsx`. Útil para ejecutar scripts `.ts` a mano. Valorar mantener si usan scripts TS; si no, opcional eliminarlo. |
| eslint, eslint-config-next, prisma, typescript, tailwind, etc. | Necesarios para desarrollo y build. |

---

## 3. Código muerto y duplicado

### 3.1 Código / módulos no referenciados

| Elemento | Ubicación | Comentario |
|----------|-----------|------------|
| **UnifiedAuthContext** + **UnifiedAuthProvider** + **useUnifiedAuth** | `src/contexts/UnifiedAuthContext.tsx` | No se usan en la app. El layout usa `AuthContext`/`AuthProvider`. Solo aparecen en `UnifiedAuthGuard.tsx` y en documentación (RESUMEN_DISENO_ACTUALIZADO.md). |
| **UnifiedAuthGuard** | `src/app/UnifiedAuthGuard.tsx` | No está importado en ninguna página ni layout. Depende de `UnifiedAuthContext`. Código muerto salvo que se decida unificar auth con este flujo. |
| **src/lib/ui-constants.ts** | Todo el archivo | No hay imports de `ui-constants`, `DESIGN_TOKENS`, `BUTTON_STYLES`, etc. en el resto del proyecto. Design tokens y estilos reutilizables no están en uso. |

**Recomendación:**  
- Si no se va a unificar auth con `UnifiedAuth*`: documentar como “reserva para refactor” o eliminar `UnifiedAuthGuard` y `UnifiedAuthContext` para reducir confusión (y en ese caso no tocar lógica de auth actual).  
- Para **ui-constants**: o bien se empieza a usar en componentes (botones, cards, inputs) o se deja documentado como “design system futuro”; no eliminar sin plan de reemplazo.

### 3.2 Interfaces y tipos duplicados

Mismas ideas repetidas en varios archivos (nombres y campos similares):

| Concepto | Archivos donde se define (ejemplos) | Sugerencia |
|----------|-------------------------------------|------------|
| **Estudiante** | AddRecordatorioModal, SetupWizard, DashboardSections, EditEstudianteModal, ViewEstudianteModal, DeleteEstudianteModal | Centralizar en `src/types/estudiante.ts` (o `models.ts`) y reutilizar. |
| **Docente** | SetupWizard, AdminDashboardContent, DashboardSections, DocenteDashboardContent, perfil docente, EditDocenteModal, ViewDocenteModal, DeleteDocenteModal | Igual: `src/types/docente.ts` o un único `src/types/index.ts`. |
| **Grado** | AddEstudianteModal, SetupWizard, DashboardSections, EditDocenteModal, EditEstudianteModal | `src/types/grado.ts` o consolidar en `src/types`. |
| **Curso** | AddEstudianteModal, SetupWizard, DashboardSections | `src/types/curso.ts`. |
| **Sede** | registro-institucion, AddAdministradorModal, page (institucion), perfil | `src/types/sede.ts`. |
| **Institucion** | UnifiedAuthContext, AddAdministradorModal, page (institucion), configuracion, perfil | `src/types/institucion.ts`. |
| **Recordatorio** | ViewRecordatorioModal, AddRecordatorioModal, DocenteDashboardContent, EditRecordatorioModal | `src/types/recordatorio.ts`. |
| **Asignacion** | AddRecordatorioModal, DocenteDashboardContent, perfil docente | `src/types/asignacion.ts` (o “docente-asignacion”). |

Tipos más “de vista” (props de modales/páginas) pueden quedarse locales; los que representan entidades de dominio (Estudiante, Docente, Grado, Curso, Sede, Institucion, Recordatorio) conviene centralizarlos en **src/types** para:

- Un solo lugar de verdad.
- Menos divergencia entre componentes.
- Mejor alineación con Prisma (re-exportar tipos generados donde aplique).

**Recomendación:** Crear `src/types/` e ir moviendo estas interfaces de forma incremental, sin cambiar lógica; solo imports y definiciones.

### 3.3 Duplicación de lógica/UI

- **Footer:** Existen `src/app/institucion/[id]/Footer.tsx` y `src/components/landing/Footer.tsx`. Son distintos (landing vs área institución). No es duplicado crítico; solo vigilar que no se copie-pegue contenido entre ambos sin necesidad.
- **PhoneInput + locale es:** Mismo bloque de import y uso en AddDocenteModal, AddEstudianteModal, SetupWizard, registro-institucion, AddAdministradorModal. Se podría extraer un componente `PhoneInputWithLocale` en `src/components/ui/` para un solo lugar de configuración (locale, estilos, validación).
- **Swal (sweetalert2):** Uso repetido en muchos archivos; patrón similar. Opcional: un módulo `src/lib/notifications.ts` o `src/utils/swal.ts` con helpers (`showSuccess`, `showError`, `confirm`) para no repetir opciones (toast, botones, etc.).

---

## 4. Estructura del Proyecto

### 4.1 Estructura actual (resumida)

```
src/
├── app/                    # App Router (páginas, layouts, guards)
│   ├── api/                # Rutas API (instituciones, auth, setup, recordatorios, etc.)
│   ├── institucion/[id]/   # Área institución (admin, docente, perfil, config)
│   ├── login, registro-institucion, recuperar-contrasena, resetear-contrasena
│   ├── test-auth/
│   ├── layout.tsx
│   └── page.tsx (landing)
├── components/
│   ├── landing/            # Header, Footer, HomeHero
│   └── ui/                 # Skeleton
├── contexts/               # AuthContext, UnifiedAuthContext
└── lib/                    # prisma, supabase, supabase-admin, env, ui-constants
```

No existe hoy: `src/types`, `src/hooks`, `src/services`, `src/utils` (como carpeta explícita).

### 4.2 Propuesta de estructura (evolutiva)

Objetivo: mejorar organización sin romper rutas ni lógica.

| Carpeta | Propósito | Acción sugerida |
|---------|-----------|------------------|
| **src/types** | Interfaces/tipos de dominio y DTOs compartidos | Crear y mover aquí las interfaces repetidas (Estudiante, Docente, Grado, Curso, Sede, Institucion, Recordatorio, etc.). Opcional: re-exportar tipos de Prisma donde convenga. |
| **src/hooks** | Hooks reutilizables | Crear cuando haya hooks compartidos (ej. `useInstitucion`, `useRecordatorios`). No obligatorio ya; solo cuando exista la necesidad. |
| **src/services** | Llamadas a API / capa de datos (opcional) | Crear si se quiere desacoplar páginas de `fetch` directo (ej. `api/instituciones`, `api/recordatorios`). No obligatorio para esta auditoría. |
| **src/utils** | Helpers puros | Crear si se extraen validadores, formateadores o helpers de Swal. Opcional. |
| **src/lib** | Ya existe; mantener | Mantener prisma, supabase, env. Valorar uso o documentación de `ui-constants`. |
| **src/components** | Ya existe | Mantener `landing/` y `ui/`. Valorar `components/ui/PhoneInputWrapper` si se unifica el uso del teléfono. |

Prioridad sugerida: primero **src/types** y uso de esos tipos en los archivos que hoy definen interfaces duplicadas; el resto cuando haya código concreto que mover.

### 4.3 Interfaces en archivos .tsx

Varias interfaces están definidas dentro de `.tsx` (modales, páginas, guards). Las que son **props de componente** (ej. `AddDocenteModalProps`) pueden seguir en el mismo archivo. Las que representan **entidades de dominio** (Docente, Estudiante, Grado, etc.) es mejor moverlas a **src/types** para reutilización y mantenimiento.

---

## 5. Mejores Prácticas

### 5.1 Variables de entorno

- **APP_URL:** Ya centralizada en `src/lib/env.ts` con validación; uso correcto en las rutas que se refactorizaron.
- **DATABASE_URL:** Validada en `src/lib/prisma.ts` con error claro. Correcto.
- **Supabase:** Uso de `NEXT_PUBLIC_SUPABASE_*` y `SUPABASE_SERVICE_ROLE_KEY` en `supabase.ts` y `supabase-admin.ts`; comprobaciones con `isSupabaseConfigured()` / `isSupabaseAdminConfigured()`. Correcto.
- **NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET:** Usado en registro-institucion y perfil con fallback `'instituciones'`. Valorar documentar en `.env.example` si no está.
- **branding/route.ts:** Usa `SUPABASE_URL` o `NEXT_PUBLIC_SUPABASE_URL` y buckets por env. Revisar que en producción estén definidas las variables deseadas.

**Recomendación:** Tener un `.env.example` con todas las variables necesarias (APP_URL, Supabase, DB, bucket) y documentar cuáles son obligatorias.

### 5.2 Organización de APIs

- Rutas bajo **app/api/** por dominio (auth, instituciones, setup, recordatorios, docentes, estudiantes, etc.). Estructura clara.
- Algunas rutas usan `@/lib/...` y otras rutas relativas largas (ej. `../../../../../lib/prisma`). Ver 5.3.

### 5.3 Imports

- **tsconfig.json** tiene `"@/*": ["./src/*"]`. Correcto.
- En **app** hay mezcla:
  - Varios archivos usan **@/** (ej. `@/lib/prisma`, `@/lib/env`).
  - Otros usan rutas **relativas** largas (ej. `../../../../contexts/AuthContext`, `../../../../../lib/prisma`).

**Recomendación:** Unificar a **imports con alias @/** en todo el proyecto para legibilidad y menos rotura al mover archivos. Ejemplo: `import { useAuth } from '@/contexts/AuthContext'` en lugar de `'../../../../contexts/AuthContext'`.

### 5.4 Separación de responsabilidades

- Los Route Handlers hacen validación, Prisma y a veces Supabase; es aceptable para el tamaño actual.
- Páginas y modales a veces llevan bastante lógica (formularios, fetch). A medio plazo se podría extraer:
  - Lógica de formularios a hooks o a componentes presentacionales + contenedor.
  - Llamadas `fetch` a funciones en `src/services` o `src/lib/api`.

No es obligatorio cambiarlo ya; es una mejora incremental cuando se toque cada flujo.

### 5.5 Prisma

- **prisma/migrations/** en .gitignore: ya comentado en 1.2. Decidir si se versionan migraciones.
- Uso de **@prisma/adapter-pg** y **pg** para conexión en entorno serverless/edge; coherente con Next.

---

## 6. Resumen de Acciones Recomendadas

### Alta prioridad (bajo riesgo)

1. **Unificar imports a @/:** Sustituir rutas relativas largas por alias `@/` en `src/app` y `src/contexts`.
2. **Decidir sobre prisma/migrations:** Si se quieren versionar, quitar `prisma/migrations/` del .gitignore.
3. **Documentar o usar ui-constants:** Si no se usan los tokens, documentar en el archivo que es “reserva para design system” o empezar a usar en 1–2 componentes piloto.

### Prioridad media (mejora de mantenibilidad)

4. **Crear src/types:** Añadir tipos compartidos (Estudiante, Docente, Grado, Curso, Sede, Institucion, Recordatorio, etc.) e ir migrando interfaces desde .tsx de forma incremental.
5. **Valorar dependencias no usadas:** Eliminar `jsonwebtoken` y `@types/jsonwebtoken` si no hay planes de JWTs propios; valorar `dotenv` en función de scripts con `tsx`.
6. **Código muerto UnifiedAuth*:** Decidir: o se usa (integrando en layout y reemplazando guards actuales) o se documenta como “no usado” o se elimina para evitar confusión.

### Prioridad baja (opcional)

7. **Componente PhoneInput con locale:** Extraer `PhoneInputWithLocale` en `src/components/ui` para unificar imports y configuración.
8. **Helpers de Swal:** Centralizar en `src/lib/notifications.ts` o `src/utils/swal.ts` si se quiere homogeneizar mensajes y confirmaciones.
9. **.env.example:** Completar con todas las variables usadas (APP_URL, Supabase URL/keys, bucket, DATABASE_URL, etc.).

---

## 7. Lista de archivos relevante para cambios

### Archivos creados (propuesta)

- `src/types/index.ts` (o `estudiante.ts`, `docente.ts`, etc.) cuando se centralicen tipos.

### Archivos a tocar (solo si se aplican recomendaciones)

- **Imports @/:** Cualquier archivo bajo `src/app` y `src/contexts` que use rutas relativas a `lib` o `contexts`.
- **Tipos:** Los .tsx que definen interfaces de dominio (listados en 3.2); solo para cambiar la definición de tipo a `import from '@/types/...'`.
- **.gitignore:** Una línea (prisma/migrations/) si se decide versionar migraciones.
- **package.json:** Solo si se eliminan `jsonwebtoken`, `@types/jsonwebtoken` o `dotenv`.

### Archivos no modificados (por restricciones)

- Lógica de negocio en APIs y páginas.
- Flujo de autenticación (AuthContext, Supabase, guards actuales).
- Rutas (URLs) y estructura de `app/` (rutas existentes).
- Plantillas de correo o contenido de emails.

---

## 8. Confirmación de consistencia

| Aspecto | Estado |
|--------|--------|
| .next y node_modules en .gitignore | Correcto |
| URL pública centralizada en env.ts | Hecho |
| Uso de APP_URL en rutas que necesitan base URL | Refactorizado |
| Dependencias críticas (Prisma, Supabase, bcrypt, etc.) | En uso |
| Código muerto identificado | UnifiedAuth*, UnifiedAuthGuard, ui-constants sin imports |
| Interfaces duplicadas identificadas | Listadas en 3.2; sugerida consolidación en src/types |
| Estructura propuesta (types, hooks, services, utils) | No destructiva; evolutiva |
| Cambios sugeridos | Solo organización, imports y dependencias; sin tocar auth ni rutas |

---

*Auditoría orientada a limpieza, escalabilidad y mantenibilidad sin alterar comportamiento funcional ni autenticación.*
