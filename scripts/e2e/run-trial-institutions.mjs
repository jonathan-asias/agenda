/**
 * E2E: Gestión Vortico → 2 instituciones trial → setup → recordatorios email.
 * Inst 1: flujo tipo wizard (lotes setup).
 * Inst 2: alta elemento a elemento.
 * 15 estudiantes por institución. Solo canal email.
 *
 * Uso:
 *   node scripts/e2e/run-trial-institutions.mjs
 *
 * Requiere: .env.local (Supabase) + .env.e2e + servidor en E2E_BASE_URL
 *           PLATFORM_ADMIN_EMAILS debe incluir E2E_GV_EMAIL en el servidor.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

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

const BASE_URL = (process.env.E2E_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
const GV_EMAIL = (process.env.E2E_GV_EMAIL || '').trim().toLowerCase();
const GV_PASSWORD = process.env.E2E_GV_PASSWORD || '';
const PASSWORD = process.env.E2E_PASSWORD || '';
const EMAIL_BASE = (process.env.E2E_EMAIL_BASE || 'jonathanasias').trim().toLowerCase();
const RUN_ID = Date.now().toString().slice(-6);

function alias(tag) {
  return `${EMAIL_BASE}+${tag}@gmail.com`;
}

function instEmail(tag) {
  return alias(`inst${tag}r${RUN_ID}`);
}

function docenteEmailFor(tag) {
  return alias(`doc${tag}r${RUN_ID}`);
}

function acudienteEmail(n) {
  return alias(`acu${n}r${RUN_ID}`);
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
  const { createServerClient } = await import('@supabase/ssr');
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
  return { email, cookieHeader: jar.header(), session: data.session, jar };
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
    json = { _raw: text.slice(0, 400) };
  }
  return { status: res.status, ok: res.ok, json };
}

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

async function ensureAuthUser(email, password) {
  const admin = getAdminSupabase();
  if (admin) {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (!error) return data.user;
    const msg = (error.message || '').toLowerCase();
    if (!msg.includes('already') && error.code !== 'email_exists' && error.status !== 422) {
      throw new Error(`admin.createUser ${email}: ${error.message}`);
    }
    // Confirm existing user if needed
    const { data: listed } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const user = listed?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (user && !user.email_confirmed_at) {
      await admin.auth.admin.updateUserById(user.id, { email_confirm: true });
    }
    return user ?? null;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anonKey) throw new Error('Supabase público no configurado');
  const pub = createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: signData, error: signError } = await pub.auth.signUp({ email, password });
  if (signError) {
    const msg = (signError.message || '').toLowerCase();
    if (!msg.includes('already')) throw new Error(`signUp ${email}: ${signError.message}`);
  }
  return signData?.user ?? null;
}

function extractTokenFromRegistroUrl(registroUrl) {
  const u = new URL(registroUrl);
  return u.searchParams.get('token') || '';
}

async function createTrialAndRegister({
  gvCookies,
  tag,
  nombre,
  nit,
  planId,
}) {
  const email = instEmail(tag);
  console.log(`\n=== Institución ${tag}: ${nombre} (${email}) ===`);

  const inviteRes = await apiFetch('/api/gestion-vortico/trial-invites', {
    method: 'POST',
    cookieHeader: gvCookies,
    body: {
      institucionNombre: nombre,
      nit,
      email,
      planId,
      trialDays: 30,
    },
  });

  if (!inviteRes.ok) {
    throw new Error(
      `Trial invite ${tag} falló (${inviteRes.status}): ${JSON.stringify(inviteRes.json)}`
    );
  }

  const registroUrl = inviteRes.json.registroUrl || inviteRes.json.registroUrlLocalhost;
  if (!registroUrl) throw new Error(`Sin registroUrl para inst ${tag}`);
  const registroToken = extractTokenFromRegistroUrl(registroUrl);
  if (!registroToken) throw new Error(`Sin token en registroUrl inst ${tag}`);

  console.log(`  Invite OK id=${inviteRes.json.inviteId} emailSent=${inviteRes.json.emailSent}`);

  await ensureAuthUser(email, PASSWORD);

  const reg = await apiFetch('/api/instituciones', {
    method: 'POST',
    body: {
      nombre,
      direccion_principal: `Calle ${tag} #${RUN_ID}-E2E`,
      nit,
      nombre_contacto: `Contacto E2E ${tag}`,
      telefono_contacto: `300${String(1000000 + Number(tag) * 111).slice(0, 7)}`,
      email,
      password: PASSWORD,
      registroToken,
      tiene_sedes: false,
      jornadas: ['Mañana'],
      color_primario: '#2563eb',
      color_secundario: '#0f172a',
      turnstileToken: 'e2e-bypass',
    },
  });

  if (!reg.ok) {
    throw new Error(
      `Registro institución ${tag} falló (${reg.status}): ${JSON.stringify(reg.json)}`
    );
  }

  const institucionId = reg.json?.data?.id;
  if (!institucionId) throw new Error(`Sin institucionId tras registro ${tag}`);
  console.log(`  Registrada id=${institucionId}`);

  const session = await loginAs(email, PASSWORD);
  return { email, institucionId, cookieHeader: session.cookieHeader, tag };
}

async function resolvePlanId(gvCookies) {
  if (process.env.E2E_PLAN_ID) return Number(process.env.E2E_PLAN_ID);
  const res = await apiFetch('/api/planes', { cookieHeader: gvCookies });
  if (!res.ok) throw new Error(`No se pudieron listar planes: ${res.status}`);
  const planes = res.json?.planes || [];
  const basico = planes.find(
    (p) => !p.whatsapp && String(p.nombre || '').toLowerCase().includes('básico')
  );
  const sinWa = planes.find((p) => p.whatsapp === false || p.whatsapp == null);
  const plan = basico || sinWa || planes[0];
  if (!plan) throw new Error('No hay planes activos');
  console.log(`Plan: ${plan.nombre} id=${plan.id} whatsapp=${plan.whatsapp}`);
  return plan.id;
}

/** Wizard-style: batch setup APIs */
async function setupWizardStyle(inst) {
  const { institucionId, cookieHeader, tag } = inst;
  console.log(`  [wizard] grados/cursos/áreas/materias/docente/15 estudiantes`);

  const gc = await apiFetch('/api/setup/grados-cursos', {
    method: 'POST',
    cookieHeader,
    body: {
      institucionId,
      gradosCursos: [
        { grado_id: 5, cursos: [{ nombre: `E2E-${tag}-1A` }, { nombre: `E2E-${tag}-1B` }] },
        { grado_id: 6, cursos: [{ nombre: `E2E-${tag}-2A` }] },
      ],
    },
  });
  if (!gc.ok) throw new Error(`grados-cursos: ${JSON.stringify(gc.json)}`);

  const am = await apiFetch('/api/setup/areas-materias', {
    method: 'POST',
    cookieHeader,
    body: {
      institucionId,
      areas: [{ nombre: 'Ciencias', es_opcional: false, orden: 1 }],
      materias: [{ nombre: 'Matemáticas', areaId: 1 }],
    },
  });
  if (!am.ok) throw new Error(`areas-materias: ${JSON.stringify(am.json)}`);

  const gradosRes = await apiFetch(`/api/setup/grados/${institucionId}`, { cookieHeader });
  const grados = gradosRes.json?.grados || [];
  const materiasRes = await apiFetch(`/api/setup/materias/${institucionId}`, { cookieHeader });
  const materias = materiasRes.json?.materias || [];
  const materia = materias[0];
  if (!materia) throw new Error('Sin materia tras wizard areas');

  const gradoIds = grados.map((g) => g.id);
  const mg = await apiFetch('/api/setup/materia-grados', {
    method: 'POST',
    cookieHeader,
    body: {
      institucionId,
      asignaciones: gradoIds.map((gradoId) => ({
        materiaId: materia.id,
        gradoId,
      })),
    },
  });
  if (!mg.ok) throw new Error(`materia-grados: ${JSON.stringify(mg.json)}`);

  const docenteEmail = docenteEmailFor(tag);

  const cursosByGrado = {};
  for (const g of grados) {
    cursosByGrado[g.id] = (g.cursos || []).map((c) => c.id);
  }

  const doc = await apiFetch('/api/setup/docentes', {
    method: 'POST',
    cookieHeader,
    body: {
      institucionId,
      docentes: [
        {
          nombres: 'Docente',
          apellidos: `E2E${tag}`,
          telefono: '3001112233',
          email: docenteEmail,
          password: PASSWORD,
        },
      ],
      asignaciones: {
        grados: gradoIds,
        cursos: cursosByGrado,
        materias: Object.fromEntries(gradoIds.map((id) => [id, [materia.id]])),
      },
    },
  });
  if (!doc.ok) throw new Error(`docentes: ${JSON.stringify(doc.json)}`);

  const allCursos = grados.flatMap((g) =>
    (g.cursos || []).map((c) => ({ ...c, grado_id: g.id }))
  );
  const estudiantes = buildStudents(tag, allCursos, 15, tag === '1' ? 1 : 16);

  const est = await apiFetch('/api/setup/estudiantes', {
    method: 'POST',
    cookieHeader,
    body: { institucionId, estudiantes },
  });
  if (!est.ok) throw new Error(`estudiantes batch: ${JSON.stringify(est.json)}`);

  const created =
    est.json?.data?.estudiantesCreados ||
    est.json?.data?.estudiantes ||
    est.json?.estudiantes ||
    [];
  console.log(`  [wizard] estudiantes creados: ${created.length || estudiantes.length}`);

  return {
    docenteEmail,
    materia,
    grados,
    allCursos,
    estudiantes,
    estudianteIds: created.map((e) => e.id).filter(Boolean),
  };
}

