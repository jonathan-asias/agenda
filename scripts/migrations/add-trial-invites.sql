-- Invitaciones de prueba y flag es_prueba en suscripciones
-- Ejecutar manualmente en PostgreSQL si no usa prisma migrate.

ALTER TABLE "Suscripciones"
  ADD COLUMN IF NOT EXISTS "es_prueba" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS "InvitacionesPrueba" (
  "id" SERIAL PRIMARY KEY,
  "referencia" VARCHAR(64) NOT NULL UNIQUE,
  "institucion_nombre" VARCHAR(255) NOT NULL,
  "nit" VARCHAR(50) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "plan_id" INTEGER NOT NULL REFERENCES "Planes"("id"),
  "suscripcion_id" INTEGER NOT NULL UNIQUE REFERENCES "Suscripciones"("id"),
  "estado" VARCHAR(30) NOT NULL,
  "link_expires_at" TIMESTAMP(3) NOT NULL,
  "trial_days" INTEGER NOT NULL DEFAULT 30,
  "created_by" VARCHAR(255) NOT NULL,
  "used_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "InvitacionesPrueba_email_idx" ON "InvitacionesPrueba"("email");
CREATE INDEX IF NOT EXISTS "InvitacionesPrueba_nit_idx" ON "InvitacionesPrueba"("nit");
CREATE INDEX IF NOT EXISTS "InvitacionesPrueba_estado_idx" ON "InvitacionesPrueba"("estado");
