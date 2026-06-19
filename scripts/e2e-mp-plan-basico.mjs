/**
 * E2E: Plan Básico → Mercado Pago sandbox → verificar can-register
 * Uso: node scripts/e2e-mp-plan-basico.mjs
 */
import { chromium } from 'playwright';

const BASE = process.env.E2E_BASE_URL || 'http://localhost:3000';
const TEST_EMAIL = `e2e-${Date.now()}@test-agenda.local`;

const CARD = {
  number: '5031755734530604',
  cvv: '123',
  expiry: '11/30',
  holder: 'APRO',
  document: '123456789',
};

async function fillMercadoPagoCheckout(page) {
  await page.waitForURL(/mercadopago/, { timeout: 60000 });
  console.log('→ Checkout MP:', page.url());

  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});

  // Tarjeta de crédito / débito
  const cardOption = page
    .locator('text=/tarjeta|crédito|credito|débito|debito/i')
    .first();
  if (await cardOption.isVisible({ timeout: 8000 }).catch(() => false)) {
    await cardOption.click();
    await page.waitForTimeout(1500);
  }

  const fillInPageOrFrames = async (selectors, value) => {
    for (const frame of page.frames()) {
      for (const sel of selectors) {
        const el = frame.locator(sel).first();
        if (await el.isVisible({ timeout: 500 }).catch(() => false)) {
          await el.fill(value);
          return true;
        }
      }
    }
    for (const sel of selectors) {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 500 }).catch(() => false)) {
        await el.fill(value);
        return true;
      }
    }
    return false;
  };

  await fillInPageOrFrames(
    [
      'input[name="cardNumber"]',
      'input[id*="cardNumber"]',
      'input[placeholder*="5031"]',
      'input[autocomplete="cc-number"]',
      'input[inputmode="numeric"]',
    ],
    CARD.number
  );

  await fillInPageOrFrames(
    [
      'input[name="cardholderName"]',
      'input[id*="cardholder"]',
      'input[placeholder*="titular"]',
      'input[autocomplete="cc-name"]',
    ],
    CARD.holder
  );

  await fillInPageOrFrames(
    [
      'input[name="expirationDate"]',
      'input[id*="expiration"]',
      'input[placeholder*="MM"]',
      'input[autocomplete="cc-exp"]',
    ],
    CARD.expiry
  );

  await fillInPageOrFrames(
    [
      'input[name="securityCode"]',
      'input[id*="security"]',
      'input[placeholder*="CVV"]',
      'input[autocomplete="cc-csc"]',
    ],
    CARD.cvv
  );

  await fillInPageOrFrames(
    [
      'input[name="identificationNumber"]',
      'input[id*="identification"]',
      'input[placeholder*="documento"]',
    ],
    CARD.document
  );

  const payBtn = page
    .locator(
      'button:has-text("Pagar"), button:has-text("Continuar"), button[type="submit"]'
    )
    .first();
  await payBtn.click({ timeout: 15000 }).catch(async () => {
    await page.keyboard.press('Enter');
  });

  await page.waitForTimeout(3000);
}

async function main() {
  console.log('=== E2E Plan Básico + Mercado Pago sandbox ===');
  console.log('Email de prueba:', TEST_EMAIL);
  console.log('Base URL:', BASE);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    locale: 'es-CO',
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  let ref = null;
  let checkoutUrl = null;

  try {
    // 1. Landing → Plan Básico
    await page.goto(`${BASE}/#pricing`, { waitUntil: 'networkidle', timeout: 60000 });
    await page.getByRole('button', { name: 'Elegir Plan Básico' }).click();
    await page.locator('#checkout-nombre').fill('APRO');
    await page.locator('#checkout-email').fill(TEST_EMAIL);

    const prefPromise = page.waitForResponse(
      (r) => r.url().includes('/api/payments/create-preference') && r.request().method() === 'POST',
      { timeout: 30000 }
    );
    await page.getByRole('button', { name: 'Ir a pagar' }).click();
    const prefRes = await prefPromise;
    const prefData = await prefRes.json();
    checkoutUrl = prefData.checkoutUrl;
    console.log('→ create-preference:', prefRes.status(), 'sandbox:', prefData.sandbox);
    console.log('→ checkoutUrl:', checkoutUrl?.slice(0, 80) + '...');

    if (!checkoutUrl?.includes('sandbox.mercadopago')) {
      throw new Error('Checkout no es sandbox: ' + checkoutUrl);
    }

    // 2. Mercado Pago checkout
    await page.goto(checkoutUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await fillMercadoPagoCheckout(page);

    // 3. Esperar retorno o sync
    try {
      await page.waitForURL(/pago-exitoso|localhost:3000/, { timeout: 90000 });
    } catch {
      console.log('→ No hubo redirect automático; intentando sync-status vía API');
    }

    const currentUrl = page.url();
    const urlObj = new URL(currentUrl);
    ref = urlObj.searchParams.get('ref');

    if (!ref) {
      // Buscar ref en DB vía create-preference response - we need to extract from URL or API
      const syncRes = await fetch(`${BASE}/api/payments/can-register?email=${encodeURIComponent(TEST_EMAIL)}`);
      const syncData = await syncRes.json();
      console.log('→ can-register (sin ref):', syncData);

      if (!syncData.canRegister) {
        // Try to get pending payment ref from search - call sync if we had ref from preference
        // Extract ref from checkout external_reference - we don't have it in response
        // Re-create preference via API to get ref in DB
        const apiRes = await fetch(`${BASE}/api/payments/create-preference`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: TEST_EMAIL, planId: 1, nombre: 'APRO' }),
        });
        // Actually we already created one - search payments by email in DB isn't exposed
        // Parse ref from success URL in preference - not returned. Need to query DB or return ref in API.
        throw new Error(
          'Pago no completado en MP. URL final: ' +
            currentUrl +
            '. Revise titular APRO en formulario MP.'
        );
      }
    } else {
      console.log('→ ref:', ref);
      await page.waitForTimeout(5000);

      const canRegRes = await fetch(
        `${BASE}/api/payments/can-register?email=${encodeURIComponent(TEST_EMAIL)}`
      );
      const canReg = await canRegRes.json();
      console.log('→ can-register:', canReg);

      if (!canReg.canRegister) {
        const syncRes = await fetch(`${BASE}/api/payments/sync-status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ref, email: TEST_EMAIL }),
        });
        const syncData = await syncRes.json();
        console.log('→ sync-status:', syncData);

        const canReg2 = await (
          await fetch(
            `${BASE}/api/payments/can-register?email=${encodeURIComponent(TEST_EMAIL)}`
          )
        ).json();
        console.log('→ can-register (post-sync):', canReg2);

        if (!canReg2.canRegister) {
          throw new Error('Pago no confirmado. sync=' + JSON.stringify(syncData));
        }
      }
    }

    console.log('\n✅ PRUEBA EXITOSA — Plan Básico pagado, registro habilitado para', TEST_EMAIL);
    process.exit(0);
  } catch (err) {
    console.error('\n❌ PRUEBA FALLIDA:', err.message);
    if (page) {
      const screenshot = `scripts/e2e-mp-failure-${Date.now()}.png`;
      await page.screenshot({ path: screenshot, fullPage: true }).catch(() => {});
      console.error('Captura:', screenshot);
      console.error('URL final:', page.url());
    }
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
