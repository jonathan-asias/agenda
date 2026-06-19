import fs from 'fs';

const path = '.env.local';
if (!fs.existsSync(path)) {
  console.log('ERROR: .env.local no existe');
  process.exit(1);
}

const vars = {};
for (const line of fs.readFileSync(path, 'utf8').split(/\r?\n/)) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  const i = t.indexOf('=');
  if (i === -1) continue;
  const key = t.slice(0, i).trim();
  let val = t.slice(i + 1).trim();
  if (
    (val.startsWith('"') && val.endsWith('"')) ||
    (val.startsWith("'") && val.endsWith("'"))
  ) {
    val = val.slice(1, -1);
  }
  vars[key] = val;
}

function maskUrl(url) {
  try {
    const u = new URL(url);
    const user = u.username || '(sin user)';
    const pass = u.password
      ? `***${u.password.length >= 4 ? u.password.slice(-2) : ''}`
      : '(sin password)';
    return `${u.protocol}//${user}:${pass}@${u.host}${u.pathname}${u.search || ''}`;
  } catch {
    return '(URL invalida)';
  }
}

function validateDbUrl(name, url, opts = {}) {
  const issues = [];
  const ok = [];
  if (!url) {
    issues.push('Falta o esta vacia');
    return { name, issues, ok, masked: null };
  }

  let parsed;
  try {
    parsed = new URL(url);
  } catch (e) {
    issues.push(`No es una URL valida (${e.message})`);
    if (/[@#/?&=%+]/.test(url.split('@')[0] || '')) {
      issues.push(
        'La password puede tener caracteres especiales; codificala con encodeURIComponent (ej. @ -> %40)'
      );
    }
    if (!url.startsWith('postgresql://') && !url.startsWith('postgres://')) {
      issues.push('Debe empezar con postgresql://');
    }
    return { name, issues, ok, masked: maskUrl(url) };
  }

  if (parsed.protocol !== 'postgresql:' && parsed.protocol !== 'postgres:') {
    issues.push('Protocolo debe ser postgresql://');
  }
  if (!parsed.username) issues.push('Falta usuario (ej. postgres o agenda_app)');
  if (!parsed.password) issues.push('Falta password en la URL');

  if (!parsed.hostname.includes('supabase')) {
    ok.push(`Host: ${parsed.hostname} (verifica que sea tu proyecto Supabase)`);
  } else {
    ok.push(`Host Supabase: ${parsed.hostname}`);
  }

  const port = parsed.port || '5432';
  const db = parsed.pathname.replace(/^\//, '') || 'postgres';
  if (db !== 'postgres') issues.push('Base de datos debe ser /postgres');

  const params = parsed.searchParams;
  const isPoolerHost = parsed.hostname.includes('pooler.supabase.com');
  if (opts.expectPooler) {
    if (isPoolerHost && port === '6543') {
      ok.push('Pooler Session mode: puerto 6543 OK');
      if (params.get('pgbouncer') !== 'true') {
        issues.push('Falta ?pgbouncer=true');
      } else {
        ok.push('pgbouncer=true OK');
      }
    } else if (isPoolerHost && port === '5432') {
      issues.push(
        'Estas en host pooler pero puerto 5432; para app runtime usa 6543?pgbouncer=true (Session pooler)'
      );
    } else if (!isPoolerHost && port === '5432') {
      ok.push('Conexion directa db.*.supabase.co:5432 (valida para DIRECT_URL, no ideal para DATABASE_URL en prod)');
    } else {
      issues.push(`Puerto inesperado ${port} para pooler`);
    }
  }
  if (opts.expectDirect) {
    if (port !== '5432') issues.push('DIRECT_URL debe usar puerto 5432');
    else ok.push('Puerto 5432 OK');
    if (params.get('pgbouncer') === 'true') {
      issues.push('DIRECT_URL no debe llevar pgbouncer=true');
    }
    if (isPoolerHost) {
      issues.push(
        'DIRECT_URL deberia apuntar a db.TU_REF.supabase.co:5432 (conexion directa), no al host pooler'
      );
    } else {
      ok.push('Host directo (no pooler) OK');
    }
  }
  if (opts.expectedUser) {
    const u = parsed.username;
    const refMatch = u.match(/^postgres\.([a-z0-9]+)$/);
    if (opts.expectedUser === 'postgres' && (u === 'postgres' || refMatch)) {
      ok.push(`Usuario postgres OK (${u})`);
    } else if (opts.expectedUser === 'agenda_app') {
      const agendaRef = u.match(/^agenda_app\.([a-z0-9]+)$/);
      if (agendaRef) {
        ok.push(`Usuario agenda_app OK (${u})`);
      } else if (u === 'agenda_app' && isPoolerHost) {
        issues.push(
          'En pooler usa agenda_app.PROJECT_REF (ej. agenda_app.gsptmgsmcdqwqburiwab) o conexion directa db.*:5432'
        );
      } else if (u === 'agenda_app' && !isPoolerHost) {
        ok.push('Usuario agenda_app OK (conexion directa)');
      } else {
        issues.push(`Usuario agenda_app invalido: ${u}`);
      }
    } else {
      issues.push(`Usuario esperado: ${opts.expectedUser}, actual: ${u}`);
    }
  }

  return { name, issues, ok, masked: maskUrl(url) };
}

const checks = [
  validateDbUrl('DATABASE_URL', vars.DATABASE_URL, {
    expectPooler: true,
    expectedUser: 'postgres',
  }),
  validateDbUrl('DIRECT_URL', vars.DIRECT_URL, {
    expectDirect: true,
    expectedUser: 'postgres',
  }),
  validateDbUrl('DATABASE_URL_AGENDA_APP', vars.DATABASE_URL_AGENDA_APP, {
    expectPooler: true,
    expectedUser: 'agenda_app',
  }),
];

console.log('=== Validacion connection strings (.env.local) ===\n');
for (const c of checks) {
  console.log(`--- ${c.name} ---`);
  if (c.masked) console.log(`URL (enmascarada): ${c.masked}`);
  if (!vars[c.name] && c.name === 'DATABASE_URL_AGENDA_APP') {
    console.log('(opcional; si falta, runtime usa DATABASE_URL/postgres)');
  }
  for (const x of c.ok) console.log(`  OK: ${x}`);
  for (const x of c.issues) console.log(`  PROBLEMA: ${x}`);
  if (vars[c.name] && c.issues.length === 0) console.log('  RESULTADO: formato OK');
  console.log('');
}

const hasAgenda = Boolean(vars.DATABASE_URL_AGENDA_APP?.trim());
console.log(
  'RLS efectivo:',
  hasAgenda
    ? 'DATABASE_URL_AGENDA_APP definida (RLS puede aplicarse)'
    : 'Sin DATABASE_URL_AGENDA_APP (usa postgres, RLS no restringe)'
);

const totalIssues = checks.reduce((n, c) => n + (vars[c.name] ? c.issues.length : 0), 0);
if (totalIssues === 0 && vars.DATABASE_URL && vars.DIRECT_URL) {
  console.log('\n>>> Todo OK. Reinicia npm run dev para aplicar cambios.');
} else {
  console.log(`\n>>> ${totalIssues} problema(s) pendiente(s). Revisa arriba.`);
}