/** Manual-style: one resource at a time */
async function setupManualStyle(inst) {
  const { institucionId, cookieHeader, tag } = inst;
  console.log(`  [manual] elemento por elemento`);

  // 3 llamadas separadas de grados-cursos (como agregar curso/grado aparte)
  for (const [gradoId, cursoNombre] of [
    [5, `E2E-${tag}-1A`],
    [5, `E2E-${tag}-1B`],
    [6, `E2E-${tag}-2A`],
  ]) {
    const r = await apiFetch('/api/setup/grados-cursos', {
      method: 'POST',
      cookieHeader,
      body: {
        institucionId,
        gradosCursos: [{ grado_id: gradoId, cursos: [{ nombre: cursoNombre }] }],
      },
    });
    if (!r.ok) throw new Error(`manual grados-cursos ${cursoNombre}: ${JSON.stringify(r.json)}`);
    console.log(`    + curso ${cursoNombre}`);
  }

  // /api/setup/materias espera area_id del catálogo predeterminado (1–13), no el id de BD.
  const mat = await apiFetch('/api/setup/materias', {
    method: 'POST',
    cookieHeader,
    body: {
      institucionId,
      materias: [{ nombre: 'Lenguaje', area_id: 7 }],
    },
  });
  if (!mat.ok) throw new Error(`manual materia: ${JSON.stringify(mat.json)}`);
  console.log('    + materia Lenguaje (área catálogo 7)');

  const gradosRes = await apiFetch(`/api/setup/grados/${institucionId}`, { cookieHeader });
  const grados = gradosRes.json?.grados || [];
  const materiasRes = await apiFetch(`/api/setup/materias/${institucionId}`, { cookieHeader });
  const materia = (materiasRes.json?.materias || [])[0];
  if (!materia) throw new Error('Sin materia tras alta manual');
  const gradoIds = grados.map((g) => g.id);

  await apiFetch('/api/setup/materia-grados', {
    method: 'POST',
    cookieHeader,
    body: {
      institucionId,
      asignaciones: gradoIds.map((gradoId) => ({ materiaId: materia.id, gradoId })),
    },
  });

  const docenteEmail = docenteEmailFor(tag);
  const cursosByGrado = {};
  for (const g of grados) {
    cursosByGrado[g.id] = (g.cursos || []).map((c) => c.id);
  }

  const doc = await apiFetch('/api/setup/docentes', {
    method: 'POST',
    cookieHeader,
    body: {
      institucionId,
      docentes: [
        {
          nombres: 'Docente',
          apellidos: `Manual${tag}`,
          telefono: '3002223344',
          email: docenteEmail,
          password: PASSWORD,
        },
      ],
      asignaciones: {
        grados: gradoIds,
        cursos: cursosByGrado,
        materias: Object.fromEntries(gradoIds.map((id) => [id, [materia.id]])),
      },
    },
  });
  if (!doc.ok) throw new Error(`manual docente: ${JSON.stringify(doc.json)}`);
  console.log(`    + docente ${docenteEmail}`);

  const allCursos = grados.flatMap((g) =>
    (g.cursos || []).map((c) => ({ ...c, grado_id: g.id }))
  );
  const estudiantes = buildStudents(tag, allCursos, 15, 16);

  let okCount = 0;
  const estudianteIds = [];
  for (const estudiante of estudiantes) {
    const r = await apiFetch('/api/setup/estudiantes', {
      method: 'POST',
      cookieHeader,
      body: { institucionId, estudiantes: [estudiante] },
    });
    if (!r.ok) {
      throw new Error(
        `manual estudiante ${estudiante.codigo_estudiantil}: ${JSON.stringify(r.json)}`
      );
    }
    const created =
      r.json?.data?.estudiantesCreados ||
      r.json?.data?.estudiantes ||
      [];
    for (const e of created) {
      if (e?.id) estudianteIds.push(e.id);
    }
    okCount += 1;
  }
  console.log(`  [manual] estudiantes creados uno a uno: ${okCount}`);

  return { docenteEmail, materia, grados, allCursos, estudiantes, estudianteIds };
}

