/**
 * Tipos de Supabase para el cliente TypeScript.
 *
 * Para generar tipos desde tu proyecto Supabase (recomendado en producción):
 *   npx supabase gen types typescript --project-id <PROJECT_ID> > src/types/supabase.ts
 *
 * Mientras tanto se usa esta definición mínima compatible con createClient<Database>.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: Record<string, unknown>;
    Views: Record<string, never>;
    Functions: Record<string, unknown>;
    Enums: Record<string, string>;
  };
};
