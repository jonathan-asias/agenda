import { NextRequest, NextResponse } from 'next/server';
import {
  enforceTenant,
  tenantErrorToResponse
} from '@/lib/tenant';
import { withTenantFromRequest } from '@/lib/db/with-tenant-request';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    const { email: emailParam } = await params;
    const email = decodeURIComponent(emailParam);

    if (!email || email.trim().length === 0) {
      return NextResponse.json({ error: 'Email es requerido' }, { status: 400 });
    }

    return await withTenantFromRequest(request, async (tx, userInstitutionId) => {
      const administrador = await tx.administradores.findFirst({
        where: {
          correo: email.trim(),
          institucion_id: userInstitutionId,
        },
        include: {
          institucion: {
            select: { id: true, nombre: true }
          },
          sede: {
            select: { id: true, nombre: true }
          }
        }
      });

      if (!administrador) {
        return NextResponse.json({ error: 'Administrador no encontrado' }, { status: 404 });
      }

      enforceTenant(userInstitutionId, administrador.institucion_id);

      return NextResponse.json({
        administrador: {
          id: administrador.id,
          nombre: administrador.nombre,
          apellido: administrador.apellido,
          correo: administrador.correo,
          cargo: administrador.cargo,
          institucion: administrador.institucion,
          sede: administrador.sede
        }
      });
    });
  } catch (error) {
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error buscando administrador:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
