-- Categoría/lugar en calendario + vínculo desde recordatorios; renombra reunion → evento
ALTER TABLE "CalendarioAcademicoEventos"
  ADD COLUMN IF NOT EXISTS "categoria" VARCHAR(50),
  ADD COLUMN IF NOT EXISTS "lugar" VARCHAR(255);

UPDATE "CalendarioAcademicoEventos"
SET "tipo" = 'evento'
WHERE "tipo" = 'reunion';

CREATE INDEX IF NOT EXISTS "CalendarioAcademicoEventos_institucion_tipo_idx"
  ON "CalendarioAcademicoEventos" ("institucion_id", "tipo");

ALTER TABLE "Recordatorios"
  ADD COLUMN IF NOT EXISTS "calendario_evento_id" INTEGER
  REFERENCES "CalendarioAcademicoEventos"("id") ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS "Recordatorios_calendario_evento_id_idx"
  ON "Recordatorios" ("calendario_evento_id");
