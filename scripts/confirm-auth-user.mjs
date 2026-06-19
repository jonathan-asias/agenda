/**
 * Confirma email y opcionalmente fija contraseña en Supabase Auth.
 * Uso: node scripts/confirm-auth-user.mjs jonathanasias+4@gmail.com [NuevaPass2025!@]
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

try {
  const envPath = resolve(process.cwd(), '.env.local');
  const raw = readFileSync(envPath, 'utf8');
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
} catch {
  // .env.local opcional si las vars ya están en el entorno
}

const email = process.argv[2]?.trim().toLowerCase();
const newPassword = process.argv[3];

if (!email) {
  console.error('Uso: node scripts/confirm-auth-user.mjs <email> [password]');
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

let page = 1;
let user = null;

while (page <= 20 && !user) {
  const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
  if (error) {
    console.error('Error listando usuarios:', error.message);
    process.exit(1);
  }
  user = data.users.find((u) => u.email?.trim().toLowerCase() === email) ?? null;
  if (data.users.length < 200) break;
  page += 1;
}

if (!user) {
  console.error(`No se encontró usuario Supabase con email: ${email}`);
  process.exit(1);
}

const updatePayload = { email_confirm: true };
if (newPassword) updatePayload.password = newPassword;

const { data: updated, error: updateError } = await supabase.auth.admin.updateUserById(
  user.id,
  updatePayload
);

if (updateError) {
  console.error('Error actualizando usuario:', updateError.message);
  process.exit(1);
}

console.log('OK:', updated.user.email, 'confirmado=', updated.user.email_confirmed_at != null);
if (newPassword) console.log('Contraseña actualizada.');
