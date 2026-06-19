import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = 'http://localhost:3000';

const pref = await fetch(`${BASE}/api/payments/create-preference`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'prueba-manual@test.com', planId: 1, nombre: 'APRO' }),
}).then((r) => r.json());

console.log(JSON.stringify(pref, null, 2));
