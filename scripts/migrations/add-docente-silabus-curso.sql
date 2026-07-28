-- Añade curso_id al sílabus (un archivo por curso + materia del docente)
ALTER TABLE "DocenteSilabus" ADD COLUMN IF NOT EXISTS "curso_id" INTEGER;

UPDATE "DocenteSilabus" ds
SET "curso_id" = da."curso_id"
FROM "DocenteAsignaciones" da
WHERE ds."curso_id" IS NULL
  AND da."docente_id" = ds."docente_id"
  AND da."materia_id" = ds."materia_id"
  AND da."grado_id" = ds."grado_id";

-- Filas sin asignación recuperable no pueden tener curso_id NOT NULL
DELETE FROM "DocenteSilabus" WHERE "curso_id" IS NULL;

ALTER TABLE "DocenteSilabus" DROP CONSTRAINT IF EXISTS "DocenteSilabus_docente_id_materia_id_grado_id_key";

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'DocenteSilabus_curso_id_fkey'
  ) THEN
    ALTER TABLE "DocenteSilabus"
      ADD CONSTRAINT "DocenteSilabus_curso_id_fkey"
      FOREIGN KEY ("curso_id") REFERENCES "Cursos"("id") ON DELETE CASCADE;
  END IF;
END $$;

ALTER TABLE "DocenteSilabus"
  ALTER COLUMN "curso_id" SET NOT NULL;

DROP INDEX IF EXISTS "DocenteSilabus_docente_id_curso_id_materia_id_key";
CREATE UNIQUE INDEX "DocenteSilabus_docente_id_curso_id_materia_id_key"
  ON "DocenteSilabus"("docente_id", "curso_id", "materia_id");
