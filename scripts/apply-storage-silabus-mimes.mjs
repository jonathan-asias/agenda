/**
 * Actualiza allowed_mime_types del bucket instituciones (branding + sílabus).
 * Uso: node scripts/apply-storage-silabus-mimes.mjs
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
  console.error('ERROR: define DATABASE_URL o DIRECT_URL en .env / .env.local');
  process.exit(1);
}

const bucketId =
  vars.SUPABASE_STORAGE_BUCKET ||
  vars.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ||
  'instituciones';

const sqlPath = 'scripts/migrations/update-storage-bucket-silabus-mimes.sql';
let sql = fs.readFileSync(sqlPath, 'utf8');
if (bucketId !== 'instituciones') {
  sql = sql.replaceAll("'instituciones'", `'${bucketId.replace(/'/g, "''")}'`);
}

const client = new pg.Client({
  connectionString,
  ssl: connectionString.includes('supabase') ? { rejectUnauthorized: false } : undefined,
});

try {
  await client.connect();

  const before = await client.query(
    `SELECT id, file_size_limit, allowed_mime_types FROM storage.buckets WHERE id = $1`,
    [bucketId]
  );
  if (before.rows.length === 0) {
    console.error(`ERROR: no existe el bucket "${bucketId}" en storage.buckets`);
    process.exit(1);
  }
  console.log('Antes:', before.rows[0]);

  await client.query(sql);

  const after = await client.query(
    `SELECT id, file_size_limit, allowed_mime_types FROM storage.buckets WHERE id = $1`,
    [bucketId]
  );
  console.log('Después:', after.rows[0]);
  console.log('MIME types del bucket actualizados. Puedes volver a adjuntar el sílabus.');
} catch (err) {
  console.error('ERROR:', err.message);
  console.error(
    `\nAlternativa: copia ${sqlPath} en Supabase → SQL Editor → Run`
  );
  process.exit(1);
} finally {
  await client.end();
}
