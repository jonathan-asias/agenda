/**
 * PT-14 (P2) — sync-status idempotente para pago ya APPROVED.
 */
import { apiFetch, printResults, getApprovedPagoCredentials, PentestSkip } from '../pentest-lib.mjs';

export const id = 'PT-14';
export const title = 'Race / idempotencia sync-status';
export const priority = 'P2';

export async function run() {
  const pago = await getApprovedPagoCredentials();
  if (!pago) {
    throw new PentestSkip('Sin pago APPROVED en BD ni PENTEST_PAGO_* en env');
  }

  console.log(`  Pago prueba: ${pago.referencia} (${pago.email})`);

  const body = { ref: pago.referencia, email: pago.email };
  const [r1, r2, r3] = await Promise.all([
    apiFetch('/api/payments/sync-status', { method: 'POST', body }),
    apiFetch('/api/payments/sync-status', { method: 'POST', body }),
    apiFetch('/api/payments/sync-status', { method: 'POST', body }),
  ]);

  const results = [];
  const allOk =
    r1.status === 200 &&
    r2.status === 200 &&
    r3.status === 200 &&
    r1.json?.synced !== false;

  results.push({
    pass: allOk,
    label: '3× sync-status paralelo',
    status: `${r1.status}/${r2.status}/${r3.status}`,
    detail: allOk
      ? 'Idempotente sin error 500'
      : 'Revisar race condition',
  });

  results.push({
    pass: r1.json?.duplicate !== false || r1.json?.synced === true,
    label: 'Respuesta coherente (synced/duplicate)',
    status: r1.status,
    detail: JSON.stringify(r1.json).slice(0, 120),
  });

  return printResults(id, title, results);
}
