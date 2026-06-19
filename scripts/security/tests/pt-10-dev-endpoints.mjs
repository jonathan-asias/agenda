/**
 * PT-10 (P2) — Endpoints de desarrollo no deben estar abiertos en producción.
 */
import { apiFetch, printResults } from '../pentest-lib.mjs';

export const id = 'PT-10';
export const title = 'Endpoints dev / mock deshabilitados';
export const priority = 'P2';

export async function run() {
  const results = [];

  const devMock = await apiFetch('/api/payments/dev-mock-checkout', {
    method: 'POST',
    body: { email: 'probe@test.local', planId: 1 },
  });
  results.push({
    pass: devMock.status === 403 || devMock.status === 503,
    label: 'POST /api/payments/dev-mock-checkout',
    status: devMock.status,
    detail:
      devMock.status === 403
        ? 'Deshabilitado (esperado fuera de dev mock)'
        : devMock.status === 200
          ? 'VULNERABLE: mock checkout activo'
          : `Status ${devMock.status}`,
  });

  const plansInit = await apiFetch('/api/planes/init', { method: 'POST', body: {} });
  results.push({
    pass: plansInit.status === 403 || plansInit.status === 401,
    label: 'POST /api/planes/init sin secret',
    status: plansInit.status,
    detail:
      plansInit.status === 403
        ? 'Protegido'
        : plansInit.status === 200
          ? 'VULNERABLE: init abierto'
          : `Status ${plansInit.status}`,
  });

  const pushTest = await apiFetch('/api/push/test');
  const isProd = process.env.NODE_ENV === 'production';
  results.push({
    pass: isProd ? pushTest.status === 404 : pushTest.status !== 200 || pushTest.json?.success === false,
    label: 'GET /api/push/test',
    status: pushTest.status,
    detail: isProd
      ? pushTest.status === 404
        ? 'Oculto en producción'
        : 'VULNERABLE en producción'
      : 'Dev: endpoint de prueba (revisar manualmente)',
  });

  return printResults(id, title, results);
}
