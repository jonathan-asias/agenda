import fs from 'fs';
import pg from 'pg';

const email = process.argv[2]?.trim().toLowerCase();
if (!email) {
  console.error('Uso: node scripts/check-payment-email.mjs email@ejemplo.com');
  process.exit(1);
}

const env = fs.readFileSync('.env.local', 'utf8');
const dbUrl = env.match(/^DATABASE_URL=(.+)$/m)?.[1]?.trim().replace(/^["']|["']$/g, '');
if (!dbUrl) {
  console.error('DATABASE_URL no encontrado');
  process.exit(1);
}

const hasResend = /^RESEND_API_KEY=.+/m.test(env);
const hasFrom = /^EMAIL_FROM=.+/m.test(env);

const client = new pg.Client({ connectionString: dbUrl });
await client.connect();

const pagos = await client.query(
  `SELECT referencia, estado, procesado, monto, plan_id, created_at, mercado_pago_id
   FROM "Pagos" WHERE LOWER(email) = LOWER($1) ORDER BY created_at DESC LIMIT 5`,
  [email]
);
const subs = await client.query(
  `SELECT id, plan_id, estado, institucion_id, fecha_inicio
   FROM "Suscripciones" WHERE LOWER(email) = LOWER($1) ORDER BY created_at DESC LIMIT 3`,
  [email]
);
const inst = await client.query(
  `SELECT id, nombre, plan_id FROM "Instituciones" WHERE LOWER(email) = LOWER($1)`,
  [email]
);

console.log(JSON.stringify({ email, hasResend, hasFrom, pagos: pagos.rows, subs: subs.rows, inst: inst.rows }, null, 2));
await client.end();
