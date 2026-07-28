-- Sílabus: formulario (Básico) vs PDF+HTML (Plus)
ALTER TABLE "DocenteSilabus" ADD COLUMN IF NOT EXISTS "origen" VARCHAR(20) NOT NULL DEFAULT 'formulario';
ALTER TABLE "DocenteSilabus" ADD COLUMN IF NOT EXISTS "contenido_html" TEXT;
ALTER TABLE "DocenteSilabus" ADD COLUMN IF NOT EXISTS "contenido_json" JSONB;

ALTER TABLE "DocenteSilabus" ALTER COLUMN "storage_path" DROP NOT NULL;
ALTER TABLE "DocenteSilabus" ALTER COLUMN "nombre_archivo" DROP NOT NULL;
ALTER TABLE "DocenteSilabus" ALTER COLUMN "mime_type" DROP NOT NULL;
ALTER TABLE "DocenteSilabus" ALTER COLUMN "tamano_bytes" DROP NOT NULL;

-- Filas existentes con archivo → origen pdf
UPDATE "DocenteSilabus"
SET "origen" = 'pdf'
WHERE "storage_path" IS NOT NULL AND "storage_path" <> '';
