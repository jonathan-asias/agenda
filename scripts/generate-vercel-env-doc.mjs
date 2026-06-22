/**
 * Genera docs/vercel-env-sandbox.md desde .env.local (valores reales, solo uso local).
 * Uso: node scripts/generate-vercel-env-doc.mjs
 */
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const envPath = path.join(root, '.env.local');
const outPath = path.join(root, 'docs', 'vercel-env-sandbox.md');

const KEYS = [
  'DATABASE_URL',
  'DATABASE_URL_AGENDA_APP',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_APP_URL',
  'APP_URL',
  'PUSH_ACTIVATION_SECRET',
  'SUPABASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET',
  'MERCADOPAGO_ACCESS_TOKEN',
  'MERCADOPAGO_SANDBOX',
  'MERCADOPAGO_WEBHOOK_SECRET',
  'WOMPI_PUBLIC_KEY',
  'WOMPI_PRIVATE_KEY',
  'WOMPI_INTEGRITY_SECRET',
  'WOMPI_EVENTS_SECRET',
  'WOMPI_SANDBOX',
  'RESEND_API_KEY',
  'EMAIL_FROM',
  'PLATFORM_ADMIN_EMAILS',
  'PLANS_INIT_SECRET',
  'REGISTRO_ACCESS_TTL_HOURS',
  'REGISTRO_ACCESS_SECRET',
  'WEB_PUSH_PUBLIC_KEY',
  'WEB_PUSH_PRIVATE_KEY',
  'PAYMENT_DEV_CONFIRM_SECRET',
  'SUBSCRIPTION_GRACE_DAYS',
  'INSTITUTION_ARCHIVE_RETENTION_DAYS',
];

function parseEnvFile(content) {
  const env = {};
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
  return env;
}

if (!fs.existsSync(envPath)) {
  console.error('No existe .env.local');
  process.exit(1);
}

const env = parseEnvFile(fs.readFileSync(envPath, 'utf8'));
const appUrl =
  env.APP_URL?.replace(/\/$/, '') ||
  env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ||
  'https://agenda-beta-kohl.vercel.app';

const lines = ['# Vercel — variables sandbox (valores desde .env.local)', ''];

for (const key of KEYS) {
  const value = env[key];
  if (value !== undefined && value !== '') {
    lines.push(`${key}=${value}`);
  }
}

lines.push('');
lines.push(`Webhook MP=${appUrl}/api/payments/webhook`);
lines.push(`Webhook Wompi=${appUrl}/api/wompi/webhook`);
if (env.PAYMENT_DEV_CONFIRM_SECRET) {
  lines.push(
    `URL confirmación manual=${appUrl}/prueba/confirmar-compra/${env.PAYMENT_DEV_CONFIRM_SECRET}`
  );
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${lines.join('\n')}\n`, 'utf8');
console.log(`Escrito: ${outPath} (${lines.length - 2} entradas)`);
