/**
 * PT-08 (P1) — Docente A lee recordatorios del docente B.
 */
import {
  loginAs,
  apiFetch,
  printResults,
  requireEnv,
} from '../pentest-lib.mjs';

export const id = 'PT-08';
export const title = 'Lectura de recordatorios ajenos (by-docente)';
export const priority = 'P1';

export async function run() {
  requireEnv([
    'PENTEST_DOCENTE_A_EMAIL',
    'PENTEST_DOCENTE_A_PASSWORD',
    'PENTEST_DOCENTE_B_ID',
  ]);

  const session = await loginAs(
    process.env.PENTEST_DOCENTE_A_EMAIL,
    process.env.PENTEST_DOCENTE_A_PASSWORD
  );

  const docenteBId = process.env.PENTEST_DOCENTE_B_ID;
  const res = await apiFetch(`/api/recordatorios/by-docente/${docenteBId}`, {
    cookieHeader: session.cookieHeader,
  });

  const results = [];
  if (res.status === 403 || res.status === 401) {
    results.push({
      pass: true,
      label: `GET by-docente/${docenteBId}`,
      status: res.status,
      detail: 'Bloqueado',
    });
  } else if (res.status === 200 && Array.isArray(res.json?.recordatorios) && res.json.recordatorios.length > 0) {
    results.push({
      pass: false,
      label: `GET by-docente/${docenteBId}`,
      status: res.status,
      detail: `VULNERABLE: ${res.json.recordatorios.length} recordatorios visibles`,
    });
  } else if (res.status === 200) {
    results.push({
      pass: null,
      label: `GET by-docente/${docenteBId}`,
      status: res.status,
      detail: '200 con lista vacía — confirmar que B tiene recordatorios en staging',
    });
  } else {
    results.push({
      pass: res.status === 404,
      label: `GET by-docente/${docenteBId}`,
      status: res.status,
      detail: res.status === 404 ? '404 (aceptable)' : 'Revisar manualmente',
    });
  }

  return printResults(id, title, results);
}
