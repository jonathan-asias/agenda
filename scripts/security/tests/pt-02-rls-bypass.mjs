/**
 * PT-02 (P0) — Auditoría estática: rutas con withDbBypass y estado RLS en BD.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadPentestEnv, PROJECT_ROOT } from '../load-env.mjs';
import { printResults } from '../pentest-lib.mjs';
import { buildDbUrlCandidates, connectFirst } from '../db-connect.mjs';

loadPentestEnv();

export const id = 'PT-02';
export const title = 'Bypass RLS — rutas API y políticas PostgreSQL';
export const priority = 'P0';

const API_ROOT = path.join(PROJECT_ROOT, 'src/app/api');

/** Rutas públicas legítimas con bypass (allowlist). */
const BYPASS_ALLOWLIST_PREFIXES = [
  'payments/',
  'wompi/',
  'push/',
  'planes/',
  'gestion-vortico/',
  'auth/reset-password/',
  'instituciones/by-email/',
  'instituciones/route.ts',
];

const BYPASS_ALLOWLIST_EXACT = new Set([
  'payments/config/route.ts',
  'wompi/config/route.ts',
]);

function isBypassAllowlisted(rel) {
  if (BYPASS_ALLOWLIST_EXACT.has(rel)) return true;
  return BYPASS_ALLOWLIST_PREFIXES.some((p) => rel.startsWith(p) || rel === p);
}

const APP_LEVEL_AUTH_MARKERS = [
  'requireAuthInstitutionId',
  'requireInstitutionOwnerRole',
  'requireAdminRole',
  'requireAdminApiInstitutionId',
  'requirePlatformAdmin',
  'enforceInstitutionReadAccess',
  'enforceInstitutionWriteAccess',
];

function walkRouteFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkRouteFiles(full, acc);
    else if (entry.name === 'route.ts') acc.push(full);
  }
  return acc;
}

function relApiPath(absPath) {
  return path.relative(API_ROOT, absPath).replace(/\\/g, '/');
}

function scanBypassRoutes() {
  const files = walkRouteFiles(API_ROOT);
  const withBypass = [];
  const withoutTenantGuard = [];

  for (const file of files) {
    const rel = relApiPath(file);
    const content = fs.readFileSync(file, 'utf8');
    const usesBypass =
      content.includes('withDbBypass') ||
      content.includes('withSystemDb');
    const usesTenant =
      content.includes('withDbTenant') ||
      content.includes('withTenantFromRequest') ||
      content.includes('withAdminSedeDb') ||
      content.includes('withAdminTenantDb') ||
      content.includes('withOwnerTenantDb') ||
      content.includes('requirePlatformAdmin');
    const usesAppAuth = APP_LEVEL_AUTH_MARKERS.some((m) => content.includes(m));

    if (usesBypass) {
      withBypass.push({ rel, allowlisted: isBypassAllowlisted(rel) });
    }
    if (!usesTenant && !usesBypass && !usesAppAuth) {
      const isPublicOk =
        rel.startsWith('auth/') ||
        rel === 'payments/config/route.ts' ||
        rel === 'wompi/config/route.ts' ||
        rel === 'wompi/pago-by-email/route.ts' ||
        rel === 'instituciones/by-email/[email]/route.ts' ||
        rel === 'push/test/route.ts';
      if (!isPublicOk) {
        withoutTenantGuard.push(rel);
      }
    }
  }

  return { withBypass, withoutTenantGuard };
}

async function checkRlsInDatabase() {
  const urls = buildDbUrlCandidates();
  if (!urls.length) {
    return { skip: true, reason: 'Sin DATABASE_URL para verificar RLS' };
  }

  const { client, rol } = await connectFirst(urls, { label: 'RLS' });

  try {
    const tables = await client.query(`
      SELECT c.relname AS table_name, c.relrowsecurity AS rls_enabled
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public'
        AND c.relkind = 'r'
        AND c.relname IN (
          'Instituciones', 'Estudiantes', 'Docentes', 'Administradores',
          'Recordatorios', 'Cursos', 'Grados', 'Pagos'
        )
      ORDER BY c.relname
    `);

    const policies = await client.query(`
      SELECT tablename, policyname
      FROM pg_policies
      WHERE schemaname = 'public'
      ORDER BY tablename
    `);

    const bypassRole = await client.query(`
      SELECT rolname, rolbypassrls
      FROM pg_roles
      WHERE rolname IN (current_user, 'agenda_app', 'postgres')
    `);

    return {
      skip: false,
      connectedAs: rol,
      tables: tables.rows,
      policyCount: policies.rows.length,
      policies: policies.rows,
      roles: bypassRole.rows,
    };
  } finally {
    await client.end();
  }
}

export async function run() {
  const results = [];
  const { withBypass, withoutTenantGuard } = scanBypassRoutes();

  const unlistedBypass = withBypass.filter((r) => !r.allowlisted);
  results.push({
    pass: unlistedBypass.length === 0,
    label: 'withDbBypass solo en rutas allowlisted',
    status: unlistedBypass.length,
    detail:
      unlistedBypass.length === 0
        ? `${withBypass.length} rutas bypass revisadas`
        : `Revisar: ${unlistedBypass.map((r) => r.rel).join(', ')}`,
  });

  results.push({
    pass: withoutTenantGuard.length <= 5,
    label: 'Rutas sin guard de tenant (revisión manual)',
    status: withoutTenantGuard.length,
    detail:
      withoutTenantGuard.length === 0
        ? 'Ninguna ruta sospechosa'
        : withoutTenantGuard.slice(0, 12).join(', ') +
          (withoutTenantGuard.length > 12 ? '…' : ''),
  });

  try {
    const rls = await checkRlsInDatabase();
    if (rls.skip) {
      results.push({
        pass: null,
        label: 'RLS en PostgreSQL',
        status: '-',
        detail: rls.reason,
      });
    } else {
      const disabled = rls.tables.filter((t) => !t.rls_enabled);
      results.push({
        pass: disabled.length === 0 && rls.policyCount > 0,
        label: 'RLS habilitado en tablas críticas',
        status: rls.policyCount,
        detail:
          disabled.length === 0
            ? `${rls.policyCount} políticas (${rls.connectedAs})`
            : `Sin RLS: ${disabled.map((t) => t.table_name).join(', ')}`,
      });

      const agendaApp = rls.roles.find((r) => r.rolname === 'agenda_app');
      results.push({
        pass: Boolean(agendaApp && !agendaApp.rolbypassrls),
        label: 'Rol agenda_app sin BYPASSRLS',
        status: agendaApp?.rolbypassrls ? 1 : 0,
        detail: agendaApp
          ? `agenda_app bypass_rls=${agendaApp.rolbypassrls} (conectado como ${rls.connectedAs})`
          : 'Rol agenda_app no encontrado',
      });
    }
  } catch (err) {
    results.push({
      pass: null,
      label: 'RLS en PostgreSQL',
      status: '-',
      detail: `No se pudo conectar: ${err instanceof Error ? err.message : err}`,
    });
  }

  return printResults(id, title, results);
}
