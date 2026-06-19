/**
 * PT-04 (P1) — Enumeración de instituciones por email.
 */
import { apiFetch, printResults } from '../pentest-lib.mjs';

export const id = 'PT-04';
export const title = 'Enumeración de IDs / existencia de institución';
export const priority = 'P1';

export async function run() {
  const probeEmail = process.env.PENTEST_PROBE_EMAIL || 'institucion-probe-no-existe@test.local';
  const knownEmail = process.env.PENTEST_TENANT_A_EMAIL?.trim();

  const results = [];

  // Calentar servidor (evita falso positivo por compilación fría en `next dev`)
  await apiFetch('/api/planes');

  const t0 = Date.now();
  const fake = await apiFetch(`/api/instituciones/by-email/${encodeURIComponent(probeEmail)}`);
  const tFake = Date.now() - t0;

  const t1 = Date.now();
  const known = knownEmail
    ? await apiFetch(`/api/instituciones/by-email/${encodeURIComponent(knownEmail)}`)
    : null;
  const tKnown = known ? Date.now() - t1 : 0;

  // No debe revelar exists ni id sin sesión coincidente (PT-27)
  const leaksExistence = fake.json?.exists === true && fake.status === 200;
  results.push({
    pass: !leaksExistence && fake.json?.id == null,
    label: 'by-email no revela existencia ni id sin sesión',
    status: fake.status,
    detail: leaksExistence
      ? `Filtró exists=${fake.json?.exists}`
      : `exists=${fake.json?.exists}, id=${fake.json?.id ?? 'null'}`,
  });

  if (known) {
    const revealsWithoutSession =
      known.json?.exists === true && known.json?.id != null && known.status === 200;
    // Si hay sesión en cookies no las enviamos — sin cookie no debe haber id
    results.push({
      pass: known.json?.id == null,
      label: 'by-email sin cookie no devuelve institution id',
      status: known.status,
      detail: revealsWithoutSession ? `id expuesto: ${known.json.id}` : 'Sin id en respuesta anónima',
    });
  }

  const timingDelta = known ? Math.abs(tKnown - tFake) : 0;
  const timingOk = timingDelta < 500;
  results.push({
    pass: timingOk ? true : null,
    label: 'Timing similar exists true/false (informativo en dev)',
    status: timingDelta,
    detail: timingOk
      ? `fake=${tFake}ms known=${tKnown}ms`
      : `delta=${timingDelta}ms — revisar en prod (dev con Turbopack puede falsear)`,
  });

  return printResults(id, title, results);
}
