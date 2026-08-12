-- Calendario académico por sede
CREATE TABLE IF NOT EXISTS "CalendarioAcademicoEventos" (
  "id" SERIAL PRIMARY KEY,
  "institucion_id" INTEGER NOT NULL REFERENCES "Instituciones"("id") ON DELETE CASCADE,
  "sede_id" INTEGER REFERENCES "Sedes"("id") ON DELETE SET NULL,
  "titulo" VARCHAR(255) NOT NULL,
  "descripcion" TEXT,
  "tipo" VARCHAR(50) NOT NULL DEFAULT 'otro',
  "todo_el_dia" BOOLEAN NOT NULL DEFAULT TRUE,
  "fecha_inicio" TIMESTAMPTZ NOT NULL,
  "fecha_fin" TIMESTAMPTZ NOT NULL,
  "color" VARCHAR(7),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "CalendarioAcademicoEventos_institucion_sede_idx"
  ON "CalendarioAcademicoEventos" ("institucion_id", "sede_id");

CREATE INDEX IF NOT EXISTS "CalendarioAcademicoEventos_institucion_fechas_idx"
  ON "CalendarioAcademicoEventos" ("institucion_id", "fecha_inicio", "fecha_fin");

ALTER TABLE "CalendarioAcademicoEventos" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CalendarioAcademicoEventos" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "CalendarioAcademicoEventos";
CREATE POLICY tenant_isolation ON "CalendarioAcademicoEventos"
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
