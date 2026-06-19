/**
 * PT-37 (P1) — Push subscribe sin token válido.
 */
import { apiFetch, printResults } from '../pentest-lib.mjs';

export const id = 'PT-37';
export const title = 'Push cross-tenant — subscribe sin token';
export const priority = 'P1';

export async function run() {
  const body = {
    institucionId: Number(process.env.PENTEST_INSTITUTION_B_ID) || 99999,
    acudienteId: 1,
    subscribeToken: 'invalid.token.here',
    subscription: {
      endpoint: 'https://fcm.googleapis.com/fcm/send/fake-endpoint',
      keys: { p256dh: 'dGVzdA==', auth: 'dGVzdA==' },
    },
  };

  const res = await apiFetch('/api/push/subscribe', { method: 'POST', body });

  const results = [];
  results.push({
    pass: res.status === 403 || res.status === 401 || res.status === 503,
    label: 'POST /api/push/subscribe token inválido',
    status: res.status,
    detail:
      res.status === 200
        ? 'VULNERABLE: suscripción creada sin token'
        : `Rechazado (${res.json?.error ?? 'ok'})`,
  });

  return printResults(id, title, results);
}
