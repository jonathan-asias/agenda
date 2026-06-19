/**
 * PT-23 (P2) — Push subscribe token expirado / malformado.
 */
import { apiFetch, printResults } from '../pentest-lib.mjs';

export const id = 'PT-23';
export const title = 'Tokens push — TTL y formato';
export const priority = 'P2';

export async function run() {
  const instId = Number(process.env.PENTEST_INSTITUTION_A_ID) || 8;

  const expiredToken = '1.1.1.0.expiredsignature00000000000000000000000000000000';
  const res = await apiFetch('/api/push/subscribe', {
    method: 'POST',
    body: {
      institucionId: instId,
      acudienteId: 1,
      subscribeToken: expiredToken,
      subscription: {
        endpoint: 'https://fcm.googleapis.com/fcm/send/test',
        keys: { p256dh: 'dGVzdA==', auth: 'dGVzdA==' },
      },
    },
  });

  const results = [
    {
      pass: res.status === 403 || res.status === 401,
      label: 'subscribeToken expirado/malformado',
      status: res.status,
      detail: res.json?.error ?? 'rechazado',
    },
  ];

  return printResults(id, title, results);
}
