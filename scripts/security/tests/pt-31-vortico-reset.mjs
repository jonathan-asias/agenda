/**
 * PT-31 (P1) — Reset VORTICO sin sesión platform admin.
 */
import { apiFetch, printResults } from '../pentest-lib.mjs';

export const id = 'PT-31';
export const title = 'VORTICO — reset password anónimo';
export const priority = 'P1';

export async function run() {
  const res = await apiFetch('/api/gestion-vortico/reset-password', {
    method: 'POST',
    body: {
      userType: 'institucion',
      email: 'victim@example.com',
      password: 'Hacked1234!',
    },
  });

  const results = [];
  results.push({
    pass: res.status === 401 || res.status === 403,
    label: 'POST reset-password sin sesión admin',
    status: res.status,
    detail:
      res.status === 200
        ? 'VULNERABLE: reset ejecutado sin auth'
        : 'Denegado',
  });

  return printResults(id, title, results);
}
