# Auditoría: Auth y tenant — getAuthInstitutionId






**Fecha:** 26 de febrero de 2025  
**Rol:** Auditor senior SaaS multi-tenant  
**Hipótesis:** `getAuthInstitutionId(req)` podría estar devolviendo el mismo `institutionId` para distintas sesiones (Admin A y Admin B), provocando que datos de una institución aparezcan en otra.

---

## FASE 1 — Implementación actual de getAuthInstitutionId

**Archivo:** `src/lib/tenant.ts`

### Implementación completa (con logs temporales)

```typescript
export async function getAuthInstitutionId(
  _request?: NextRequest
): Promise<number | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error
    } = await supabase.auth.getUser();

    if (error || !user?.email) {
      console.log('AUTH USER:', user?.email ?? '(none)', error?.message ?? '');
      console.log('AUTH INSTITUTION ID:', null);
      return null;
    }

    const email = user.email.trim();

    // Admin
    const admin = await prisma.administradores.findUnique({
      where: { correo: email },
      select: { institucion_id: true, supabase_user_id: true }
    });
    if (admin?.institucion_id != null) {
      const institutionId = admin.institucion_id;
      console.log('AUTH USER:', user?.email);
      console.log('AUTH INSTITUTION ID:', institutionId);
      return institutionId;
    }

    // Docente
    const docente = await prisma.docentes.findUnique({
      where: { email },
      select: { institucion_id: true }
    });
    if (docente?.institucion_id != null) {
      const institutionId = docente.institucion_id;
      console.log('AUTH USER:', user?.email);
      console.log('AUTH INSTITUTION ID:', institutionId);
      return institutionId;
    }

    // Institución
    const inst = await prisma.instituciones.findUnique({
      where: { email },
      select: { id: true }
    });
    if (inst?.id != null) {
      const institutionId = inst.id;
      console.log('AUTH USER:', user?.email);
      console.log('AUTH INSTITUTION ID:', institutionId);
      return institutionId;
    }

    console.log('AUTH USER:', user?.email);
    console.log('AUTH INSTITUTION ID:', null);
    return null;
  } catch (e) {
    console.log('AUTH USER:', '(exception)');
    console.log('AUTH INSTITUTION ID:', null);
    return null;
  }
}
```

### Verificaciones

| Pregunta | Respuesta |
|----------|-----------|
| ¿Cómo obtiene el usuario autenticado? | `createServerSupabaseClient()` (lee cookies) → `supabase.auth.getUser()`. |
| ¿Cómo obtiene el institutionId? | Por **email** del user: busca en Administradores (correo), luego Docentes (email), luego Instituciones (email). No usa `user.id` de Auth. |
| ¿Usa cookies? | Sí. El cliente en `supabase-server.ts` usa `cookies()` de `next/headers` y las pasa a Supabase SSR. |
| ¿Usa supabase.auth.getUser()? | Sí. Es la única forma de obtener el usuario en esta función. |
| ¿Algún fallback? | No. Si no hay match en ninguna tabla o hay excepción, devuelve `null`. |

### Flujo resumido

1. **Cliente Supabase en servidor**  
   Se usa `createServerSupabaseClient()` (en `src/lib/supabase-server.ts`), que:
   - Usa `cookies()` de `next/headers` para leer las cookies de la petición.
   - Crea un cliente con `createServerClient` (Supabase SSR) pasando `getAll`/`setAll` sobre ese store de cookies.
   - No se usa ningún header ni query: la identidad viene solo de la sesión en cookies.

2. **Usuario autenticado**  
   - Se llama a `supabase.auth.getUser()` (no `getSession()`).
   - Según Supabase, `getUser()` valida el JWT y hace una llamada al servidor de Auth si hace falta; la sesión se obtiene de las cookies que el cliente envía en la petición.
   - Si hay `error` o no hay `user?.email`, la función devuelve `null` (y ahora hace log de "AUTH USER: (none)" y "AUTH INSTITUTION ID: null").

