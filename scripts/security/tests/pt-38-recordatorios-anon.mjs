/**
 * PT-38 (P3) — Recordatorios por institución no filtran PII sin auth.
 */
import { apiFetch, printResults } from '../pentest-lib.mjs';

export const id = 'PT-38';
export const title = 'Recordatorios sin autenticación';
export const priority = 'P3';

export async function run() {
  const instId = process.env.PENTEST_INSTITUTION_A_ID || '8';
  const res = await apiFetch(`/api/recordatorios/by-institucion/${instId}`);

  const results = [
    {
      pass: res.status === 401 || res.status === 403,
      label: `GET by-institucion/${instId} sin sesión`,
      status: res.status,
      detail:
        res.status === 200
          ? 'VULNERABLE: recordatorios expuestos'
          : 'Denegado',
    },
  ];

  return printResults(id, title, results);
}
