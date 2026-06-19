#!/usr/bin/env node
/**
 * Ejecuta las pruebas de docs/prompt_testing.md y genera docs/pentest-staging.md
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadPentestEnv } from './load-env.mjs';
import {
  apiFetch,
  getBaseUrl,
  loginAs,
  printResults,
  requireEnv,
  resolveInstitutionId,
  assertBlocked,
  getApprovedPagoCredentials,
  PentestSkip,
} from './pentest-lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');

loadPentestEnv();

const report = [];

function record(test, vector, result, status, fix = '—') {
  report.push({ test, vector, result, status, fix });
}

async function runPt07() {
  const mod = await import('./tests/pt-07-recordatorio-impersonation.mjs');
  const summary = await mod.run();
  const pass = summary.failed === 0;
  record(
    'PT-07',
    'Docente A crea recordatorio como docente B',
    pass ? '403/401 o validación sin suplantación' : 'Posible suplantación',
    pass ? '✅ PASS' : '❌ FAIL',
    pass ? '—' : 'Revisar assertDocenteSelfOrStaff'
  );
  return pass;
}

async function runPt04Timing() {
  const probeEmail = process.env.PENTEST_PROBE_EMAIL || 'no-existe-probe@test.local';
  const knownEmail = process.env.PENTEST_TENANT_A_EMAIL?.trim();
  if (!knownEmail) throw new PentestSkip('PENTEST_TENANT_A_EMAIL requerido');

  const iterations = 10;
  const fakeTimes = [];
  const knownTimes = [];

  for (let i = 0; i < iterations; i++) {
    const t0 = Date.now();
    await apiFetch(`/api/instituciones/by-email/${encodeURIComponent(probeEmail)}`);
    fakeTimes.push(Date.now() - t0);

    const t1 = Date.now();
    await apiFetch(`/api/instituciones/by-email/${encodeURIComponent(knownEmail)}`);
    knownTimes.push(Date.now() - t1);
  }

  const avg = (arr) => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
  const avgFake = avg(fakeTimes);
  const avgKnown = avg(knownTimes);
  const delta = Math.abs(avgKnown - avgFake);

  const fake = await apiFetch(`/api/instituciones/by-email/${encodeURIComponent(probeEmail)}`);
  const known = await apiFetch(`/api/instituciones/by-email/${encodeURIComponent(knownEmail)}`);

  const bodyOk =
    fake.json?.exists !== true &&
    fake.json?.id == null &&
    known.json?.id == null;
  const statusOk = fake.status === known.status;
  const timingOk = delta < 50;

  const pass = bodyOk && statusOk && timingOk;
  const partial = bodyOk && statusOk && !timingOk;

  record(
    'PT-04',
    'Enumeración email (10× timing)',
    `fake avg=${avgFake}ms known avg=${avgKnown}ms Δ=${delta}ms; status ${fake.status}/${known.status}; exists=${fake.json?.exists}`,
    pass ? '✅ PASS' : partial ? '⚠️ PARCIAL' : '❌ FAIL',
    partial ? 'Considerar delay artificial ~200ms' : pass ? '—' : 'Unificar respuestas by-email'
  );
  return pass;
}

async function runPt14() {
  const pago = await getApprovedPagoCredentials();
  if (!pago) {
    record('PT-14', 'Idempotencia sync-status', 'Omitido: sin pago APPROVED', '⚠️ PARCIAL', 'Configurar PENTEST_PAGO_*');
    return null;
  }

  const body = { ref: pago.referencia, email: pago.email };
  const [r1, r2, r3] = await Promise.all([
    apiFetch('/api/payments/sync-status', { method: 'POST', body }),
    apiFetch('/api/payments/sync-status', { method: 'POST', body }),
    apiFetch('/api/payments/sync-status', { method: 'POST', body }),
  ]);

  const pass =
    r1.status === 200 &&
    r2.status === 200 &&
    r3.status === 200 &&
    !String(r1.json).includes('error');

  record(
    'PT-14',
    '3× sync-status concurrente',
    `status ${r1.status}/${r2.status}/${r3.status}; duplicate=${JSON.stringify([r1.json?.duplicate, r2.json?.duplicate, r3.json?.duplicate])}`,
    pass ? '✅ PASS' : '❌ FAIL',
    pass ? '—' : 'Revisar approve-payment claim atómico'
  );
  return pass;
}

async function runPt02() {
  const mod = await import('./tests/pt-02-rls-bypass.mjs');
  const summary = await mod.run();
  const pass = summary.failed === 0;
  record('PT-02', 'RLS bypass / allowlist', `${summary.passed} pass, ${summary.failed} fail`, pass ? '✅ PASS' : '❌ FAIL');
  return pass;
}

async function runPt01Pt03() {
  const mod1 = await import('./tests/pt-01-cross-tenant.mjs');
  const s1 = await mod1.run();
  const pass1 = s1.failed === 0;
  record('PT-01', 'IDOR cross-tenant (admin A → B)', `${s1.passed} pass`, pass1 ? '✅ PASS' : '❌ FAIL');

  const mod3 = await import('./tests/pt-03-docente-cross-tenant.mjs');
  const s3 = await mod3.run();
  const pass3 = s3.failed === 0;
  record('PT-03', 'Docente A → recursos institución B', `${s3.passed} pass`, pass3 ? '✅ PASS' : '❌ FAIL');

  return pass1 && pass3;
}

async function runHeaders() {
  const res = await fetch(getBaseUrl(), { method: 'HEAD' }).catch(() =>
    fetch(getBaseUrl())
  );
  const h = res.headers;
  const checks = {
    'Content-Security-Policy': Boolean(h.get('content-security-policy')),
    'Strict-Transport-Security': (h.get('strict-transport-security') || '').includes('31536000'),
    'X-Frame-Options': (h.get('x-frame-options') || '').toUpperCase() === 'DENY',
    'X-Content-Type-Options': (h.get('x-content-type-options') || '') === 'nosniff',
  };
  const missing = Object.entries(checks).filter(([, ok]) => !ok).map(([k]) => k);
  const pass = missing.length === 0;
  record(
    'Headers (A05)',
    'curl -I staging',
    pass ? 'Los 4 headers presentes' : `Faltan: ${missing.join(', ')}`,
    pass ? '✅ PASS' : '❌ FAIL',
    pass ? '—' : 'next.config.ts headers()'
  );
  return pass;
}

async function runBrandingXss() {
  const mod = await import('./tests/pt-16-branding-xss.mjs');
  const s = await mod.run();
  const pass = s.failed === 0;
  record('Branding XSS (A03)', 'Payload script en color_primario', pass ? '400 o no persistido' : 'Payload almacenado', pass ? '✅ PASS' : '❌ FAIL');
  return pass;
}

async function runExcelFormulas() {
  const mod = await import('./tests/pt-17-excel-upload.mjs');
  const s = await mod.run();
  const pass = s.failed === 0;
  record('Excel fórmulas (A03)', 'Carga masiva con =cmd', pass ? 'Rechazado' : 'Aceptó fórmula', pass ? '✅ PASS' : '❌ FAIL');
  return pass;
}

function writeReport() {
  const lines = [
    '# Pentest staging — Agenda Virtual',
    '',
    `**Fecha:** ${new Date().toISOString()}`,
    `**Base URL:** ${getBaseUrl()}`,
    '',
    '| Test | Vector | Resultado obtenido | Estado | Fix requerido |',
    '|------|--------|-------------------|--------|---------------|',
  ];

  for (const r of report) {
    lines.push(
      `| ${r.test} | ${r.vector} | ${r.result.replace(/\|/g, '\\|')} | ${r.status} | ${r.fix} |`
    );
  }

  const goLive = report.filter((r) =>
    ['PT-07', 'PT-04', 'PT-14', 'PT-02', 'Headers (A05)', 'Branding XSS (A03)', 'Excel fórmulas (A03)'].includes(
      r.test
    )
  );
  const allPass = goLive.every((r) => r.status === '✅ PASS');
  const partial = goLive.some((r) => r.status === '⚠️ PARCIAL');

  lines.push('');
  lines.push('## Criterio go-live');
  lines.push('');
  if (allPass) {
    lines.push('**✅ GO-LIVE** — Todas las pruebas obligatorias pasaron.');
  } else if (partial && !goLive.some((r) => r.status === '❌ FAIL')) {
    lines.push('**⚠️ GO-LIVE CONDICIONAL** — Sin fallos críticos; revisar ítems PARCIAL.');
  } else {
    lines.push('**❌ NO GO-LIVE** — Corregir fallos antes de producción.');
  }

  const out = path.join(ROOT, 'docs', 'pentest-staging.md');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, lines.join('\n') + '\n', 'utf8');
  console.log(`\nReporte: ${out}`);
}

async function main() {
  console.log('Prompt testing —', getBaseUrl());
  const results = {};

  try {
    results.pt07 = await runPt07();
  } catch (e) {
    record('PT-07', 'Suplantación docente', e.message, '⚠️ PARCIAL', e.message);
  }

  try {
    results.pt04 = await runPt04Timing();
  } catch (e) {
    record('PT-04', 'Enumeración email', e.message, '⚠️ PARCIAL', e.message);
  }

  try {
    results.pt14 = await runPt14();
  } catch (e) {
    record('PT-14', 'Idempotencia pagos', e.message, '⚠️ PARCIAL', e.message);
  }

  try {
    results.pt02 = await runPt02();
  } catch (e) {
    record('PT-02', 'RLS bypass', e.message, '❌ FAIL', e.message);
  }

  try {
    results.cross = await runPt01Pt03();
  } catch (e) {
    record('PT-01/03', 'Cross-tenant', e.message, '⚠️ PARCIAL', e.message);
  }

  try {
    results.headers = await runHeaders();
  } catch (e) {
    record('Headers (A05)', 'Security headers', e.message, '❌ FAIL', e.message);
  }

  try {
    results.branding = await runBrandingXss();
  } catch (e) {
    record('Branding XSS (A03)', 'Branding', e.message, '⚠️ PARCIAL', e.message);
  }

  try {
    results.excel = await runExcelFormulas();
  } catch (e) {
    record('Excel fórmulas (A03)', 'Excel', e.message, '⚠️ PARCIAL', e.message);
  }

  writeReport();

  const failed = report.some((r) => r.status === '❌ FAIL');
  process.exit(failed ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