3. **Obtención del institutionId**  
   Se usa **solo el email** del usuario de Supabase, normalizado con `trim()`. No se usa el `user.id` de Supabase Auth para la búsqueda. El orden es:

   - **Administradores:**  
     `prisma.administradores.findUnique({ where: { correo: email }, select: { institucion_id, supabase_user_id } })`  
     Si hay fila, se devuelve `admin.institucion_id`.
   - **Docentes:**  
     `prisma.docentes.findUnique({ where: { email }, select: { institucion_id } })`  
     Si hay fila, se devuelve `docente.institucion_id`.
   - **Instituciones:**  
     `prisma.instituciones.findUnique({ where: { email }, select: { id } })`  
     Si hay fila, se devuelve `inst.id`.

4. **Fallback**  
   No hay otro fallback: si no hay match en ninguna de las tres tablas, se devuelve `null`. En caso de excepción en el `try`, se captura y se devuelve `null` (y ahora se hace log del error).

### Resumen de dependencias

| Dato | Origen |
|------|--------|
| Usuario autenticado | Cookies de la petición → `createServerSupabaseClient()` → `supabase.auth.getUser()` |
| Email | `user.email` de Supabase Auth |
| institutionId (admin) | Tabla `Administradores` por `correo` = email (sin usar `supabase_user_id`) |
| institutionId (docente) | Tabla `Docentes` por `email` |
| institutionId (institución) | Tabla `Instituciones` por `email` |

No se usa el parámetro `_request` en la implementación actual.

---

## FASE 2 — Log temporal agregado

Dentro de `getAuthInstitutionId` se añadieron exactamente estas dos líneas en cada rama:

```ts
console.log("AUTH USER:", user?.email);
console.log("AUTH INSTITUTION ID:", institutionId);  // o null si no hay match
```

- Cuando hay match (Admin, Docente o Institución): se asigna el id a `institutionId`, se imprimen las dos líneas y se retorna.
- Cuando no hay usuario, no hay match o hay excepción: se imprime `AUTH INSTITUTION ID: null`.

Así se puede ver en Vercel (o en consola) qué email e institutionId se usan en cada petición.

---

## FASE 3 — Build

Se ejecutó `npm run build`. **Resultado:** compilación correcta (Next.js 16.1.6, Prisma generate + next build). Los únicos cambios son los logs; no se modificó lógica de negocio.

---

## FASE 4 — Prueba en producción (Vercel)

**Pasos recomendados:**

1. Desplegar en Vercel con los logs activos.
2. **Sesión 1 (Admin A):**  
   Iniciar sesión como admin de la Institución A, crear una materia, y revisar en los logs de la petición:
   - `AUTH USER:` (debe ser el email del Admin A).
   - `AUTH INSTITUTION ID:` (debe ser el id de la Institución A).
3. **Sesión 2 (Admin B):**  
   En otra sesión (p. ej. incógnito u otro navegador), iniciar sesión como admin de la Institución B, crear una materia, y revisar:
   - `AUTH USER:` (email del Admin B).
   - `AUTH INSTITUTION ID:` (id de la Institución B).
4. **Conclusión de la prueba:**  
   - Si en ambas peticiones `AUTH INSTITUTION ID` es **distinto** → el problema no es que `getAuthInstitutionId` devuelva el mismo id; habría que revisar caché, rutas, o filtros en otros puntos.  
   - Si en ambas peticiones `AUTH INSTITUTION ID` es **el mismo** → se confirma la hipótesis y aplica el análisis de FASE 5.

**Resultado de logs:** Pendiente de ejecutar la prueba en producción y anotar aquí los valores observados.

---

## FASE 5 — Si AUTH INSTITUTION ID es igual en ambas sesiones

Entonces el problema es que la misma identidad (o el mismo institutionId) se está usando para ambas sesiones. Revisión del vínculo Supabase Auth ↔ institución:

### Tabla Administradores (Prisma)

