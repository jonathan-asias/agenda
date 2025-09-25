import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      nombre, 
      direccion_principal, 
      nit, 
      nombre_contacto, 
      telefono_contacto,
      email,
      password,
      tiene_sedes,
      jornadas = [],
      sedes = []
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

    if (!password || password.trim().length === 0) {
      return NextResponse.json(
        { error: 'La contraseña es requerida' },
        { status: 400 }
      );
    }

    // Validar contraseña segura
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      );
    }

    // Validar que al menos una jornada esté seleccionada si no tiene sedes
    if (!tiene_sedes && jornadas.length === 0) {
      return NextResponse.json(
        { error: 'Debe seleccionar al menos una jornada' },
        { status: 400 }
      );
    }

    // Validar que las sedes tengan datos completos si se seleccionó que tiene sedes
    if (tiene_sedes && sedes.length === 0) {
      return NextResponse.json(
        { error: 'Debe agregar al menos una sede' },
        { status: 400 }
      );
    }

    for (const sede of sedes) {
      if (!sede.nombre || sede.nombre.trim().length === 0) {
        return NextResponse.json(
          { error: 'El nombre de la sede es requerido' },
          { status: 400 }
        );
      }
      if (!sede.jornadas || sede.jornadas.length === 0) {
        return NextResponse.json(
          { error: 'Debe seleccionar al menos una jornada para la sede' },
          { status: 400 }
        );
      }
    }

    // Crear la institución en la base de datos con transacción
    const result = await prisma.$transaction(async (tx) => {
      // Crear la institución
      const institucion = await tx.instituciones.create({
        data: {
          nombre: nombre.trim(),
          direccion_principal: direccion_principal.trim(),
          nit: nit.trim(),
          nombre_contacto: nombre_contacto.trim(),
          telefono_contacto: telefono_contacto.trim(),
          email: email.trim(),
          password: password, // En producción, aquí deberías hashear la contraseña
          tiene_sedes: Boolean(tiene_sedes),
          jornadas: tiene_sedes ? [] : jornadas,
        },
      });

      // Crear las sedes si existen
      if (tiene_sedes && sedes.length > 0) {
        await tx.sedes.createMany({
          data: sedes.map((sede: any) => ({
            nombre: sede.nombre.trim(),
            jornadas: sede.jornadas,
            institucion_id: institucion.id,
          })),
        });
      }

      return institucion;
    });

    return NextResponse.json(
      { 
        message: 'Institución registrada exitosamente',
        data: result 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error al crear institución:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const instituciones = await prisma.instituciones.findMany({
      include: {
        sedes: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    return NextResponse.json(instituciones);
  } catch (error) {
    console.error('Error al obtener instituciones:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
