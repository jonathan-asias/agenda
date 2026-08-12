ALTER TABLE "Recordatorios"
  ADD COLUMN IF NOT EXISTS "hora_llegada" TIMESTAMP(3);
