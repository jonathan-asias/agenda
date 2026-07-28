-- Amplía MIME types del bucket de storage para branding + sílabus.
-- Bucket: instituciones (o el valor de SUPABASE_STORAGE_BUCKET)
--
-- Branding: image/png, image/jpeg, image/webp (+ svg si ya se usaba)
-- Sílabus: PDF, Word (.doc/.docx), Excel (.xls/.xlsx)
-- Límite: 30 MB (branding valida 5 MB y sílabus 10 MB en API)

UPDATE storage.buckets
SET
  file_size_limit = 31457280,
  allowed_mime_types = ARRAY[
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/svg+xml',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
WHERE id = 'instituciones';
