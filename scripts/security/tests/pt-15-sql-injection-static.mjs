/**
 * PT-15 (P2) — Auditoría estática SQL injection (Prisma raw queries).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PROJECT_ROOT } from '../load-env.mjs';
import { printResults } from '../pentest-lib.mjs';

export const id = 'PT-15';
export const title = 'SQL injection — raw queries';
export const priority = 'P2';

const SRC = path.join(PROJECT_ROOT, 'src');
const UNSAFE = [
  /\$queryRawUnsafe/,
  /\$executeRawUnsafe/,
  /\$queryRaw\s*`[^`]*\$\{/,
  /\$executeRaw\s*`[^`]*\$\{/,
];

const ALLOWLIST = new Set([
  'src/lib/db/rls-context.ts',
  'src/lib/auth/invalidate-user-sessions.ts',
]);

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && e.name !== 'node_modules') walk(full, acc);
    else if (/\.(ts|tsx|js|mjs)$/.test(e.name)) acc.push(full);
  }
  return acc;
}

export async function run() {
  const hits = [];
  for (const file of walk(SRC)) {
    const content = fs.readFileSync(file, 'utf8');
    for (const re of UNSAFE) {
      if (re.test(content)) {
        const rel = path.relative(PROJECT_ROOT, file).replace(/\\/g, '/');
        if (!ALLOWLIST.has(rel)) hits.push(rel);
        break;
      }
    }
  }

  const results = [
    {
      pass: hits.length === 0,
      label: 'Sin $queryRawUnsafe / concatenación insegura',
      status: hits.length,
      detail:
        hits.length === 0
          ? 'Solo raw parametrizado en rls-context'
          : `Revisar: ${hits.join(', ')}`,
    },
  ];

  const rls = path.join(SRC, 'lib', 'db', 'rls-context.ts');
  const rlsContent = fs.readFileSync(rls, 'utf8');
  results.push({
    pass: rlsContent.includes('$executeRaw`') && rlsContent.includes('set_config'),
    label: 'RLS context usa tagged template parametrizado',
    status: rlsContent.includes('$executeRaw') ? 1 : 0,
    detail: 'set_config con parámetros bind',
  });

  return printResults(id, title, results);
}
