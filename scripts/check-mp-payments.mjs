import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

function loadEnv() {
  const raw = readFileSync(join(ROOT, '.env.local'), 'utf8');
  for (const line of raw.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i === -1) continue;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
}
loadEnv();

const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
const refs = [
  '8019b1a8-7f4a-4b49-8807-b719627a56d1',
  'f6b8db03-a19e-42b9-8b53-3b0c0c6515eb',
  '1c37e24e-55de-45c1-824d-30ad87a1d190',
];

for (const ref of refs) {
  const url = `https://api.mercadopago.com/v1/payments/search?external_reference=${ref}&sort=date_created&criteria=desc`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  console.log('\nref:', ref);
  console.log('payments:', (data.results ?? []).map((p) => ({ id: p.id, status: p.status, detail: p.status_detail })));
}

// Token type
console.log('\nToken prefix:', token?.slice(0, 12));
