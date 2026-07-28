/**
 * Aplica RLS tenant_isolation a DocenteSilabus.
 * Uso: node scripts/apply-docente-silabus-rls.mjs
 */
import fs from 'fs';
import pg from 'pg';

function loadEnv(path) {
  if (!fs.existsSync(path)) return {};
  const vars = {};
  for (const line of fs.readFileSync(path, 'utf8').split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i === -1) continue;
    let val = t.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    vars[t.slice(0, i).trim()] = val;
  }
  return vars;
}

const vars = { ...loadEnv('.env'), ...loadEnv('.env.local') };
const connectionString = vars.DATABASE_URL || vars.DIRECT_URL;
if (!connectionString) {
  console.error('ERROR: define DATABASE_URL o DIRECT_URL');
  process.exit(1);
}

const sql = fs.readFileSync('scripts/migrations/add-docente-silabus-rls.sql', 'utf8');
const client = new pg.Client({
  connectionString,
  ssl: connectionString.includes('supabase') ? { rejectUnauthorized: false } : undefined,
});

try {
  await client.connect();
  await client.query(sql);

  const pols = await client.query(`
    SELECT policyname, cmd, qual, with_check
    FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'DocenteSilabus'
  `);
  console.log('Políticas DocenteSilabus:', pols.rows);

  const flags = await client.query(`
    SELECT c.relrowsecurity AS rls, c.relforcerowsecurity AS force
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = 'DocenteSilabus'
  `);
  console.log('Flags:', flags.rows[0]);
  console.log('RLS aplicado. Vuelve a adjuntar el sílabus.');
} catch (err) {
  console.error('ERROR:', err.message);
  process.exit(1);
} finally {
  await client.end();
}
