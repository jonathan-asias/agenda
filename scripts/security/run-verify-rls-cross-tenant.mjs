#!/usr/bin/env node
/**
 * Prueba de aislamiento RLS cross-tenant en PostgreSQL (rol agenda_app).
 * Compara conteos con set_config vs ground truth por institucion_id.
 *
 * Uso: npm run pentest:rls-cross-tenant
 * Requiere: DATABASE_URL_AGENDA_APP + DIRECT_URL/DATABASE_URL
 *           PENTEST_INSTITUTION_A_ID, PENTEST_INSTITUTION_B_ID
 */
import pg from 'pg';
import { loadPentestEnv } from './load-env.mjs';
import { loginAs, resolveInstitutionId, PentestSkip } from './pentest-lib.mjs';
import { buildAdminCandidates, buildAgendaAppCandidates, connectFirst } from './db-connect.mjs';

loadPentestEnv();

const TABLES = [
  { name: 'Estudiantes', column: 'institucion_id' },
  { name: 'Docentes', column: 'institucion_id' },
  { name: 'Administradores', column: 'institucion_id' },
  {
    name: 'Recordatorios',
    groundTruthSql: `
      SELECT COUNT(*)::int AS n
      FROM "Recordatorios" r
      INNER JOIN "Docentes" d ON d.id = r.docente_id
      WHERE d.institucion_id = $1
    `,
  },
  { name: 'Cursos', column: 'institucion_id' },
];

async function resolveTenantIds() {
  let tenantA = Number(process.env.PENTEST_INSTITUTION_A_ID);
  let tenantB = Number(process.env.PENTEST_INSTITUTION_B_ID);

  if (!tenantA && process.env.PENTEST_TENANT_A_EMAIL && process.env.PENTEST_TENANT_A_PASSWORD) {
    const session = await loginAs(
      process.env.PENTEST_TENANT_A_EMAIL,
      process.env.PENTEST_TENANT_A_PASSWORD
    );
    tenantA = Number(await resolveInstitutionId(session.cookieHeader));
  }

  if (!tenantA || !tenantB) {
    throw new PentestSkip(
      'Defina PENTEST_INSTITUTION_A_ID y PENTEST_INSTITUTION_B_ID en .env.pentest'
    );
  }
  if (tenantA === tenantB) {
    throw new PentestSkip('Tenant A y B deben ser instituciones distintas');
  }
  return { tenantA, tenantB };
}

async function groundCount(client, table, tenantId, spec) {
  if (table === 'Instituciones') {
    const { rows } = await client.query(
      `SELECT COUNT(*)::int AS n FROM "Instituciones" WHERE id = $1`,
      [tenantId]
    );
    return rows[0].n;
  }
  if (spec.groundTruthSql) {
    const { rows } = await client.query(spec.groundTruthSql, [tenantId]);
    return rows[0].n;
  }
  const { rows } = await client.query(
    `SELECT COUNT(*)::int AS n FROM "${table}" WHERE "${spec.column}" = $1`,
    [tenantId]
  );
  return rows[0].n;
}

async function sampleId(client, table, column, tenantId) {
  const { rows } = await client.query(
    `SELECT id FROM "${table}" WHERE "${column}" = $1 ORDER BY id LIMIT 1`,
    [tenantId]
  );
  return rows[0]?.id ?? null;
}

async function rlsCount(client, tenantId, table) {
  await client.query('BEGIN');
  try {
    await client.query(`SELECT set_config('app.bypass_rls', 'false', true)`);
    await client.query(`SELECT set_config('app.current_institution_id', $1, true)`, [
      String(tenantId),
    ]);
    const { rows } = await client.query(`SELECT COUNT(*)::int AS n FROM "${table}"`);
    await client.query('ROLLBACK');
    return rows[0].n;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  }
}

async function rlsCountNoTenant(client, table) {
  await client.query('BEGIN');
  try {
    await client.query(`SELECT set_config('app.bypass_rls', 'false', true)`);
    await client.query(`SELECT set_config('app.current_institution_id', '', true)`);
    const { rows } = await client.query(`SELECT COUNT(*)::int AS n FROM "${table}"`);
    await client.query('ROLLBACK');
    return rows[0].n;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  }
}

async function rlsFetchById(client, scopedTenantId, table, rowId) {
  await client.query('BEGIN');
  try {
    await client.query(`SELECT set_config('app.bypass_rls', 'false', true)`);
    await client.query(`SELECT set_config('app.current_institution_id', $1, true)`, [
      String(scopedTenantId),
    ]);
    const { rows } = await client.query(`SELECT id FROM "${table}" WHERE id = $1`, [rowId]);
    await client.query('ROLLBACK');
    return rows.length;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  }
}

