import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { withDbTenant } from '@/lib/db/rls-context';
import { withTenantFromRequest } from '@/lib/db/with-tenant-request';
import { getAuthUserEmail, tenantErrorToResponse } from '@/lib/tenant';
import { subscriptionErrorToResponse } from '@/lib/security/subscription-guard';

function storageBucket() {
  return (
    process.env.SUPABASE_STORAGE_BUCKET ||
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ||
    'instituciones'
  );
}

async function streamPlanFile(opts: {
  planId: number;
  institutionId: number;
  docenteId: number;
}) {
  return withDbTenant(opts.institutionId, async (tx) => {
    const item = await tx.docentePlanSemanal.findFirst({
      where: {
        id: opts.planId,
        docente_id: opts.docenteId,
        institucion_id: opts.institutionId,
      },
    });
    if (!item) {
      return NextResponse.json({ error: 'Plan semanal no encontrado' }, { status: 404 });
    }
    if (!item.storage_path || !item.nombre_archivo) {
      return NextResponse.json(
        { error: 'Este plan no tiene archivo PDF' },
        { status: 404 }
      );
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase.storage
      .from(storageBucket())
      .download(item.storage_path);

    if (error || !data) {
      console.error('Error descargando plan semanal de storage:', error);
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const planId = Number.parseInt(idParam, 10);
    if (!planId || Number.isNaN(planId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
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

      return streamPlanFile({
        planId,
        institutionId,
        docenteId: docente.id,
      });
    });
  } catch (error) {
    const sub = subscriptionErrorToResponse(error);
    if (sub) return sub;
    const tenant = tenantErrorToResponse(error);
    if (tenant) return tenant;
    console.error('Error sirviendo archivo plan semanal:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
