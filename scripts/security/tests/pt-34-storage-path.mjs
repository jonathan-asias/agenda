/**
 * PT-34 (P3) — Path traversal y políticas storage.
 */
import fs from 'fs';
import path from 'path';
import { PROJECT_ROOT } from '../load-env.mjs';
import { printResults } from '../pentest-lib.mjs';

export const id = 'PT-34';
export const title = 'Path traversal — storage branding';
export const priority = 'P3';

export async function run() {
  const brandingRoute = fs.readFileSync(
    path.join(PROJECT_ROOT, 'src/app/api/instituciones/[id]/branding/route.ts'),
    'utf8'
  );
  const policiesPath = path.join(PROJECT_ROOT, 'supabase/storage-policies.sql');
  const policies = fs.existsSync(policiesPath)
    ? fs.readFileSync(policiesPath, 'utf8')
    : '';

  const pathServerGenerated =
    brandingRoute.includes('`${institutionId}/logo-${Date.now()}`') &&
    brandingRoute.includes('`${institutionId}/banner-${Date.now()}`');
  const noUserPathInput = !/formData\.get\(['"]path/i.test(brandingRoute);

  const anonWriteDenied =
    policies.includes('instituciones_deny_anon_write') &&
    policies.includes('WITH CHECK (false)');

  return printResults(id, title, [
    {
      pass: pathServerGenerated && noUserPathInput,
      label: 'Paths generados en servidor (sin input usuario)',
      status: 1,
      detail: pathServerGenerated
        ? 'logo/banner bajo {institutionId}/logo-{timestamp}'
        : 'Revisar construcción de paths',
    },
    {
      pass: anonWriteDenied || policies.length === 0,
      label: 'Políticas storage deniegan escritura anon',
      status: anonWriteDenied ? 1 : 0,
      detail: anonWriteDenied
        ? 'instituciones_deny_anon_write presente'
        : policies.length === 0
          ? 'Sin storage-policies.sql (revisar manualmente)'
          : 'Falta política deny write',
    },
  ]);
}
