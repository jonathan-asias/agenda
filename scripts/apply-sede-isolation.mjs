/**
 * Aplica columnas sede_id para aislamiento por sede.
 * Usa DIRECT_URL (preferido) o DATABASE_URL de .env.local
 *
 * Uso: node scripts/apply-sede-isolation.mjs
 */
import fs from 'fs';
import pg from 'pg';

const envPath = '.env.local';
if (!fs.existsSync(envPath)) {
  console.error('ERROR: .env.local no existe');
  process.exit(1);
}

const vars = {};
for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
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

const connectionString = vars.DIRECT_URL || vars.DATABASE_URL;
if (!connectionString) {
  console.error('ERROR: define DIRECT_URL o DATABASE_URL en .env.local');
  process.exit(1);
}

const sqlPath = 'scripts/add-sede-isolation.sql';
const sql = fs.readFileSync(sqlPath, 'utf8');

const client = new pg.Client({
  connectionString,
  ssl: connectionString.includes('supabase') ? { rejectUnauthorized: false } : undefined,
});

console.log('Conectando a la base de datos...');
console.log('(usa DIRECT_URL si db push falla con el pooler)\n');

try {
  await client.connect();
  await client.query(sql);
  console.log('Migración aplicada correctamente.');
  console.log('Reinicia npm run dev si el servidor ya estaba corriendo.');
} catch (err) {
  console.error('ERROR al aplicar migración:', err.message);
  console.error('\nAlternativa: copia scripts/add-sede-isolation.sql en Supabase → SQL Editor → Run');
  process.exit(1);
} finally {
  await client.end();
}
