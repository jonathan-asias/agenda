/**
 * PT-26 (P1) — Respuestas API no deben incluir password.
 */
import {
  loginAs,
  resolveInstitutionId,
  apiFetch,
  printResults,
  requireEnv,
  PentestSkip,
} from '../pentest-lib.mjs';

export const id = 'PT-26';
export const title = 'Exposición de contraseñas en JSON';
export const priority = 'P1';

function findPasswordKey(obj, path = '') {
  const hits = [];
  if (obj == null || typeof obj !== 'object') return hits;
  for (const [k, v] of Object.entries(obj)) {
    const p = path ? `${path}.${k}` : k;
    if (k.toLowerCase() === 'password' && v != null && v !== '') {
      hits.push(p);
    }
    if (typeof v === 'object') hits.push(...findPasswordKey(v, p));
  }
  return hits;
}

export async function run() {
  requireEnv(['PENTEST_TENANT_A_EMAIL', 'PENTEST_TENANT_A_PASSWORD']);

  const session = await loginAs(
    process.env.PENTEST_TENANT_A_EMAIL,
    process.env.PENTEST_TENANT_A_PASSWORD
  );

  const instId =
    Number(process.env.PENTEST_INSTITUTION_A_ID) ||
    (await resolveInstitutionId(session.cookieHeader));
  if (!instId) throw new PentestSkip('Sin institutionId');

  const endpoints = [
    { label: 'GET institución', path: `/api/instituciones/${instId}` },
    { label: 'GET dashboard', path: `/api/instituciones/${instId}/dashboard` },
    { label: 'GET perfil', path: `/api/instituciones/${instId}/perfil` },
  ];

  const results = [];
  for (const ep of endpoints) {
    const res = await apiFetch(ep.path, { cookieHeader: session.cookieHeader });
    const hits = res.json ? findPasswordKey(res.json) : [];
    results.push({
      pass: hits.length === 0,
      label: ep.label,
      status: res.status,
      detail: hits.length ? `password en: ${hits.join(', ')}` : 'Sin campo password',
    });
  }

  return printResults(id, title, results);
}
