-- Plan de clases semanal del docente
CREATE TABLE IF NOT EXISTS "DocentePlanSemanal" (
  "id" SERIAL PRIMARY KEY,
  "docente_id" INTEGER NOT NULL REFERENCES "Docentes"("id") ON DELETE CASCADE,
  "materia_id" INTEGER NOT NULL REFERENCES "Materias"("id") ON DELETE CASCADE,
  "grado_id" INTEGER NOT NULL REFERENCES "Grados"("id") ON DELETE CASCADE,
  "curso_id" INTEGER NOT NULL REFERENCES "Cursos"("id") ON DELETE CASCADE,
  "institucion_id" INTEGER NOT NULL,
  "periodo_academico" VARCHAR(100) NOT NULL,
  "semana" VARCHAR(50) NOT NULL,
  "fecha_inicio" DATE NOT NULL,
  "fecha_final" DATE NOT NULL,
  "origen" VARCHAR(20) NOT NULL DEFAULT 'formulario',
  "contenido_html" TEXT,
  "contenido_json" JSONB,
  "storage_path" VARCHAR(500),
  "nombre_archivo" VARCHAR(255),
  "mime_type" VARCHAR(120),
  "tamano_bytes" INTEGER,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "DocentePlanSemanal_docente_curso_materia_inicio_key"
    UNIQUE ("docente_id", "curso_id", "materia_id", "fecha_inicio")
);

CREATE INDEX IF NOT EXISTS "DocentePlanSemanal_institucion_id_idx"
  ON "DocentePlanSemanal"("institucion_id");

CREATE INDEX IF NOT EXISTS "DocentePlanSemanal_docente_curso_materia_idx"
  ON "DocentePlanSemanal"("docente_id", "curso_id", "materia_id");

ALTER TABLE "DocentePlanSemanal" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DocentePlanSemanal" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "DocentePlanSemanal";
CREATE POLICY tenant_isolation ON "DocentePlanSemanal"
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
