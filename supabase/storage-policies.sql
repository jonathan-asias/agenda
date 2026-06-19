-- Políticas Storage para bucket de branding (ejecutar en Supabase SQL Editor)
-- Bucket: instituciones (o el valor de SUPABASE_STORAGE_BUCKET)
--
-- El upload lo hace el backend con service role (PUT /api/instituciones/[id]/branding).
-- Estas políticas evitan que clientes con anon key suban/lean archivos de otros tenants.

-- Lectura pública solo de objetos bajo rutas que expongas vía signed URL desde el servidor.
-- Ajuste el bucket si usa otro nombre.

DROP POLICY IF EXISTS "instituciones_public_read" ON storage.objects;
CREATE POLICY "instituciones_public_read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'instituciones');

-- Sin INSERT/UPDATE/DELETE para anon ni authenticated en paths de instituciones
DROP POLICY IF EXISTS "instituciones_deny_anon_write" ON storage.objects;
CREATE POLICY "instituciones_deny_anon_write"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (false);

DROP POLICY IF EXISTS "instituciones_deny_anon_update" ON storage.objects;
CREATE POLICY "instituciones_deny_anon_update"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (false);

DROP POLICY IF EXISTS "instituciones_deny_anon_delete" ON storage.objects;
CREATE POLICY "instituciones_deny_anon_delete"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (false);

-- service_role bypasses RLS en Storage; el app solo debe usar service role en servidor.
