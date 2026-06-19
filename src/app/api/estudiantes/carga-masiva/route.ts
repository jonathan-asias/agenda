import { NextRequest, NextResponse } from 'next/server';
import { enforceTenant, tenantErrorToResponse } from '@/lib/tenant';
import { withAdminSedeDb } from '@/lib/security/require-admin-api';
import { rbacErrorToResponse } from '@/lib/security/rbac';
import {
  sedeDataForCreate,
  sedeErrorToResponse,
  SedeAccessDeniedError,
} from '@/lib/sede-scope';
import { parseEstudiantesWorkbook } from '@/lib/estudiantes-excel';
import {
  assertExcelUploadFile,
  validateEstudiantesForImport,
} from '@/lib/estudiantes-carga-masiva';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const institucionId = Number(formData.get('institucionId'));

    if (!institucionId || Number.isNaN(institucionId)) {
      return NextResponse.json(
        { success: false, error: 'institucionId es requerido' },
        { status: 400 }
      );
    }

    let file: File;
    try {
      file = assertExcelUploadFile(formData.get('archivo'));
    } catch (err) {
      return NextResponse.json(
        { success: false, error: err instanceof Error ? err.message : 'Archivo inválido' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { rows, errores: erroresParseo } = parseEstudiantesWorkbook(buffer);

    if (erroresParseo.length > 0 && rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'El archivo no pudo procesarse',
          errores: erroresParseo,
        },
        { status: 400 }
      );
    }

    return await withAdminSedeDb(request, async (tx, { institutionId, scope }) => {
      enforceTenant(institutionId, institucionId);

      const institucion = await tx.instituciones.findUnique({
        where: { id: institucionId },
      });
      if (!institucion) {
        return NextResponse.json(
          { success: false, error: 'Institución no encontrada' },
          { status: 404 }
        );
      }

      const validacion = await validateEstudiantesForImport(
        tx,
        institucionId,
        scope,
        rows,
        erroresParseo
      );

      if (!validacion.valido) {
        return NextResponse.json(
          {
            success: false,
            error: 'Corrija los errores del archivo antes de importar.',
            data: {
              totalFilas: validacion.totalFilas,
              exitosos: 0,
              fallidos: validacion.totalFilas,
              estudiantesCreados: [],
              errores: validacion.errores,
            },
          },
          { status: 400 }
        );
      }

      const sedeData = sedeDataForCreate(scope);
      const errores: string[] = [];
      const estudiantesCreados: Array<{
        fila: number;
        id: number;
        codigo_estudiantil: string;
        nombres: string;
        apellidos: string;
      }> = [];

      for (const row of rows) {
        try {
          const creado = await tx.estudiantes.create({
            data: {
              nombres: row.nombres,
              apellidos: row.apellidos,
              codigo_estudiantil: row.codigo_estudiantil,
              nombre_acudiente: row.nombre_acudiente,
              correo_acudiente: row.correo_acudiente,
              telefono_acudiente: row.telefono_acudiente,
              grado_id: row.grado_id,
              curso_id: row.curso_id,
              institucion_id: institucionId,
              ...sedeData,
              activo: true,
            },
          });

          estudiantesCreados.push({
            fila: row.fila,
            id: creado.id,
            codigo_estudiantil: creado.codigo_estudiantil,
            nombres: creado.nombres,
            apellidos: creado.apellidos,
          });
        } catch (err) {
          if (err instanceof SedeAccessDeniedError) {
            errores.push(`Fila ${row.fila}: grado o curso no pertenece a su sede.`);
          } else {
            errores.push(
              `Fila ${row.fila}: ${err instanceof Error ? err.message : 'Error al crear'}`
            );
          }
        }
      }

      return NextResponse.json({
        success: estudiantesCreados.length > 0,
        message:
          estudiantesCreados.length > 0
            ? `Se importaron ${estudiantesCreados.length} estudiante(s).`
            : 'No se importó ningún estudiante.',
        data: {
          totalFilas: rows.length,
          exitosos: estudiantesCreados.length,
          fallidos: rows.length - estudiantesCreados.length,
          estudiantesCreados,
          errores,
        },
      });
    });
  } catch (error) {
    const sedeResp = sedeErrorToResponse(error);
    if (sedeResp) return sedeResp;
    const rbacResp = rbacErrorToResponse(error);
    if (rbacResp) return rbacResp;
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error en carga masiva estudiantes:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
