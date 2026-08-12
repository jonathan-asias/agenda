/**
 * E2E producción: 3 instituciones vía Gestión Vortico en ahoritapp.com
 *
 * Inst 1: 1 sede · 1 admin
 * Inst 2: 2 sedes · 2 admins
 * Inst 3: 2 sedes · 2 admins
 *
 * Por institución: 5 docentes, 4 materias, 4 cursos, 4 estudiantes/curso (16).
 *
 * Requiere:
 *   - .env.local (Supabase) + .env.e2e
 *   - E2E_BASE_URL=https://ahoritapp.com
 *   - Endpoint POST /api/gestion-vortico/trial-invites/:id/provision desplegado
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
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
/** Si GV falla en prod (sin PLATFORM_ADMIN_EMAILS), usar localhost con misma DB. */
const GV_BASE_URL = (process.env.E2E_GV_BASE_URL || BASE_URL).replace(/\/$/, '');
const GV_EMAIL = (process.env.E2E_GV_EMAIL || '').trim().toLowerCase();
const GV_PASSWORD = process.env.E2E_GV_PASSWORD || '';
const PASSWORD = process.env.E2E_PASSWORD || '';
const EMAIL_BASE = (process.env.E2E_EMAIL_BASE || 'jonathanasias').trim().toLowerCase();
const RUN_ID = Date.now().toString().slice(-6);

const REPORT = {
  runId: RUN_ID,
  baseUrl: BASE_URL,
  passwordNote: 'Misma contraseña E2E_PASSWORD en .env.e2e',
  instituciones: [],
};

function alias(tag) {
  return `${EMAIL_BASE}+${String(tag).toLowerCase()}@gmail.com`;
}

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
  return { email, cookieHeader: jar.header(), session: data.session };
}

async function apiFetch(pathName, { method = 'GET', cookieHeader, body, baseUrl } = {}) {
  const root = (baseUrl || BASE_URL).replace(/\/$/, '');
  const url = `${root}${pathName.startsWith('/') ? pathName : `/${pathName}`}`;
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
  return { status: res.status, ok: res.ok, json };
}

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function confirmAuthEmail(email) {
  const admin = getAdminSupabase();
  if (!admin) return;
  const { data: listed } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const user = listed?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  if (user) {
    await admin.auth.admin.updateUserById(user.id, {
      email_confirm: true,
      password: PASSWORD,
    });
  }
}

async function resolvePlanId(gvCookies) {
  if (process.env.E2E_PLAN_ID) return Number(process.env.E2E_PLAN_ID);
  const res = await apiFetch('/api/planes', { cookieHeader: gvCookies });
  if (!res.ok) throw new Error(`planes: ${res.status}`);
  const planes = res.json?.planes || [];
  const basico = planes.find(
    (p) => !p.whatsapp && String(p.nombre || '').toLowerCase().includes('básico')
  );
  const plan = basico || planes.find((p) => !p.whatsapp) || planes[0];
  if (!plan) throw new Error('Sin planes');
  console.log(`Plan: ${plan.nombre} id=${plan.id}`);
  return plan.id;
}

async function createInviteAndProvision(gvCookies, { tag, nombre, nit, sedes }) {
  const email = alias(`inst${tag}r${RUN_ID}`);
  console.log(`\n=== ${nombre} (${email}) sedes=${sedes.length} ===`);

  const inviteRes = await apiFetch('/api/gestion-vortico/trial-invites', {
    method: 'POST',
    cookieHeader: gvCookies,
    body: {
      institucionNombre: nombre,
      nit,
      email,
      planId: await resolvePlanId(gvCookies),
      trialDays: 30,
    },
  });
  // planId resolved every time - inefficient; pass planId from outside instead
  if (!inviteRes.ok) {
    throw new Error(`invite ${tag}: ${JSON.stringify(inviteRes.json)}`);
  }

  const inviteId = inviteRes.json.inviteId;
  const prov = await apiFetch(`/api/gestion-vortico/trial-invites/${inviteId}/provision`, {
    method: 'POST',
    cookieHeader: gvCookies,
    body: {
      password: PASSWORD,
      direccionPrincipal: `Av E2E ${tag} #${RUN_ID}`,
      nombreContacto: `Contacto Inst ${tag}`,
      telefonoContacto: `300${String(1000000 + Number(tag) * 17).slice(0, 7)}`,
      sedes: sedes.map((nombreSede) => ({
        nombre: nombreSede,
        jornadas: ['Mañana'],
      })),
    },
  });

  if (!prov.ok) {
    throw new Error(`provision ${tag}: ${JSON.stringify(prov.json)}`);
  }

  console.log(`  Institución id=${prov.json.institucionId} sedes=${prov.json.sedeIds?.join(',')}`);
  await confirmAuthEmail(email);

  const session = await loginAs(email, PASSWORD);
  return {
    tag,
    email,
    nombre,
    institucionId: prov.json.institucionId,
    sedeIds: prov.json.sedeIds || [],
    cookieHeader: session.cookieHeader,
  };
}

