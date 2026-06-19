import { NextRequest, NextResponse } from 'next/server';
import {
  enforceTenant,
  tenantErrorToResponse
} from '@/lib/tenant';
import { withAdminSedeDb } from '@/lib/security/require-admin-api';
import { rbacErrorToResponse } from '@/lib/security/rbac';
import { sedeFilter, sedeErrorToResponse } from '@/lib/sede-scope';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ institucionId: string }> }
) {
  try {
    const { institucionId: institucionIdParam } = await params;
    const institucionIdFromUrl = parseInt(institucionIdParam);

    if (!institucionIdFromUrl || isNaN(institucionIdFromUrl)) {
      return NextResponse.json({ error: 'ID de institución inválido' }, { status: 400 });
    }

    return await withAdminSedeDb(request, async (tx, { institutionId, scope }) => {
      enforceTenant(institutionId, institucionIdFromUrl);

      const docenteWhere = scope.allSedes
        ? { institucion_id: institutionId }
        : { institucion_id: institutionId, ...sedeFilter(scope) };

      const recordatorios = await tx.recordatorios.findMany({
        where: {
          docente: docenteWhere
        },
        include: {
          docente: {
            select: {
              id: true,
              nombres: true,
              apellidos: true,
              email: true
            }
          },
          grado: {
            select: { id: true, nombre: true, nivel: true }
          },
          curso: {
            select: { id: true, nombre: true, jornada: true }
          },
          area: {
            select: { id: true, nombre: true }
          },
          materia: {
            select: { id: true, nombre: true }
          },
          estudiantes: {
            include: {
              estudiante: {
                select: {
                  id: true,
                  nombres: true,
                  apellidos: true,
                  codigo_estudiantil: true
                }
              }
            }
          }
        },
        orderBy: { fecha: 'asc' }
      });

      return NextResponse.json({ recordatorios });
    });
  } catch (error) {
    const sedeResp = sedeErrorToResponse(error);
    if (sedeResp) return sedeResp;
    const rbacResp = rbacErrorToResponse(error);
    if (rbacResp) return rbacResp;
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error buscando recordatorios:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
