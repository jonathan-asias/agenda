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
  /** Postgres en pooler: rutas sistema / bypass RLS (reset, webhooks, registro). */
  DATABASE_BYPASS_URL: process.env.DATABASE_URL?.trim() || "",

  /** Rol agenda_app: rutas autenticadas con RLS. */
  DATABASE_URL:
    process.env.DATABASE_URL_AGENDA_APP?.trim() ||
    process.env.DATABASE_URL ||
    "",

  SUPABASE_SERVICE_ROLE_KEY:
    process.env.SUPABASE_SERVICE_ROLE_KEY || "",

  PUSH_ACTIVATION_SECRET:
    process.env.PUSH_ACTIVATION_SECRET?.trim() || "",

  MERCADOPAGO_ACCESS_TOKEN:
    process.env.MERCADOPAGO_ACCESS_TOKEN?.trim() || "",

  MERCADOPAGO_WEBHOOK_SECRET:
    process.env.MERCADOPAGO_WEBHOOK_SECRET?.trim() || "",

  /** URL base servidor (correos, webhooks MP). Prioridad sobre NEXT_PUBLIC_APP_URL. */
  APP_URL:
    process.env.APP_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    "",
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

  if (!serverEnv.PUSH_ACTIVATION_SECRET) {
    console.error(
      'Falta PUSH_ACTIVATION_SECRET (enlaces push en correos). Generar: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
    );
  }
}

/** Compatibilidad: APP_URL usado en API routes (reset password, administradores, docentes) */
export const APP_URL = serverEnv.APP_URL || publicEnv.NEXT_PUBLIC_APP_URL;

/** Registro de institución: exige pago si alguna pasarela está configurada. */
export function isPaymentRequiredForRegistration(): boolean {
  if (process.env.SKIP_PAYMENT_FOR_REGISTRATION === 'true') {
    return false;
  }
  if (process.env.REQUIRE_PAYMENT_FOR_REGISTRATION === 'false') {
    return false;
  }
  const mp = Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN?.trim());
  const wompi = Boolean(
    process.env.WOMPI_PUBLIC_KEY?.trim() &&
      process.env.WOMPI_PRIVATE_KEY?.trim() &&
      process.env.WOMPI_INTEGRITY_SECRET?.trim()
  );
  return mp || wompi;
}
