# Reporte: Sistema UI reutilizable global

**Fecha:** 16 de febrero de 2025  
**Objetivo:** Crear sistema de componentes UI reutilizables en `src/components/ui/` con Tailwind y actualizar el proyecto para usarlos. Sin cambios de lógica; solo UI.

---

## 1. Estructura creada

```
src/components/ui/
├── index.ts          # Exportaciones centralizadas
├── Button.tsx        # Botón (variantes, tamaños)
├── Input.tsx        # Campo de texto con label/error/hint
├── Card.tsx         # Contenedor + CardHeader
├── Modal.tsx        # Diálogo modal (overlay, título, cerrar)
├── Table.tsx        # Table, TableHeader, TableBody, TableRow, TableHead, TableCell
├── Loader.tsx       # Spinner + LoaderPage
├── Badge.tsx        # Etiqueta de estado
├── Skeleton.tsx     # (existente)
└── PhoneInputField.tsx  # (existente)
```

---

## 2. Componentes

### Button
- **Variantes:** `primary` | `secondary` | `destructive` | `success` | `outline` | `ghost`
- **Tamaños:** `sm` | `md` | `lg`
- **Props:** `variant`, `size`, `fullWidth`, `className`, y atributos nativos de `<button>`

### Input
- **Props:** `label`, `error`, `hint`, `containerClassName`, `inputRef`, y atributos nativos de `<input>`
- Estilos: borde, focus (blue), estado de error (red)

### Card
- **Variantes:** `default` | `elevated` | `outlined` | `nested`
- **Padding:** `none` | `sm` | `md` | `lg`
- **CardHeader:** `title`, `subtitle`, `action` (opcional)

### Modal
- **Props:** `open`, `onClose`, `title`, `size` (sm | md | lg | xl | full), `closeOnOverlayClick`, `showCloseButton`
- Cierra con Escape y bloquea scroll del body cuando está abierto

### Table
- **Table:** `striped`, `compact`
- **Subcomponentes:** TableHeader, TableBody, TableRow, TableHead, TableCell
- Estilo: bordes, cabecera gris, filas con hover

### Loader
- **Tamaños:** `sm` | `md` | `lg`
- **LoaderPage:** mensaje centrado con spinner (para estados de carga de página)

### Badge
- **Variantes:** `default` | `primary` | `success` | `danger` | `warning` | `neutral`

Todos los componentes usan **Tailwind** y son compatibles con el diseño existente (blue-600 primario, slate, etc.).

---

## 3. Uso en el proyecto

Se actualizaron las siguientes pantallas para usar los nuevos componentes (solo reemplazo de UI, misma lógica):

| Archivo | Componentes usados |
|---------|--------------------|
| `src/app/institucion/[id]/admin/estudiantes/page.tsx` | Button, Card, LoaderPage |
| `src/app/institucion/[id]/admin/DashboardStats.tsx` | Card |
| `src/app/institucion/[id]/admin/modals/AddGradoModal.tsx` | Modal, Button, Loader |
| `src/app/institucion/[id]/page.tsx` | Button |

### Detalle de cambios
- **Estudiantes:** Contenedor principal con `Card`; botón "Agregar estudiante" con `Button`; carga con `LoaderPage`; cada tarjeta de estudiante con `Card`.
- **DashboardStats:** Cada estadística envuelta en `Card` (mismo layout y datos).
- **AddGradoModal:** Contenedor del diálogo reemplazado por `Modal`; botones Cancelar/Crear con `Button`; spinner de envío con `Loader`.
- **Institucion page:** Botones "Agregar Administrador" y "Crear administrador" con `Button`.

---

## 4. Cómo usar en el resto del proyecto

Importación desde el barrel:

```ts
import { Button, Input, Card, Modal, Table, Loader, Badge } from '@/components/ui';
```

Ejemplos:

```tsx
<Button variant="primary" size="md" onClick={handleClick}>Guardar</Button>
<Input label="Email" error={errors.email} value={email} onChange={...} />
<Card variant="default" padding="lg"><CardHeader title="Título" />...</Card>
<Modal open={open} onClose={onClose} title="Título" size="md">{content}</Modal>
<Table striped><TableHeader><TableRow>...</TableRow></TableHeader><TableBody>...</TableBody></Table>
<Loader size="md" />  // o <LoaderPage message="Cargando..." />
<Badge variant="success">Activo</Badge>
```

---

## 5. Verificación

- **Build:** `npm run build` completado correctamente.
- **Lógica:** Sin cambios en flujos, estado ni comportamiento; solo sustitución de marcado/estilos por componentes.
- **Tipos:** Corregido uso de `BrandingData` en `perfil/page.tsx` (value de inputs con `?? ''`) para que el build pase.

---

## 6. Resumen

| Concepto | Estado |
|----------|--------|
| Componentes creados | Button, Input, Card, Modal, Table, Loader, Badge |
| Ubicación | `src/components/ui/` |
| Estilos | Tailwind (alineado con diseño actual) |
| Exportación | `@/components/ui` (index.ts) |
| Archivos actualizados | 4 (estudiantes, DashboardStats, AddGradoModal, page institucion) |
| Lógica | Sin cambios |
| Build | OK |

El sistema UI reutilizable queda listo para seguir sustituyendo botones, cards, modales, tablas, loaders y badges en el resto de la aplicación desde `@/components/ui`.
