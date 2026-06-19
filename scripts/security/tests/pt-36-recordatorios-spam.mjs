/**
 * PT-36 (P3) — Abuse / spam en POST recordatorios.
 */
import fs from 'fs';
import path from 'path';
import { PROJECT_ROOT } from '../load-env.mjs';
import { printResults } from '../pentest-lib.mjs';

export const id = 'PT-36';
export const title = 'Spam recordatorios / notificaciones';
export const priority = 'P3';

export async function run() {
  const routePath = path.join(PROJECT_ROOT, 'src/app/api/recordatorios/route.ts');
  const src = fs.readFileSync(routePath, 'utf8');

  const hasRateLimit = /checkRateLimit|rateLimitResponse/.test(src);
  const hasQuota =
    /checkPlanQuota|recordatorioQuota|MAX_RECORDATORIOS|throttl/i.test(src);

  return printResults(id, title, [
    {
      pass: hasRateLimit,
      label: 'Rate limit en POST /api/recordatorios',
      status: hasRateLimit ? 1 : 0,
      detail: hasRateLimit
        ? 'checkRateLimit presente'
        : 'Sin rate limit — riesgo de abuso de email/push',
    },
    {
      pass: hasQuota ? true : null,
      label: 'Cuota por plan o throttling (informativo)',
      status: hasQuota ? 1 : 0,
      detail: hasQuota
        ? 'Límite detectado en código'
        : 'Sin cuotas explícitas (recomendación del plan)',
    },
  ]);
}