async function createSedeAdmin(inst, sedeId, adminIndex) {
  const correo = alias(`adm${inst.tag}s${adminIndex}r${RUN_ID}`);
  const res = await apiFetch(`/api/instituciones/${inst.institucionId}/administradores`, {
    method: 'POST',
    cookieHeader: inst.cookieHeader,
    body: {
      nombre: `Admin${inst.tag}`,
      apellido: `Sede${adminIndex}`,
      correo,
      telefono: `310${String(2000000 + Number(inst.tag) * 100 + adminIndex).slice(0, 7)}`,
      cargo: 'Coordinador de sede',
      password: PASSWORD,
      sede_id: String(sedeId),
    },
  });
  if (!res.ok) {
    throw new Error(`admin ${correo}: ${JSON.stringify(res.json)}`);
  }
  await confirmAuthEmail(correo);
  console.log(`  + admin ${correo} sede=${sedeId}`);
  return { correo, sedeId, id: res.json?.id };
}

/**
 * Setup académico scoped al admin de una sede.
 * @param counts { cursos, materias, docentes, estudiantesPorCurso }
 */
async function setupForSedeAdmin(inst, admin, counts, namePrefix) {
  const session = await loginAs(admin.correo, PASSWORD);
  const cookieHeader = session.cookieHeader;
  const institucionId = inst.institucionId;

  // Cursos: repartidos en grados 5 y 6
  const gradoPlan = [];
  for (let i = 0; i < counts.cursos; i++) {
    const grado_id = i % 2 === 0 ? 5 : 6;
    gradoPlan.push({
      grado_id,
      cursos: [{ nombre: `${namePrefix}-C${i + 1}` }],
    });
  }
  // Agrupar por grado_id
  const byGrado = new Map();
  for (const item of gradoPlan) {
    if (!byGrado.has(item.grado_id)) byGrado.set(item.grado_id, []);
    byGrado.get(item.grado_id).push(...item.cursos);
  }
  const gradosCursos = [...byGrado.entries()].map(([grado_id, cursos]) => ({
    grado_id,
    cursos,
  }));

  const gc = await apiFetch('/api/setup/grados-cursos', {
    method: 'POST',
    cookieHeader,
    body: { institucionId, gradosCursos },
  });
  if (!gc.ok) throw new Error(`grados-cursos ${admin.correo}: ${JSON.stringify(gc.json)}`);

  // Materias vía catálogo predeterminado (area_id 5..8 etc.)
  const areaIds = [5, 6, 7, 8, 9];
  const materiasPayload = [];
  for (let i = 0; i < counts.materias; i++) {
    materiasPayload.push({
      nombre: `${namePrefix}-Mat${i + 1}`,
      area_id: areaIds[i % areaIds.length],
    });
  }
  const mat = await apiFetch('/api/setup/materias', {
    method: 'POST',
    cookieHeader,
    body: { institucionId, materias: materiasPayload },
  });
  if (!mat.ok) throw new Error(`materias ${admin.correo}: ${JSON.stringify(mat.json)}`);

  const gradosRes = await apiFetch(`/api/setup/grados/${institucionId}`, { cookieHeader });
  const grados = gradosRes.json?.grados || [];
  const materiasRes = await apiFetch(`/api/setup/materias/${institucionId}`, { cookieHeader });
  const materias = materiasRes.json?.materias || [];
  const materiaIds = materias.map((m) => m.id);
  const gradoIds = grados.map((g) => g.id);

  const mg = await apiFetch('/api/setup/materia-grados', {
    method: 'POST',
    cookieHeader,
    body: {
      institucionId,
      asignaciones: gradoIds.flatMap((gradoId) =>
        materiaIds.map((materiaId) => ({ gradoId, materiaId }))
      ),
    },
  });
  if (!mg.ok) throw new Error(`materia-grados: ${JSON.stringify(mg.json)}`);

  const cursosByGrado = {};
  const allCursos = [];
  for (const g of grados) {
    const ids = (g.cursos || []).map((c) => c.id);
    cursosByGrado[g.id] = ids;
    for (const c of g.cursos || []) {
      allCursos.push({ ...c, grado_id: g.id });
    }
  }

  const docentes = [];
  for (let i = 0; i < counts.docentes; i++) {
    docentes.push({
      nombres: `Doc${inst.tag}`,
      apellidos: `${namePrefix}${i + 1}`,
      telefono: `320${String(3000000 + Number(inst.tag) * 100 + i).slice(0, 7)}`,
      email: alias(`doc${inst.tag}${namePrefix}${i + 1}r${RUN_ID}`.replace(/-/g, '')),
      password: PASSWORD,
    });
  }

  // Crear docentes de uno en uno para capturar errores claros
  const docentesCreados = [];
  for (const docente of docentes) {
    const doc = await apiFetch('/api/setup/docentes', {
      method: 'POST',
      cookieHeader,
      body: {
        institucionId,
        docentes: [docente],
        asignaciones: {
          grados: gradoIds,
          cursos: cursosByGrado,
          materias: Object.fromEntries(
            gradoIds.map((id) => [id, materiaIds.slice(0, 2)])
          ),
        },
      },
    });
    if (!doc.ok) {
      throw new Error(`docente ${docente.email}: ${JSON.stringify(doc.json)}`);
    }
    await confirmAuthEmail(docente.email);
    docentesCreados.push(docente.email);
    console.log(`    + docente ${docente.email}`);
  }

  const estudiantes = [];
  let estSeq = 0;
  for (const curso of allCursos) {
    for (let i = 0; i < counts.estudiantesPorCurso; i++) {
      estSeq += 1;
      estudiantes.push({
        nombres: `Est${inst.tag}`,
        apellidos: `${namePrefix}${estSeq}`,
        codigo_estudiantil: `E2E${inst.tag}${RUN_ID}${namePrefix}${estSeq}`.slice(0, 30),
        nombre_acudiente: `Acudiente ${inst.tag}-${estSeq}`,
        correo_acudiente: alias(`acu${inst.tag}${namePrefix}${estSeq}r${RUN_ID}`),
        telefono_acudiente: `311${String(4000000 + estSeq).slice(0, 7)}`,
        grado_id: curso.grado_id,
        curso_id: curso.id,
      });
    }
  }

  const estRes = await apiFetch('/api/setup/estudiantes', {
    method: 'POST',
    cookieHeader,
    body: { institucionId, estudiantes },
  });
  if (!estRes.ok) {
    throw new Error(`estudiantes: ${JSON.stringify(estRes.json)}`);
  }
  const created =
    estRes.json?.data?.estudiantesCreados ||
    estRes.json?.data?.estudiantes ||
    [];
  console.log(
    `    estudiantes creados: ${created.length || estudiantes.length} (esperados ${estudiantes.length})`
  );

  return {
    admin: admin.correo,
    sedeId: admin.sedeId,
    docentes: docentesCreados,
    cursos: allCursos.map((c) => c.nombre),
    materias: materias.map((m) => m.nombre),
    estudiantes: estudiantes.length,
    acudientes: estudiantes.map((e) => e.correo_acudiente),
  };
}

