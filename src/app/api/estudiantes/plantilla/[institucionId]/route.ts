import { NextRequest, NextResponse } from 'next/server';
import { enforceTenant, tenantErrorToResponse } from '@/lib/tenant';
import { withAdminSedeDb } from '@/lib/security/require-admin-api';
import { rbacErrorToResponse } from '@/lib/security/rbac';
import {
  institutionSedeWhere,
  cursosSedeWhere,
  sedeFilter,
  sedeErrorToResponse,
} from '@/lib/sede-scope';
import {
  buildEstudiantesWorkbook,
  workbookToXlsxBuffer,
} from '@/lib/estudiantes-excel';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ institucionId: string }> }
) {
  try {
    const { institucionId: param } = await params;
    const institucionId = parseInt(param, 10);

    if (!institucionId || Number.isNaN(institucionId)) {
      return NextResponse.json({ error: 'ID de institución inválido' }, { status: 400 });
    }

    return await withAdminSedeDb(request, async (tx, { institutionId, scope }) => {
      enforceTenant(institutionId, institucionId);

      const baseWhere = institutionSedeWhere(institutionId, scope);
      const cursoWhere = cursosSedeWhere(institutionId, scope);
      const cursoNested = scope.allSedes ? undefined : { where: sedeFilter(scope) };

      const [institucion, gradosRaw, materiasRaw, cursosCount] = await Promise.all([
        tx.instituciones.findUnique({
          where: { id: institutionId },
          select: { nombre: true },
        }),
        tx.grados.findMany({
          where: baseWhere,
          include: {
            cursos: {
              ...(cursoNested ?? {}),
              select: { id: true, nombre: true },
            },
          },
          orderBy: { orden: 'asc' },
        }),
        tx.materias.findMany({
          where: baseWhere,
          include: { area: { select: { nombre: true } } },
          orderBy: { nombre: 'asc' },
        }),
        tx.cursos.count({ where: cursoWhere }),
      ]);

      if (gradosRaw.length === 0 || cursosCount === 0) {
        return NextResponse.json(
          {
            error:
              'Primero crea grados y cursos. La carga masiva necesita esa estructura para asignar a cada estudiante.',
          },
          { status: 400 }
        );
      }

      const grados = gradosRaw.map((g) => ({
        id: g.id,
        nombre: g.nombre,
        nivel: g.nivel,
      }));

      const cursos = gradosRaw.flatMap((g) =>
        g.cursos.map((c) => ({
          id: c.id,
          nombre: c.nombre,
          grado_id: g.id,
          grado_nombre: g.nombre,
        }))
      );

      const materias = materiasRaw.map((m) => ({
        id: m.id,
        nombre: m.nombre,
        area: m.area.nombre,
      }));

      const wb = buildEstudiantesWorkbook({
        grados,
        cursos,
        materias,
        institucionNombre: institucion?.nombre,
      });

      const buffer = workbookToXlsxBuffer(wb);
      const filename = `plantilla-estudiantes-${institucionId}.xlsx`;

      return new NextResponse(new Uint8Array(buffer), {
        status: 200,
        headers: {
          'Content-Type':
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Cache-Control': 'no-store',
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
    console.error('Error generando plantilla estudiantes:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
