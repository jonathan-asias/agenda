-- Lugar del evento en autorizaciones (hora queda en fecha_evento)
ALTER TABLE "Recordatorios"
  ADD COLUMN IF NOT EXISTS "lugar_evento" VARCHAR(255);
