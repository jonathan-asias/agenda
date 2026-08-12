-- Tipo autorización en recordatorios: campos extra + respuesta del acudiente
ALTER TABLE "Recordatorios"
  ADD COLUMN IF NOT EXISTS "motivo" TEXT,
  ADD COLUMN IF NOT EXISTS "evento_nombre" VARCHAR(255),
  ADD COLUMN IF NOT EXISTS "fecha_evento" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "documento_path" VARCHAR(500),
  ADD COLUMN IF NOT EXISTS "documento_nombre" VARCHAR(255),
  ADD COLUMN IF NOT EXISTS "documento_mime" VARCHAR(120),
  ADD COLUMN IF NOT EXISTS "documento_tamano" INTEGER;

ALTER TABLE "RecordatorioEstudiantes"
  ADD COLUMN IF NOT EXISTS "autorizacion_respuesta" VARCHAR(20),
  ADD COLUMN IF NOT EXISTS "autorizacion_respondido_at" TIMESTAMP(3);
