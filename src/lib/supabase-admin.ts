import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import { publicEnv, serverEnv } from '@/lib/env';

let supabaseAdminClient: SupabaseClient<Database> | null = null;
let hasLoggedMissingAdminConfig = false;

const missingAdminConfigMessage =
  'Supabase admin no está configurado. Define NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en las variables de entorno.';

export const isSupabaseAdminConfigured = (): boolean =>
  Boolean(publicEnv.NEXT_PUBLIC_SUPABASE_URL && serverEnv.SUPABASE_SERVICE_ROLE_KEY);

/** Cliente admin con SERVICE ROLE para uso en APIs (branding, storage). */
export function createAdminClient(): SupabaseClient<Database> {
  const supabaseUrl = publicEnv.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = serverEnv.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRole) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY no configurado');
  }
  return createClient<Database>(supabaseUrl, serviceRole, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

const createSupabaseAdminClient = (): SupabaseClient<Database> => {
  const supabaseUrl = publicEnv.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = serverEnv.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    if (!hasLoggedMissingAdminConfig) {
      console.error(missingAdminConfigMessage);
      hasLoggedMissingAdminConfig = true;
    }
    throw new Error(missingAdminConfigMessage);
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

export const getSupabaseAdminClient = (): SupabaseClient<Database> => {
  if (!supabaseAdminClient) {
    supabaseAdminClient = createSupabaseAdminClient();
  }
  return supabaseAdminClient;
};

export const tryGetSupabaseAdminClient = (): SupabaseClient<Database> | null => {
  try {
    return getSupabaseAdminClient();
  } catch {
    return null;
  }
};
