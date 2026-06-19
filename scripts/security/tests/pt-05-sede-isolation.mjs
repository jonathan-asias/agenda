/**
 * PT-05 (P1) — Admin de sede A no accede a curso/estudiantes de sede B (misma institución).
 */
import {
  loginAs,
  resolveInstitutionId,
  apiFetch,
  assertBlocked,
  printResults,
  requireEnv,
  PentestSkip,
} from '../pentest-lib.mjs';

export const id = 'PT-05';
export const title = 'Aislamiento por sede';
export const priority = 'P1';

export async function run() {
  requireEnv([
    'PENTEST_SEDE_ADMIN_EMAIL',
    'PENTEST_SEDE_ADMIN_PASSWORD',
    'PENTEST_CURSO_OTHER_SEDE_ID',
  ]);

  const session = await loginAs(
    process.env.PENTEST_SEDE_ADMIN_EMAIL,
    process.env.PENTEST_SEDE_ADMIN_PASSWORD
  );

  const instId = await resolveInstitutionId(session.cookieHeader);
  const cursoOtherSede = process.env.PENTEST_CURSO_OTHER_SEDE_ID;

  if (!instId) throw new PentestSkip('Admin sede sin institutionId');

  const results = [];
  const res = await apiFetch(`/api/estudiantes/by-curso/${cursoOtherSede}`, {
    cookieHeader: session.cookieHeader,
  });
  results.push(assertBlocked(res, `GET estudiantes by-curso ${cursoOtherSede} (otra sede)`));

  return printResults(id, title, results);
}
