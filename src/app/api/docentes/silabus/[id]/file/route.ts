import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { withDbTenant } from '@/lib/db/rls-context';
import { withTenantFromRequest } from '@/lib/db/with-tenant-request';
import { getAuthUserEmail, tenantErrorToResponse } from '@/lib/tenant';
import { subscriptionErrorToResponse } from '@/lib/security/subscription-guard';
import { verifySilabusViewToken } from '@/lib/security/silabus-view-token';

function storageBucket() {
  return (
    process.env.SUPABASE_STORAGE_BUCKET ||
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ||
    'instituciones'
  );
}

async function streamSilabusFile(opts: {
  silabusId: number;
  institutionId: number;
  docenteId: number;
}) {
  return withDbTenant(opts.institutionId, async (tx) => {
    const item = await tx.docenteSilabus.findFirst({
      where: {
        id: opts.silabusId,
        docente_id: opts.docenteId,
        institucion_id: opts.institutionId,
      },
    });
    if (!item) {
      return NextResponse.json({ error: 'Sílabus no encontrado' }, { status: 404 });
    }
    if (!item.storage_path || !item.nombre_archivo) {
      return NextResponse.json(
        { error: 'Este sílabus no tiene archivo PDF' },
        { status: 404 }
      );
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase.storage
      .from(storageBucket())
      .download(item.storage_path);

    if (error || !data) {
      console.error('Error descargando sílabus de storage:', error);
      return NextResponse.json(
        { error: 'No se pudo leer el archivo' },
        { status: 500 }
      );
    }

    const buffer = Buffer.from(await data.arrayBuffer());
    const asciiName = item.nombre_archivo.replace(/[^\x20-\x7E]/g, '_');
    const disposition = `inline; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(item.nombre_archivo)}`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': item.mime_type || 'application/octet-stream',
        'Content-Length': String(buffer.length),
        'Content-Disposition': disposition,
        'Cache-Control': 'private, max-age=60',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  });
}

/**
 * Sirve el archivo para iframe / descarga.
 * Auth: sesión del docente, o ?token= (HMAC corto, p. ej. Office Online).
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const silabusId = Number.parseInt(idParam, 10);
    if (!silabusId || Number.isNaN(silabusId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const token = request.nextUrl.searchParams.get('token')?.trim();
    if (token) {
      const verified = verifySilabusViewToken(token);
      if (!verified || verified.silabusId !== silabusId) {
        return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 401 });
      }
      return streamSilabusFile({
        silabusId: verified.silabusId,
        institutionId: verified.institucionId,
        docenteId: verified.docenteId,
      });
    }

    const email = await getAuthUserEmail(request);
    if (!email) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    return await withTenantFromRequest(request, async (tx, institutionId) => {
      const docente = await tx.docentes.findFirst({
        where: { email, institucion_id: institutionId, activo: true },
        select: { id: true },
      });
      if (!docente) {
        return NextResponse.json({ error: 'Docente no encontrado' }, { status: 404 });
      }

      return streamSilabusFile({
        silabusId,
        institutionId,
        docenteId: docente.id,
      });
    });
  } catch (error) {
    const sub = subscriptionErrorToResponse(error);
    if (sub) return sub;
    const tenant = tenantErrorToResponse(error);
    if (tenant) return tenant;
    console.error('Error sirviendo sílabus:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
