import { NextRequest, NextResponse } from 'next/server';
import {
  enforceTenant,
  tenantErrorToResponse
} from '@/lib/tenant';
import { withAdminSedeDb } from '@/lib/security/require-admin-api';
import { rbacErrorToResponse } from '@/lib/security/rbac';
import { materiaGradosWhere, sedeErrorToResponse } from '@/lib/sede-scope';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ institucionId: string }> }
) {
  try {
    const { institucionId: institucionIdParam } = await params;
    const institucionIdFromUrl = parseInt(institucionIdParam);

    if (isNaN(institucionIdFromUrl)) {
      return NextResponse.json(
        { success: false, error: 'ID de institución inválido' },
        { status: 400 }
      );
    }

    return await withAdminSedeDb(request, async (tx, { institutionId, scope }) => {
      enforceTenant(institutionId, institucionIdFromUrl);

      const materiasGrados = await tx.materiaGrados.findMany({
        where: materiaGradosWhere(institutionId, scope),
        include: {
          materia: {
            select: { id: true, nombre: true, area_id: true }
          },
          grado: {
            select: { id: true, nombre: true, nivel: true }
          }
        },
        orderBy: [
          { grado: { nombre: 'asc' } },
          { materia: { nombre: 'asc' } }
        ]
      });

      return NextResponse.json({
        success: true,
        materiasGrados
      });
    });
  } catch (error) {
    const sedeResp = sedeErrorToResponse(error);
    if (sedeResp) return sedeResp;
    const rbacResp = rbacErrorToResponse(error);
    if (rbacResp) return rbacResp;
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error cargando materias-grados:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
