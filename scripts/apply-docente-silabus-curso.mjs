/**
 * Aplica curso_id a DocenteSilabus.
 * Uso: node scripts/apply-docente-silabus-curso.mjs
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
// Prefer pooler (DATABASE_URL): DIRECT_URL :5432 often unreachable from local networks.
const connectionString = vars.DATABASE_URL || vars.DIRECT_URL;
if (!connectionString) {
  console.error('ERROR: define DATABASE_URL o DIRECT_URL en .env / .env.local');
  process.exit(1);
}

const sqlPath = 'scripts/migrations/add-docente-silabus-curso.sql';
const sql = fs.readFileSync(sqlPath, 'utf8');

const client = new pg.Client({
  connectionString,
  ssl: connectionString.includes('supabase') ? { rejectUnauthorized: false } : undefined,
});

try {
  await client.connect();
  console.log('Conectado. Revisando columnas de DocenteSilabus...');
  const cols = await client.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'DocenteSilabus'
    ORDER BY ordinal_position
  `);
  console.log(
    'Columnas:',
    cols.rows.map((r) => r.column_name).join(', ') || '(tabla inexistente)'
  );

  await client.query(sql);
  console.log('Migración aplicada correctamente.');

  const colsAfter = await client.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'DocenteSilabus'
    ORDER BY ordinal_position
  `);
  console.log('Columnas después:', colsAfter.rows.map((r) => r.column_name).join(', '));
} catch (err) {
  console.error('ERROR al aplicar migración:', err.message);
  console.error(
    '\nAlternativa: copia scripts/migrations/add-docente-silabus-curso.sql en Supabase → SQL Editor → Run'
  );
  process.exit(1);
} finally {
  await client.end();
}
