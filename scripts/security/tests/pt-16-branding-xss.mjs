/**
 * PT-16 (P1) — Branding acepta colores/URLs maliciosos (XSS/SSRF probe).
 */
import {
  loginAs,
  resolveInstitutionId,
  apiFetch,
  printResults,
  requireEnv,
  PentestSkip,
} from '../pentest-lib.mjs';

export const id = 'PT-16';
export const title = 'XSS/SSRF en branding JSON';
export const priority = 'P1';

const MALICIOUS_PAYLOAD = {
  color_primario: 'red;}</style><script>alert(1)</script><style>',
  color_secundario: '#000000',
  logo_url: 'https://evil.example.com/track.png',
  banner_url: 'javascript:alert(1)',
};

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

  const putRes = await apiFetch(`/api/instituciones/${instId}/branding`, {
    method: 'PUT',
    cookieHeader: session.cookieHeader,
    body: MALICIOUS_PAYLOAD,
  });

  const getRes = await apiFetch(`/api/instituciones/${instId}/branding`, {
    cookieHeader: session.cookieHeader,
  });

  const results = [];

  const acceptedPayload =
    putRes.status === 200 &&
    (getRes.json?.color_primario?.includes('script') ||
      getRes.json?.logo_url?.includes('evil.example'));

  results.push({
    pass: !acceptedPayload,
    label: 'API rechaza o sanitiza payload malicioso',
    status: putRes.status,
    detail: acceptedPayload
      ? 'VULNERABLE: payload almacenado sin validación'
      : putRes.status === 400
        ? 'Rechazado con 400'
        : `PUT ${putRes.status} — verificar valores persistidos`,
  });

  if (getRes.json) {
    const storedBad =
      String(getRes.json.color_primario || '').includes('script') ||
      String(getRes.json.logo_url || '').startsWith('https://evil');
    results.push({
      pass: !storedBad,
      label: 'Valores peligrosos no persistidos',
      status: getRes.status,
      detail: storedBad ? 'Datos maliciosos en BD' : 'OK o no aplicado',
    });
  }

  return printResults(id, title, results);
}
