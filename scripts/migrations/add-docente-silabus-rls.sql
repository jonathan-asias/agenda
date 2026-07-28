-- RLS para DocenteSilabus (misma regla que Docentes/Estudiantes por institucion_id)
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
