# Resumen del Diseño - Agenda Virtual Escolar

**Versión:** Actualizado después de unificación de estilos y eliminación de gradientes  
**Fecha:** 2024  
**Estado:** FASE 0 - Consistencia visual mejorada

---

## 📋 Índice

1. [Paleta de Colores](#paleta-de-colores)
2. [Tipografía](#tipografía)
3. [Componentes de Diseño](#componentes-de-diseño)
4. [Design Tokens Centralizados](#design-tokens-centralizados)
5. [Estados y Feedback Visual](#estados-y-feedback-visual)
6. [Elementos Específicos](#elementos-específicos)
7. [Responsive Design](#responsive-design)
8. [Dark Mode](#dark-mode)
9. [Mejoras Implementadas](#mejoras-implementadas)

---

## 🎨 Paleta de Colores

### Colores Principales

#### Azul (Color Primario)
- **Azul 50**: `bg-blue-50` - Fondos de página
- **Azul 100**: `bg-blue-100` - Fondos de badges y alertas
- **Azul 500**: `bg-blue-500` - Elementos de progreso
- **Azul 600**: `bg-blue-600` - Botones primarios, logos, headers
- **Azul 700**: `bg-blue-700` - Hover de botones primarios
- **Azul 800**: `text-blue-800` - Texto en badges

#### Gris/Slate (Color Neutro)
- **Slate 50**: `bg-slate-50` - Fondos de cards anidadas
- **Slate 100**: `bg-slate-100` - Fondos de badges neutros
- **Slate 200**: `border-slate-200` - Bordes de cards
- **Slate 300**: `border-slate-300` - Bordes de inputs
- **Slate 400**: `text-slate-400` - Placeholders, texto secundario
- **Slate 600**: `bg-slate-600` - Botones secundarios
- **Slate 700**: `bg-slate-700` - Hover de botones secundarios
- **Slate 800**: `text-slate-800` - Texto principal
- **Slate 900**: `text-slate-900` - Texto en inputs

#### Verde (Éxito)
- **Verde 50**: `bg-green-50` - Fondos de alertas de éxito
- **Verde 100**: `bg-green-100` - Fondos de badges de éxito
- **Verde 200**: `border-green-200` - Bordes de alertas
- **Verde 500**: `bg-green-500` - Elementos de progreso completado
- **Verde 600**: `bg-green-600` - Botones de éxito, cards de estadísticas
- **Verde 700**: `bg-green-700` - Hover de botones de éxito
- **Verde 800**: `text-green-800` - Texto en badges de éxito

#### Rojo (Error/Destructivo)
- **Rojo 50**: `bg-red-50` - Fondos de alertas de error
- **Rojo 100**: `bg-red-100` - Fondos de badges de error
- **Rojo 200**: `border-red-200` - Bordes de alertas de error
- **Rojo 300**: `border-red-300` - Bordes de inputs con error
- **Rojo 500**: `focus:ring-red-500` - Focus ring de inputs con error
- **Rojo 600**: `bg-red-600` - Botones destructivos
- **Rojo 700**: `bg-red-700` - Hover de botones destructivos
- **Rojo 800**: `text-red-800` - Texto en badges de error

#### Otros Colores
- **Púrpura 600**: `bg-purple-600` - Cards de estadísticas (materias)
- **Naranja 600**: `bg-orange-600` - Cards de estadísticas (grados)
- **Esmeralda 500**: `bg-emerald-500` - Steps completados
- **Amarillo 50**: `bg-yellow-50` - Alertas de advertencia
- **Amarillo 200**: `border-yellow-200` - Bordes de alertas de advertencia

### Colores de Fondo

- **Fondo de páginas**: `bg-blue-50` (antes: gradiente `from-slate-50 via-blue-50 to-indigo-50`)
- **Fondo de cards glassmorphism**: `bg-white/80 backdrop-blur-sm`
- **Fondo de cards estándar**: `bg-white`
- **Fondo de cards anidadas**: `bg-slate-50`

---

## 📝 Tipografía

### Fuente Principal
- **Familia**: `font-sans` (sistema por defecto de Tailwind)
- **Tamaños estándar**:
  - `text-xs` - Badges, etiquetas pequeñas
  - `text-sm` - Inputs, botones, texto secundario
  - `text-base` - Texto normal (por defecto)
  - `text-lg` - Títulos de secciones
  - `text-xl` - Títulos medianos
  - `text-2xl` - Títulos grandes
  - `text-3xl` - Números grandes (estadísticas)

### Pesos de Fuente
- `font-medium` - Botones, badges, texto destacado
- `font-semibold` - Títulos de secciones
- `font-bold` - Títulos principales, números grandes

---

## 🧩 Componentes de Diseño

### Botones

#### Botón Primario
```tsx
className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
```
- **Color**: Azul sólido (`bg-blue-600`)
- **Hover**: `hover:bg-blue-700`
- **Padding**: `px-4 py-2`
- **Border-radius**: `rounded-lg` (8px)
- **Transición**: `transition-colors` (optimizada)

#### Botón Secundario
```tsx
className="inline-flex items-center px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
```
- **Color**: Gris sólido (`bg-slate-600`)
- **Hover**: `hover:bg-slate-700`

#### Botón Destructivo
```tsx
className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
```
- **Color**: Rojo sólido (`bg-red-600`)
- **Hover**: `hover:bg-red-700`

#### Botón de Éxito
```tsx
className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
```
- **Color**: Verde sólido (`bg-green-600`)
- **Hover**: `hover:bg-green-700`

#### Botón Outline
```tsx
className="inline-flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
```

### Cards

#### Card Principal (Glassmorphism)
```tsx
className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6"
```
- **Fondo**: `bg-white/80 backdrop-blur-sm` (efecto glassmorphism)
- **Border-radius**: `rounded-2xl` (16px)
- **Sombra**: `shadow-lg`
- **Borde**: `border border-white/20`
- **Padding**: `p-6`

#### Card Secundaria
```tsx
className="bg-white rounded-xl shadow-sm border border-slate-200 p-4"
```
- **Fondo**: `bg-white`
- **Border-radius**: `rounded-xl` (12px)
- **Sombra**: `shadow-sm`
- **Borde**: `border border-slate-200`
- **Padding**: `p-4`

#### Card Interactiva (con hover)
```tsx
className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow"
```
- Incluye `hover:shadow-md transition-shadow`

#### Card Anidada
```tsx
className="bg-slate-50 rounded-lg border border-slate-200 p-4"
```
- **Fondo**: `bg-slate-50`
- **Border-radius**: `rounded-lg` (8px)

### Inputs

#### Input Estándar
```tsx
className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-slate-400"
```
- **Padding**: `px-4 py-2.5`
- **Border-radius**: `rounded-lg` (8px)
- **Borde**: `border border-slate-300`
- **Focus**: `focus:ring-2 focus:ring-blue-500 focus:border-blue-500`
- **Placeholder**: `placeholder:text-slate-400`

#### Input con Error
```tsx
className="w-full px-4 py-2.5 text-sm border border-red-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
```
- **Borde**: `border-red-300`
- **Focus**: `focus:ring-red-500 focus:border-red-500`

#### Select
- Mismo estilo que input estándar

#### Textarea
- Mismo estilo que input estándar

### Badges

#### Badge Base
```tsx
className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
```

#### Variantes de Color
- **Azul**: `bg-blue-100 text-blue-800`
- **Verde**: `bg-green-100 text-green-800`
- **Rojo**: `bg-red-100 text-red-800`
- **Gris**: `bg-slate-100 text-slate-800`
- **Índigo**: `bg-indigo-100 text-indigo-800`

### Alertas

#### Alerta de Error
```tsx
className="bg-red-50 border border-red-200 rounded-lg p-4"
```

#### Alerta de Éxito
```tsx
className="bg-green-50 border border-green-200 rounded-lg p-4"
```

#### Alerta Informativa
```tsx
className="bg-blue-50 border border-blue-200 rounded-lg p-4"
```

#### Alerta de Advertencia
```tsx
className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
```

---

## 🎯 Design Tokens Centralizados

Todos los estilos están centralizados en `src/lib/ui-constants.ts`:

### Border Radius
- `button`: `rounded-lg` (8px)
- `input`: `rounded-lg` (8px)
- `card`: `rounded-xl` (12px)
- `cardLarge`: `rounded-2xl` (16px)
- `badge`: `rounded-full`

### Shadows
- `subtle`: `shadow-sm`
- `card`: `shadow-sm`
- `cardLarge`: `shadow-lg`
- `modal`: `shadow-xl`
- `hover`: `hover:shadow-md`

### Padding
- `button`: `px-4 py-2`
- `buttonLarge`: `px-6 py-3`
- `input`: `px-4 py-2.5`
- `card`: `p-4`
- `cardLarge`: `p-6`
- `badge`: `px-3 py-1`

### Gaps
- `small`: `gap-2`
- `standard`: `gap-3`
- `medium`: `gap-4`
- `large`: `gap-6`
- `xLarge`: `gap-8`

### Transiciones
- `colors`: `transition-colors` (usado en botones)
- `all`: `transition-all duration-200` (usado en inputs)
- `shadow`: `transition-shadow` (usado en cards)
- `allSlow`: `transition-all duration-300`

### Backgrounds
- `page`: `bg-blue-50` (fondo de páginas)
- `cardGlass`: `bg-white/80 backdrop-blur-sm` (glassmorphism)

---

## 🔄 Estados y Feedback Visual

### Estados de Botones

#### Normal
- Color sólido según tipo (azul, gris, rojo, verde)
- Sin efectos adicionales

#### Hover
- Color más oscuro (ej: `bg-blue-600` → `bg-blue-700`)
- Transición suave con `transition-colors`

#### Focus
- Ring de 2px con offset
- Color según tipo de botón (azul, gris, rojo, verde)

#### Disabled
- `opacity-50`
- `cursor-not-allowed`

### Estados de Inputs

#### Normal
- Borde `border-slate-300`
- Fondo blanco

#### Focus
- Ring azul de 2px
- Borde azul

#### Error
- Borde rojo `border-red-300`
- Ring rojo en focus

#### Disabled
- `opacity-50`
- `cursor-not-allowed`
- Fondo gris claro

### Estados de Cards

#### Normal
- Sombra estándar según tipo

#### Hover (solo en cards interactivas)
- `hover:shadow-md`
- Transición suave con `transition-shadow`

### Estados de Error

- **Fondo**: `bg-red-50`
- **Borde**: `border-red-200`
- **Texto**: `text-red-800`
- **Iconos**: `text-red-600` o `text-red-400`

### Estados de Éxito

- **Fondo**: `bg-green-50`
- **Borde**: `border-green-200`
- **Texto**: `text-green-800`
- **Badges**: Indicadores verdes con iconos

---

## 🎨 Elementos Específicos

### Header

- **Fondo**: `bg-white`
- **Sombra**: `shadow-sm`
- **Borde**: `border-b border-slate-200`
- **Posición**: `sticky top-0 z-50`
- **Altura**: `h-16`
- **Logo**: Color sólido `bg-blue-600` con icono blanco (antes: gradiente)

### Modales (SweetAlert2)

- **Popup**: `rounded-2xl`
- **Botones**: `rounded-lg`
- **Colores de botones**:
  - Confirmar: `#dc2626` (rojo)
  - Cancelar: `#64748b` (gris)

### Cards de Información

- **Fondo**: `bg-white/80 backdrop-blur-sm` (glassmorphism)
- **Borde**: `border border-white/20`
- **Sombra**: `shadow-lg`
- **Bordes redondeados**: `rounded-2xl`
- **Padding**: `p-6`

### Badges y Etiquetas

- **Fondo**: `bg-green-100`, `bg-blue-100`, `bg-red-100`
- **Texto**: `text-green-800`, `text-blue-600`, `text-red-600`
- **Bordes redondeados**: `rounded-full`
- **Padding**: `px-3 py-1`

### Iconos SVG

- **Tamaños comunes**: `w-4 h-4`, `w-5 h-5`, `w-6 h-6`, `w-8 h-8`
- **Colores**: Heredan del texto o se definen explícitamente

### Loading Spinners

- **Estándar**: `animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600`
- **Pequeño**: `animate-spin rounded-full h-4 w-4 border-b-2 border-white`

---

## 📱 Responsive Design

### Breakpoints (Tailwind CSS)

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### Estrategia Responsive

- **Mobile First**: Diseño base para móviles
- **Padding adaptativo**: `px-4 sm:px-6 lg:px-8`
- **Grids responsivos**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Texto adaptativo**: `text-sm sm:text-base`
- **Espaciado adaptativo**: `gap-4 md:gap-6`

---

## 🌙 Dark Mode

### Estado Actual

- **Soporte básico**: Preparado para dark mode mediante CSS variables
- **No implementado completamente**: El diseño actual está optimizado para modo claro
- **Preparado para futuro**: Estructura lista para implementar dark mode

### Variables CSS (si se implementa)

- Variables de color preparadas en `globals.css`
- Media query `@media (prefers-color-scheme: dark)` disponible

---

## ✅ Mejoras Implementadas

### 1. Unificación de Estilos

#### Botones
- ✅ Todos los botones primarios usan color sólido `bg-blue-600` (antes: gradiente)
- ✅ Transiciones optimizadas: `transition-colors` en lugar de `transition-all`
- ✅ Estilos centralizados en `BUTTON_STYLES`

#### Inputs
- ✅ Todos los inputs unificados con el mismo estilo
- ✅ Padding consistente: `px-4 py-2.5`
- ✅ Border-radius unificado: `rounded-lg`
- ✅ Estados de error consistentes
- ✅ Estilos centralizados en `INPUT_STYLES`

#### Cards
- ✅ Glassmorphism mantenido en cards principales
- ✅ Border-radius unificado según tipo
- ✅ Sombras consistentes
- ✅ Estilos centralizados en `CARD_STYLES`

#### Badges
- ✅ Padding unificado: `px-3 py-1`
- ✅ Tamaño de texto: `text-xs`
- ✅ Font weight: `font-medium`
- ✅ Estilos centralizados en `BADGE_STYLES`

### 2. Eliminación de Gradientes

- ✅ **Fondos de página**: `bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50` → `bg-blue-50`
- ✅ **Botones primarios**: `bg-gradient-to-r from-blue-600 to-indigo-600` → `bg-blue-600`
- ✅ **Botones de éxito**: `bg-gradient-to-r from-green-600 to-emerald-600` → `bg-green-600`
- ✅ **Logo del header**: `bg-gradient-to-br from-blue-600 to-indigo-600` → `bg-blue-600`
- ✅ **Cards de estadísticas**: Todos los gradientes reemplazados por colores sólidos
- ✅ **Headers de modales**: Gradientes reemplazados por colores sólidos
- ✅ **Steps y progress bars**: Gradientes reemplazados por colores sólidos

### 3. Centralización de Design Tokens

- ✅ Creado `src/lib/ui-constants.ts` con todas las constantes
- ✅ Border radius centralizado
- ✅ Sombras centralizadas
- ✅ Padding centralizado
- ✅ Gaps centralizados
- ✅ Estilos de botones centralizados
- ✅ Estilos de cards centralizados
- ✅ Estilos de inputs centralizados
- ✅ Estilos de badges centralizados
- ✅ Estilos de alertas centralizados
- ✅ Transiciones centralizadas
- ✅ Backgrounds centralizados

### 4. Optimización de Transiciones

- ✅ Botones: `transition-colors` (más eficiente que `transition-all`)
- ✅ Inputs: `transition-all duration-200` (mantenido para efectos completos)
- ✅ Cards: `transition-shadow` (solo sombras)

### 5. Consistencia Visual

- ✅ Mismos tamaños de padding en elementos similares
- ✅ Mismos border-radius en elementos similares
- ✅ Mismas sombras en elementos similares
- ✅ Mismos colores para mismos propósitos
- ✅ Mismas transiciones para mismos efectos

---

## 📊 Archivos Modificados

### Constantes UI
- `src/lib/ui-constants.ts` - Design tokens centralizados

### Páginas Principales
- `src/app/page.tsx`
- `src/app/login/page.tsx`
- `src/app/registro-institucion/page.tsx`
- `src/app/recuperar-contrasena/page.tsx`
- `src/app/resetear-contrasena/[token]/page.tsx`

### Módulo de Institución
- `src/app/institucion/[id]/page.tsx`
- `src/app/institucion/[id]/Header.tsx`
- `src/app/institucion/[id]/perfil/page.tsx`
- `src/app/institucion/[id]/AddAdministradorModal.tsx`

### Módulo de Admin
- `src/app/institucion/[id]/admin/AdminDashboardContent.tsx`
- `src/app/institucion/[id]/admin/perfil/page.tsx`
- `src/app/institucion/[id]/admin/SetupWizard.tsx`
- `src/app/institucion/[id]/admin/modals/*` (todos los modales)

### Módulo de Docente
- `src/app/institucion/[id]/docente/DocenteDashboardContent.tsx`
- `src/app/institucion/[id]/docente/perfil/page.tsx`
- `src/app/institucion/[id]/docente/AddRecordatorioModal.tsx`
- `src/app/institucion/[id]/docente/EditRecordatorioModal.tsx`

### Guards y Componentes de Autenticación
- `src/app/UnifiedAuthGuard.tsx`
- `src/app/institucion/[id]/InstitucionAuthGuard.tsx`
- `src/app/institucion/[id]/docente/DocenteAuthGuard.tsx`
- `src/app/institucion/[id]/admin/AdminAuthGuard.tsx`

---

## 🎯 Resultado Final

### Antes
- ❌ Gradientes inconsistentes
- ❌ Estilos hardcodeados en múltiples lugares
- ❌ Variaciones arbitrarias de padding, border-radius, sombras
- ❌ Transiciones ineficientes

### Después
- ✅ Colores sólidos consistentes
- ✅ Design tokens centralizados
- ✅ Estilos unificados y reutilizables
- ✅ Transiciones optimizadas
- ✅ Código más limpio y mantenible
- ✅ Base sólida para futuras mejoras (MD3, accesibilidad)

---

## 📝 Notas Importantes

1. **Sin cambios en identidad visual**: Todos los cambios mantienen la identidad visual original
2. **Glassmorphism preservado**: El efecto glassmorphism se mantiene en cards principales
3. **Colores sólidos**: Todos los gradientes fueron reemplazados por colores sólidos equivalentes
4. **Optimización**: Transiciones optimizadas para mejor rendimiento
5. **Escalabilidad**: Estructura preparada para futuras mejoras

---

**Última actualización**: Después de unificación de estilos y eliminación de gradientes  
**Próximos pasos sugeridos**: Material Design 3, accesibilidad avanzada, personalización institucional


