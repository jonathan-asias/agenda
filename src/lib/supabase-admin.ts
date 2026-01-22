import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseAdminClient: SupabaseClient | null = null;
let hasLoggedMissingAdminConfig = false;

const missingAdminConfigMessage =
  'Supabase admin no está configurado. Define NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en las variables de entorno.';

export const isSupabaseAdminConfigured = (): boolean =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

const createSupabaseAdminClient = (): SupabaseClient => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    if (!hasLoggedMissingAdminConfig) {
      console.error(missingAdminConfigMessage);
      hasLoggedMissingAdminConfig = true;
    }
    throw new Error(missingAdminConfigMessage);
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

export const getSupabaseAdminClient = (): SupabaseClient => {
  if (!supabaseAdminClient) {
    supabaseAdminClient = createSupabaseAdminClient();
  }
  return supabaseAdminClient;
};

export const tryGetSupabaseAdminClient = (): SupabaseClient | null => {
  try {
    return getSupabaseAdminClient();
  } catch {
    return null;
  }
};