async function checkRole(client) {
  const { rows } = await client.query(`
    SELECT current_user AS rol, rolbypassrls AS bypass_rls
    FROM pg_roles WHERE rolname = current_user
  `);
  return rows[0];
}

function printRow(ok, label, detail) {
  console.log(`  ${ok ? '✓' : '✗'} ${label}: ${detail}`);
  return ok;
}

async function main() {
  console.log('RLS cross-tenant — agenda_app + set_config\n');

  const { tenantA, tenantB } = await resolveTenantIds();
  console.log(`  Tenant A: ${tenantA}`);
  console.log(`  Tenant B: ${tenantB}\n`);

  const appUrls = buildAgendaAppCandidates();
  const adminUrls = buildAdminCandidates();

  if (!appUrls.length) {
    throw new PentestSkip('Falta DATABASE_URL_AGENDA_APP o DATABASE_URL en .env.local');
  }
  if (!adminUrls.length) {
    throw new PentestSkip('Falta DIRECT_URL o DATABASE_URL para ground truth');
  }

  const { client: appClient, rol: appRol } = await connectFirst(appUrls, { label: 'agenda_app' });
  const { client: adminClient } = await connectFirst(adminUrls, { label: 'admin' });

  let passed = 0;
  let failed = 0;

  try {
    const role = await checkRole(appClient);
    console.log(`Rol conexión app: ${role.rol} (bypass_rls=${role.bypass_rls})`);
    if (role.bypass_rls) {
      console.log('  ✗ Rol app tiene BYPASSRLS — la prueba no es válida');
      process.exit(1);
    }
    if (appRol !== 'agenda_app') {
      console.log(`  ✗ Conectado como ${appRol} — se requiere rol agenda_app`);
      process.exit(1);
    }
    console.log('');

    const noTenantEst = await rlsCountNoTenant(appClient, 'Estudiantes');
    if (
      printRow(
        noTenantEst === 0,
        'Sin tenant context',
        `${noTenantEst} filas en Estudiantes (esperado 0)`
      )
    ) {
      passed++;
    } else {
      failed++;
    }

    for (const spec of TABLES) {
      const { name } = spec;
      const expectedA = await groundCount(adminClient, name, tenantA, spec);
      const expectedB = await groundCount(adminClient, name, tenantB, spec);
      const actualA = await rlsCount(appClient, tenantA, name);
      const actualB = await rlsCount(appClient, tenantB, name);

      const matchA = actualA === expectedA;
      const matchB = actualB === expectedB;

      if (
        printRow(
          matchA && matchB,
          name,
          `A: RLS=${actualA} esperado=${expectedA} | B: RLS=${actualB} esperado=${expectedB}`
        )
      ) {
        passed++;
      } else {
        failed++;
      }
    }

    const instExpectedA = await groundCount(adminClient, 'Instituciones', tenantA, {});
    const instRlsA = await rlsCount(appClient, tenantA, 'Instituciones');
    if (
      printRow(
        instRlsA === instExpectedA && instExpectedA === 1,
        'Instituciones',
        `tenant A ve ${instRlsA} fila(s) (esperado 1)`
      )
    ) {
      passed++;
    } else {
      failed++;
    }

    const leakId = await sampleId(adminClient, 'Estudiantes', 'institucion_id', tenantB);
    if (leakId != null) {
      const visible = await rlsFetchById(appClient, tenantA, 'Estudiantes', leakId);
      if (
        printRow(
          visible === 0,
          'IDOR Estudiantes',
          `id=${leakId} (tenant B) invisible con contexto A (${visible} fila)`
        )
      ) {
        passed++;
      } else {
        failed++;
      }
    } else {
      console.log('  ○ IDOR Estudiantes: sin filas en tenant B para probar');
    }

    const crossLeak = await rlsCount(appClient, tenantA, 'Estudiantes');
    const estudiantesSpec = { column: 'institucion_id' };
    const totalB = await groundCount(adminClient, 'Estudiantes', tenantB, estudiantesSpec);
    if (totalB > 0 && crossLeak > 0) {
      const totalA = await groundCount(adminClient, 'Estudiantes', tenantA, estudiantesSpec);
      if (
        printRow(
          crossLeak <= totalA,
          'No mezcla tenants',
          `contexto A: ${crossLeak} filas (máx esperado ${totalA}, tenant B tiene ${totalB})`
        )
      ) {
        passed++;
      } else {
        failed++;
      }
    }
  } finally {
    await appClient.end();
    await adminClient.end();
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`RESULTADO: ${passed} pass, ${failed} fail`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  if (err instanceof PentestSkip) {
    console.log(`○ OMITIDO: ${err.message}`);
    process.exit(0);
  }
  console.error(err);
  process.exit(1);
});
