/**
 * PT-09 (P1) — Usuario institución no accede al panel VORTICO.
 */
import {
  loginAs,
  apiFetch,
  printResults,
  requireEnv,
} from '../pentest-lib.mjs';

export const id = 'PT-09';
export const title = 'Acceso no autorizado a panel VORTICO';
export const priority = 'P1';

export async function run() {
  requireEnv(['PENTEST_TENANT_A_EMAIL', 'PENTEST_TENANT_A_PASSWORD']);

  const session = await loginAs(
    process.env.PENTEST_TENANT_A_EMAIL,
    process.env.PENTEST_TENANT_A_PASSWORD
  );

  const endpoints = [
    { label: 'GET /api/gestion-vortico/instituciones', path: '/api/gestion-vortico/instituciones' },
    { label: 'GET /api/gestion-vortico/stats', path: '/api/gestion-vortico/stats' },
    {
      label: 'POST /api/gestion-vortico/reset-password',
      path: '/api/gestion-vortico/reset-password',
      method: 'POST',
      body: { userType: 'institucion', email: 'x@test.local', password: 'Test1234!' },
    },
  ];

  const results = [];
  for (const ep of endpoints) {
    const res = await apiFetch(ep.path, {
      method: ep.method || 'GET',
      cookieHeader: session.cookieHeader,
      body: ep.body,
    });
    const blocked = res.status === 401 || res.status === 403;
    results.push({
      pass: blocked,
      label: ep.label,
      status: res.status,
      detail: blocked ? 'Denegado' : 'VULNERABLE',
      json: blocked ? undefined : res.json,
    });
  }

  return printResults(id, title, results);
}
