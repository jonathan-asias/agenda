/**
 * Completa pago en checkout MP sandbox (Plan Básico ya creado vía API).
 * Uso: node scripts/mp-checkout-pay.mjs <checkoutUrl> <email> <referencia>
 */
import { chromium } from 'playwright';

const checkoutUrl = process.argv[2];
const email = process.argv[3];
const referencia = process.argv[4];
const BASE = process.env.E2E_BASE_URL || 'http://localhost:3000';

if (!checkoutUrl || !email || !referencia) {
  console.error('Uso: node scripts/mp-checkout-pay.mjs <checkoutUrl> <email> <referencia>');
  process.exit(1);
}

const CARD = {
  number: '5031755734530604',
  cvv: '123',
  expiry: '1130',
  holder: 'APRO',
  document: '123456789',
};

async function fillAllFrames(page, selectors, value) {
  for (const frame of page.frames()) {
    for (const sel of selectors) {
      const loc = frame.locator(sel).first();
      if (await loc.isVisible({ timeout: 800 }).catch(() => false)) {
        await loc.click().catch(() => {});
        await loc.fill(value);
        return true;
      }
    }
  }
  for (const sel of selectors) {
    const loc = page.locator(sel).first();
    if (await loc.isVisible({ timeout: 800 }).catch(() => false)) {
      await loc.click().catch(() => {});
      await loc.fill(value);
      return true;
    }
  }
  return false;
}

async function main() {
  const browser = await chromium.launch({
    headless: true,
    slowMo: 50,
    args: ['--disable-blink-features=AutomationControlled'],
  });
  const page = await browser.newPage({ locale: 'es-CO', viewport: { width: 1280, height: 900 } });

  console.log('Abriendo checkout MP...');
  await page.goto(checkoutUrl, { waitUntil: 'load', timeout: 120000 });
  await page.waitForTimeout(15000);

  await page.screenshot({ path: 'scripts/mp-checkout-loaded.png', fullPage: true });
  console.log('Screenshot: scripts/mp-checkout-loaded.png');

  // Seleccionar tarjeta si aparece lista de medios de pago
  for (const text of ['Tarjeta de crédito', 'Tarjeta de débito', 'Tarjeta', 'Crédito', 'Débito']) {
    const btn = page.getByText(text, { exact: false }).first();
    if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await btn.click();
      await page.waitForTimeout(2000);
      break;
    }
  }

  const filled = {
    number: await fillAllFrames(page, [
      'input[name="cardNumber"]',
      'input[data-testid="card-number"]',
      'input[placeholder*="5031"]',
      'input[autocomplete="cc-number"]',
      '#cardNumber',
    ], CARD.number),
    holder: await fillAllFrames(page, [
      'input[name="cardholderName"]',
      'input[name="cardholder"]',
      'input[placeholder*="titular"]',
      'input[autocomplete="cc-name"]',
    ], CARD.holder),
    expiry: await fillAllFrames(page, [
      'input[name="expirationDate"]',
      'input[placeholder*="MM"]',
      'input[autocomplete="cc-exp"]',
    ], CARD.expiry),
    cvv: await fillAllFrames(page, [
      'input[name="securityCode"]',
      'input[placeholder*="CVV"]',
      'input[autocomplete="cc-csc"]',
    ], CARD.cvv),
    doc: await fillAllFrames(page, [
      'input[name="identificationNumber"]',
      'input[name="docNumber"]',
      'input[placeholder*="documento"]',
    ], CARD.document),
  };
  console.log('Campos llenados:', filled);

  await page.screenshot({ path: 'scripts/mp-checkout-filled.png', fullPage: true });

  const pay = page.locator('button:has-text("Pagar"), button:has-text("Continuar"), [data-testid="submit"]').first();
  if (await pay.isVisible({ timeout: 5000 }).catch(() => false)) {
    await pay.click();
  }

  console.log('Esperando resultado (hasta 2 min)...');
  try {
    await page.waitForURL(/pago-exitoso|payment=cancelled|localhost/, { timeout: 120000 });
  } catch {
    console.log('URL final:', page.url());
  }

  await page.waitForTimeout(5000);
  await page.screenshot({ path: 'scripts/mp-checkout-result.png', fullPage: true });

  const syncRes = await fetch(`${BASE}/api/payments/sync-status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ref: referencia, email }),
  });
  const syncData = await syncRes.json();
  console.log('sync-status:', syncData);

  const canRes = await fetch(`${BASE}/api/payments/can-register?email=${encodeURIComponent(email)}`);
  console.log('can-register:', await canRes.json());

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
