/**
 * PT-28 (P3) — No exponer secretos en NEXT_PUBLIC_*.
 */
import fs from 'fs';
import path from 'path';
import { PROJECT_ROOT } from '../load-env.mjs';
import { printResults } from '../pentest-lib.mjs';

export const id = 'PT-28';
export const title = 'Variables NEXT_PUBLIC sin secretos';
export const priority = 'P3';

const FORBIDDEN_VAR =
  /process\.env\.(NEXT_PUBLIC_[A-Z0-9_]*(SECRET|SERVICE_ROLE|PRIVATE|WEBHOOK_SECRET|PASSWORD)[A-Z0-9_]*)/gi;

function scanFile(filePath) {
  if (filePath.includes('.env')) return [];
  const content = fs.readFileSync(filePath, 'utf8');
  const hits = [];
  for (const line of content.split('\n')) {
    const matches = line.matchAll(FORBIDDEN_VAR);
    for (const m of matches) {
      hits.push(`${path.basename(filePath)}: ${m[1]}`);
    }
  }
  return hits;
}

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === '.next') continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, acc);
    else if (/\.(ts|tsx|js|mjs)$/.test(e.name)) acc.push(full);
  }
  return acc;
}

export async function run() {
  const files = walk(path.join(PROJECT_ROOT, 'src'));
  const allHits = files.flatMap(scanFile);

  const results = [
    {
      pass: allHits.length === 0,
      label: 'Sin NEXT_PUBLIC_* con SECRET/SERVICE_ROLE',
      status: allHits.length,
      detail:
        allHits.length === 0
          ? 'OK en src/ y raíz'
          : allHits.slice(0, 3).join('; '),
    },
  ];

  return printResults(id, title, results);
}
