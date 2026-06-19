/**
 * PT-11 (P2) — Token de registro inválido / validación idempotente de pago aprobado.
 */
import { apiFetch, printResults, getApprovedPagoCredentials } from '../pentest-lib.mjs';

export const id = 'PT-11';
export const title = 'Tokens de registro y replay de validación';
export const priority = 'P2';

export async function run() {
  const results = [];

  const invalid = await apiFetch(
    '/api/payments/validate-registro-access?token=invalido.firmado'
  );
  results.push({
    pass: invalid.json?.valid === false,
    label: 'GET validate-registro-access token inválido',
    status: invalid.status,
    detail: invalid.json?.valid === false ? 'Rechazado' : 'VULNERABLE',
  });

  const pago = await getApprovedPagoCredentials();
  if (!pago) {
    results.push({
      pass: null,
      label: 'Doble consulta pago APPROVED',
      status: '-',
      detail: 'Sin pago APPROVED en BD ni PENTEST_PAGO_* en env',
    });
    return printResults(id, title, results);
  }

  console.log(`  Pago prueba: ${pago.referencia} (${pago.email})`);

  const [a, b] = await Promise.all([
    apiFetch(`/api/payments/can-register?email=${encodeURIComponent(pago.email)}`),
    apiFetch(`/api/payments/can-register?email=${encodeURIComponent(pago.email)}`),
  ]);

  const bothOk = a.status === 200 && b.status === 200 && a.json?.canRegister !== undefined;
  results.push({
    pass: bothOk,
    label: 'POST can-register paralelo (idempotente)',
    status: `${a.status}/${b.status}`,
    detail: bothOk
      ? 'Ambas respuestas OK (lectura idempotente)'
      : 'Revisar consistencia',
  });

  return printResults(id, title, results);
}
