import { NextRequest, NextResponse } from 'next/server';
import {
  enforceTenant,
  tenantErrorToResponse
} from '@/lib/tenant';
import { withTenantFromRequest } from '@/lib/db/with-tenant-request';
import {
  rbacErrorToResponse,
  requireInstitutionOwnerRole,
} from '@/lib/security/rbac';

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const institucionId = Number.parseInt(id, 10);

    if (Number.isNaN(institucionId)) {
      return NextResponse.json({ error: 'ID de institución inválido' }, { status: 400 });
    }

    const body = await request.json();
    const { email, direccion_principal, nombre_contacto, telefono_contacto } = body;

    if (!email || !direccion_principal || !nombre_contacto || !telefono_contacto) {
      return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Formato de email inválido' }, { status: 400 });
    }

    await requireInstitutionOwnerRole(request);

    return await withTenantFromRequest(request, async (tx, userInstitutionId) => {
      enforceTenant(userInstitutionId, institucionId);

      const institucionExistente = await tx.instituciones.findUnique({
        where: { id: institucionId }
      });

      if (!institucionExistente) {
        return NextResponse.json({ error: 'Institución no encontrada' }, { status: 404 });
      }

      const emailExistente = await tx.instituciones.findFirst({
        where: {
          email: email.trim(),
          id: { not: institucionId }
        }
      });

      if (emailExistente) {
        return NextResponse.json(
          { error: 'El correo electrónico ya está en uso por otra institución' },
          { status: 400 }
        );
      }

      const institucionActualizada = await tx.instituciones.update({
        where: { id: institucionId },
        data: {
          email: email.trim(),
          direccion_principal: direccion_principal.trim(),
          nombre_contacto: nombre_contacto.trim(),
          telefono_contacto: telefono_contacto.trim()
        }
      });

      return NextResponse.json({ data: institucionActualizada });
    });
  } catch (error) {
    const rbacResp = rbacErrorToResponse(error);
    if (rbacResp) return rbacResp;
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error al actualizar perfil de institución:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
