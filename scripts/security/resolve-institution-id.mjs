#!/usr/bin/env node
/**
 * Resuelve PENTEST_INSTITUTION_B_ID a partir del email de la institución B.
 *
 * Método 1 (recomendado): API local con login de la cuenta institución B
 *   node scripts/security/resolve-institution-id.mjs
 *   Requiere en .env.pentest: PENTEST_INSTITUTION_B_EMAIL, PENTEST_INSTITUTION_B_PASSWORD
 *
 * Método 2: email por argumento + contraseña en env
 *   node scripts/security/resolve-institution-id.mjs email@colegio-b.ejemplo
 *
 * Método 3: consulta directa PostgreSQL (si hay red a Supabase)
 */
import pg from 'pg';
import { loadPentestEnv } from './load-env.mjs';
import { loginAs, apiFetch, getBaseUrl } from './pentest-lib.mjs';

loadPentestEnv();

const email = (
  process.argv[2] ||
  process.env.PENTEST_INSTITUTION_B_EMAIL ||
  ''
)
  .trim()
  .toLowerCase();

const password =
  process.env.PENTEST_INSTITUTION_B_PASSWORD?.trim() ||
  process.env.PENTEST_TENANT_B_PASSWORD?.trim();

if (!email) {
  console.error('Defina PENTEST_INSTITUTION_B_EMAIL en .env.pentest o pase el email como argumento.');
  process.exit(1);
}

async function resolveViaApi() {
  if (!password) {
    throw new Error(
      'Falta PENTEST_INSTITUTION_B_PASSWORD (o PENTEST_TENANT_B_PASSWORD) para login vía API'
    );
  }

  console.log(`Resolviendo vía API (${getBaseUrl()})…`);
  const session = await loginAs(email, password);
  const res = await apiFetch(`/api/instituciones/by-email/${encodeURIComponent(email)}`, {
    cookieHeader: session.cookieHeader,
  });

  if (res.json?.id) return res.json.id;
  throw new Error(
    `API no devolvió id (status ${res.status}). ¿El email es cuenta tipo institución?`
  );
}

async function resolveViaDb() {
  const urls = [
    process.env.DIRECT_URL?.trim(),
    process.env.DATABASE_URL?.trim(),
  ].filter(Boolean);

  if (!urls.length) throw new Error('Sin DATABASE_URL');

  let lastErr;
  for (const connectionString of urls) {
    const client = new pg.Client({ connectionString });
    try {
      await client.connect();
      const { rows } = await client.query(
        `SELECT id, nombre, email FROM "Instituciones" WHERE LOWER(email) = $1 LIMIT 1`,
        [email]
      );
      await client.end();
      if (!rows.length) throw new Error(`No hay institución con email ${email}`);
      return rows[0];
    } catch (err) {
      lastErr = err;
      try {
        await client.end();
      } catch {
        /* ignore */
      }
    }
  }
  throw lastErr;
}

try {
  let id;
  let nombre = '';

  try {
    id = await resolveViaApi();
    nombre = '(vía API)';
  } catch (apiErr) {
    console.warn(`API: ${apiErr instanceof Error ? apiErr.message : apiErr}`);
    console.warn('Intentando conexión directa a PostgreSQL…');
    const row = await resolveViaDb();
    id = row.id;
    nombre = row.nombre;
  }

  console.log(`\nInstitución: ${nombre}`);
  console.log(`Email:       ${email}`);
  console.log(`ID:          ${id}`);
  console.log(`\nAgregar a .env.pentest:\nPENTEST_INSTITUTION_B_ID=${id}`);
} catch (err) {
  console.error('\nNo se pudo resolver el ID.');
  console.error(err instanceof Error ? err.message : err);
  console.error('\nAlternativa manual: Supabase → Table Editor → Instituciones → columna id');
  process.exit(1);
}
