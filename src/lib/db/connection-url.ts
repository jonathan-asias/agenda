/**
 * Supavisor (pooler) requiere usuario con project ref: postgres.REF o agenda_app.REF
 */
export function extractSupabaseProjectRef(postgresUrl: string | undefined): string | null {
  if (!postgresUrl?.trim()) return null;
  try {
    const u = new URL(postgresUrl);
    const m = u.username.match(/^(?:postgres|agenda_app)\.([a-z0-9]+)$/i);
    return m?.[1] ?? null;
  } catch {
    return null;
  }
}

/** Añade .PROJECT_REF al usuario en URLs del pooler (evita ENOIDENTIFIER). */
export function normalizePoolerConnectionUrl(
  url: string,
  projectRef: string | null
): string {
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
