import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '../../../../../lib/supabase-admin';
import { supabase } from '../../../../../lib/supabase';

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

    const administradores = await prisma.administradores.findMany({
      where: {
        institucion_id: institucionId
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

    return NextResponse.json(administradores);
  } catch (error) {
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

    // Validar campos requeridos
    if (!nombre || !apellido || !correo || !telefono || !cargo || !password || !sede_id) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Validar contraseña segura
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y símbolos' },
        { status: 400 }
      );
    }

    // Verificar que la institución existe
    const institucion = await prisma.instituciones.findUnique({
      where: { id: institucionId }
    });

    if (!institucion) {
      return NextResponse.json(
        { error: 'Institución no encontrada' },
        { status: 404 }
      );
    }

    // Manejar el caso de sede principal cuando no hay sedes configuradas
    let sedeId = null;
    let sedeNombre = 'Sede Principal';
    
    if (sede_id === 'principal') {
      // Si se selecciona "Sede Principal", no asignar a ninguna sede específica
      sedeId = null;
    } else {
      // Verificar que la sede existe y pertenece a la institución
      const sede = await prisma.sedes.findFirst({
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

    // Verificar si el correo ya existe (único globalmente)
    const existingAdmin = await prisma.administradores.findFirst({
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

    // Verificar si el correo ya existe en esta institución específica
    const existingAdminInInstitution = await prisma.administradores.findFirst({
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

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear el administrador
    const nuevoAdministrador = await prisma.administradores.create({
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

    // Crear usuario en Supabase Auth usando el mismo método que las instituciones
    try {
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: correo.toLowerCase().trim(),
        password: password, // Usar la contraseña original antes del hash
        email_confirm: false, // NO confirmar automáticamente para que se envíe correo
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
        console.error('Detalles del error:', JSON.stringify(authError, null, 2));
        // Si falla la creación en Supabase, eliminar el administrador de la BD
        await prisma.administradores.delete({
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

      console.log('Usuario administrador creado en Supabase Auth:', authData.user?.id);

      // Actualizar el administrador con el supabase_user_id
      if (authData.user?.id) {
        await prisma.administradores.update({
          where: { id: nuevoAdministrador.id },
          data: { supabase_user_id: authData.user.id }
        });
        console.log('supabase_user_id guardado en la base de datos:', authData.user.id);

        // Enviar correo de confirmación usando el cliente público (como las instituciones)
        try {
          console.log('Enviando correo de confirmación usando cliente público...');
          const { error: emailError } = await supabase.auth.resend({
            type: 'signup',
            email: correo.toLowerCase().trim(),
            options: {
              emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login`
            }
          });

          if (emailError) {
            console.error('Error enviando correo de confirmación:', emailError);
            console.error('Detalles del error de correo:', JSON.stringify(emailError, null, 2));
            
            // Intentar método alternativo con generateLink
            console.log('Intentando método alternativo con generateLink...');
            const { error: linkError } = await supabaseAdmin.auth.admin.generateLink({
              type: 'signup',
              email: correo.toLowerCase().trim(),
              password: password,
              options: {
                redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login`
              }
            });

            if (linkError) {
              console.error('Error con método alternativo:', linkError);
            } else {
              console.log('Correo enviado exitosamente con método alternativo');
            }
          } else {
            console.log('Correo de confirmación enviado exitosamente');
          }
        } catch (emailError) {
          console.error('Error enviando correo de confirmación:', emailError);
          console.error('Stack trace del error de correo:', emailError instanceof Error ? emailError.stack : 'No stack trace available');
        }
      }
    } catch (authError) {
      console.error('Error en el proceso de creación de usuario:', authError);
      console.error('Stack trace:', authError instanceof Error ? authError.stack : 'No stack trace available');
      // Si falla la creación en Supabase, eliminar el administrador de la BD
      await prisma.administradores.delete({
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

    return NextResponse.json(nuevoAdministrador, { status: 201 });
  } catch (error) {
    console.error('Error al crear administrador:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