function buildStudents(tag, cursos, count, acudienteStart) {
  if (!cursos.length) throw new Error('Sin cursos para asignar estudiantes');
  const list = [];
  for (let i = 0; i < count; i++) {
    const curso = cursos[i % cursos.length];
    const n = acudienteStart + i;
    list.push({
      nombres: `Est${tag}`,
      apellidos: `Prueba${String(i + 1).padStart(2, '0')}`,
      codigo_estudiantil: `E2E${tag}${RUN_ID}${String(i + 1).padStart(2, '0')}`,
      nombre_acudiente: `Acudiente ${n}`,
      correo_acudiente: acudienteEmail(n),
      telefono_acudiente: `310${String(1000000 + n).slice(0, 7)}`,
      grado_id: curso.grado_id,
      curso_id: curso.id,
    });
  }
  return list;
}

async function resolveDocenteId(docenteEmail) {
  // login as docente and use by-email
  const session = await loginAs(docenteEmail, PASSWORD);
  const res = await apiFetch(`/api/docentes/by-email/${encodeURIComponent(docenteEmail)}`, {
    cookieHeader: session.cookieHeader,
  });
  if (!res.ok) {
    // try without auth path variants
    throw new Error(`No se resolvió docente ${docenteEmail}: ${JSON.stringify(res.json)}`);
  }
  const id = res.json?.docente?.id ?? res.json?.id;
  if (!id) throw new Error(`Docente sin id: ${JSON.stringify(res.json)}`);
  return { docenteId: id, cookieHeader: session.cookieHeader };
}