async function main() {
  if (!GV_EMAIL || !GV_PASSWORD || !PASSWORD) {
    throw new Error('Configure E2E_GV_EMAIL, E2E_GV_PASSWORD, E2E_PASSWORD en .env.e2e');
  }

  console.log(`E2E ahoritapp sedes BASE=${BASE_URL} GV_BASE=${GV_BASE_URL} RUN=${RUN_ID}`);

  const health = await apiFetch('/api/planes');
  if (!health.ok) throw new Error(`Servidor no responde (${health.status})`);

  const gv = await loginAs(GV_EMAIL, GV_PASSWORD);

  async function resolveGvBase() {
    const candidates = [...new Set([GV_BASE_URL, BASE_URL, 'http://localhost:3000'])];
    for (const candidate of candidates) {
      const me = await apiFetch('/api/gestion-vortico/me', {
        cookieHeader: gv.cookieHeader,
        baseUrl: candidate,
      });
      if (me.ok) {
        console.log(`Gestión Vortico OK @ ${candidate}`);
        return candidate;
      }
      console.warn(
        `GV denegado @ ${candidate}: ${me.json?.code || me.status} ${me.json?.error || ''}`
      );
    }
    throw new Error(
      'Gestión Vortico denegado en todos los hosts. En Vercel (Production) agregue PLATFORM_ADMIN_EMAILS=jonathanasias@gmail.com y redeploy, o arranque npm run dev en local con esa variable.'
    );
  }

  const gvBase = await resolveGvBase();
  REPORT.gvBaseUrl = gvBase;
  REPORT.baseUrl = BASE_URL;

  const planId = await resolvePlanId(gv.cookieHeader);

  async function inviteAndProvision(cfg) {
    const email = alias(`inst${cfg.tag}r${RUN_ID}`);
    console.log(`\n=== ${cfg.nombre} (${email}) sedes=${cfg.sedes.length} ===`);
    const inviteRes = await apiFetch('/api/gestion-vortico/trial-invites', {
      method: 'POST',
      cookieHeader: gv.cookieHeader,
      baseUrl: gvBase,
      body: {
        institucionNombre: cfg.nombre,
        nit: cfg.nit,
        email,
        planId,
        trialDays: 30,
      },
    });
    if (!inviteRes.ok) {
      throw new Error(`invite ${cfg.tag}: ${JSON.stringify(inviteRes.json)}`);
    }
    const inviteId = inviteRes.json.inviteId;
    const prov = await apiFetch(
      `/api/gestion-vortico/trial-invites/${inviteId}/provision`,
      {
        method: 'POST',
        cookieHeader: gv.cookieHeader,
        baseUrl: gvBase,
        body: {
          password: PASSWORD,
          direccionPrincipal: `Av E2E ${cfg.tag} #${RUN_ID}`,
          nombreContacto: `Contacto Inst ${cfg.tag}`,
          telefonoContacto: `300${String(1000000 + Number(cfg.tag) * 17).slice(0, 7)}`,
          sedes: cfg.sedes.map((nombreSede) => ({
            nombre: nombreSede,
            jornadas: ['Mañana'],
          })),
        },
      }
    );
    if (!prov.ok) {
      throw new Error(`provision ${cfg.tag}: ${JSON.stringify(prov.json)}`);
    }
    console.log(
      `  Institución id=${prov.json.institucionId} sedes=[${(prov.json.sedeIds || []).join(',')}]`
    );
    await confirmAuthEmail(email);
    const session = await loginAs(email, PASSWORD);
    return {
      tag: cfg.tag,
      email,
      nombre: cfg.nombre,
      institucionId: prov.json.institucionId,
      sedeIds: prov.json.sedeIds || [],
      cookieHeader: session.cookieHeader,
    };
  }

  const specs = [
    {
      tag: '1',
      nombre: `E2E Sedes Inst1 ${RUN_ID}`,
      nit: `910${RUN_ID}`.slice(0, 9),
      sedes: ['Sede Única'],
    },
    {
      tag: '2',
      nombre: `E2E Sedes Inst2 ${RUN_ID}`,
      nit: `920${RUN_ID}`.slice(0, 9),
      sedes: ['Sede Norte', 'Sede Sur'],
    },
    {
      tag: '3',
      nombre: `E2E Sedes Inst3 ${RUN_ID}`,
      nit: `930${RUN_ID}`.slice(0, 9),
      sedes: ['Sede Oriente', 'Sede Occidente'],
    },
  ];

  for (const spec of specs) {
    const inst = await inviteAndProvision(spec);
    const admins = [];
    for (let i = 0; i < inst.sedeIds.length; i++) {
      admins.push(await createSedeAdmin(inst, inst.sedeIds[i], i + 1));
    }

    const sedeSetups = [];
    if (admins.length === 1) {
      // Toda la carga académica en la única sede
      sedeSetups.push(
        await setupForSedeAdmin(
          inst,
          admins[0],
          { cursos: 4, materias: 4, docentes: 5, estudiantesPorCurso: 4 },
          'A'
        )
      );
    } else {
      // Reparto entre 2 sedes: 2+2 cursos, 2+2 materias, 3+2 docentes, 8+8 estudiantes
      sedeSetups.push(
        await setupForSedeAdmin(
          inst,
          admins[0],
          { cursos: 2, materias: 2, docentes: 3, estudiantesPorCurso: 4 },
          'N'
        )
      );
      sedeSetups.push(
        await setupForSedeAdmin(
          inst,
          admins[1],
          { cursos: 2, materias: 2, docentes: 2, estudiantesPorCurso: 4 },
          'S'
        )
      );
    }

    const docentes = sedeSetups.flatMap((s) => s.docentes);
    const cursos = sedeSetups.flatMap((s) => s.cursos);
    const materias = sedeSetups.flatMap((s) => s.materias);
    const estudiantes = sedeSetups.reduce((n, s) => n + s.estudiantes, 0);
    const acudientes = sedeSetups.flatMap((s) => s.acudientes);

    REPORT.instituciones.push({
      id: inst.institucionId,
      nombre: inst.nombre,
      email: inst.email,
      sedes: inst.sedeIds.length,
      sedeIds: inst.sedeIds,
      admins: admins.map((a) => ({ email: a.correo, sedeId: a.sedeId })),
      docentes,
      cursos,
      materias,
      estudiantes,
      acudientes,
      totales: {
        docentes: docentes.length,
        materias: materias.length,
        cursos: cursos.length,
        estudiantes,
      },
    });

    console.log(
      `  Totales inst ${inst.tag}: docentes=${docentes.length} materias=${materias.length} cursos=${cursos.length} estudiantes=${estudiantes}`
    );
  }

  const outPath = path.join(ROOT, 'docs', `e2e-ahoritapp-sedes-${RUN_ID}.md`);
  const md = buildReportMarkdown(REPORT);
  fs.writeFileSync(outPath, md, 'utf8');
  // Also refresh canonical doc
  fs.writeFileSync(path.join(ROOT, 'docs', 'e2e-cuentas-prueba.md'), md, 'utf8');

  console.log('\n=== E2E ahoritapp sedes completado ===');
  console.log(JSON.stringify(REPORT.instituciones.map((i) => i.totales), null, 2));
  console.log(`Reporte: ${outPath}`);
}

