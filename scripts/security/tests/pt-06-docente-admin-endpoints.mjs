/**
 * PT-06 (P1) — Docente no debe ejecutar endpoints de administrador.
 */
import {
  loginAs,
  apiFetch,
  printResults,
  requireEnv,
} from '../pentest-lib.mjs';

export const id = 'PT-06';
export const title = 'Escalada vertical — docente vs endpoints admin';
export const priority = 'P1';

const ADMIN_ENDPOINTS = [
  { label: 'POST /api/auth/check-email', method: 'POST', path: '/api/auth/check-email', body: { email: 'probe@test.local' } },
  {
    label: 'POST /api/setup/docentes',
    method: 'POST',
    path: '/api/setup/docentes',
    body: {
      institucionId: 1,
      docentes: [{
        nombres: 'Pentest',
        apellidos: 'Probe',
        telefono: '+573001234567',
        email: `pentest-probe-${Date.now()}@test.local`,
        password: 'Probe1234!Probe',
      }],
    },
  },
  { label: 'GET /api/estudiantes/plantilla/1', method: 'GET', path: '/api/estudiantes/plantilla/1' },
];

export async function run() {
  requireEnv(['PENTEST_DOCENTE_A_EMAIL', 'PENTEST_DOCENTE_A_PASSWORD']);

  const session = await loginAs(
    process.env.PENTEST_DOCENTE_A_EMAIL,
    process.env.PENTEST_DOCENTE_A_PASSWORD
  );

  const results = [];
  for (const ep of ADMIN_ENDPOINTS) {
    const res = await apiFetch(ep.path, {
      method: ep.method,
      cookieHeader: session.cookieHeader,
      body: ep.body,
    });
    const blocked = res.status === 401 || res.status === 403;
    results.push({
      pass: blocked,
      label: ep.label,
      status: res.status,
      detail: blocked ? 'Acceso denegado' : 'VULNERABLE: docente accedió',
      json: blocked ? undefined : res.json,
    });
  }

  return printResults(id, title, results);
}
