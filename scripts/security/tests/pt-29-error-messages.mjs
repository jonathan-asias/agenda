/**
 * PT-29 (P3) — Errores API sin stack trace en producción.
 */
import { apiFetch, printResults } from '../pentest-lib.mjs';

export const id = 'PT-29';
export const title = 'Mensajes de error no verbosos';
export const priority = 'P3';

const LEAK_PATTERNS = [
  /at\s+\S+\s+\(/,
  /node_modules/,
  /prisma/i,
  /ECONNREFUSED/,
  /stack/i,
];

export async function run() {
  const probes = [
    { label: 'ID inválido estudiante', path: '/api/estudiantes/not-a-number' },
    { label: 'Webhook MP body malo', path: '/api/payments/webhook?topic=payment&id=x', method: 'POST', body: 'not-json' },
  ];

  const results = [];

  for (const p of probes) {
    const res = await apiFetch(p.path, {
      method: p.method || 'GET',
      body: p.body,
      headers: p.body ? { 'Content-Type': 'text/plain' } : {},
    });
    const text = JSON.stringify(res.json ?? '');
    const leaks = LEAK_PATTERNS.some((re) => re.test(text));

    results.push({
      pass: !leaks,
      label: p.label,
      status: res.status,
      detail: leaks ? 'Posible fuga de stack/schema' : 'Respuesta genérica',
    });
  }

  return printResults(id, title, results);
}
