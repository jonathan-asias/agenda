/**
 * PT-35 (P3) — Bootstrap branding sin sesión (ventana post-registro).
 */
import { apiFetchForm, printResults, requireEnv, PentestSkip } from '../pentest-lib.mjs';

export const id = 'PT-35';
export const title = 'Bootstrap branding sin sesión';
export const priority = 'P3';

function tinyPngBlob() {
  const buf = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4,
    0x89, 0x00, 0x00, 0x00, 0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
    0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae,
    0x42, 0x60, 0x82,
  ]);
  return new Blob([buf], { type: 'image/png' });
}

async function bootstrapPut(instId, bootstrapEmail) {
  const form = new FormData();
  if (bootstrapEmail != null) {
    form.append('bootstrapEmail', bootstrapEmail);
  }
  form.append('logo', tinyPngBlob(), 'logo.png');
  return apiFetchForm(`/api/instituciones/${instId}/branding`, {
    method: 'PUT',
    formData: form,
  });
}

export async function run() {
  requireEnv(['PENTEST_INSTITUTION_B_ID']);

  const instB = Number(process.env.PENTEST_INSTITUTION_B_ID);
  if (!instB) throw new PentestSkip('PENTEST_INSTITUTION_B_ID inválido');

  const [noAuth, wrongEmail] = await Promise.all([
    bootstrapPut(instB, null),
    bootstrapPut(instB, 'atacante-no-existe@test.local'),
  ]);

  const results = [
    {
      pass: noAuth.status === 401 || noAuth.status === 403,
      label: 'Sin cookie ni bootstrapEmail',
      status: noAuth.status,
      detail:
        noAuth.status === 401
          ? 'Requiere autenticación'
          : noAuth.status === 403
            ? 'Denegado'
            : 'VULNERABLE: permitió upload anónimo',
      json: noAuth.status < 400 ? noAuth.json : undefined,
    },
    {
      pass: wrongEmail.status === 403 || wrongEmail.status === 401 || wrongEmail.status === 404,
      label: 'bootstrapEmail ajeno a la institución',
      status: wrongEmail.status,
      detail:
        wrongEmail.status >= 400
          ? (wrongEmail.json?.error ?? 'Rechazado')
          : 'VULNERABLE: email ajeno aceptado',
      json: wrongEmail.status < 400 ? wrongEmail.json : undefined,
    },
  ];

  return printResults(id, title, results);
}
