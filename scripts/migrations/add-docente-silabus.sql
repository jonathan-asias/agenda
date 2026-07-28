-- Sílabus por docente + materia + grado
CREATE TABLE IF NOT EXISTS "DocenteSilabus" (
  "id" SERIAL PRIMARY KEY,
  "docente_id" INTEGER NOT NULL REFERENCES "Docentes"("id") ON DELETE CASCADE,
  "materia_id" INTEGER NOT NULL REFERENCES "Materias"("id") ON DELETE CASCADE,
  "grado_id" INTEGER NOT NULL REFERENCES "Grados"("id") ON DELETE CASCADE,
  "institucion_id" INTEGER NOT NULL,
  "storage_path" VARCHAR(500) NOT NULL,
  "nombre_archivo" VARCHAR(255) NOT NULL,
  "mime_type" VARCHAR(120) NOT NULL,
  "tamano_bytes" INTEGER NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "DocenteSilabus_docente_id_materia_id_grado_id_key" UNIQUE ("docente_id", "materia_id", "grado_id")
);

CREATE INDEX IF NOT EXISTS "DocenteSilabus_institucion_id_idx" ON "DocenteSilabus"("institucion_id");

-- RLS (también en scripts/migrations/add-docente-silabus-rls.sql)
ALTER TABLE "DocenteSilabus" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DocenteSilabus" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "DocenteSilabus";
CREATE POLICY tenant_isolation ON "DocenteSilabus"
  FOR ALL
  TO public
  USING (
    app.rls_bypass()
    OR (institucion_id = app.current_institution_id())
  )
  WITH CHECK (
    app.rls_bypass()
    OR (institucion_id = app.current_institution_id())
  );
