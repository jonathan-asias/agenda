import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';
import { env } from '@/lib/env';

let supabaseClient: SupabaseClient | null = null;

export const isSupabaseConfigured = (): boolean =>
  Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const createSupabaseClient = (): SupabaseClient => {
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // En el navegador usar createBrowserClient para almacenar sesión en cookies (necesario para tenant en backend)
  if (typeof window !== 'undefined') {
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
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
