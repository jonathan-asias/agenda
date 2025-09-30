import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { email: string } }
) {
  try {
    const { email } = params;

    if (!email) {
      return NextResponse.json({ error: 'Email es requerido' }, { status: 400 });
    }

    const administrador = await prisma.administradores.findUnique({
      where: {
        correo: email
      },
      include: {
        institucion: {
          select: {
            id: true,
            nombre: true
          }
        },
        sede: {
          select: {
            id: true,
            nombre: true
          }
        }
      }
    });

    if (!administrador) {
      return NextResponse.json({ error: 'Administrador no encontrado' }, { status: 404 });
    }

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
  } catch (error) {
    console.error('Error buscando administrador:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
