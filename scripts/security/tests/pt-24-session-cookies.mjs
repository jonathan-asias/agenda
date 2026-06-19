/**
 * PT-24 (P3) — Cookies de sesión Supabase vía login.
 */
import { loginAs, printResults, PentestSkip, requireEnv } from '../pentest-lib.mjs';

export const id = 'PT-24';
export const title = 'Cookies SSR post-login';
export const priority = 'P3';

export async function run() {
  requireEnv(['PENTEST_TENANT_A_EMAIL', 'PENTEST_TENANT_A_PASSWORD']);

  const session = await loginAs(
    process.env.PENTEST_TENANT_A_EMAIL,
    process.env.PENTEST_TENANT_A_PASSWORD
  );

  const results = [];
  const hasSbCookie = /sb-[^=]+-auth-token=/.test(session.cookieHeader);

  results.push({
    pass: hasSbCookie,
    label: 'Cookie Supabase auth presente',
    status: hasSbCookie ? 1 : 0,
    detail: hasSbCookie ? 'sb-*-auth-token en Cookie header' : 'Sin cookie de sesión',
  });

  results.push({
    pass: session.cookieHeader.length > 20,
    label: 'Cookie no vacía',
    status: session.cookieHeader.length,
    detail: 'Sesión establecida vía @supabase/ssr',
  });

  return printResults(id, title, results);
}
