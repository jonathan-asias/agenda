import { NextRequest, NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { createAdminClient } from '@/lib/supabase-admin';
import { withTenantFromRequest } from '@/lib/db/with-tenant-request';
import { getAuthUserEmail, tenantErrorToResponse } from '@/lib/tenant';
import { subscriptionErrorToResponse } from '@/lib/security/subscription-guard';
import {
  resolveSilabusMimeType,
  validateSilabusFileContent,
} from '@/lib/security/silabus-upload';
import { getInstitutionPlanInfo } from '@/lib/subscription/get-institution-plan';
import { planAllowsPlanSemanalPdf } from '@/lib/plan-semanal/plan-access';
import {
  parsePlanSemanalFormFields,
  planSemanalFormToHtml,
  validatePlanSemanalForm,
} from '@/lib/plan-semanal/form-html';
import { extractPdfToPlanSemanalHtml } from '@/lib/plan-semanal/pdf-extract';

function storageBucket() {
  return (
    process.env.SUPABASE_STORAGE_BUCKET ||
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ||
    'instituciones'
  );
}

async function resolveDocente(
  tx: Prisma.TransactionClient,
  institutionId: number,
  email: string
) {
  return tx.docentes.findFirst({
    where: {
      email,
      institucion_id: institutionId,
      activo: true,
    },
    select: { id: true, nombres: true, apellidos: true, institucion_id: true },
  });
}

const planInclude = {
  materia: {
    select: {
      id: true,
      nombre: true,
      area: { select: { id: true, nombre: true } },
    },
  },
  grado: { select: { id: true, nombre: true, nivel: true } },
  curso: { select: { id: true, nombre: true, jornada: true } },
} as const;

type PlanRow = {
  id: number;
  materia_id: number;
  grado_id: number;
  curso_id: number;
  periodo_academico: string;
  semana: string;
  fecha_inicio: Date;
  fecha_final: Date;
  origen: string;
  contenido_html: string | null;
  contenido_json: Prisma.JsonValue | null;
  storage_path: string | null;
  nombre_archivo: string | null;
  mime_type: string | null;
  tamano_bytes: number | null;
  updated_at: Date;
  materia: {
    id: number;
    nombre: string;
    area: { id: number; nombre: string } | null;
  };
  grado: { id: number; nombre: string; nivel: string };
  curso: { id: number; nombre: string; jornada: string | null };
};

function toDateOnlyIso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function mapPlanItem(item: PlanRow) {
  return {
    id: item.id,
    materia_id: item.materia_id,
    grado_id: item.grado_id,
    curso_id: item.curso_id,
    periodo_academico: item.periodo_academico,
    semana: item.semana,
    fecha_inicio: toDateOnlyIso(item.fecha_inicio),
    fecha_final: toDateOnlyIso(item.fecha_final),
    origen: item.origen,
    contenido_html: item.contenido_html,
    contenido_json: item.contenido_json,
    nombre_archivo: item.nombre_archivo,
    mime_type: item.mime_type,
    tamano_bytes: item.tamano_bytes,
    has_file: Boolean(item.storage_path),
    updated_at: item.updated_at,
    materia: item.materia,
    grado: item.grado,
    curso: item.curso,
  };
}

async function assertAsignacion(
  tx: Prisma.TransactionClient,
  docenteId: number,
  materiaId: number,
  gradoId: number,
  cursoId: number
) {
  return tx.docenteAsignaciones.findFirst({
    where: {
      docente_id: docenteId,
      materia_id: materiaId,
      grado_id: gradoId,
      curso_id: cursoId,
    },
    select: { id: true },
  });
}

function parseDateOnly(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function GET(request: NextRequest) {
  try {
    const email = await getAuthUserEmail(request);
    if (!email) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const cursoId = Number(request.nextUrl.searchParams.get('curso_id') || 0);
    const materiaId = Number(request.nextUrl.searchParams.get('materia_id') || 0);

    return await withTenantFromRequest(request, async (tx, institutionId) => {
      const docente = await resolveDocente(tx, institutionId, email);
      if (!docente) {
        return NextResponse.json({ error: 'Docente no encontrado' }, { status: 404 });
      }

      const planInfo = await getInstitutionPlanInfo(tx, institutionId);
      const planNombre = planInfo?.plan?.nombre ?? null;
      const allowsPdf = planAllowsPlanSemanalPdf(planNombre);

      const items = await tx.docentePlanSemanal.findMany({
        where: {
          docente_id: docente.id,
          institucion_id: institutionId,
          ...(cursoId && materiaId
            ? { curso_id: cursoId, materia_id: materiaId }
            : {}),
        },
        include: planInclude,
        orderBy: [{ fecha_inicio: 'desc' }, { updated_at: 'desc' }],
      });

      return NextResponse.json({
        success: true,
        meta: {
          plan_nombre: planNombre,
          mode: allowsPdf ? 'pdf' : 'formulario',
          allows_pdf: allowsPdf,
        },
        data: items.map(mapPlanItem),
      });
    });
  } catch (error) {
    const sub = subscriptionErrorToResponse(error);
    if (sub) return sub;
    const tenant = tenantErrorToResponse(error);
    if (tenant) return tenant;
    console.error('Error listando planes semanales:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const email = await getAuthUserEmail(request);
    if (!email) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const contentType = request.headers.get('content-type') || '';

    // --- Plan Básico: JSON formulario ---
    if (contentType.includes('application/json')) {
      const body = await request.json();
      const materiaId = Number(body.materia_id);
      const gradoId = Number(body.grado_id);
      const cursoId = Number(body.curso_id);
      const fields = parsePlanSemanalFormFields(body.campos ?? body);

      if (!materiaId || !gradoId || !cursoId) {
        return NextResponse.json(
          { error: 'materia_id, grado_id y curso_id son requeridos' },
          { status: 400 }
        );
      }
      const formError = validatePlanSemanalForm(fields);
      if (formError) {
        return NextResponse.json({ error: formError }, { status: 400 });
      }

      const fechaInicio = parseDateOnly(fields.fecha_inicio);
      const fechaFinal = parseDateOnly(fields.fecha_final);
      if (!fechaInicio || !fechaFinal) {
        return NextResponse.json(
          { error: 'Fechas inválidas (usa formato YYYY-MM-DD)' },
          { status: 400 }
        );
      }

      return await withTenantFromRequest(request, async (tx, institutionId) => {
        const planInfo = await getInstitutionPlanInfo(tx, institutionId);
        if (planAllowsPlanSemanalPdf(planInfo?.plan?.nombre)) {
          return NextResponse.json(
            {
              error:
                'Tu plan Plus usa carga de PDF. Sube un archivo o actualiza el contenido HTML desde el visor.',
            },
            { status: 403 }
          );
        }

        const docente = await resolveDocente(tx, institutionId, email);
        if (!docente) {
          return NextResponse.json({ error: 'Docente no encontrado' }, { status: 404 });
        }

        const asignacion = await assertAsignacion(
          tx,
          docente.id,
          materiaId,
          gradoId,
          cursoId
        );
        if (!asignacion) {
          return NextResponse.json(
            { error: 'No tienes asignación para ese curso y materia' },
            { status: 403 }
          );
        }

        const materia = await tx.materias.findFirst({
          where: { id: materiaId },
          select: { nombre: true },
        });
        const curso = await tx.cursos.findFirst({
          where: { id: cursoId },
          select: { nombre: true },
        });

        const html = planSemanalFormToHtml(fields, {
          docente: `${docente.nombres} ${docente.apellidos}`.trim(),
          asignatura: materia?.nombre,
          curso: curso?.nombre,
        });

        const existing = await tx.docentePlanSemanal.findUnique({
          where: {
            docente_id_curso_id_materia_id_fecha_inicio: {
              docente_id: docente.id,
              curso_id: cursoId,
              materia_id: materiaId,
              fecha_inicio: fechaInicio,
            },
          },
        });

        const data = {
          grado_id: gradoId,
          periodo_academico: fields.periodo_academico.trim().slice(0, 100),
          semana: fields.semana.trim().slice(0, 50),
          fecha_inicio: fechaInicio,
          fecha_final: fechaFinal,
          origen: 'formulario',
          contenido_html: html,
          contenido_json: fields,
          storage_path: null,
          nombre_archivo: null,
          mime_type: null,
          tamano_bytes: null,
        };

        const saved = existing
          ? await tx.docentePlanSemanal.update({
              where: { id: existing.id },
              data,
              include: planInclude,
            })
          : await tx.docentePlanSemanal.create({
              data: {
                docente_id: docente.id,
                materia_id: materiaId,
                curso_id: cursoId,
                institucion_id: institutionId,
                ...data,
              },
              include: planInclude,
            });

        return NextResponse.json({
          success: true,
          message: existing ? 'Plan semanal actualizado' : 'Plan semanal guardado',
          data: mapPlanItem(saved),
        });
      });
    }

    // --- Plan Plus: multipart PDF ---
    const formData = await request.formData();
    const materiaId = Number(formData.get('materia_id'));
    const gradoId = Number(formData.get('grado_id'));
    const cursoId = Number(formData.get('curso_id'));
    const periodo = String(formData.get('periodo_academico') || '').trim();
    const semana = String(formData.get('semana') || '').trim();
    const fechaInicioRaw = String(formData.get('fecha_inicio') || '').trim();
    const fechaFinalRaw = String(formData.get('fecha_final') || '').trim();
    const file = formData.get('archivo');

    if (!materiaId || !gradoId || !cursoId) {
      return NextResponse.json(
        { error: 'materia_id, grado_id y curso_id son requeridos' },
        { status: 400 }
      );
    }
    if (!periodo || !semana) {
      return NextResponse.json(
        { error: 'Periodo académico y semana son requeridos' },
        { status: 400 }
      );
    }
    const fechaInicio = parseDateOnly(fechaInicioRaw);
    const fechaFinal = parseDateOnly(fechaFinalRaw);
    if (!fechaInicio || !fechaFinal) {
      return NextResponse.json(
        { error: 'Fechas inválidas (usa formato YYYY-MM-DD)' },
        { status: 400 }
      );
    }
    if (fechaFinal < fechaInicio) {
      return NextResponse.json(
        { error: 'La fecha final no puede ser anterior a la fecha de inicio' },
        { status: 400 }
      );
    }
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Debe adjuntar un archivo PDF' }, { status: 400 });
    }

    const contentError = await validateSilabusFileContent(file);
    if (contentError) {
      return NextResponse.json({ error: contentError }, { status: 400 });
    }

    const mimeType = resolveSilabusMimeType(file.name, file.type);
    const buffer = Buffer.from(await file.arrayBuffer());

    let extractedHtml = '';
    try {
      const extracted = await extractPdfToPlanSemanalHtml(buffer);
      extractedHtml = extracted.html;
    } catch (err) {
      console.error('Error extrayendo PDF plan semanal:', err);
      extractedHtml =
        '<article class="ps-doc"><p><em>No se pudo extraer el texto automáticamente. Puedes editar este contenido.</em></p></article>';
    }

    return await withTenantFromRequest(request, async (tx, institutionId) => {
      const planInfo = await getInstitutionPlanInfo(tx, institutionId);
      if (!planAllowsPlanSemanalPdf(planInfo?.plan?.nombre)) {
        return NextResponse.json(
          {
            error:
              'La carga de PDF está disponible en Plan Plus. Con Plan Básico completa el formulario de plan semanal.',
            code: 'PLAN_SEMANAL_PDF_REQUIRES_PLUS',
          },
          { status: 403 }
        );
      }

      const docente = await resolveDocente(tx, institutionId, email);
      if (!docente) {
        return NextResponse.json({ error: 'Docente no encontrado' }, { status: 404 });
      }

      const asignacion = await assertAsignacion(tx, docente.id, materiaId, gradoId, cursoId);
      if (!asignacion) {
        return NextResponse.json(
          { error: 'No tienes asignación para ese curso y materia' },
          { status: 403 }
        );
      }

      const existing = await tx.docentePlanSemanal.findUnique({
        where: {
          docente_id_curso_id_materia_id_fecha_inicio: {
            docente_id: docente.id,
            curso_id: cursoId,
            materia_id: materiaId,
            fecha_inicio: fechaInicio,
          },
        },
      });

      const safeName = file.name.replace(/[^\w.\-()\sÁÉÍÓÚáéíóúñÑ]/g, '_').slice(0, 180);
      const storagePath = `${institutionId}/plan-semanal/${docente.id}/${cursoId}-${materiaId}-${Date.now()}-${safeName}`;
      const bucket = storageBucket();
      const supabase = createAdminClient();

      const { error: uploadError } = await supabase.storage.from(bucket).upload(storagePath, buffer, {
        contentType: mimeType,
        upsert: false,
      });

      if (uploadError) {
        console.error('Error subiendo plan semanal a storage:', uploadError);
        return NextResponse.json(
          { error: 'No se pudo subir el archivo. Intenta de nuevo.' },
          { status: 500 }
        );
      }

      if (existing?.storage_path) {
        await supabase.storage.from(bucket).remove([existing.storage_path]).catch(() => null);
      }

      const fileData = {
        grado_id: gradoId,
        periodo_academico: periodo.slice(0, 100),
        semana: semana.slice(0, 50),
        fecha_inicio: fechaInicio,
        fecha_final: fechaFinal,
        origen: 'pdf',
        contenido_html: extractedHtml,
        contenido_json: null as Prisma.JsonNullValueInput | null,
        storage_path: storagePath,
        nombre_archivo: file.name.slice(0, 255),
        mime_type: mimeType,
        tamano_bytes: file.size,
      };

      const saved = existing
        ? await tx.docentePlanSemanal.update({
            where: { id: existing.id },
            data: fileData,
            include: planInclude,
          })
        : await tx.docentePlanSemanal.create({
            data: {
              docente_id: docente.id,
              materia_id: materiaId,
              curso_id: cursoId,
              institucion_id: institutionId,
              ...fileData,
            },
            include: planInclude,
          });

      return NextResponse.json({
        success: true,
        message: existing ? 'Plan semanal actualizado' : 'Plan semanal cargado',
        data: mapPlanItem(saved),
      });
    });
  } catch (error) {
    const sub = subscriptionErrorToResponse(error);
    if (sub) return sub;
    const tenant = tenantErrorToResponse(error);
    if (tenant) return tenant;
    console.error('Error guardando plan semanal:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
