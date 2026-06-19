/**
 * PT-01 (P0) — IDOR cross-tenant: tenant A no debe leer recursos de institución B.
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

export const id = 'PT-01';
export const title = 'Aislamiento multi-tenant — IDOR por ID en URL';
export const priority = 'P0';

function crossTenantCases(otherInstitutionId) {
  const b = otherInstitutionId;
  return [
    { label: 'GET /api/instituciones/{B}/dashboard', path: `/api/instituciones/${b}/dashboard` },
    { label: 'GET /api/instituciones/{B}', path: `/api/instituciones/${b}` },
    { label: 'GET /api/setup/grados/{B}', path: `/api/setup/grados/${b}` },
    { label: 'GET /api/recordatorios/by-institucion/{B}', path: `/api/recordatorios/by-institucion/${b}` },
    { label: 'GET /api/instituciones/{B}/subscription-access', path: `/api/instituciones/${b}/subscription-access` },
    { label: 'GET /api/instituciones/{B}/perfil', path: `/api/instituciones/${b}/perfil` },
    { label: 'GET /api/estudiantes/plantilla/{B}', path: `/api/estudiantes/plantilla/${b}` },
  ];
}

export async function run() {
  requireEnv([
    'PENTEST_TENANT_A_EMAIL',
    'PENTEST_TENANT_A_PASSWORD',
    'PENTEST_INSTITUTION_B_ID',
  ]);

  const session = await loginAs(
    process.env.PENTEST_TENANT_A_EMAIL,
    process.env.PENTEST_TENANT_A_PASSWORD
  );

  const ownId =
    Number(process.env.PENTEST_INSTITUTION_A_ID) ||
    (await resolveInstitutionId(session.cookieHeader));
  const otherId = Number(process.env.PENTEST_INSTITUTION_B_ID);
  if (!Number.isFinite(otherId) || otherId <= 0) {
    throw new PentestSkip(
      'PENTEST_INSTITUTION_B_ID debe ser un número (id de Instituciones en BD), no un email'
    );
  }

  if (!ownId) {
    throw new PentestSkip('No se pudo resolver institutionId del tenant A');
  }
  if (ownId === otherId) {
    throw new PentestSkip('PENTEST_INSTITUTION_B_ID debe ser distinto al tenant A');
  }

  console.log(`  Tenant A: institución ${ownId} (${session.email})`);
  console.log(`  Target B: institución ${otherId}`);

  const results = [];
  for (const { label, path } of crossTenantCases(otherId)) {
    const res = await apiFetch(path, { cookieHeader: session.cookieHeader });
    results.push(assertBlocked(res, label));
  }

  return printResults(id, title, results);
}
