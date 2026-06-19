/**
 * PT-17 (P2) — Carga masiva Excel: tamaño y tipo de archivo.
 */
import {
  loginAs,
  apiFetch,
  printResults,
  requireEnv,
  resolveInstitutionId,
} from '../pentest-lib.mjs';
import XLSX from 'xlsx';

export const id = 'PT-17';
export const title = 'Carga masiva Excel — límites y payload';
export const priority = 'P2';

function buildXlsxBuffer(rows) {
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Estudiantes');
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

export async function run() {
  requireEnv(['PENTEST_TENANT_A_EMAIL', 'PENTEST_TENANT_A_PASSWORD']);

  const session = await loginAs(
    process.env.PENTEST_TENANT_A_EMAIL,
    process.env.PENTEST_TENANT_A_PASSWORD
  );
  const instId =
    Number(process.env.PENTEST_INSTITUTION_A_ID) ||
    (await resolveInstitutionId(session.cookieHeader));

  const results = [];

  const big = new Uint8Array(5 * 1024 * 1024 + 1);
  const bigBlob = new Blob([big], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const bigFile = new File([bigBlob], 'grande.xlsx');

  const fdBig = new FormData();
  fdBig.set('institucionId', String(instId));
  fdBig.set('archivo', bigFile);

  const bigRes = await fetch(`${process.env.PENTEST_BASE_URL || 'http://localhost:3000'}/api/estudiantes/carga-masiva`, {
    method: 'POST',
    headers: { Cookie: session.cookieHeader },
    body: fdBig,
  });
  const bigJson = await bigRes.json().catch(() => ({}));

  results.push({
    pass: bigRes.status === 400 || bigRes.status === 403,
    label: 'Archivo > 5 MB rechazado',
    status: bigRes.status,
    detail: bigJson.error ?? 'rechazado',
  });

  const formulaRows = [
    {
      codigo_estudiantil: '=cmd|"/c calc"!A0',
      nombres: 'Test',
      apellidos: 'Formula',
      grado: '1',
      curso: 'A',
    },
  ];
  const buf = buildXlsxBuffer(formulaRows);
  const okFile = new File([buf], 'formula.xlsx', {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const fd = new FormData();
  fd.set('institucionId', String(instId));
  fd.set('archivo', okFile);

  const formRes = await fetch(`${process.env.PENTEST_BASE_URL || 'http://localhost:3000'}/api/estudiantes/carga-masiva`, {
    method: 'POST',
    headers: { Cookie: session.cookieHeader },
    body: fd,
  });
  const formJson = await formRes.json().catch(() => ({}));

  results.push({
    pass: formRes.status === 400 || formRes.status === 403 || formJson.success === false,
    label: 'Fila con fórmula Excel rechazada o sanitizada',
    status: formRes.status,
    detail:
      formJson.success === true
        ? 'Revisar: importó fórmula literal'
        : formJson.error ?? 'validación aplicada',
  });

  return printResults(id, title, results);
}
