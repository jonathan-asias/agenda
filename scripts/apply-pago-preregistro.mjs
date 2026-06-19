/**
 * Añade columna datos_preregistro a Pagos.
 * Uso: node scripts/apply-pago-preregistro.mjs
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

const candidates = [
  ['DIRECT_URL', vars.DIRECT_URL],
  ['DATABASE_URL', vars.DATABASE_URL],
].filter(([, url]) => Boolean(url?.trim()));

if (candidates.length === 0) {
  console.error('ERROR: define DIRECT_URL o DATABASE_URL en .env.local');
  process.exit(1);
}

const sql = fs.readFileSync('scripts/add-pago-preregistro.sql', 'utf8');
let lastError = null;

for (const [label, connectionString] of candidates) {
  const client = new pg.Client({
    connectionString,
    ssl: connectionString.includes('supabase') ? { rejectUnauthorized: false } : undefined,
  });

  console.log(`Conectando con ${label}...`);

  try {
    await client.connect();
    await client.query(sql);
    console.log('Columna datos_preregistro aplicada en Pagos.');
    await client.end();
    process.exit(0);
  } catch (err) {
    lastError = err;
    console.error(`Fallo con ${label}:`, err.message);
    try {
      await client.end();
    } catch {
      // ignore
    }
  }
}

console.error('ERROR: no se pudo aplicar la migración con ninguna URL.');
console.error(lastError?.message ?? 'Error desconocido');
console.error('\nAlternativa: copia scripts/add-pago-preregistro.sql en Supabase → SQL Editor → Run');
process.exit(1);