async function createEmailReminder(inst, setup) {
  const { docenteEmail, materia, grados, allCursos, estudiantes, estudianteIds } = setup;
  const { docenteId, cookieHeader } = await resolveDocenteId(docenteEmail);

  const paired = (estudiantes || []).map((e, i) => ({
    ...e,
    id: (estudianteIds || [])[i],
  })).filter((e) => e.id);

  if (paired.length === 0) {
    throw new Error('No hay estudiantes con id para el recordatorio');
  }

  const targetCursoId = paired[0].curso_id;
  const curso = allCursos.find((c) => c.id === targetCursoId) || allCursos[0];
  const grado = grados.find((g) => g.id === curso.grado_id) || grados[0];
  const ids = paired.filter((e) => e.curso_id === curso.id).map((e) => e.id).slice(0, 5);
  if (ids.length === 0) {
    throw new Error('No hay estudiantes del curso seleccionado para el recordatorio');
  }

  const areasRes = await apiFetch(`/api/setup/areas/${inst.institucionId}`, {
    cookieHeader: inst.cookieHeader,
  });
  const area = (areasRes.json?.areas || [])[0];
  if (!area) throw new Error(`Sin área en institución ${inst.tag}`);

  const fecha = new Date();
  fecha.setDate(fecha.getDate() + 3);

  const rem = await apiFetch('/api/recordatorios', {
    method: 'POST',
    cookieHeader,
    body: {
      nombre: `E2E Recordatorio Inst ${inst.tag}`,
      descripcion: `Prueba automatizada institución ${inst.tag}. Solo email. RUN ${RUN_ID}.`,
      fecha: fecha.toISOString(),
      tipo: 'tarea',
      modoEnvio: ['email'],
      docenteId: String(docenteId),
      gradoId: String(grado.id),
      cursoId: String(curso.id),
      areaId: String(area.id),
      materiaId: String(materia.id),
      estudiantesSeleccionados: ids.map(String),
    },
  });

  if (!rem.ok) {
    throw new Error(`recordatorio inst ${inst.tag}: ${JSON.stringify(rem.json)}`);
  }
  console.log(
    `  Recordatorio email OK (estudiantes=${ids.length}) id=${rem.json?.recordatorio?.id ?? rem.json?.id ?? 'n/a'}`
  );
  return { reminder: rem.json, studentIds: ids };
}

