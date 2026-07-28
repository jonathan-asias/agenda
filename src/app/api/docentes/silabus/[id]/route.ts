import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const email = await getAuthUserEmail(request);
    if (!email) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { id: idParam } = await params;
    const silabusId = Number.parseInt(idParam, 10);
    if (!silabusId || Number.isNaN(silabusId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    return await withTenantFromRequest(request, async (tx, institutionId) => {
      const docente = await tx.docentes.findFirst({
        where: { email, institucion_id: institutionId, activo: true },
        select: { id: true },
      });
      if (!docente) {
        return NextResponse.json({ error: 'Docente no encontrado' }, { status: 404 });
      }

      const item = await tx.docenteSilabus.findFirst({
        where: {
          id: silabusId,
          docente_id: docente.id,
          institucion_id: institutionId,
        },
      });
      if (!item) {
        return NextResponse.json({ error: 'Sílabus no encontrado' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: {
          id: item.id,
          origen: item.origen,
          contenido_html: item.contenido_html,
          contenido_json: item.contenido_json,
          nombre_archivo: item.nombre_archivo,
          mime_type: item.mime_type,
          tamano_bytes: item.tamano_bytes,
          has_file: Boolean(item.storage_path),
          url: item.storage_path ? `/api/docentes/silabus/${item.id}/file` : null,
        },
      });
    });
  } catch (error) {
    const sub = subscriptionErrorToResponse(error);
    if (sub) return sub;
    const tenant = tenantErrorToResponse(error);
    if (tenant) return tenant;
    console.error('Error obteniendo sílabus:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const email = await getAuthUserEmail(request);
    if (!email) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { id: idParam } = await params;
    const silabusId = Number.parseInt(idParam, 10);
    if (!silabusId || Number.isNaN(silabusId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const body = await request.json();
    const html =
      typeof body.contenido_html === 'string' ? body.contenido_html.trim() : '';
    if (!html) {
      return NextResponse.json({ error: 'contenido_html es requerido' }, { status: 400 });
    }
    if (html.length > 500_000) {
      return NextResponse.json({ error: 'El contenido es demasiado largo' }, { status: 400 });
    }

    return await withTenantFromRequest(request, async (tx, institutionId) => {
      const docente = await tx.docentes.findFirst({
        where: { email, institucion_id: institutionId, activo: true },
        select: { id: true },
      });
      if (!docente) {
        return NextResponse.json({ error: 'Docente no encontrado' }, { status: 404 });
      }

      const item = await tx.docenteSilabus.findFirst({
        where: {
          id: silabusId,
          docente_id: docente.id,
          institucion_id: institutionId,
        },
      });
      if (!item) {
        return NextResponse.json({ error: 'Sílabus no encontrado' }, { status: 404 });
      }

      const updated = await tx.docenteSilabus.update({
        where: { id: item.id },
        data: { contenido_html: html },
      });

      return NextResponse.json({
        success: true,
        message: 'Contenido actualizado',
        data: {
          id: updated.id,
          contenido_html: updated.contenido_html,
          origen: updated.origen,
        },
      });
    });
  } catch (error) {
    const sub = subscriptionErrorToResponse(error);
    if (sub) return sub;
    const tenant = tenantErrorToResponse(error);
    if (tenant) return tenant;
    console.error('Error actualizando HTML sílabus:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const email = await getAuthUserEmail(request);
    if (!email) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { id: idParam } = await params;
    const silabusId = Number.parseInt(idParam, 10);
    if (!silabusId || Number.isNaN(silabusId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const deleted = await withTenantFromRequest(request, async (tx, institutionId) => {
      const docente = await tx.docentes.findFirst({
        where: { email, institucion_id: institutionId, activo: true },
        select: { id: true },
      });
      if (!docente) {
        return { error: 'Docente no encontrado' as const, status: 404 as const };
      }

      const item = await tx.docenteSilabus.findFirst({
        where: {
          id: silabusId,
          docente_id: docente.id,
          institucion_id: institutionId,
        },
      });
      if (!item) {
        return { error: 'Sílabus no encontrado' as const, status: 404 as const };
      }

      const result = await tx.docenteSilabus.deleteMany({
        where: {
          id: item.id,
          docente_id: docente.id,
          institucion_id: institutionId,
        },
      });
      if (result.count === 0) {
        return { error: 'No se pudo eliminar el sílabus' as const, status: 500 as const };
      }

      return {
        ok: true as const,
        storagePath: item.storage_path,
      };
    });

    if ('error' in deleted) {
      return NextResponse.json({ error: deleted.error }, { status: deleted.status });
    }

    // Fuera de la transacción: no revertir el DELETE de BD si Storage falla.
    if (deleted.storagePath) {
      try {
        const supabase = createAdminClient();
        await supabase.storage.from(storageBucket()).remove([deleted.storagePath]);
      } catch (err) {
        console.warn('Sílabus eliminado en BD, pero falló borrar storage:', err);
      }
    }

    return NextResponse.json({ success: true, message: 'Sílabus eliminado' });
  } catch (error) {
    const sub = subscriptionErrorToResponse(error);
    if (sub) return sub;
    const tenant = tenantErrorToResponse(error);
    if (tenant) return tenant;
    console.error('Error eliminando sílabus:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
