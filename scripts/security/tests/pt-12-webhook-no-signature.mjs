/**
 * PT-12 (P2) — Webhooks sin firma deben rechazarse (producción / Wompi no-sandbox).
 */
import { apiFetch, printResults } from '../pentest-lib.mjs';
import { loadPentestEnv } from '../load-env.mjs';

loadPentestEnv();

export const id = 'PT-12';
export const title = 'Webhooks sin firma HMAC';
export const priority = 'P2';

export async function run() {
  const mpSandbox =
    process.env.MERCADOPAGO_SANDBOX?.trim().toLowerCase() !== 'false' &&
    process.env.NODE_ENV !== 'production';
  const wompiSandbox = process.env.WOMPI_SANDBOX?.trim().toLowerCase() !== 'false';

  const results = [];

  const mpRes = await apiFetch('/api/payments/webhook?topic=payment&id=999999999', {
    method: 'POST',
    body: JSON.stringify({ type: 'payment', data: { id: '999999999' } }),
  });

  if (!mpSandbox) {
    results.push({
      pass: mpRes.status === 401 || mpRes.status === 403,
      label: 'MP webhook sin x-signature (prod)',
      status: mpRes.status,
      detail:
        mpRes.status === 401
          ? 'Rechazado'
          : mpRes.json?.approved
            ? 'VULNERABLE: aprobó sin firma'
            : `Status ${mpRes.status}`,
    });
  } else {
    results.push({
      pass: mpRes.json?.approved !== true,
      label: 'MP webhook sin firma (sandbox)',
      status: mpRes.status,
      detail:
        mpRes.json?.approved === true
          ? 'VULNERABLE: aprobó sin verificar MP'
          : 'No aprobó pago falso (OK en sandbox)',
    });
  }

  const wompiBody = {
    event: 'transaction.updated',
    data: {
      transaction: {
        id: 'pentest-fake-tx',
        status: 'APPROVED',
        amount_in_cents: 150000,
        reference: 'pentest-ref-fake',
        customer_email: 'fake@test.local',
      },
    },
  };

  const wompiRes = await apiFetch('/api/wompi/webhook', {
    method: 'POST',
    body: wompiBody,
  });

  if (!wompiSandbox) {
    results.push({
      pass: wompiRes.status === 401,
      label: 'Wompi webhook sin checksum (prod)',
      status: wompiRes.status,
      detail:
        wompiRes.status === 401
          ? 'Rechazado'
          : wompiRes.json?.approved
            ? 'VULNERABLE'
            : `Status ${wompiRes.status}`,
    });
  } else {
    results.push({
      pass: wompiRes.json?.approved !== true,
      label: 'Wompi webhook sin firma (sandbox)',
      status: wompiRes.status,
      detail:
        wompiRes.json?.approved === true
          ? 'VULNERABLE: aprobó transacción falsa'
          : 'No aprobó (404/400 esperado)',
    });
  }

  return printResults(id, title, results);
}
