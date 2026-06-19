/**
 * Conexión PostgreSQL para pentest (pooler Supavisor + URLs normalizadas).
 */
import pg from 'pg';

export function extractSupabaseProjectRef(postgresUrl) {
  if (!postgresUrl?.trim()) return null;
  try {
    const u = new URL(postgresUrl);
    const m = u.username.match(/^(?:postgres|agenda_app)\.([a-z0-9]+)$/i);
    return m?.[1] ?? null;
  } catch {
    return null;
  }
}

export function normalizePoolerConnectionUrl(url, projectRef) {
  if (!url?.trim() || !projectRef) return url;
  try {
    const u = new URL(url);
    if (!u.hostname.includes('pooler.supabase.com')) return url;
    const baseUser = u.username.split('.')[0];
    if (baseUser === 'postgres' || baseUser === 'agenda_app') {
      if (!u.username.includes('.')) {
        u.username = `${baseUser}.${projectRef}`;
      }
    }
    return u.toString();
  } catch {
    return url;
  }
}

function deriveAgendaAppUrl(postgresUrl, projectRef) {
  if (!postgresUrl?.trim()) return null;
  try {
    const u = new URL(postgresUrl);
    if (u.username.startsWith('postgres')) {
      u.username = projectRef ? `agenda_app.${projectRef}` : 'agenda_app';
    }
    return u.toString();
  } catch {
    return null;
  }
}

export function buildDbUrlCandidates(env = process.env) {
  const raw = [
    env.DATABASE_URL_AGENDA_APP?.trim(),
    env.DIRECT_URL?.trim(),
    env.DATABASE_URL?.trim(),
  ].filter(Boolean);

  const projectRef =
    extractSupabaseProjectRef(env.DATABASE_URL) ||
    extractSupabaseProjectRef(env.DIRECT_URL) ||
    extractSupabaseProjectRef(env.DATABASE_URL_AGENDA_APP);

  const normalized = new Set();
  for (const url of raw) {
    normalized.add(normalizePoolerConnectionUrl(url, projectRef));
  }

  const agendaExplicit = env.DATABASE_URL_AGENDA_APP?.trim();
  if (agendaExplicit) {
    normalized.add(normalizePoolerConnectionUrl(agendaExplicit, projectRef));
  }

  const derived = deriveAgendaAppUrl(env.DATABASE_URL?.trim(), projectRef);
  if (derived) {
    normalized.add(normalizePoolerConnectionUrl(derived, projectRef));
  }

  return [...normalized];
}

export function buildAgendaAppCandidates(env = process.env) {
  const projectRef =
    extractSupabaseProjectRef(env.DATABASE_URL) ||
    extractSupabaseProjectRef(env.DIRECT_URL) ||
    extractSupabaseProjectRef(env.DATABASE_URL_AGENDA_APP);

  const urls = [];
  if (env.DATABASE_URL_AGENDA_APP?.trim()) {
    urls.push(normalizePoolerConnectionUrl(env.DATABASE_URL_AGENDA_APP.trim(), projectRef));
  }
  const derived = deriveAgendaAppUrl(env.DATABASE_URL?.trim(), projectRef);
  if (derived) {
    urls.push(normalizePoolerConnectionUrl(derived, projectRef));
  }

  return [...new Set(urls.filter(Boolean))];
}

export function buildAdminCandidates(env = process.env) {
  const projectRef =
    extractSupabaseProjectRef(env.DATABASE_URL) ||
    extractSupabaseProjectRef(env.DIRECT_URL);

  const urls = [env.DIRECT_URL?.trim(), env.DATABASE_URL?.trim()].filter(Boolean);
  return [...new Set(urls.map((u) => normalizePoolerConnectionUrl(u, projectRef)))];
}

export async function connectFirst(urls, { label = 'DB' } = {}) {
  let lastErr;
  for (const connectionString of urls) {
    const client = new pg.Client({ connectionString });
    try {
      await client.connect();
      const { rows } = await client.query('SELECT current_user AS rol');
      return { client, rol: rows[0]?.rol, connectionString };
    } catch (err) {
      lastErr = err;
      try {
        await client.end();
      } catch {
        /* ignore */
      }
    }
  }
  throw lastErr ?? new Error(`Sin conexión (${label})`);
}
