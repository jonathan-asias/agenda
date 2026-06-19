import { NextRequest, NextResponse } from 'next/server';
import {
  nombreGradoCanonico,
  nivelGradoPorOrden,
} from '@/lib/grados-predeterminados';
import {
  enforceTenant,
  tenantErrorToResponse
} from '@/lib/tenant';
import { withAdminSedeDb } from '@/lib/security/require-admin-api';
import { rbacErrorToResponse } from '@/lib/security/rbac';
import {
  institutionSedeWhere,
  cursosSedeWhere,
  sedeFilter,
  sedeErrorToResponse,
} from '@/lib/sede-scope';

const MIGRATION_HINT =
  'Faltan columnas sede_id en la base de datos. Ejecuta: node scripts/apply-sede-isolation.mjs (o npx prisma db push) y reinicia el servidor.';

function migrationErrorResponse(error: unknown): NextResponse | null {
  if (
    error &&
    typeof error === 'object' &&
    'code' in error &&
    (error as { code: string }).code === 'P2022'
  ) {
    return NextResponse.json(
      {
        success: false,
        error: 'Migración de sedes pendiente',
        details: MIGRATION_HINT,
      },
      { status: 503 }
    );
  }
  return null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ institucionId: string }> }
) {
  try {
    const { institucionId } = await params;
    const institucionIdFromUrl = parseInt(institucionId);

    if (!institucionIdFromUrl || isNaN(institucionIdFromUrl)) {
      return NextResponse.json(
        { error: 'ID de institución inválido' },
        { status: 400 }
      );
    }

    return await withAdminSedeDb(request, async (tx, { institutionId, scope }) => {
      enforceTenant(institutionId, institucionIdFromUrl);

      const baseWhere = institutionSedeWhere(institutionId, scope);
      const cursoNestedFilter = scope.allSedes ? undefined : { where: sedeFilter(scope) };

      const gradosRaw = await tx.grados.findMany({
        where: baseWhere,
        include: {
          cursos: {
            ...(cursoNestedFilter ?? {}),
            select: {
              id: true,
              nombre: true,
              grado_id: true
            }
          }
        },
        orderBy: { orden: 'asc' }
      });

      const grados = await Promise.all(
        gradosRaw.map(async (grado) => {
          const nombreCanonico = nombreGradoCanonico(grado.orden, grado.nombre);
          const nivelCanonico = nivelGradoPorOrden(grado.orden) ?? grado.nivel;
          if (grado.nombre !== nombreCanonico || grado.nivel !== nivelCanonico) {
            return tx.grados.update({
              where: { id: grado.id },
              data: { nombre: nombreCanonico, nivel: nivelCanonico },
              include: {
                cursos: {
                  ...(cursoNestedFilter ?? {}),
                  select: {
                    id: true,
                    nombre: true,
                    grado_id: true
                  }
                }
              }
            });
          }
          return grado;
        })
      );

      return NextResponse.json({
        success: true,
        grados,
        total: grados.length
      });
    });
  } catch (error) {
    const migrationResp = migrationErrorResponse(error);
    if (migrationResp) return migrationResp;
    const sedeResp = sedeErrorToResponse(error);
    if (sedeResp) return sedeResp;
    const rbacResp = rbacErrorToResponse(error);
    if (rbacResp) return rbacResp;
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error cargando grados:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al cargar grados',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
