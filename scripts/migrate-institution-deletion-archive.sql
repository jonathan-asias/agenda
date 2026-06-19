-- Respaldo JSONB antes de eliminar instituciones
-- Ejecutar en Supabase SQL Editor o: psql $DIRECT_URL -f scripts/migrate-institution-deletion-archive.sql

CREATE TABLE IF NOT EXISTS "InstitutionDeletionArchives" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "institucion_id" INTEGER NOT NULL,
  "nombre" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "nit" VARCHAR(50),
  "deleted_by" VARCHAR(255) NOT NULL,
  "reason" VARCHAR(50) NOT NULL DEFAULT 'user_request',
  "snapshot_version" INTEGER NOT NULL DEFAULT 1,
  "snapshot" JSONB NOT NULL,
  "auth_user_ids" TEXT[] NOT NULL DEFAULT '{}',
  "deleted_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "retention_until" TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS "InstitutionDeletionArchives_institucion_id_idx"
  ON "InstitutionDeletionArchives" ("institucion_id");

CREATE INDEX IF NOT EXISTS "InstitutionDeletionArchives_email_idx"
  ON "InstitutionDeletionArchives" ("email");

CREATE INDEX IF NOT EXISTS "InstitutionDeletionArchives_deleted_at_idx"
  ON "InstitutionDeletionArchives" ("deleted_at");

CREATE INDEX IF NOT EXISTS "InstitutionDeletionArchives_retention_until_idx"
  ON "InstitutionDeletionArchives" ("retention_until");

COMMENT ON TABLE "InstitutionDeletionArchives" IS
  'Respaldo JSONB de instituciones eliminadas; purgar filas con retention_until vencido.';
