import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;
let hasLoggedMissingConfig = false;

const missingConfigMessage =
  'Supabase no está configurado. Define NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en las variables de entorno.';

export const isSupabaseConfigured = (): boolean =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const createSupabaseClient = (): SupabaseClient => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    if (!hasLoggedMissingConfig) {
      console.error(missingConfigMessage);
      hasLoggedMissingConfig = true;
    }
    throw new Error(missingConfigMessage);
  }

  return createClient(supabaseUrl, supabaseAnonKey);
};

export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseClient) {
    supabaseClient = createSupabaseClient();
  }
  return supabaseClient;
};

export const tryGetSupabaseClient = (): SupabaseClient | null => {
  try {
    return getSupabaseClient();
  } catch {
    return null;
  }
};
