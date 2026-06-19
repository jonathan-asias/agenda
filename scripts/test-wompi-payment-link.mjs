/**
 * Prueba POST /v1/payment_links y muestra el error completo.
 * Uso: node scripts/test-wompi-payment-link.mjs
 */
import fs from 'fs';

const envPath = '.env.local';
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

const key = vars.WOMPI_PRIVATE_KEY?.trim();
const appUrl = vars.APP_URL?.trim()?.replace(/\/$/, '');
const base = 'https://sandbox.wompi.co/v1';

async function test(label, body) {
  const res = await fetch(`${base}/payment_links`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  console.log(`\n--- ${label} ---`);
  console.log('status:', res.status);
  console.log(text);
}

const minimal = {
  name: 'Plan Basico Agenda Virtual',
  description: 'Suscripcion mensual',
  single_use: true,
  collect_shipping: false,
  currency: 'COP',
  amount_in_cents: 10000000,
};

await test('minimal fixed amount', minimal);
await test('with uuid sku', { ...minimal, sku: 'ec4689fe-46fc-47ef-a3b8-1ceda783f7ec' });
await test('with hex sku no hyphens', {
  ...minimal,
  sku: 'ec4689fe46fc47efa3b81ceda783f7ec',
});
if (appUrl) {
  await test('with redirect devtunnel', {
    ...minimal,
    redirect_url: `${appUrl}/pago-exitoso?gateway=wompi`,
  });
}
await test('with redirect localhost https', {
  ...minimal,
  redirect_url: 'https://localhost:3000/pago-exitoso?gateway=wompi',
});
await test('em dash in name', {
  ...minimal,
  name: 'Plan Basico — Agenda Virtual',
});

await test('1000 COP like plan 1', {
  name: 'Plan Basico Agenda Virtual',
  description: 'Suscripcion mensual',
  single_use: true,
  collect_shipping: false,
  currency: 'COP',
  amount_in_cents: 100000,
  sku: 'ec4689fe-46fc-47ef-a3b8-1ceda783f7ec',
});

await test('exact app payload', {
  name: 'Plan Básico — Agenda Virtual',
  description: 'Suscripción mensual',
  single_use: true,
  collect_shipping: false,
  currency: 'COP',
  amount_in_cents: 100000,
  sku: 'ec4689fe-46fc-47ef-a3b8-1ceda783f7ec',
});
