-- =============================================================================
-- Agenda Virtual — Verificación RLS (Row Level Security)
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- O local: node scripts/security/run-verify-rls.mjs
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Tablas críticas: ¿RLS habilitado?
-- Esperado: relrowsecurity = true en todas
-- -----------------------------------------------------------------------------
SELECT
  c.relname AS tabla,
  c.relrowsecurity AS rls_activo,
  c.relforcerowsecurity AS rls_forzado
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
  AND c.relname IN (
    'Instituciones',
    'Administradores',
    'Docentes',
    'Estudiantes',
    'Acudientes',
    'Cursos',
    'Grados',
    'Materias',
    'Areas',
    'Recordatorios',
    'DocenteSilabus',
    'Pagos',
    'Suscripciones',
    'PushSubscriptions',
    'Sedes',
    'AuditLog'
  )
ORDER BY c.relname;

-- -----------------------------------------------------------------------------
-- 2. Políticas RLS por tabla
-- Esperado: al menos una política por tabla multi-tenant
-- -----------------------------------------------------------------------------
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual IS NOT NULL AS tiene_using,
  with_check IS NOT NULL AS tiene_with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- -----------------------------------------------------------------------------
-- 3. Conteo de políticas por tabla
-- -----------------------------------------------------------------------------
SELECT
  tablename,
  COUNT(*) AS num_politicas
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- -----------------------------------------------------------------------------
-- 4. Rol de aplicación: ¿tiene BYPASSRLS? (debe ser false)
-- -----------------------------------------------------------------------------
SELECT
  rolname,
  rolsuper AS es_superuser,
  rolbypassrls AS bypass_rls,
  rolcanlogin AS puede_login
FROM pg_roles
WHERE rolname IN (
  current_user,
  'agenda_app',
  'postgres',
  'authenticator',
  'service_role'
)
ORDER BY rolname;

-- -----------------------------------------------------------------------------
-- 5. Verificar que existen funciones/helpers de tenant (si se crearon en migración)
-- -----------------------------------------------------------------------------
SELECT
  p.proname AS funcion,
  pg_get_function_identity_arguments(p.oid) AS argumentos
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND (
    p.proname ILIKE '%tenant%'
    OR p.proname ILIKE '%institution%'
    OR p.proname ILIKE '%rls%'
  )
ORDER BY p.proname;

-- -----------------------------------------------------------------------------
-- 6. Prueba manual de aislamiento (ejecutar con rol agenda_app, NO postgres)
-- Sustituir :institution_id_a y :institution_id_b por IDs reales (ej. 8 y 9)
-- Automatizado: npm run pentest:rls-cross-tenant
-- -----------------------------------------------------------------------------
-- BEGIN;
-- SELECT set_config('app.current_institution_id', '8', true);
-- SELECT COUNT(*) AS filas_visibles_tenant_a FROM "Estudiantes";
-- SELECT set_config('app.current_institution_id', '9', true);
-- SELECT COUNT(*) AS filas_visibles_tenant_b FROM "Estudiantes";
-- ROLLBACK;

-- -----------------------------------------------------------------------------
-- 7. Resumen pass/fail (tablas críticas sin RLS)
-- -----------------------------------------------------------------------------
SELECT
  c.relname AS tabla_sin_rls
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
  AND c.relname IN (
    'Instituciones', 'Estudiantes', 'Docentes', 'Administradores',
    'Recordatorios', 'Pagos', 'Cursos', 'Grados'
  )
  AND c.relrowsecurity = false
ORDER BY c.relname;

-- Si esta consulta devuelve 0 filas → RLS habilitado en tablas críticas ✓
