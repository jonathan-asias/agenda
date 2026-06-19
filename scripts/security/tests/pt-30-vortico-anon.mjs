/**
 * PT-30 (P1) — Panel VORTICO listado global solo para platform admin.
 */
import { apiFetch, printResults } from '../pentest-lib.mjs';

export const id = 'PT-30';
export const title = 'VORTICO — listado sin autenticación';
export const priority = 'P1';

export async function run() {
  const res = await apiFetch('/api/gestion-vortico/instituciones');

  const results = [];
  const blocked = res.status === 401 || res.status === 403;
  const inconclusive = res.status === 406 || res.status === 502 || res.status === 503;
  const leaked =
    res.status === 200 &&
    Array.isArray(res.json?.instituciones) &&
    res.json.instituciones.length > 0;

  results.push({
    pass: inconclusive ? null : blocked && !leaked,
    label: 'GET gestion-vortico/instituciones sin sesión',
    status: res.status,
    detail: leaked
      ? `VULNERABLE: ${res.json.instituciones.length} instituciones expuestas`
      : inconclusive
        ? 'Respuesta inconclusa (proxy/túnel) — probar en localhost'
        : blocked
          ? 'Denegado'
          : 'Revisar respuesta',
  });

  return printResults(id, title, results);
}
