import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

function load(name) {
  const full = path.join(ROOT, name);
  if (!fs.existsSync(full)) return;
  for (const line of fs.readFileSync(full, 'utf8').split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i < 0) continue;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

load('.env.local');
load('.env.e2e');

const email = (process.env.E2E_GV_EMAIL || 'jonathanasias@gmail.com').toLowerCase();
const password = process.env.E2E_GV_PASSWORD;
if (!password) {
  console.error('Missing E2E_GV_PASSWORD');
  process.exit(1);
}

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const { data: list, error: listErr } = await admin.auth.admin.listUsers({
  page: 1,
  perPage: 1000,
});
if (listErr) {
  console.error(listErr.message);
  process.exit(1);
}

const user = list?.users?.find((u) => u.email?.toLowerCase() === email);
if (user) {
  const { error } = await admin.auth.admin.updateUserById(user.id, {
    password,
    email_confirm: true,
  });
  if (error) {
    console.error(error.message);
    process.exit(1);
  }
  console.log('UPDATED_EXISTING');
} else {
  const { error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) {
    console.error(error.message);
    process.exit(1);
  }
  console.log('CREATED');
}
