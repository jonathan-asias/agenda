-- Aislamiento por sede: columnas sede_id en entidades académicas.
-- Ejecutar en Supabase SQL Editor o: npx prisma db push

ALTER TABLE "Grados" ADD COLUMN IF NOT EXISTS "sede_id" INTEGER;
ALTER TABLE "Areas" ADD COLUMN IF NOT EXISTS "sede_id" INTEGER;
ALTER TABLE "Materias" ADD COLUMN IF NOT EXISTS "sede_id" INTEGER;
ALTER TABLE "Estudiantes" ADD COLUMN IF NOT EXISTS "sede_id" INTEGER;

ALTER TABLE "Grados" DROP CONSTRAINT IF EXISTS "Grados_sede_id_fkey";
ALTER TABLE "Areas" DROP CONSTRAINT IF EXISTS "Areas_sede_id_fkey";
ALTER TABLE "Materias" DROP CONSTRAINT IF EXISTS "Materias_sede_id_fkey";
ALTER TABLE "Estudiantes" DROP CONSTRAINT IF EXISTS "Estudiantes_sede_id_fkey";

ALTER TABLE "Grados"
  ADD CONSTRAINT "Grados_sede_id_fkey"
  FOREIGN KEY ("sede_id") REFERENCES "Sedes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Areas"
  ADD CONSTRAINT "Areas_sede_id_fkey"
  FOREIGN KEY ("sede_id") REFERENCES "Sedes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Materias"
  ADD CONSTRAINT "Materias_sede_id_fkey"
  FOREIGN KEY ("sede_id") REFERENCES "Sedes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Estudiantes"
  ADD CONSTRAINT "Estudiantes_sede_id_fkey"
  FOREIGN KEY ("sede_id") REFERENCES "Sedes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "Grados_institucion_sede_idx" ON "Grados"("institucion_id", "sede_id");
CREATE INDEX IF NOT EXISTS "Areas_institucion_sede_idx" ON "Areas"("institucion_id", "sede_id");
CREATE INDEX IF NOT EXISTS "Materias_institucion_sede_idx" ON "Materias"("institucion_id", "sede_id");
CREATE INDEX IF NOT EXISTS "Estudiantes_institucion_sede_idx" ON "Estudiantes"("institucion_id", "sede_id");
CREATE INDEX IF NOT EXISTS "Cursos_institucion_sede_idx" ON "Cursos"("institucion_id", "sede_id");

-- Backfill sede_id en estudiantes desde su curso (datos existentes)
UPDATE "Estudiantes" e
SET "sede_id" = c."sede_id"
FROM "Cursos" c
WHERE e."curso_id" = c."id"
  AND e."sede_id" IS NULL
  AND c."sede_id" IS NOT NULL;
