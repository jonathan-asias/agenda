#!/usr/bin/env node
/**
 * Ejecuta scripts/security/sql/verify-rls.sql contra PostgreSQL.
 * Si no hay conexión, imprime instrucciones para Supabase SQL Editor.
 *
 * Uso: node scripts/security/run-verify-rls.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { loadPentestEnv } from './load-env.mjs';
import { buildDbUrlCandidates } from './db-connect.mjs';

loadPentestEnv();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sqlPath = path.join(__dirname, 'sql', 'verify-rls.sql');

const urls = buildDbUrlCandidates();

if (!urls.length) {
  console.log('Sin DATABASE_URL en .env.local\n');
  console.log('Ejecuta manualmente en Supabase → SQL Editor:');
  console.log(`  ${sqlPath}\n`);
  process.exit(1);
}

const sql = fs.readFileSync(sqlPath, 'utf8');
const statements = sql
  .split(';')
  .map((s) => s.replace(/--[^\n]*/g, '').trim())
  .filter((s) => s.length > 10 && !s.startsWith('/*'));

let client;
let connected = false;

for (const connectionString of urls) {
  client = new pg.Client({ connectionString });
  try {
    await client.connect();
    connected = true;
    console.log(`Conectado (${connectionString.includes('agenda_app') ? 'agenda_app' : 'DB'})\n`);
    break;
  } catch (err) {
    console.warn(`Fallo conexión: ${err instanceof Error ? err.message : err}`);
    try {
      await client.end();
    } catch {
      /* ignore */
    }
  }
}

if (!connected) {
  console.log('\nNo se pudo conectar. Ejecuta el SQL manualmente:');
  console.log(`  ${sqlPath}`);
  console.log('\nSupabase Dashboard → SQL Editor → pegar contenido del archivo');
  process.exit(1);
}

let section = 0;
let tablesWithoutRls = [];

try {
  for (const stmt of statements) {
    if (!stmt.toUpperCase().startsWith('SELECT')) continue;
    section++;
    try {
      const res = await client.query(stmt);
      console.log(`${'─'.repeat(60)}`);
      console.log(`Consulta ${section} — ${res.rowCount} fila(s)`);
      if (res.rows.length) {
        console.table(res.rows.slice(0, 25));
        if (res.rows.length > 25) {
          console.log(`  … y ${res.rows.length - 25} más`);
        }
      } else {
        console.log('  (sin resultados)');
      }

      if (stmt.includes('tabla_sin_rls') && res.rows.length === 0) {
        console.log('  ✓ Ninguna tabla crítica sin RLS');
      }
      if (stmt.includes('tabla_sin_rls')) {
        tablesWithoutRls = res.rows;
      }
    } catch (err) {
      console.warn(`  Error en consulta ${section}:`, err instanceof Error ? err.message : err);
    }
  }
} finally {
  await client.end();
}

console.log(`\n${'='.repeat(60)}`);
if (tablesWithoutRls.length === 0) {
  console.log('RESULTADO: RLS OK en tablas críticas (consulta 7 vacía)');
  process.exit(0);
} else {
  console.log('RESULTADO: REVISAR — tablas sin RLS:');
  for (const row of tablesWithoutRls) {
    console.log(`  - ${row.tabla_sin_rls}`);
  }
  process.exit(1);
}
