/**
 * Añade categoria/lugar al calendario y calendario_evento_id en Recordatorios.
 * Uso: node scripts/apply-calendario-evento-categoria.mjs
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

const sql = fs.readFileSync('scripts/migrations/add-calendario-evento-categoria.sql', 'utf8');
const client = new pg.Client({
  connectionString,
  ssl: connectionString.includes('supabase') ? { rejectUnauthorized: false } : undefined,
  connectionTimeoutMillis: 60_000,
});

try {
  await client.connect();
  await client.query(sql);
  const cols = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'CalendarioAcademicoEventos'
      AND column_name IN ('categoria', 'lugar')
    ORDER BY column_name
  `);
  console.log('Calendario columnas:', cols.rows.map((r) => r.column_name).join(', ') || 'MISSING');
  const rec = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'Recordatorios'
      AND column_name = 'calendario_evento_id'
  `);
  console.log(rec.rows.length ? 'Recordatorios.calendario_evento_id OK' : 'MISSING calendario_evento_id');
  console.log('Migración aplicada.');
} catch (err) {
  console.error('ERROR:', err.message);
  process.exit(1);
} finally {
  await client.end().catch(() => null);
}
