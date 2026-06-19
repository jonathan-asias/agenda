/**
 * PT-03 (P0) — Docente de institución A no accede a recursos de institución B.
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

export const id = 'PT-03';
export const title = 'Escalada horizontal — docente cross-tenant';
export const priority = 'P0';

export async function run() {
  requireEnv([
    'PENTEST_DOCENTE_A_EMAIL',
    'PENTEST_DOCENTE_A_PASSWORD',
    'PENTEST_INSTITUTION_B_ID',
  ]);

  const session = await loginAs(
    process.env.PENTEST_DOCENTE_A_EMAIL,
    process.env.PENTEST_DOCENTE_A_PASSWORD
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
  const docenteBId = process.env.PENTEST_DOCENTE_B_ID?.trim();
  const cursoBId = process.env.PENTEST_CURSO_B_ID?.trim();

  if (!ownId) throw new PentestSkip('No se pudo resolver institutionId del docente A');
  if (ownId === otherId) throw new PentestSkip('PENTEST_INSTITUTION_B_ID debe ser distinto');

  console.log(`  Docente A: institución ${ownId} (${session.email})`);
  console.log(`  Target B: institución ${otherId}`);

  const results = [];

  const baseCases = [
    { label: 'GET dashboard institución B', path: `/api/instituciones/${otherId}/dashboard` },
    { label: 'GET setup/grados B', path: `/api/setup/grados/${otherId}` },
    { label: 'GET recordatorios by-institucion B', path: `/api/recordatorios/by-institucion/${otherId}` },
    { label: 'POST setup/docentes (institucionId=B)', path: '/api/setup/docentes', method: 'POST', body: { institucionId: otherId, docentes: [] } },
  ];

  for (const c of baseCases) {
    const res = await apiFetch(c.path, {
      method: c.method || 'GET',
      cookieHeader: session.cookieHeader,
      body: c.body,
    });
    // POST con body vacío puede dar 400 — eso también es pass (no creó docentes en B)
    if (c.method === 'POST' && (res.status === 400 || res.status === 403 || res.status === 401)) {
      results.push({ pass: true, label: c.label, status: res.status, detail: 'Rechazado' });
    } else {
      results.push(assertBlocked(res, c.label));
    }
  }

  if (docenteBId) {
    const res = await apiFetch(`/api/docentes/${docenteBId}`, { cookieHeader: session.cookieHeader });
    results.push(assertBlocked(res, `GET /api/docentes/${docenteBId} (docente de B)`));
  } else {
    results.push({
      pass: null,
      label: 'GET /api/docentes/{B}',
      status: '-',
      detail: 'Omitido: definir PENTEST_DOCENTE_B_ID',
    });
  }

  if (cursoBId) {
    const res = await apiFetch(`/api/estudiantes/by-curso/${cursoBId}`, {
      cookieHeader: session.cookieHeader,
    });
    results.push(assertBlocked(res, `GET /api/estudiantes/by-curso/${cursoBId}`));
  } else {
    results.push({
      pass: null,
      label: 'GET /api/estudiantes/by-curso/{B}',
      status: '-',
      detail: 'Omitido: definir PENTEST_CURSO_B_ID',
    });
  }

  return printResults(id, title, results);
}
