/**
 * Envía 2 recordatorios por email por cada docente del run E2E sedes.
 * Usa docs/e2e-cuentas-prueba.md (o E2E_RUN_DOC) + .env.e2e / .env.local.
 *
 * BASE: E2E_BASE_URL (default https://ahoritapp.com)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServerClient } from '@supabase/ssr';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');

function loadEnvFile(name) {
  const full = path.join(ROOT, name);
  if (!fs.existsSync(full)) return;
  for (const line of fs.readFileSync(full, 'utf8').split(/\r?\n/)) {
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
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

loadEnvFile('.env.local');
loadEnvFile('.env.e2e');

const BASE_URL = (process.env.E2E_BASE_URL || 'https://ahoritapp.com').replace(/\/$/, '');
const PASSWORD = process.env.E2E_PASSWORD || '';
const REMINDERS_PER_DOCENTE = Number(process.env.E2E_REMINDERS_PER_DOCENTE || 2);
const DOC_PATH =
  process.env.E2E_RUN_DOC ||
  path.join(ROOT, 'docs', 'e2e-cuentas-prueba.md');

function createCookieJar() {
  const jar = new Map();
  return {
    getAll() {
      return [...jar.entries()].map(([name, value]) => ({ name, value }));
    },
    setAll(cookiesToSet) {
      for (const { name, value } of cookiesToSet) {
        if (value == null || value === '') jar.delete(name);
        else jar.set(name, value);
      }
    },
    header() {
      return [...jar.entries()].map(([name, value]) => `${name}=${value}`).join('; ');
    },
  };
}

async function loginAs(email, password) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anonKey) throw new Error('Faltan NEXT_PUBLIC_SUPABASE_URL / ANON_KEY');

  const jar = createCookieJar();
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (cookies) => jar.setAll(cookies),
    },
  });

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error || !data.session) {
    throw new Error(`Login fallido (${email}): ${error?.message ?? 'sin sesión'}`);
  }
  return { email, cookieHeader: jar.header() };
}

async function apiFetch(pathName, { method = 'GET', cookieHeader, body } = {}) {
  const url = `${BASE_URL}${pathName.startsWith('/') ? pathName : `/${pathName}`}`;
  const init = {
    method,
    headers: {
      Accept: 'application/json',
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
  };
  if (body != null) {
    init.headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(body);
  }
  const res = await fetch(url, init);
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { _raw: text.slice(0, 500) };
  }
  return {
    status: res.status,
    ok: res.ok,
    json,
    retryAfter: Number(res.headers.get('retry-after') || 0),
  };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function parseInstitutionsFromDoc(md) {
  const institutions = [];
  const sections = md.split(/^## /m).slice(1);
  for (const section of sections) {
    if (!section.startsWith('E2E Sedes Inst')) continue;
    const nombre = section.split('\n')[0].trim();
    const idMatch = section.match(/\|\s*ID\s*\|\s*\*\*(\d+)\*\*/);
    const emailMatch = section.match(/\|\s*Email institución\s*\|\s*`([^`]+)`/);
    if (!idMatch || !emailMatch) continue;

    const docentes = [];
    const docBlock = section.match(/### Docentes\s*\n([\s\S]*?)(?:\n### |\n## |$)/);
    if (docBlock) {
      for (const line of docBlock[1].split('\n')) {
        const m = line.match(/`([^`]+@[^`]+)`/);
        if (m) docentes.push(m[1].toLowerCase());
      }
    }

    institutions.push({
      id: Number(idMatch[1]),
      nombre,
      email: emailMatch[1].toLowerCase(),
      docentes,
    });
  }
  return institutions;
}

async function fetchEstudiantesByCurso(instCookies, cursoId, institucionId) {
  const res = await apiFetch(
    `/api/estudiantes/by-curso/${cursoId}?institucionId=${institucionId}`,
    { cookieHeader: instCookies }
  );
  if (!res.ok) {
    throw new Error(`estudiantes curso ${cursoId}: ${JSON.stringify(res.json)}`);
  }
  return res.json?.estudiantes || [];
}

async function postReminderWithRetry(cookieHeader, body, label) {
  for (let attempt = 1; attempt <= 6; attempt++) {
    const rem = await apiFetch('/api/recordatorios', {
      method: 'POST',
      cookieHeader,
      body,
    });
    if (rem.ok) {
      const id = rem.json?.recordatorio?.id ?? rem.json?.id ?? 'n/a';
      console.log(`    ✓ ${label} id=${id}`);
      return rem.json;
    }
    if (rem.status === 429) {
      const waitSec = Math.max(rem.retryAfter || 60, 30);
      console.warn(`    rate-limit ${label}, esperando ${waitSec}s (intento ${attempt})`);
      await sleep(waitSec * 1000);
      continue;
    }
    throw new Error(`${label}: ${JSON.stringify(rem.json)}`);
  }
  throw new Error(`${label}: agotados reintentos por rate-limit`);
}

function pickAssignments(asignaciones, count) {
  const unique = [];
  const seen = new Set();
  for (const a of asignaciones || []) {
    const cursoId = a.curso?.id;
    const materiaId = a.materia?.id;
    const gradoId = a.grado?.id;
    const areaId = a.materia?.area?.id;
    if (!cursoId || !materiaId || !gradoId || !areaId) continue;
    const key = `${cursoId}:${materiaId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push({
      cursoId,
      materiaId,
      gradoId,
      areaId,
      cursoNombre: a.curso?.nombre,
      materiaNombre: a.materia?.nombre,
    });
    if (unique.length >= count) break;
  }
  // Si solo hay una asignación, reutilizarla para el 2º recordatorio
  while (unique.length > 0 && unique.length < count) {
    unique.push({ ...unique[0] });
  }
  return unique;
}

