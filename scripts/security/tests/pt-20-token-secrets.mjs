/**
 * PT-20 (P2) — Fortaleza de secretos HMAC y rechazo de tokens débiles.
 */
import { apiFetch, printResults } from '../pentest-lib.mjs';
import { loadPentestEnv } from '../load-env.mjs';

loadPentestEnv();

export const id = 'PT-20';
export const title = 'Secretos de tokens y validación';
export const priority = 'P2';

const MIN_SECRET_BYTES = 16;

export async function run() {
  const results = [];

  const secrets = [
    { name: 'REGISTRO_ACCESS_SECRET', value: process.env.REGISTRO_ACCESS_SECRET?.trim() },
    { name: 'PUSH_ACTIVATION_SECRET', value: process.env.PUSH_ACTIVATION_SECRET?.trim() },
  ].filter((s) => s.value);

  if (!secrets.length) {
    results.push({
      pass: null,
      label: 'Longitud de secretos HMAC',
      status: '-',
      detail: 'Sin REGISTRO_ACCESS_SECRET ni PUSH_ACTIVATION_SECRET en env',
    });
  } else {
    for (const s of secrets) {
      const bytes = Buffer.byteLength(s.value, 'utf8');
      results.push({
        pass: bytes >= MIN_SECRET_BYTES,
        label: `${s.name} >= ${MIN_SECRET_BYTES} bytes`,
        status: bytes,
        detail: bytes >= 32 ? 'Fuerte' : bytes >= 16 ? 'Aceptable' : 'DÉBIL',
      });
    }
  }

  const tampered = await apiFetch(
    '/api/payments/validate-registro-access?token=' +
      encodeURIComponent('eyJ.fake.payload.fakesignature')
  );
  results.push({
    pass: tampered.json?.valid === false,
    label: 'Token registro manipulado rechazado',
    status: tampered.status,
    detail: tampered.json?.reason ?? 'invalid',
  });

  const activate = await apiFetch('/api/push/activate?estudianteId=1&sig=1.0.fake');
  results.push({
    pass: activate.status === 403 || activate.status === 400 || activate.status === 404,
    label: 'Push activation sig inválida',
    status: activate.status,
    detail: activate.json?.error ?? 'rechazado',
  });

  return printResults(id, title, results);
}
