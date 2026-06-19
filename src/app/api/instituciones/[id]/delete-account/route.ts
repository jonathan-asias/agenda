import { NextRequest, NextResponse } from 'next/server';
import { enforceTenant, tenantErrorToResponse } from '@/lib/tenant';
import { rbacErrorToResponse, requireInstitutionOwnerRole } from '@/lib/security/rbac';
import { writeAuditLog } from '@/lib/security/audit-log';
import { deleteInstitutionAccount } from '@/lib/institution/delete-institution-account';

const CONFIRMATION_TOKEN = 'ELIMINAR';

interface DeleteAccountBody {
  confirmation?: string;
}

/**
 * POST /api/instituciones/[id]/delete-account
 * Elimina permanentemente la institución y todos los datos relacionados.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const institucionId = Number.parseInt(id, 10);
    if (Number.isNaN(institucionId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const { institutionId: userInstitutionId } = await requireInstitutionOwnerRole(request);
    enforceTenant(userInstitutionId, institucionId);

    let body: DeleteAccountBody = {};
    try {
      body = (await request.json()) as DeleteAccountBody;
    } catch {
      return NextResponse.json(
        { error: 'Debe confirmar escribiendo ELIMINAR' },
        { status: 400 }
      );
    }

    if (body.confirmation?.trim().toUpperCase() !== CONFIRMATION_TOKEN) {
      return NextResponse.json(
        { error: 'Confirmación inválida. Escriba ELIMINAR para continuar.' },
        { status: 400 }
      );
    }

    const result = await deleteInstitutionAccount(institucionId, {
      reason: 'user_request',
    });

    await writeAuditLog({
      usuario: result.email,
      accion: 'INSTITUCION_ELIMINADA',
      metadata: {
        institucionId: result.institucionId,
        archiveId: result.archiveId,
        retentionUntil: result.retentionUntil,
        authUsersDeleted: result.authUsersDeleted,
        authUsersFailed: result.authUsersFailed,
      },
      request,
    });

    return NextResponse.json({
      deleted: true,
      archiveId: result.archiveId,
      message: 'La cuenta de la institución fue eliminada permanentemente.',
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Institución no encontrada') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    const rbacResp = rbacErrorToResponse(error);
    if (rbacResp) return rbacResp;
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error eliminando cuenta de institución:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
