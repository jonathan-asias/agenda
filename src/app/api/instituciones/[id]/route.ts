import { NextRequest, NextResponse } from 'next/server';
import {
  enforceTenant,
  tenantErrorToResponse
} from '@/lib/tenant';
import { sanitizeInstitucionResponse } from '@/lib/security/sanitize-response';
import { rbacErrorToResponse, requireInstitutionOwnerRole } from '@/lib/security/rbac';
import { withTenantFromRequest } from '@/lib/db/with-tenant-request';
import { deleteInstitutionAccount } from '@/lib/institution/delete-institution-account';
import { writeAuditLog } from '@/lib/security/audit-log';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const institucionId = parseInt(id);

    if (isNaN(institucionId)) {
      return NextResponse.json(
        { error: 'ID de institución inválido' },
        { status: 400 }
      );
    }

    const institucion = await withTenantFromRequest(request, async (tx, userInstitutionId) => {
      enforceTenant(userInstitutionId, institucionId);
      return tx.instituciones.findUnique({
        where: { id: institucionId },
        include: {
          sedes: true,
          administradores: true,
        },
      });
    });

    if (!institucion) {
      return NextResponse.json(
        { error: 'Institución no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(sanitizeInstitucionResponse(institucion));
  } catch (error) {
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error al obtener institución:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const institucionId = parseInt(id);

    if (isNaN(institucionId)) {
      return NextResponse.json(
        { error: 'ID de institución inválido' },
        { status: 400 }
      );
    }

    await requireInstitutionOwnerRole(request);

    const body = await request.json();
    const { 
      nombre, 
      direccion_principal, 
      nit, 
      nombre_contacto, 
      telefono_contacto,
      email
    } = body;

    // Validaciones básicas
    if (!nombre || nombre.trim().length === 0) {
      return NextResponse.json(
        { error: 'El nombre de la institución es requerido' },
        { status: 400 }
      );
    }

    if (!direccion_principal || direccion_principal.trim().length === 0) {
      return NextResponse.json(
        { error: 'La dirección principal es requerida' },
        { status: 400 }
      );
    }

    if (!nit || nit.trim().length === 0) {
      return NextResponse.json(
        { error: 'El NIT es requerido' },
        { status: 400 }
      );
    }

    if (!nombre_contacto || nombre_contacto.trim().length === 0) {
      return NextResponse.json(
        { error: 'El nombre de contacto es requerido' },
        { status: 400 }
      );
    }

    if (!telefono_contacto || telefono_contacto.trim().length === 0) {
      return NextResponse.json(
        { error: 'El teléfono de contacto es requerido' },
        { status: 400 }
      );
    }

    if (!email || email.trim().length === 0) {
      return NextResponse.json(
        { error: 'El correo electrónico es requerido' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'El formato del correo electrónico no es válido' },
        { status: 400 }
      );
    }

    return await withTenantFromRequest(request, async (tx, userInstitutionId) => {
      enforceTenant(userInstitutionId, institucionId);

      const institucionExistente = await tx.instituciones.findUnique({
        where: { id: institucionId }
      });

      if (!institucionExistente) {
        return NextResponse.json(
          { error: 'Institución no encontrada' },
          { status: 404 }
        );
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
          nombre: nombre.trim(),
          direccion_principal: direccion_principal.trim(),
          nit: nit.trim(),
          nombre_contacto: nombre_contacto.trim(),
          telefono_contacto: telefono_contacto.trim(),
          email: email.trim()
        },
        include: {
          sedes: true,
          administradores: true
        }
      });

      return NextResponse.json({
        message: 'Institución actualizada exitosamente',
        data: sanitizeInstitucionResponse(institucionActualizada)
      });
    });

  } catch (error) {
    const rbacResp = rbacErrorToResponse(error);
    if (rbacResp) return rbacResp;
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error al actualizar institución:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const institucionId = parseInt(id);

    if (isNaN(institucionId)) {
      return NextResponse.json(
        { error: 'ID de institución inválido' },
        { status: 400 }
      );
    }

    const { institutionId: userInstitutionId } = await requireInstitutionOwnerRole(request);
    enforceTenant(userInstitutionId, institucionId);

    const result = await deleteInstitutionAccount(institucionId);

    await writeAuditLog({
      usuario: result.email,
      accion: 'INSTITUCION_ELIMINADA',
      metadata: {
        institucionId: result.institucionId,
        archiveId: result.archiveId,
        via: 'DELETE',
      },
      request,
    });

    return NextResponse.json({
      message: 'Institución eliminada exitosamente',
      deleted: true,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Institución no encontrada') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    const rbacResp = rbacErrorToResponse(error);
    if (rbacResp) return rbacResp;
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error al eliminar institución:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
