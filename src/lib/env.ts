// src/lib/env.ts

const isServer = typeof window === "undefined";

// Variables públicas (disponibles en cliente y servidor)
// En Next.js NEXT_PUBLIC_* se reemplazan en build; no validar con throw en cliente
export const publicEnv = {
  NEXT_PUBLIC_SUPABASE_URL:
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",

  NEXT_PUBLIC_SUPABASE_ANON_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",

  NEXT_PUBLIC_APP_URL:
    process.env.NEXT_PUBLIC_APP_URL || "",

  NEXT_PUBLIC_BASE_URL:
    process.env.NEXT_PUBLIC_BASE_URL || "",
};

// Variables privadas SOLO servidor
export const serverEnv = {
  DATABASE_URL:
    process.env.DATABASE_URL || "",

  SUPABASE_SERVICE_ROLE_KEY:
    process.env.SUPABASE_SERVICE_ROLE_KEY || "",
};

// Validar SOLO en servidor (console.error, no throw para no tumbar el build)
if (isServer) {
  const requiredServerEnv = [
    "DATABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
  ];

  for (const key of requiredServerEnv) {
    if (!process.env[key]) {
      console.error(
        `Falta variable de entorno requerida: ${key}`
      );
    }
  }
}

/** Compatibilidad: APP_URL usado en API routes (reset password, administradores, docentes) */
export const APP_URL = publicEnv.NEXT_PUBLIC_APP_URL;