function buildReportMarkdown(report) {
  const lines = [];
  lines.push(`# Cuentas E2E ahoritapp.com — sedes (run ${report.runId})`);
  lines.push('');
  lines.push(`**Base URL (setup académico):** ${report.baseUrl}  `);
  if (report.gvBaseUrl && report.gvBaseUrl !== report.baseUrl) {
    lines.push(`**GV / provision:** ${report.gvBaseUrl} (misma DB; prod sin PLATFORM_ADMIN_EMAILS)  `);
  }
  lines.push(`**Contraseña:** la de \`.env.e2e\` (\`E2E_PASSWORD\` / provisional de pruebas).`);
  lines.push('');
  lines.push('## Operador Gestión Vortico');
  lines.push('');
  lines.push(`- Email: \`${GV_EMAIL}\``);
  lines.push('');
  for (const inst of report.instituciones) {
    lines.push(`## ${inst.nombre}`);
    lines.push('');
    lines.push(`| Campo | Valor |`);
    lines.push(`|---|---|`);
    lines.push(`| ID | **${inst.id}** |`);
    lines.push(`| Email institución | \`${inst.email}\` |`);
    lines.push(`| Sedes | ${inst.sedes} (ids: ${inst.sedeIds.join(', ')}) |`);
    lines.push(
      `| Totales | docentes=${inst.totales.docentes}, materias=${inst.totales.materias}, cursos=${inst.totales.cursos}, estudiantes=${inst.totales.estudiantes} |`
    );
    lines.push('');
    lines.push('### Admins por sede');
    lines.push('');
    for (const a of inst.admins) {
      lines.push(`- \`${a.email}\` → sede_id=${a.sedeId}`);
    }
    lines.push('');
    lines.push('### Docentes');
    lines.push('');
    for (const d of inst.docentes) {
      lines.push(`- \`${d}\``);
    }
    lines.push('');
    lines.push('### Cursos');
    lines.push('');
    for (const c of inst.cursos) {
      lines.push(`- ${c}`);
    }
    lines.push('');
    lines.push('### Materias');
    lines.push('');
    for (const m of inst.materias) {
      lines.push(`- ${m}`);
    }
    lines.push('');
    lines.push('### Acudientes (correos)');
    lines.push('');
    for (const a of inst.acudientes) {
      lines.push(`- \`${a}\``);
    }
    lines.push('');
  }
  lines.push('## Cómo se creó');
  lines.push('');
  lines.push('1. Invitación trial desde Gestión Vortico en ahoritapp.com');
  lines.push('2. Provision operador (`POST .../trial-invites/:id/provision`)');
  lines.push('3. Admins por sede desde cuenta institución');
  lines.push('4. Setup académico con sesión de cada admin (scoped por sede)');
  lines.push('');
  return lines.join('\n');
}

main().catch((err) => {
  console.error('\nE2E FALLÓ:', err.message || err);
  process.exit(1);
});