- **Existe** y está mapeada a la tabla de base de datos correspondiente.
- **Campos relevantes:**
  - `institucion_id` (Int, obligatorio) → institución a la que pertenece el admin.
  - `correo` (String, **@unique**) → un solo administrador por email en todo el sistema.
  - `supabase_user_id` (String, opcional) → id del usuario en Supabase Auth (`auth.users.id`).

### Vinculación actual

- **Al crear un administrador** (en `src/app/api/instituciones/[id]/administradores/route.ts`):
  - Se crea la fila en `Administradores` (con `institucion_id`, `correo`, etc.) **sin** `supabase_user_id`.
  - Se crea el usuario en Supabase Auth con `auth.admin.createUser({ email, password, ... })`.
  - Si `authData.user?.id` existe, se actualiza el administrador con `supabase_user_id: authData.user.id`.
- **En getAuthInstitutionId** (tenant.ts):
  - **No** se usa `supabase_user_id`.
  - Se busca **solo por email:** `findUnique({ where: { correo: email } })`.
  - Como `correo` es único globalmente, a cada email le corresponde **como máximo** un administrador y por tanto un solo `institucion_id`.

### Consecuencias

1. **Mismo email en dos instituciones:**  
   El esquema no lo permite: `correo` es `@unique`. Solo puede haber un admin con ese email y, por tanto, un solo `institucion_id` asociado a ese email. No se está “validando institución” además del email porque no hace falta para unicidad; el punto crítico es que **la identificación del tenant es solo por email**.

2. **Mismo institutionId para Admin A y Admin B (emails distintos):**  
   Si los emails son distintos y aun así los logs muestran el mismo `AUTH INSTITUTION ID`, entonces:
   - O bien **la sesión (cookies) es la misma** en ambas peticiones (mismo usuario visto por el servidor), por ejemplo por dominio/cookies compartidas o por cómo se envían las cookies en las peticiones al API.
   - O bien hay otro bug (caché, variable global, etc.) fuera de `getAuthInstitutionId`.

3. **Uso de `supabase_user_id`:**  
   La tabla **sí** tiene el campo y **sí** se rellena al crear el admin (en un update posterior al create).  
   **No** se usa en `getAuthInstitutionId`: la resolución es **solo por email**.  
   Para atar cada sesión de Supabase Auth a un único administrador (y así a una única institución) de forma explícita, sería más robusto resolver primero por `user.id` de Auth y `supabase_user_id` en BD, y solo en fallback por email (documentado como mejora recomendada en “Conclusión”).

---

## Conclusión

- **Implementación actual:**  
  `getAuthInstitutionId` depende de las cookies de la petición y de `supabase.auth.getUser()`. Obtiene el email del usuario y resuelve el `institutionId` **solo por email** contra Administradores, Docentes o Instituciones. No usa el parámetro `request` ni `supabase_user_id` para la búsqueda.

- **Riesgo principal si los logs muestran el mismo institutionId en dos sesiones distintas:**  
  Que el servidor esté interpretando que ambas peticiones son del **mismo usuario** (misma sesión/cookies), o que exista un fallo fuera de esta función. En ese caso conviene revisar dominio de cookies, uso de `getUser()` en serverless, y que cada petición lleve las cookies de la sesión correcta.

- **Recomendación (sin modificar aún, solo auditoría):**  
  Cuando se decida cambiar comportamiento, considerar usar **primero** el id de Supabase Auth (`user.id`) y buscar en `Administradores` por `supabase_user_id`, y usar la búsqueda por email solo como respaldo. Eso refuerza el vínculo “una sesión Auth = un admin = una institución” y evita ambigüedades si en el futuro el modelo de email cambiara.

- **Próximo paso:**  
  Ejecutar la prueba de FASE 4 en Vercel y registrar en este documento los valores de `AUTH USER` y `AUTH INSTITUTION ID` para Admin A y Admin B, para cerrar la conclusión con datos reales.
