/**
 * PT-22 (P2) — Registro sin token / token vacío.
 */
import { apiFetch, printResults } from '../pentest-lib.mjs';

export const id = 'PT-22';
export const title = 'Registro post-pago — token obligatorio';
export const priority = 'P2';

export async function run() {
  const results = [];

  const noToken = await apiFetch('/api/payments/validate-registro-access');
  results.push({
    pass: noToken.json?.valid === false && noToken.status === 400,
    label: 'validate-registro-access sin token',
    status: noToken.status,
    detail: noToken.json?.reason ?? 'missing',
  });

  const registro = await apiFetch('/api/instituciones', {
    method: 'POST',
    body: {
      nombre: 'Pentest',
      direccion_principal: 'Calle 1',
      nit: '123',
      nombre_contacto: 'Test',
      telefono_contacto: '+573001234567',
      email: `pentest-${Date.now()}@test.local`,
      password: 'Test1234!Test',
      tiene_sedes: false,
    },
  });

  results.push({
    pass: registro.status === 400 || registro.status === 401 || registro.status === 403,
    label: 'POST /api/instituciones sin registroToken',
    status: registro.status,
    detail:
      registro.status === 200 || registro.status === 201
        ? 'VULNERABLE: registro abierto'
        : 'Bloqueado',
  });

  return printResults(id, title, results);
}
