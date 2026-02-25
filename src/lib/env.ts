/**
 * Validación obligatoria de variables de entorno críticas en startup.
 * Si falta alguna, lanza Error claro.
 * Variables server-only se validan solo en el servidor (evita errores en el cliente).
 */
const isServer = typeof window === 'undefined';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (value == null || String(value).trim() === '') {
    throw new Error(
      `Variable de entorno requerida no configurada: ${name}. Configúrala en .env.local o en el entorno de despliegue.`
    );
  }
  return value.trim();
}

// Siempre validadas (disponibles en cliente y servidor)
const NEXT_PUBLIC_SUPABASE_URL = requireEnv('NEXT_PUBLIC_SUPABASE_URL');
const NEXT_PUBLIC_SUPABASE_ANON_KEY = requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
const NEXT_PUBLIC_APP_URL = requireEnv('NEXT_PUBLIC_APP_URL');
const NEXT_PUBLIC_BASE_URL = requireEnv('NEXT_PUBLIC_BASE_URL');

// Solo en servidor (no expuestas al cliente)
const DATABASE_URL = isServer ? requireEnv('DATABASE_URL') : '';
const SUPABASE_SERVICE_ROLE_KEY = isServer ? requireEnv('SUPABASE_SERVICE_ROLE_KEY') : '';

export const env = {
  DATABASE_URL,
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
  NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_BASE_URL
} as const;

/** @deprecated Usar env.NEXT_PUBLIC_APP_URL - exportado por compatibilidad */
export const APP_URL = env.NEXT_PUBLIC_APP_URL;
