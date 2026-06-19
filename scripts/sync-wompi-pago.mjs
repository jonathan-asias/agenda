/**
 * Sincroniza un pago Wompi pendiente (sandbox) y opcionalmente reenvía correo.
 * Uso: node scripts/sync-wompi-pago.mjs email@ejemplo.com
 */
import fs from 'fs';
import pg from 'pg';

const email = process.argv[2]?.trim().toLowerCase();
if (!email) {
  console.error('Uso: node scripts/sync-wompi-pago.mjs email@ejemplo.com');
  process.exit(1);
}

const env = fs.readFileSync('.env.local', 'utf8');
const get = (k) => env.match(new RegExp(`^${k}=(.+)$`, 'm'))?.[1]?.trim().replace(/^["']|["']$/g, '');
const dbUrl = get('DATABASE_URL');
const wompiKey = get('WOMPI_PRIVATE_KEY');
const base = 'https://sandbox.wompi.co/v1';

const client = new pg.Client({ connectionString: dbUrl });
await client.connect();

const pagoRes = await client.query(
  `SELECT * FROM "Pagos" WHERE LOWER(email) = LOWER($1) AND estado = 'PENDING' ORDER BY created_at DESC LIMIT 1`,
  [email]
);
const pago = pagoRes.rows[0];
if (!pago) {
  console.log('No hay pago PENDING para', email);
  await client.end();
  process.exit(0);
}

console.log('Pago pendiente:', pago.referencia, 'monto', pago.monto, 'marker', pago.mercado_pago_id);

let linkId = null;
if (pago.mercado_pago_id?.startsWith('wompi-pl-')) {
  linkId = pago.mercado_pago_id.slice('wompi-pl-'.length);
}

const headers = { Authorization: `Bearer ${wompiKey}` };
let approved = null;

if (linkId) {
  const res = await fetch(`${base}/transactions?payment_link_id=${encodeURIComponent(linkId)}`, { headers });
  const json = await res.json();
  approved = json.data?.find((t) => t.status === 'APPROVED');
  console.log('Por payment_link_id:', res.status, 'txs', json.data?.length ?? 0);
}

if (!approved) {
  const res = await fetch(
    `${base}/transactions?reference=${encodeURIComponent(pago.referencia)}`,
    { headers }
  );
  const json = await res.json();
  approved = json.data?.find((t) => t.status === 'APPROVED');
  console.log('Por reference:', res.status, 'txs', json.data?.length ?? 0);
}

if (!approved) {
  const fromDate = new Date(pago.created_at).toISOString().slice(0, 10);
  const res = await fetch(`${base}/transactions?from_date=${fromDate}&page=1`, { headers });
  const json = await res.json();
  const txs = json.data ?? [];
  approved = txs.find(
    (t) =>
      t.status === 'APPROVED' &&
      (t.customer_email?.toLowerCase() === email ||
        t.payment_link_id === linkId ||
        Math.round(t.amount_in_cents / 100) === pago.monto)
  );
  console.log('Listado reciente:', res.status, 'txs', txs.length, approved ? 'match' : 'sin match');
  if (!approved && txs.length) {
    console.log(
      'Últimas APPROVED:',
      txs
        .filter((t) => t.status === 'APPROVED')
        .slice(0, 5)
        .map((t) => ({
          id: t.id,
          email: t.customer_email,
          link: t.payment_link_id,
          cents: t.amount_in_cents,
        }))
    );
  }
}

if (!approved) {
  console.log('No se encontró transacción APPROVED en Wompi. ¿Completó el pago en checkout?');
  await client.end();
  process.exit(1);
}

console.log('Transacción aprobada:', approved.id, approved.status, approved.amount_in_cents);

const amountCop = Math.round(approved.amount_in_cents / 100);
if (amountCop !== pago.monto) {
  console.error('Monto no coincide', amountCop, 'vs', pago.monto);
  await client.end();
  process.exit(1);
}

await client.query(
  `UPDATE "Pagos" SET estado = 'APPROVED', procesado = true, mercado_pago_id = $1 WHERE id = $2`,
  [approved.id, pago.id]
);

const subExists = await client.query(
  `SELECT id FROM "Suscripciones" WHERE LOWER(email) = LOWER($1) AND plan_id = $2 AND estado = 'ACTIVA' AND institucion_id IS NULL`,
  [email, pago.plan_id]
);
if (subExists.rows.length === 0) {
  await client.query(
    `INSERT INTO "Suscripciones" (email, plan_id, estado, fecha_inicio, created_at) VALUES ($1, $2, 'ACTIVA', NOW(), NOW())`,
    [email, pago.plan_id]
  );
}

console.log('Pago sincronizado en BD. Llame POST /api/... o reinicie flujo de correo.');
console.log('Ref:', pago.referencia);
await client.end();
