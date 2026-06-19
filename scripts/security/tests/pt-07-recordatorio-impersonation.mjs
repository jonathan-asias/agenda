/**
 * PT-07 (P1) — Docente A crea recordatorio en nombre de docente B (misma institución).
 */
import {
  loginAs,
  resolveInstitutionId,
  apiFetch,
  printResults,
  requireEnv,
  PentestSkip,
} from '../pentest-lib.mjs';

export const id = 'PT-07';
export const title = 'Suplantación de docente en POST recordatorios';
export const priority = 'P1';

export async function run() {
  requireEnv([
    'PENTEST_DOCENTE_A_EMAIL',
    'PENTEST_DOCENTE_A_PASSWORD',
    'PENTEST_DOCENTE_B_ID',
  ]);

  const session = await loginAs(
    process.env.PENTEST_DOCENTE_A_EMAIL,
    process.env.PENTEST_DOCENTE_A_PASSWORD
  );

  const docenteBId = Number(process.env.PENTEST_DOCENTE_B_ID);
  const instId = await resolveInstitutionId(session.cookieHeader);
  if (!instId) throw new PentestSkip('Sin institutionId');

  // Payload mínimo — esperamos 400 por datos incompletos, NO 200 con suplantación exitosa
  const body = {
    nombre: 'Pentest probe',
    descripcion: 'No enviar',
    fecha: new Date(Date.now() + 86400000).toISOString(),
    tipo: 'otro',
    docenteId: docenteBId,
    gradoId: 1,
    cursoId: 1,
    areaId: 1,
    materiaId: 1,
    estudiantesSeleccionados: [1],
  };

  const res = await apiFetch('/api/recordatorios', {
    method: 'POST',
    cookieHeader: session.cookieHeader,
    body,
  });

  const results = [];

  // Si 403 → mitigación presente. Si 200 → vulnerable. Si 400/404 → aceptable pero revisar ownership
  if (res.status === 403 || res.status === 401) {
    results.push({
      pass: true,
      label: 'POST recordatorio como otro docente',
      status: res.status,
      detail: 'Bloqueado por ownership',
    });
  } else if (res.status === 200 || res.status === 201) {
    results.push({
      pass: false,
      label: 'POST recordatorio como otro docente',
      status: res.status,
      detail: 'VULNERABLE: recordatorio creado en nombre de otro docente',
      json: res.json,
    });
  } else {
    results.push({
      pass: null,
      label: 'POST recordatorio como otro docente',
      status: res.status,
      detail: 'No concluyente (validación de datos) — probar con IDs reales en staging',
      json: res.json,
    });
  }

  return printResults(id, title, results);
}
