import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import {
  enforceTenant,
  tenantErrorToResponse
} from '@/lib/tenant';
import { rbacErrorToResponse } from '@/lib/security/rbac';
import { omitPassword, omitPasswordFromList } from '@/lib/security/sanitize-response';
import {
  getSupabaseAdminClient,
  isSupabaseAdminConfigured,
} from '@/lib/supabase-admin';
import { sendSignupConfirmationEmail } from '@/lib/auth/send-signup-confirmation';
import { withAdminTenantDb } from '@/lib/security/require-admin-api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const institucionIdFromUrl = parseInt(id);

    if (isNaN(institucionIdFromUrl)) {
      return NextResponse.json(
        { error: 'ID de institución inválido' },
        { status: 400 }
      );
    }

    return await withAdminTenantDb(request, async (tx, userInstitutionId) => {
      enforceTenant(userInstitutionId, institucionIdFromUrl);

      const administradores = await tx.administradores.findMany({
        where: {
          institucion_id: userInstitutionId
        },
        include: {
          sede: {
            select: {
              id: true,
              nombre: true
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        }
      });

      return NextResponse.json(omitPasswordFromList(administradores));
    });
  } catch (error) {
    const rbacResp = rbacErrorToResponse(error);
    if (rbacResp) return rbacResp;
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error al obtener administradores:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(
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

    const body = await request.json();
    const { nombre, apellido, correo, telefono, cargo, password, sede_id } = body;

    if (!nombre || !apellido || !correo || !telefono || !cargo || !password || !sede_id) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y símbolos' },
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

      enforceTenant(userInstitutionId, institucionId);

      let sedeId = null;
      let sedeNombre = 'Sede Principal';

      if (sede_id === 'principal') {
        sedeId = null;
      } else {
        const sede = await tx.sedes.findFirst({
          where: {
            id: parseInt(sede_id),
            institucion_id: institucionId
          }
        });

        if (!sede) {
          return NextResponse.json(
            { error: 'La sede seleccionada no existe o no pertenece a esta institución' },
            { status: 400 }
          );
        }

        sedeId = parseInt(sede_id);
        sedeNombre = sede.nombre;
      }

      const existingAdmin = await tx.administradores.findFirst({
        where: {
          correo: correo.toLowerCase().trim()
        }
      });

      if (existingAdmin) {
        return NextResponse.json(
          { error: 'Ya existe un administrador con este correo electrónico' },
          { status: 409 }
        );
      }

      const existingAdminInInstitution = await tx.administradores.findFirst({
        where: {
          correo: correo.toLowerCase().trim(),
          institucion_id: institucionId
        }
      });

      if (existingAdminInInstitution) {
        return NextResponse.json(
          { error: 'Ya existe un administrador con este correo en esta institución' },
          { status: 409 }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const nuevoAdministrador = await tx.administradores.create({
        data: {
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          correo: correo.toLowerCase().trim(),
          telefono: telefono.trim(),
          cargo: cargo.trim(),
          password: hashedPassword,
          institucion_id: institucionId,
          sede_id: sedeId
        },
        include: {
          sede: {
            select: {
              id: true,
              nombre: true
            }
          }
        }
      });

      try {
        if (!isSupabaseAdminConfigured()) {
          console.error('Supabase admin no está configurado. No se puede crear el administrador en Auth.');
          return NextResponse.json(
            { error: 'El servicio de autenticación no está configurado. Contacta al administrador.' },
            { status: 500 }
          );
        }

        const supabaseAdminClient = getSupabaseAdminClient();

        const { data: authData, error: authError } = await supabaseAdminClient.auth.admin.createUser({
          email: correo.toLowerCase().trim(),
          password: password,
          email_confirm: false,
          user_metadata: {
            nombre: nombre.trim(),
            apellido: apellido.trim(),
            cargo: cargo.trim(),
            institucion: institucion.nombre,
            sede: sedeNombre,
            tipo: 'administrador'
          }
        });

        if (authError) {
          console.error('Error creando usuario en Supabase Auth:', authError);
          await tx.administradores.delete({
            where: { id: nuevoAdministrador.id }
          });
          return NextResponse.json(
            {
              error: 'Error al crear usuario en el sistema de autenticación',
              details: authError.message || 'Error desconocido'
            },
            { status: 500 }
          );
        }

        if (authData.user?.id) {
          await tx.administradores.update({
            where: { id: nuevoAdministrador.id },
            data: { supabase_user_id: authData.user.id }
          });
          await sendSignupConfirmationEmail(correo);
        }
      } catch (authError) {
        console.error('Error en el proceso de creación de usuario:', authError);
        await tx.administradores.delete({
          where: { id: nuevoAdministrador.id }
        });
        return NextResponse.json(
          {
            error: 'Error al crear usuario en el sistema de autenticación',
            details: authError instanceof Error ? authError.message : 'Error desconocido'
          },
          { status: 500 }
        );
      }

      return NextResponse.json(omitPassword(nuevoAdministrador), { status: 201 });
    });
  } catch (error) {
    const rbacResp = rbacErrorToResponse(error);
    if (rbacResp) return rbacResp;
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error al crear administrador:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
