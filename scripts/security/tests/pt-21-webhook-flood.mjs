/**
 * PT-21 (P2) — Flood de webhooks con firma inválida (rate limit + no aprobación).
 */
import { apiFetch, printResults } from '../pentest-lib.mjs';

export const id = 'PT-21';
export const title = 'Flood webhooks falsos';
export const priority = 'P2';

export async function run() {
  const results = [];
  const requests = 15;
  const responses = await Promise.all(
    Array.from({ length: requests }, (_, i) =>
      apiFetch('/api/payments/webhook?topic=payment&id=flood' + i, {
        method: 'POST',
        body: JSON.stringify({ type: 'payment', data: { id: String(i) } }),
        headers: { 'x-signature': 'invalid', 'x-request-id': 'pentest-' + i },
      })
    )
  );

  const approved = responses.filter((r) => r.json?.approved === true).length;
  const rateLimited = responses.filter((r) => r.status === 429).length;

  results.push({
    pass: approved === 0,
    label: `${requests} webhooks MP inválidos sin aprobación`,
    status: approved,
    detail: approved ? 'VULNERABLE' : 'Ninguno aprobó pago',
  });

  results.push({
    pass: true,
    label: 'Rate limit activo (opcional)',
    status: rateLimited,
    detail:
      rateLimited > 0
        ? `${rateLimited} respuestas 429`
        : 'Sin 429 en 15 req (límite 120/min)',
  });

  return printResults(id, title, results);
}
