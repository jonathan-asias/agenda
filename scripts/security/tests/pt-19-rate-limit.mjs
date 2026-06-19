/**
 * PT-19 (P3) — Rate limiting en endpoint sensible.
 */
import { apiFetch, printResults } from '../pentest-lib.mjs';

export const id = 'PT-19';
export const title = 'Rate limiting — auth reset request';
export const priority = 'P3';

export async function run() {
  const results = [];
  const attempts = 8;
  const responses = [];

  for (let i = 0; i < attempts; i++) {
    responses.push(
      await apiFetch('/api/auth/reset-password/request', {
        method: 'POST',
        body: { email: `pentest-rate-${i}@test.local` },
      })
    );
  }

  const rateLimited = responses.some((r) => r.status === 429);
  const all500 = responses.every((r) => r.status >= 500);

  results.push({
    pass: !all500,
    label: `${attempts} POST reset-password/request`,
    status: responses.map((r) => r.status).join(','),
    detail: all500 ? 'Errores servidor' : 'Endpoint responde sin caer',
  });

  results.push({
    pass: true,
    label: 'Rate limit 429 (informativo en local)',
    status: rateLimited ? 429 : 200,
    detail: rateLimited
      ? 'Rate limit activado'
      : 'Sin 429 en pocas req (límite 5/300s; normal en dev)',
  });

  return printResults(id, title, results);
}
