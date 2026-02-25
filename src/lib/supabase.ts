import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';
import { env } from '@/lib/env';

let supabaseClient: SupabaseClient<Database> | null = null;

export const isSupabaseConfigured = (): boolean =>
  Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

function createSupabaseClient(): SupabaseClient<Database> {
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (typeof window !== 'undefined') {
    return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
  }
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}

export function getSupabaseClient(): SupabaseClient<Database> {
  if (!supabaseClient) {
    supabaseClient = createSupabaseClient();
  }
  return supabaseClient;
}

export function tryGetSupabaseClient(): SupabaseClient<Database> | null {
  try {
    return getSupabaseClient();
  } catch {
    return null;
  }
}
