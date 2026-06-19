import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '..', '.env.local');
const env = readFileSync(envPath, 'utf8');
const dbUrl = env.match(/^DATABASE_URL=(.+)$/m)?.[1]?.trim().replace(/^["']|["']$/g, '');
if (!dbUrl) {
  console.error('DATABASE_URL no encontrado en .env.local');
  process.exit(1);
}

const client = new pg.Client({ connectionString: dbUrl });
await client.connect();

const updates = [
  ['Plan Básico', 1500],
  ['Plan Plus', 2000],
];

for (const [nombre, precio] of updates) {
  const res = await client.query(
    'UPDATE "Planes" SET precio = $1 WHERE nombre = $2 RETURNING id, nombre, precio',
    [precio, nombre]
  );
  console.log(res.rows[0] ?? { nombre, error: 'no encontrado' });
}

await client.end();
console.log('OK — precios sincronizados');
