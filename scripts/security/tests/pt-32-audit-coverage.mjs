/**
 * PT-32 (P3) — Rutas VORTICO críticas con auditoría.
 */
import fs from 'fs';
import path from 'path';
import { PROJECT_ROOT } from '../load-env.mjs';
import { printResults } from '../pentest-lib.mjs';

export const id = 'PT-32';
export const title = 'Auditoría panel VORTICO';
export const priority = 'P3';

const VORTICO_ROUTES = [
  {
    rel: 'src/app/api/gestion-vortico/reset-password/route.ts',
    requireAudit: true,
  },
  {
    rel: 'src/app/api/gestion-vortico/instituciones/[id]/route.ts',
    requireAudit: false,
  },
];

export async function run() {
  const results = [];

  for (const { rel, requireAudit } of VORTICO_ROUTES) {
    const full = path.join(PROJECT_ROOT, rel);
    const exists = fs.existsSync(full);
    const content = exists ? fs.readFileSync(full, 'utf8') : '';
    const hasAudit = content.includes('writeAuditLog');
    const hasPlatformAdmin = content.includes('requirePlatformAdmin');

    results.push({
      pass: exists && hasPlatformAdmin,
      label: `${rel} — requirePlatformAdmin`,
      status: exists ? 1 : 0,
      detail: hasPlatformAdmin ? 'OK' : 'Falta guard',
    });

    results.push({
      pass: !requireAudit || hasAudit,
      label: `${rel} — writeAuditLog`,
      status: hasAudit ? 1 : 0,
      detail: !requireAudit
        ? 'Solo lectura (audit opcional)'
        : hasAudit
          ? 'Auditado'
          : 'Sin auditoría',
    });
  }

  return printResults(id, title, results);
}
