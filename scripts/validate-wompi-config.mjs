/**
 * Valida variables Wompi en .env.local (sin imprimir secretos completos).
 * Uso: node scripts/validate-wompi-config.mjs
 */
import fs from 'fs';

const envPath = '.env.local';
if (!fs.existsSync(envPath)) {
  console.error('ERROR: .env.local no existe');
  process.exit(1);
}

const vars = {};
for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  const i = t.indexOf('=');
  if (i === -1) continue;
  let val = t.slice(i + 1).trim();
  if (
    (val.startsWith('"') && val.endsWith('"')) ||
    (val.startsWith("'") && val.endsWith("'"))
  ) {
    val = val.slice(1, -1);
  }
  vars[t.slice(0, i).trim()] = val;
}

const required = ['WOMPI_PUBLIC_KEY', 'WOMPI_PRIVATE_KEY', 'WOMPI_INTEGRITY_SECRET'];
const optional = ['WOMPI_EVENTS_SECRET', 'WOMPI_SANDBOX', 'APP_URL'];

console.log('--- Validación Wompi ---\n');

let ok = true;
for (const key of required) {
  const val = vars[key]?.trim();
  if (!val) {
    console.log(`✗ ${key}: FALTA`);
    ok = false;
  } else {
    console.log(`✓ ${key}: ${val.slice(0, 14)}…`);
  }
}

for (const key of optional) {
  const val = vars[key]?.trim();
  console.log(val ? `✓ ${key}: definida` : `○ ${key}: opcional (no definida)`);
}

const pub = vars.WOMPI_PUBLIC_KEY?.trim() ?? '';
const prv = vars.WOMPI_PRIVATE_KEY?.trim() ?? '';
const sandbox = vars.WOMPI_SANDBOX !== 'false';

if (sandbox && pub && !pub.startsWith('pub_test_')) {
  console.log('\n⚠ WOMPI_PUBLIC_KEY no parece de sandbox (pub_test_)');
}
if (sandbox && prv && !prv.startsWith('prv_test_')) {
  console.log('⚠ WOMPI_PRIVATE_KEY no parece de sandbox (prv_test_)');
}

const appUrl = vars.APP_URL?.trim();
if (!appUrl || appUrl.includes('localhost')) {
  console.log('\n⚠ APP_URL debe ser HTTPS público para webhooks Wompi (túnel o dominio).');
} else {
  console.log(`\n✓ Webhook sugerido: ${appUrl.replace(/\/$/, '')}/api/wompi/webhook`);
}

if (!vars.WOMPI_EVENTS_SECRET?.trim()) {
  console.log('⚠ WOMPI_EVENTS_SECRET: configure en Dashboard Wompi → Secretos de integración.');
}

console.log('\nReinicie npm run dev después de cambiar .env.local.');

process.exit(ok ? 0 : 1);
