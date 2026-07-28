/**
 * Sube variables a Vercel (production + preview) desde docs/vercel-env-sandbox.md
 * Uso: node scripts/push-vercel-env.mjs
 */
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const sourcePath = path.join(process.cwd(), 'docs', 'vercel-env-sandbox.md');
const targets = ['production', 'preview'];

function parseEnvLines(content) {
  const entries = [];
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    if (!/^[A-Z][A-Z0-9_]*$/.test(key)) continue;
    entries.push({ key, value: trimmed.slice(eq + 1) });
  }
  return entries;
}

function runVercel(args) {
  return spawnSync('npx', ['vercel', ...args], {
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true,
    encoding: 'utf8',
  });
}

function addEnv(key, value, target) {
  runVercel(['env', 'rm', key, target, '-y']);
  const args = ['env', 'add', key, target, '--value', value, '--yes'];
  return runVercel(args);
}

if (!fs.existsSync(sourcePath)) {
  console.error('No existe docs/vercel-env-sandbox.md');
  process.exit(1);
}

const entries = parseEnvLines(fs.readFileSync(sourcePath, 'utf8'));
if (entries.length === 0) {
  console.error('No hay variables para subir');
  process.exit(1);
}

console.log(`Subiendo ${entries.length} variables a ${targets.join(', ')}...\n`);

let ok = 0;
let fail = 0;

for (const { key, value } of entries) {
  for (const target of targets) {
    const result = addEnv(key, value, target);
    if (result.status === 0) {
      console.log(`OK  ${key} → ${target}`);
      ok += 1;
    } else {
      console.error(`FAIL ${key} → ${target}`);
      if (result.stderr) console.error(result.stderr.trim());
      if (result.stdout) console.error(result.stdout.trim());
      fail += 1;
    }
  }
}

console.log(`\nListo: ${ok} ok, ${fail} fallos`);
process.exit(fail > 0 ? 1 : 0);
