import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

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

    const institucion = await prisma.instituciones.findUnique({
      where: {
        id: institucionId
      },
      include: {
        sedes: true,
        administradores: true
      }
    });

    if (!institucion) {
      return NextResponse.json(
        { error: 'Institución no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(institucion);
  } catch (error) {
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

    // Verificar que la institución existe
    const institucionExistente = await prisma.instituciones.findUnique({
      where: { id: institucionId }
    });

    if (!institucionExistente) {
      return NextResponse.json(
        { error: 'Institución no encontrada' },
        { status: 404 }
      );
    }

    // Verificar que el email no esté en uso por otra institución
    const emailExistente = await prisma.instituciones.findFirst({
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

    // Actualizar la institución
    const institucionActualizada = await prisma.instituciones.update({
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
      data: institucionActualizada
    });

  } catch (error) {
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

    // Verificar que la institución existe
    const institucionExistente = await prisma.instituciones.findUnique({
      where: { id: institucionId }
    });

    if (!institucionExistente) {
      return NextResponse.json(
        { error: 'Institución no encontrada' },
        { status: 404 }
      );
    }

    // Eliminar la institución (esto también eliminará las sedes y administradores por CASCADE)
    await prisma.instituciones.delete({
      where: { id: institucionId }
    });

    return NextResponse.json({
      message: 'Institución eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar institución:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