async function sendForDocente(inst, docenteEmail, instCookies) {
  console.log(`\n  Docente ${docenteEmail}`);
  const session = await loginAs(docenteEmail, PASSWORD);
  const docRes = await apiFetch(
    `/api/docentes/by-email/${encodeURIComponent(docenteEmail)}`,
    { cookieHeader: session.cookieHeader }
  );
  if (!docRes.ok) {
    throw new Error(`by-email ${docenteEmail}: ${JSON.stringify(docRes.json)}`);
  }
  const docente = docRes.json?.docente;
  if (!docente?.id) throw new Error(`Sin docente id: ${docenteEmail}`);

  const assignments = pickAssignments(
    docente.docenteAsignaciones,
    REMINDERS_PER_DOCENTE
  );
  if (assignments.length === 0) {
    throw new Error(`Docente ${docenteEmail} sin asignaciones curso/materia/área`);
  }

  const created = [];
  for (let i = 0; i < assignments.length; i++) {
    const a = assignments[i];
    const estudiantes = await fetchEstudiantesByCurso(
      instCookies,
      a.cursoId,
      inst.id
    );
    const ids = estudiantes.map((e) => e.id).slice(0, 4);
    if (ids.length === 0) {
      throw new Error(
        `Sin estudiantes en curso ${a.cursoId} (${a.cursoNombre}) para ${docenteEmail}`
      );
    }

    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 2 + i);

    const body = {
      nombre: `E2E Rem ${i + 1} · ${a.materiaNombre || 'Materia'}`,
      descripcion: `Recordatorio de prueba #${i + 1} de ${docenteEmail}. Solo email. Inst ${inst.id}.`,
      fecha: fecha.toISOString(),
      tipo: i % 2 === 0 ? 'tarea' : 'examen',
      modoEnvio: ['email'],
      docenteId: String(docente.id),
      gradoId: String(a.gradoId),
      cursoId: String(a.cursoId),
      areaId: String(a.areaId),
      materiaId: String(a.materiaId),
      estudiantesSeleccionados: ids.map(String),
    };

    const result = await postReminderWithRetry(
      session.cookieHeader,
      body,
      `rem${i + 1}`
    );
    created.push({
      id: result?.recordatorio?.id ?? result?.id,
      nombre: body.nombre,
      estudiantes: ids.length,
    });
    await sleep(1500);
  }
  return created;
}

async function main() {
  if (!PASSWORD) throw new Error('Configure E2E_PASSWORD en .env.e2e');
  if (!fs.existsSync(DOC_PATH)) throw new Error(`No existe ${DOC_PATH}`);

  const md = fs.readFileSync(DOC_PATH, 'utf8');
  const institutions = parseInstitutionsFromDoc(md);
  if (institutions.length === 0) {
    throw new Error('No se parsearon instituciones E2E Sedes en el documento');
  }

  console.log(
    `Enviando ${REMINDERS_PER_DOCENTE} recordatorios/docente · BASE=${BASE_URL} · inst=${institutions.length}`
  );

  const report = {
    baseUrl: BASE_URL,
    remindersPerDocente: REMINDERS_PER_DOCENTE,
    institutions: [],
  };

  for (const inst of institutions) {
    console.log(`\n=== ${inst.nombre} (id=${inst.id}) ===`);
    const instSession = await loginAs(inst.email, PASSWORD);
    const row = { id: inst.id, nombre: inst.nombre, docentes: [] };

    for (const docenteEmail of inst.docentes) {
      const reminders = await sendForDocente(
        inst,
        docenteEmail,
        instSession.cookieHeader
      );
      row.docentes.push({ email: docenteEmail, reminders });
    }
    report.institutions.push(row);
  }

  const total = report.institutions.reduce(
    (n, i) => n + i.docentes.reduce((m, d) => m + d.reminders.length, 0),
    0
  );
  console.log(`\n=== Listo: ${total} recordatorios enviados ===`);

  const outPath = path.join(ROOT, 'docs', 'e2e-recordatorios-enviados.md');
  const lines = [
    '# Recordatorios E2E enviados',
    '',
    `**Base:** ${BASE_URL}`,
    `**Por docente:** ${REMINDERS_PER_DOCENTE}`,
    `**Total:** ${total}`,
    '',
  ];
  for (const inst of report.institutions) {
    lines.push(`## ${inst.nombre} (id ${inst.id})`);
    lines.push('');
    for (const d of inst.docentes) {
      lines.push(`- \`${d.email}\``);
      for (const r of d.reminders) {
        lines.push(`  - id=${r.id} · ${r.nombre} · ${r.estudiantes} estudiantes`);
      }
    }
    lines.push('');
  }
  fs.writeFileSync(outPath, lines.join('\n'), 'utf8');

  // Append short note to cuentas doc
  const note = `\n\n## Recordatorios (post-run)\n\nCada docente envió **${REMINDERS_PER_DOCENTE}** recordatorios por email. Detalle: \`docs/e2e-recordatorios-enviados.md\`.\n`;
  if (!md.includes('## Recordatorios (post-run)')) {
    fs.writeFileSync(DOC_PATH, md.trimEnd() + note, 'utf8');
  }

  console.log(`Reporte: ${outPath}`);
}

main().catch((err) => {
  console.error('\nFALLÓ:', err.message || err);
  process.exit(1);
});
