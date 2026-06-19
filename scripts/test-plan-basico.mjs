/**
 * Prueba E2E Plan Básico:
 * 1) UI: landing → modal → checkout sandbox MP
 * 2) API MP: pago aprobado con tarjeta de prueba (APRO)
 * 3) sync-status + can-register
 *
 * Uso: node scripts/test-plan-basico.mjs
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const BASE = process.env.E2E_BASE_URL || 'http://localhost:3000';
const TEST_EMAIL = `prueba-basico-${Date.now()}@test.com`;

function loadEnvLocal() {
  try {
    const raw = readFileSync(join(ROOT, '.env.local'), 'utf8');
    for (const line of raw.split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const i = t.indexOf('=');
      if (i === -1) continue;
      const key = t.slice(0, i).trim();
      let val = t.slice(i + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    // .env.local opcional si vars ya están en el entorno
  }
}

loadEnvLocal();

async function createPreference() {
  const res = await fetch(`${BASE}/api/payments/create-preference`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: TEST_EMAIL, planId: 1, nombre: 'APRO' }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`create-preference ${res.status}: ${data.error}`);
  return data;
}

async function testUiFlow(checkoutUrl) {
  console.log('\n--- Paso 1: UI (Plan Básico → Mercado Pago sandbox) ---');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ locale: 'es-CO' });

  try {
    await page.goto(`${BASE}/#pricing`, { waitUntil: 'networkidle', timeout: 60000 });
    await page.getByRole('button', { name: 'Elegir Plan Básico' }).click();
    await page.locator('#checkout-nombre').fill('APRO');
    await page.locator('#checkout-email').fill(TEST_EMAIL);

    await page.getByText('Modo prueba — datos de tarjeta en Mercado Pago').waitFor({
      timeout: 10000,
    });
    await page.getByText('5031 7557 3453 0604').waitFor({ timeout: 5000 });
    console.log('✓ Modal Plan Básico con datos de prueba visibles');

    await page.goto(checkoutUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(8000);
    const url = page.url();
    if (!url.includes('sandbox.mercadopago')) {
      throw new Error('Checkout MP no cargó: ' + url);
    }
    console.log('✓ Checkout sandbox MP cargado:', url.slice(0, 70) + '...');
    return true;
  } finally {
    await browser.close();
  }
}

async function syncAndVerify(referencia, email) {
  const syncRes = await fetch(`${BASE}/api/payments/sync-status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ref: referencia, email }),
  });
  const syncData = await syncRes.json();
  console.log('→ sync-status:', syncRes.status, syncData);

  const canRes = await fetch(
    `${BASE}/api/payments/can-register?email=${encodeURIComponent(email)}`
  );
  const canData = await canRes.json();
  console.log('→ can-register:', canData);

  if (!canData.canRegister) {
    throw new Error('can-register=false después del pago');
  }
  return canData;
}

async function main() {
  console.log('=== Prueba Plan Básico + Mercado Pago ===');
  console.log('Email:', TEST_EMAIL);
  console.log('Base:', BASE);

  if (!process.env.MERCADOPAGO_ACCESS_TOKEN?.trim()) {
    throw new Error('MERCADOPAGO_ACCESS_TOKEN no encontrado en .env.local');
  }

  const pref = await createPreference();
  console.log('\n--- Paso 0: create-preference ---');
  console.log('✓ sandbox:', pref.sandbox);
  console.log('✓ referencia:', pref.referencia);
  console.log('✓ checkoutUrl:', pref.checkoutUrl?.slice(0, 75) + '...');

  if (!pref.sandbox || !pref.checkoutUrl?.includes('sandbox.mercadopago')) {
    throw new Error('Preferencia no está en modo sandbox');
  }

  await testUiFlow(pref.checkoutUrl);

  console.log('\n--- Paso 2: Verificación backend (sync-status) ---');
  const syncBefore = await fetch(`${BASE}/api/payments/sync-status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ref: pref.referencia, email: TEST_EMAIL }),
  }).then((r) => r.json());
  console.log('→ sync-status (sin pagar aún):', syncBefore);

  if (syncBefore.canRegister) {
    console.log('\n✅ Pago ya estaba aprobado — registro habilitado para', TEST_EMAIL);
    return;
  }

  console.log('\n--- Paso 3: Checkout manual en Mercado Pago ---');
  console.log('Abra esta URL en Edge/Chrome incógnito y complete el pago:');
  console.log(pref.checkoutUrl);
  console.log('\nDatos de tarjeta (en el formulario de MP, NO en el modal de la app):');
  console.log('  Número: 5031 7557 3453 0604');
  console.log('  CVV: 123 | Vence: 11/30');
  console.log('  Titular: APRO (exacto, en mayúsculas)');
  console.log('  Documento: 123456789');
  console.log('\nDespués del pago, ejecute:');
  console.log(`  node scripts/sync-quick.mjs ${pref.referencia} ${TEST_EMAIL}`);

  console.log('\n✅ Prueba automática OK hasta checkout MP (sandbox + UI + preferencia creada)');
  console.log('   Email de prueba:', TEST_EMAIL);
  console.log('   Referencia:', pref.referencia);
}

main().catch((err) => {
  console.error('\n❌ FALLO:', err.message);
  process.exit(1);
});
