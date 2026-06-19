-- Migración Mercado Pago: Planes, Suscripciones, Pagos (nuevo esquema), AuditLogs
-- Ejecutar con conexión directa (DIRECT_URL) antes de prisma generate.

CREATE TABLE IF NOT EXISTS "Planes" (
  "id" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(100) NOT NULL UNIQUE,
  "precio" INTEGER NOT NULL,
  "push" BOOLEAN NOT NULL DEFAULT false,
  "whatsapp" BOOLEAN NOT NULL DEFAULT false,
  "email" BOOLEAN NOT NULL DEFAULT true,
  "activo" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Suscripciones" (
  "id" SERIAL PRIMARY KEY,
  "email" VARCHAR(255) NOT NULL,
  "plan_id" INTEGER NOT NULL REFERENCES "Planes"("id"),
  "estado" VARCHAR(50) NOT NULL,
  "fecha_inicio" TIMESTAMP(3),
  "fecha_fin" TIMESTAMP(3),
  "institucion_id" INTEGER UNIQUE,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "AuditLogs" (
  "id" SERIAL PRIMARY KEY,
  "usuario" VARCHAR(255),
  "accion" VARCHAR(100) NOT NULL,
  "ip" VARCHAR(64),
  "metadata" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "Instituciones" ADD COLUMN IF NOT EXISTS "plan_id" INTEGER REFERENCES "Planes"("id");
ALTER TABLE "Instituciones" ADD COLUMN IF NOT EXISTS "suscripcion_id" INTEGER UNIQUE REFERENCES "Suscripciones"("id");
ALTER TABLE "Instituciones" ALTER COLUMN "push_enabled" SET DEFAULT false;

-- Reemplazar tabla Pagos (Wompi) por esquema Mercado Pago
DROP TABLE IF EXISTS "Pagos";

CREATE TABLE "Pagos" (
  "id" SERIAL PRIMARY KEY,
  "email" VARCHAR(255) NOT NULL,
  "referencia" VARCHAR(255) NOT NULL UNIQUE,
  "mercado_pago_id" VARCHAR(255) UNIQUE,
  "plan_id" INTEGER NOT NULL REFERENCES "Planes"("id"),
  "monto" INTEGER NOT NULL,
  "estado" VARCHAR(50) NOT NULL,
  "procesado" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "Pagos_email_estado_idx" ON "Pagos"("email", "estado");
CREATE INDEX IF NOT EXISTS "Suscripciones_email_estado_idx" ON "Suscripciones"("email", "estado");
