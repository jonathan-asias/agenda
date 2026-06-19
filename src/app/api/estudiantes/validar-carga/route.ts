import { NextRequest, NextResponse } from 'next/server';
import { enforceTenant, tenantErrorToResponse } from '@/lib/tenant';
import { withAdminSedeDb } from '@/lib/security/require-admin-api';
import { rbacErrorToResponse } from '@/lib/security/rbac';
import { sedeErrorToResponse } from '@/lib/sede-scope';
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

      return NextResponse.json({
        success: true,
        message: validacion.valido
          ? `Archivo correcto: ${validacion.filasValidas} estudiante(s) listos para importar.`
          : 'Se encontraron errores en el archivo. Corríjalos antes de importar.',
        data: validacion,
      });
    });
  } catch (error) {
    const sedeResp = sedeErrorToResponse(error);
    if (sedeResp) return sedeResp;
    const rbacResp = rbacErrorToResponse(error);
    if (rbacResp) return rbacResp;
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error validando carga masiva:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
