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
import { planAllowsSilabusPdf } from '@/lib/silabus/plan-access';
import {
  parseSilabusFormFields,
  silabusFormToHtml,
  validateSilabusForm,
} from '@/lib/silabus/form-html';
import { extractPdfToHtml } from '@/lib/silabus/pdf-extract';

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
    select: { id: true, institucion_id: true },
  });
}

const silabusInclude = {
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

type SilabusRow = {
  id: number;
  materia_id: number;
  grado_id: number;
  curso_id: number;
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

function mapSilabusItem(item: SilabusRow) {
  return {
    id: item.id,
    materia_id: item.materia_id,
    grado_id: item.grado_id,
    curso_id: item.curso_id,
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

export async function GET(request: NextRequest) {
  try {
    const email = await getAuthUserEmail(request);
    if (!email) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    return await withTenantFromRequest(request, async (tx, institutionId) => {
      const docente = await resolveDocente(tx, institutionId, email);
      if (!docente) {
        return NextResponse.json({ error: 'Docente no encontrado' }, { status: 404 });
      }

      const planInfo = await getInstitutionPlanInfo(tx, institutionId);
      const planNombre = planInfo?.plan?.nombre ?? null;
      const allowsPdf = planAllowsSilabusPdf(planNombre);

      const items = await tx.docenteSilabus.findMany({
        where: { docente_id: docente.id, institucion_id: institutionId },
        include: silabusInclude,
        orderBy: [{ updated_at: 'desc' }],
      });

      return NextResponse.json({
        success: true,
        meta: {
          plan_nombre: planNombre,
          mode: allowsPdf ? 'pdf' : 'formulario',
          allows_pdf: allowsPdf,
        },
        data: items.map(mapSilabusItem),
      });
    });
  } catch (error) {
    const sub = subscriptionErrorToResponse(error);
    if (sub) return sub;
    const tenant = tenantErrorToResponse(error);
    if (tenant) return tenant;
    console.error('Error listando sílabus:', error);
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
      const fields = parseSilabusFormFields(body.campos ?? body);

      if (!materiaId || !gradoId || !cursoId) {
        return NextResponse.json(
          { error: 'materia_id, grado_id y curso_id son requeridos' },
          { status: 400 }
        );
      }
      const formError = validateSilabusForm(fields);
      if (formError) {
        return NextResponse.json({ error: formError }, { status: 400 });
      }

      const html = silabusFormToHtml(fields);

      return await withTenantFromRequest(request, async (tx, institutionId) => {
        const planInfo = await getInstitutionPlanInfo(tx, institutionId);
        if (planAllowsSilabusPdf(planInfo?.plan?.nombre)) {
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

        const existing = await tx.docenteSilabus.findUnique({
          where: {
            docente_id_curso_id_materia_id: {
              docente_id: docente.id,
              curso_id: cursoId,
              materia_id: materiaId,
            },
          },
        });

        const data = {
          grado_id: gradoId,
          origen: 'formulario',
          contenido_html: html,
          contenido_json: fields,
          storage_path: null,
          nombre_archivo: null,
          mime_type: null,
          tamano_bytes: null,
        };

        const saved = existing
          ? await tx.docenteSilabus.update({
              where: { id: existing.id },
              data,
              include: silabusInclude,
            })
          : await tx.docenteSilabus.create({
              data: {
                docente_id: docente.id,
                materia_id: materiaId,
                grado_id: gradoId,
                curso_id: cursoId,
                institucion_id: institutionId,
                ...data,
              },
              include: silabusInclude,
            });

        return NextResponse.json({
          success: true,
          message: existing ? 'Sílabus actualizado' : 'Sílabus guardado',
          data: mapSilabusItem(saved),
        });
      });
    }

    // --- Plan Plus: multipart PDF ---
    const formData = await request.formData();
    const materiaId = Number(formData.get('materia_id'));
    const gradoId = Number(formData.get('grado_id'));
    const cursoId = Number(formData.get('curso_id'));
    const file = formData.get('archivo');

    if (!materiaId || !gradoId || !cursoId) {
      return NextResponse.json(
        { error: 'materia_id, grado_id y curso_id son requeridos' },
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
      const extracted = await extractPdfToHtml(buffer);
      extractedHtml = extracted.html;
    } catch (err) {
      console.error('Error extrayendo PDF:', err);
      extractedHtml =
        '<article class="silabus-doc"><p><em>No se pudo extraer el texto automáticamente. Puedes editar este contenido.</em></p></article>';
    }

    return await withTenantFromRequest(request, async (tx, institutionId) => {
      const planInfo = await getInstitutionPlanInfo(tx, institutionId);
      if (!planAllowsSilabusPdf(planInfo?.plan?.nombre)) {
        return NextResponse.json(
          {
            error:
              'La carga de PDF está disponible en Plan Plus. Con Plan Básico completa el formulario de sílabus.',
            code: 'SILABUS_PDF_REQUIRES_PLUS',
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

      const existing = await tx.docenteSilabus.findUnique({
        where: {
          docente_id_curso_id_materia_id: {
            docente_id: docente.id,
            curso_id: cursoId,
            materia_id: materiaId,
          },
        },
      });

      const safeName = file.name.replace(/[^\w.\-()\sÁÉÍÓÚáéíóúñÑ]/g, '_').slice(0, 180);
      const storagePath = `${institutionId}/silabus/${docente.id}/${cursoId}-${materiaId}-${Date.now()}-${safeName}`;
      const bucket = storageBucket();
      const supabase = createAdminClient();

      const { error: uploadError } = await supabase.storage.from(bucket).upload(storagePath, buffer, {
        contentType: mimeType,
        upsert: false,
      });

      if (uploadError) {
        console.error('Error subiendo sílabus a storage:', uploadError);
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
        origen: 'pdf',
        contenido_html: extractedHtml,
        contenido_json: null as Prisma.JsonNullValueInput | null,
        storage_path: storagePath,
        nombre_archivo: file.name.slice(0, 255),
        mime_type: mimeType,
        tamano_bytes: file.size,
      };

      const saved = existing
        ? await tx.docenteSilabus.update({
            where: { id: existing.id },
            data: fileData,
            include: silabusInclude,
          })
        : await tx.docenteSilabus.create({
            data: {
              docente_id: docente.id,
              materia_id: materiaId,
              grado_id: gradoId,
              curso_id: cursoId,
              institucion_id: institutionId,
              ...fileData,
            },
            include: silabusInclude,
          });

      return NextResponse.json({
        success: true,
        message: existing ? 'Sílabus actualizado' : 'Sílabus cargado',
        data: mapSilabusItem(saved),
      });
    });
  } catch (error) {
    const sub = subscriptionErrorToResponse(error);
    if (sub) return sub;
    const tenant = tenantErrorToResponse(error);
    if (tenant) return tenant;
    console.error('Error guardando sílabus:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
