/**
 * Agrega columnas de autorización a Recordatorios / RecordatorioEstudiantes.
 * Uso: node scripts/apply-recordatorio-autorizacion.mjs
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
// Preferir pooler: DIRECT_URL (db.*) suele bloquearse por red/firewall.
const connectionString = vars.DATABASE_URL || vars.DIRECT_URL;
if (!connectionString) {
  console.error('ERROR: define DATABASE_URL o DIRECT_URL');
  process.exit(1);
}

const sql = fs.readFileSync('scripts/migrations/add-recordatorio-autorizacion.sql', 'utf8');
const client = new pg.Client({
  connectionString,
  ssl: connectionString.includes('supabase') ? { rejectUnauthorized: false } : undefined,
  connectionTimeoutMillis: 60_000,
});

try {
  console.log('Conectando…');
  await client.connect();
  await client.query(sql);

  const colsRec = await client.query(`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'Recordatorios'
      AND column_name IN (
        'motivo', 'evento_nombre', 'fecha_evento',
        'documento_path', 'documento_nombre', 'documento_mime', 'documento_tamano'
      )
    ORDER BY column_name
  `);
  const colsEst = await client.query(`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'RecordatorioEstudiantes'
      AND column_name IN ('autorizacion_respuesta', 'autorizacion_respondido_at')
    ORDER BY column_name
  `);

  console.log('Columnas Recordatorios (autorización):');
  for (const r of colsRec.rows) console.log(`  ${r.column_name} (${r.data_type})`);
  console.log('Columnas RecordatorioEstudiantes (autorización):');
  for (const r of colsEst.rows) console.log(`  ${r.column_name} (${r.data_type})`);

  if (colsRec.rows.length < 7 || colsEst.rows.length < 2) {
    console.error('ERROR: faltan columnas tras la migración');
    process.exit(1);
  }
  console.log('Migración aplicada.');
} catch (err) {
  console.error('ERROR:', err.message);
  process.exit(1);
} finally {
  await client.end().catch(() => null);
}
