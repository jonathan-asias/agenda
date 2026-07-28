import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { withTenantFromRequest } from '@/lib/db/with-tenant-request';
import { getAuthUserEmail, tenantErrorToResponse } from '@/lib/tenant';
import { subscriptionErrorToResponse } from '@/lib/security/subscription-guard';
import {
  parsePlanSemanalFormFields,
  planSemanalFormToHtml,
  validatePlanSemanalForm,
} from '@/lib/plan-semanal/form-html';
import { planAllowsPlanSemanalPdf } from '@/lib/plan-semanal/plan-access';
import { getInstitutionPlanInfo } from '@/lib/subscription/get-institution-plan';

function storageBucket() {
  return (
    process.env.SUPABASE_STORAGE_BUCKET ||
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ||
    'instituciones'
  );
}

function toDateOnlyIso(d: Date): string {
  return d.toISOString().slice(0, 10);
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
    const planId = Number.parseInt(idParam, 10);
    if (!planId || Number.isNaN(planId)) {
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

      const item = await tx.docentePlanSemanal.findFirst({
        where: {
          id: planId,
          docente_id: docente.id,
          institucion_id: institutionId,
        },
      });
      if (!item) {
        return NextResponse.json({ error: 'Plan semanal no encontrado' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: {
          id: item.id,
          origen: item.origen,
          periodo_academico: item.periodo_academico,
          semana: item.semana,
          fecha_inicio: toDateOnlyIso(item.fecha_inicio),
          fecha_final: toDateOnlyIso(item.fecha_final),
          contenido_html: item.contenido_html,
          contenido_json: item.contenido_json,
          nombre_archivo: item.nombre_archivo,
          mime_type: item.mime_type,
          tamano_bytes: item.tamano_bytes,
          has_file: Boolean(item.storage_path),
          url: item.storage_path ? `/api/docentes/plan-semanal/${item.id}/file` : null,
        },
      });
    });
  } catch (error) {
    const sub = subscriptionErrorToResponse(error);
    if (sub) return sub;
    const tenant = tenantErrorToResponse(error);
    if (tenant) return tenant;
    console.error('Error obteniendo plan semanal:', error);
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
    const planId = Number.parseInt(idParam, 10);
    if (!planId || Number.isNaN(planId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const body = await request.json();

    return await withTenantFromRequest(request, async (tx, institutionId) => {
      const docente = await tx.docentes.findFirst({
        where: { email, institucion_id: institutionId, activo: true },
        select: { id: true, nombres: true, apellidos: true },
      });
      if (!docente) {
        return NextResponse.json({ error: 'Docente no encontrado' }, { status: 404 });
      }

      const item = await tx.docentePlanSemanal.findFirst({
        where: {
          id: planId,
          docente_id: docente.id,
          institucion_id: institutionId,
        },
        include: {
          materia: { select: { nombre: true } },
          curso: { select: { nombre: true } },
        },
      });
      if (!item) {
        return NextResponse.json({ error: 'Plan semanal no encontrado' }, { status: 404 });
      }

      const planInfo = await getInstitutionPlanInfo(tx, institutionId);
      const allowsPdf = planAllowsPlanSemanalPdf(planInfo?.plan?.nombre);

      // Actualización HTML (ambos planes / Plus principalmente)
      if (typeof body.contenido_html === 'string') {
        const html = body.contenido_html.trim();
        if (!html) {
          return NextResponse.json({ error: 'contenido_html es requerido' }, { status: 400 });
        }
        if (html.length > 500_000) {
          return NextResponse.json({ error: 'El contenido es demasiado largo' }, { status: 400 });
        }

        const updated = await tx.docentePlanSemanal.update({
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
      }

      // Actualización formulario (Plan Básico)
      if (!allowsPdf && (body.campos || body.tema_semana !== undefined)) {
        const fields = parsePlanSemanalFormFields(body.campos ?? body);
        const formError = validatePlanSemanalForm(fields);
        if (formError) {
          return NextResponse.json({ error: formError }, { status: 400 });
        }

        const html = planSemanalFormToHtml(fields, {
          docente: `${docente.nombres} ${docente.apellidos}`.trim(),
          asignatura: item.materia.nombre,
          curso: item.curso.nombre,
        });

        const updated = await tx.docentePlanSemanal.update({
          where: { id: item.id },
          data: {
            periodo_academico: fields.periodo_academico.trim().slice(0, 100),
            semana: fields.semana.trim().slice(0, 50),
            fecha_final: new Date(fields.fecha_final + 'T00:00:00.000Z'),
            contenido_html: html,
            contenido_json: fields,
          },
        });

        return NextResponse.json({
          success: true,
          message: 'Plan semanal actualizado',
          data: {
            id: updated.id,
            contenido_html: updated.contenido_html,
            contenido_json: updated.contenido_json,
            origen: updated.origen,
          },
        });
      }

      return NextResponse.json(
        { error: 'Envía contenido_html o los campos del formulario' },
        { status: 400 }
      );
    });
  } catch (error) {
    const sub = subscriptionErrorToResponse(error);
    if (sub) return sub;
    const tenant = tenantErrorToResponse(error);
    if (tenant) return tenant;
    console.error('Error actualizando plan semanal:', error);
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
    const planId = Number.parseInt(idParam, 10);
    if (!planId || Number.isNaN(planId)) {
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

      const item = await tx.docentePlanSemanal.findFirst({
        where: {
          id: planId,
          docente_id: docente.id,
          institucion_id: institutionId,
        },
      });
      if (!item) {
        return { error: 'Plan semanal no encontrado' as const, status: 404 as const };
      }

      const result = await tx.docentePlanSemanal.deleteMany({
        where: {
          id: item.id,
          docente_id: docente.id,
          institucion_id: institutionId,
        },
      });
      if (result.count === 0) {
        return { error: 'No se pudo eliminar el plan semanal' as const, status: 500 as const };
      }

      return {
        ok: true as const,
        storagePath: item.storage_path,
      };
    });

    if ('error' in deleted) {
      return NextResponse.json({ error: deleted.error }, { status: deleted.status });
    }

    if (deleted.storagePath) {
      try {
        const supabase = createAdminClient();
        await supabase.storage.from(storageBucket()).remove([deleted.storagePath]);
      } catch (err) {
        console.warn('Plan semanal eliminado en BD, pero falló borrar storage:', err);
      }
    }

    return NextResponse.json({ success: true, message: 'Plan semanal eliminado' });
  } catch (error) {
    const sub = subscriptionErrorToResponse(error);
    if (sub) return sub;
    const tenant = tenantErrorToResponse(error);
    if (tenant) return tenant;
    console.error('Error eliminando plan semanal:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