async function assertCrossTenantBlocked(instA, instB) {
  const docA = await loginAs(docenteEmailFor('1'), PASSWORD);
  const probe = await apiFetch(`/api/setup/grados/${instB.institucionId}`, {
    cookieHeader: docA.cookieHeader,
  });
  const blocked =
    probe.status === 401 ||
    probe.status === 403 ||
    probe.status === 404 ||
    (probe.ok && (probe.json?.grados || []).length === 0);
  // Also try recordatorios by institution
  const rem = await apiFetch(`/api/recordatorios/by-institucion/${instB.institucionId}`, {
    cookieHeader: docA.cookieHeader,
  });
  const remBlocked =
    rem.status === 401 || rem.status === 403 || rem.status === 404 || !rem.ok;

  console.log(
    `  Cross-tenant: grados B status=${probe.status} blocked=${blocked}; recordatorios B status=${rem.status} blocked=${remBlocked}`
  );
  if (!blocked && !remBlocked) {
    throw new Error('POSIBLE FUGA: docente1 accede a recursos de institución 2');
  }
  return true;
}

async function main() {
  if (!GV_EMAIL || !GV_PASSWORD || !PASSWORD) {
    throw new Error('Complete E2E_GV_EMAIL, E2E_GV_PASSWORD y E2E_PASSWORD en .env.e2e');
  }

  console.log(`E2E BASE_URL=${BASE_URL} RUN_ID=${RUN_ID}`);
  console.log(`GV admin=${GV_EMAIL}`);

  const health = await apiFetch('/api/planes');
  if (!health.ok) {
    throw new Error(`Servidor no responde en ${BASE_URL} (planes=${health.status})`);
  }

  const gv = await loginAs(GV_EMAIL, GV_PASSWORD);
  const me = await apiFetch('/api/gestion-vortico/me', { cookieHeader: gv.cookieHeader });
  if (!me.ok) {
    throw new Error(
      `Gestión Vortico denegado (${me.status}). Verifique PLATFORM_ADMIN_EMAILS y password. ${JSON.stringify(me.json)}`
    );
  }
  console.log('Gestión Vortico: sesión OK');

  const planId = await resolvePlanId(gv.cookieHeader);

  const inst1 = await createTrialAndRegister({
    gvCookies: gv.cookieHeader,
    tag: '1',
    nombre: `E2E Test Inst 1 ${RUN_ID}`,
    nit: `900${RUN_ID}`.slice(0, 9),
    planId,
  });

  const inst2 = await createTrialAndRegister({
    gvCookies: gv.cookieHeader,
    tag: '2',
    nombre: `E2E Test Inst 2 ${RUN_ID}`,
    nit: `901${RUN_ID}`.slice(0, 9),
    planId,
  });

  const setup1 = await setupWizardStyle(inst1);
  const setup2 = await setupManualStyle(inst2);

  await createEmailReminder(inst1, setup1);
  await createEmailReminder(inst2, setup2);

  await assertCrossTenantBlocked(inst1, inst2);

  console.log('\n=== E2E completado ===');
  console.log(
    JSON.stringify(
      {
        runId: RUN_ID,
        inst1: { id: inst1.institucionId, email: inst1.email, mode: 'wizard' },
        inst2: { id: inst2.institucionId, email: inst2.email, mode: 'manual' },
        studentsPerInstitution: 15,
        channel: 'email',
        note: 'Revise Gmail (aliases +acudiente*) para correos de Copetón. Gmail API queda como mejora.',
      },
      null,
      2
    )
  );
}

main().catch((err) => {
  console.error('\nE2E FALLÓ:', err.message || err);
  process.exit(1);
});
