/**
 * PT-18 (P1) — SSRF probe en logo_url durante registro (solo almacenamiento).
 */
import { apiFetch, printResults } from '../pentest-lib.mjs';

export const id = 'PT-18';
export const title = 'SSRF / URL arbitraria en registro';
export const priority = 'P1';

export async function run() {
  const results = [];

  // Sin token de registro válido debe fallar antes de persistir — probamos que no acepta registro abierto
  const body = {
    nombre: 'Pentest SSRF Probe',
    direccion_principal: 'Calle 1',
    nit: '999999999',
    nombre_contacto: 'Test',
    telefono_contacto: '+573001234567',
    email: `ssrf-probe-${Date.now()}@pentest.local`,
    password: 'Probe1234!Probe',
    tiene_sedes: false,
    logo_url: 'http://169.254.169.254/latest/meta-data/',
  };

  const res = await apiFetch('/api/instituciones', { method: 'POST', body });

  const openRegistration =
    res.status === 200 || res.status === 201;

  results.push({
    pass: !openRegistration,
    label: 'POST /api/instituciones sin registroToken',
    status: res.status,
    detail: openRegistration
      ? 'VULNERABLE: registro abierto con logo_url interna'
      : 'Registro bloqueado o requiere token (esperado)',
  });

  if (openRegistration && res.json?.id) {
    results.push({
      pass: false,
      label: 'logo_url metadata URL',
      status: res.status,
      detail: 'Institución creada — auditar si servidor fetchea la URL',
    });
  }

  return printResults(id, title, results);
}
