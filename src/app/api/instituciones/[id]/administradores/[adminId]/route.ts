import { NextRequest, NextResponse } from 'next/server';
import {
  enforceTenant,
  tenantErrorToResponse
} from '@/lib/tenant';
import { rbacErrorToResponse } from '@/lib/security/rbac';
import { omitPassword } from '@/lib/security/sanitize-response';
import {
  getSupabaseAdminClient,
  isSupabaseAdminConfigured,
} from '@/lib/supabase-admin';
import { withAdminTenantDb } from '@/lib/security/require-admin-api';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; adminId: string }> }
) {
  try {
    const { id, adminId } = await params;
    const institucionId = parseInt(id);
    const administradorId = parseInt(adminId);

    if (isNaN(institucionId) || isNaN(administradorId)) {
      return NextResponse.json(
        { error: 'ID de institución o administrador inválido' },
        { status: 400 }
      );
    }

    return await withAdminTenantDb(request, async (tx, userInstitutionId) => {
      const institucion = await tx.instituciones.findUnique({
        where: { id: institucionId }
      });

      if (!institucion) {
        return NextResponse.json(
          { error: 'Institución no encontrada' },
          { status: 404 }
        );
      }

      const administrador = await tx.administradores.findFirst({
        where: {
          id: administradorId,
          institucion_id: institucionId
        }
      });

      if (!administrador) {
        return NextResponse.json(
          { error: 'Administrador no encontrado o no pertenece a esta institución' },
          { status: 404 }
        );
      }

      enforceTenant(userInstitutionId, administrador.institucion_id);

      if (administrador.supabase_user_id) {
        if (!isSupabaseAdminConfigured()) {
          console.error('Supabase admin no está configurado. No se eliminará el usuario en Auth.');
        } else {
          const supabaseAdminClient = getSupabaseAdminClient();
          try {
            const { error: authError } = await supabaseAdminClient.auth.admin.deleteUser(
              administrador.supabase_user_id
            );

            if (authError) {
              console.error('Error al eliminar usuario de Supabase Auth:', authError);
            }
          } catch (authError) {
            console.error('Error al eliminar usuario de Supabase Auth:', authError);
          }
        }
      }

      await tx.administradores.delete({
        where: {
          id: administradorId
        }
      });

      return NextResponse.json(
        { message: 'Administrador eliminado exitosamente' },
        { status: 200 }
      );
    });
  } catch (error) {
    const rbacResp = rbacErrorToResponse(error);
    if (rbacResp) return rbacResp;
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error al eliminar administrador:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; adminId: string }> }
) {
  try {
    const { id, adminId } = await params;
    const institucionId = parseInt(id);
    const administradorId = parseInt(adminId);

    if (isNaN(institucionId) || isNaN(administradorId)) {
      return NextResponse.json(
        { error: 'ID de institución o administrador inválido' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { nombre, apellido, correo, telefono, cargo, sede_id, password } = body;

    if (!nombre || !apellido || !correo || !telefono || !cargo || !sede_id) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      return NextResponse.json(
        { error: 'Formato de correo inválido' },
        { status: 400 }
      );
    }

    return await withAdminTenantDb(request, async (tx, userInstitutionId) => {
      const institucion = await tx.instituciones.findUnique({
        where: { id: institucionId }
      });

      if (!institucion) {
        return NextResponse.json({ error: 'Institución no encontrada' }, { status: 404 });
      }

      const administrador = await tx.administradores.findFirst({
        where: {
          id: administradorId,
          institucion_id: institucionId
        }
      });

      if (!administrador) {
        return NextResponse.json(
          { error: 'Administrador no encontrado o no pertenece a esta institución' },
          { status: 404 }
        );
      }

      enforceTenant(userInstitutionId, administrador.institucion_id);

      const emailExistente = await tx.administradores.findFirst({
        where: {
          correo: correo.toLowerCase().trim(),
          id: { not: administradorId }
        }
      });

      if (emailExistente) {
        return NextResponse.json(
          { error: 'Ya existe un administrador con este correo electrónico' },
          { status: 409 }
        );
      }

      let sedeId: number | null = null;
      if (sede_id === 'principal') {
        sedeId = null;
      } else {
        const sede = await tx.sedes.findFirst({
          where: {
            id: parseInt(sede_id, 10),
            institucion_id: institucionId
          }
        });
        if (!sede) {
          return NextResponse.json(
            { error: 'La sede seleccionada no existe o no pertenece a esta institución' },
            { status: 400 }
          );
        }
        sedeId = parseInt(sede_id, 10);
      }

      if (administrador.supabase_user_id && isSupabaseAdminConfigured()) {
        const supabaseAdminClient = getSupabaseAdminClient();
        const updates: { email?: string; password?: string } = {
          email: correo.toLowerCase().trim()
        };
        if (password && password.trim().length > 0) {
          updates.password = password;
        }
        const { error: authError } = await supabaseAdminClient.auth.admin.updateUserById(
          administrador.supabase_user_id,
          updates
        );
        if (authError) {
          return NextResponse.json(
            { error: 'No se pudo actualizar el usuario en autenticación' },
            { status: 500 }
          );
        }
      }

      const dataToUpdate: {
        nombre: string;
        apellido: string;
        correo: string;
        telefono: string;
        cargo: string;
        sede_id: number | null;
        password?: string;
      } = {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        correo: correo.toLowerCase().trim(),
        telefono: telefono.trim(),
        cargo: cargo.trim(),
        sede_id: sedeId
      };

      if (password && password.trim().length > 0) {
        const bcrypt = await import('bcryptjs');
        dataToUpdate.password = await bcrypt.hash(password, 12);
      }

      const administradorActualizado = await tx.administradores.update({
        where: { id: administradorId },
        data: dataToUpdate
      });

      return NextResponse.json({ data: omitPassword(administradorActualizado) });
    });
  } catch (error) {
    const rbacResp = rbacErrorToResponse(error);
    if (rbacResp) return rbacResp;
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error al actualizar administrador:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
