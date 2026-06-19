/**
 * PT-33 (P3) — Polyglot / MIME spoofing en upload de branding.
 */
import {
  loginAs,
  resolveInstitutionId,
  apiFetchForm,
  printResults,
  requireEnv,
  PentestSkip,
} from '../pentest-lib.mjs';

export const id = 'PT-33';
export const title = 'MIME spoofing — branding upload';
export const priority = 'P3';

function buildPolyglotPng() {
  const header = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const payload = Buffer.from('<html><body><script>alert("xss")</script></body></html>', 'utf8');
  return Buffer.concat([header, payload]);
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

  const blob = new Blob([buildPolyglotPng()], { type: 'image/png' });
  const form = new FormData();
  form.append('logo', blob, 'polyglot.png');

  const res = await apiFetchForm(`/api/instituciones/${instId}/branding`, {
    method: 'PUT',
    cookieHeader: session.cookieHeader,
    formData: form,
  });

  const rejected = res.status === 400 || res.status === 403 || res.status === 415;

  return printResults(id, title, [
    {
      pass: rejected,
      label: 'Polyglot PNG+HTML rechazado',
      status: res.status,
      detail: rejected
        ? (res.json?.error ?? 'Rechazado')
        : 'VULNERABLE: upload aceptado sin validación de contenido',
      json: rejected ? undefined : res.json,
    },
  ]);
}
