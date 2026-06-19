/**
 * PT-13 (P2) — sync-status no disponible en producción; monto inválido en Wompi webhook.
 */
import { apiFetch, printResults } from '../pentest-lib.mjs';
import { loadPentestEnv } from '../load-env.mjs';

loadPentestEnv();

export const id = 'PT-13';
export const title = 'Manipulación de pagos / sync-status';
export const priority = 'P2';

export async function run() {
  const results = [];

  const syncProd = await apiFetch('/api/payments/sync-status', {
    method: 'POST',
    body: { ref: 'fake-ref', email: 'fake@test.local' },
  });

  const mpProd =
    process.env.MERCADOPAGO_SANDBOX?.trim().toLowerCase() === 'false' ||
    process.env.NODE_ENV === 'production';

  results.push({
    pass: mpProd ? syncProd.status === 403 : syncProd.status !== 500,
    label: 'POST sync-status en modo producción MP',
    status: syncProd.status,
    detail: mpProd
      ? syncProd.status === 403
        ? 'Bloqueado en prod'
        : 'VULNERABLE: sync abierto en prod'
      : 'Sandbox: endpoint disponible (esperado)',
  });

  const wompiBody = {
    event: 'transaction.updated',
    timestamp: Date.now(),
    signature: { properties: [], checksum: '' },
    data: {
      transaction: {
        id: 'pt13-amount-test',
        status: 'APPROVED',
        amount_in_cents: 100,
        reference: process.env.PENTEST_PAGO_REFERENCIA?.trim() || 'nonexistent-ref',
        customer_email: process.env.PENTEST_PAGO_EMAIL?.trim() || 'fake@test.local',
      },
    },
  };

  const wompiRes = await apiFetch('/api/wompi/webhook', {
    method: 'POST',
    body: wompiBody,
  });

  results.push({
    pass: wompiRes.status === 400 || wompiRes.status === 401 || wompiRes.status === 404,
    label: 'Wompi webhook monto/referencia inválidos',
    status: wompiRes.status,
    detail:
      wompiRes.json?.approved === true
        ? 'VULNERABLE: aprobó con monto bajo'
        : `Rechazado (${wompiRes.json?.error ?? 'ok'})`,
  });

  return printResults(id, title, results);
}
