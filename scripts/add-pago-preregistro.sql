ALTER TABLE "Pagos"
ADD COLUMN IF NOT EXISTS "datos_preregistro" JSONB;
