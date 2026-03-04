import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/push/activate?estudianteId=X
 *
 * Valida estudianteId (temporalmente solo simular validación) y devuelve
 * acudienteId, institucionId, publicKey para la página de activación.
 * Si el acudiente no existe en tabla Acudientes, lo crea desde los datos del estudiante.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const estudianteId = searchParams.get('estudianteId');
    const acudienteIdParam = searchParams.get('acudienteId');

    const publicKey = process.env.WEB_PUSH_PUBLIC_KEY;
    if (!publicKey) {
      return NextResponse.json(
        { error: 'Push no configurado' },
        { status: 503 }
      );
    }

    if (acudienteIdParam) {
      const acudId = parseInt(acudienteIdParam, 10);
      if (Number.isNaN(acudId)) {
        return NextResponse.json({ error: 'acudienteId inválido' }, { status: 400 });
      }
      const acudiente = await prisma.acudientes.findUnique({
        where: { id: acudId },
        select: { id: true, institucion_id: true },
      });
      if (!acudiente) {
        return NextResponse.json({ error: 'Acudiente no encontrado' }, { status: 404 });
      }
      return NextResponse.json({
        acudienteId: acudiente.id,
        institucionId: acudiente.institucion_id,
        publicKey,
      });
    }

    if (!estudianteId) {
      return NextResponse.json(
        { error: 'estudianteId o acudienteId es requerido' },
        { status: 400 }
      );
    }

    const estId = parseInt(estudianteId, 10);
    if (Number.isNaN(estId)) {
      return NextResponse.json({ error: 'estudianteId inválido' }, { status: 400 });
    }

    const estudiante = await prisma.estudiantes.findFirst({
      where: { id: estId, activo: true },
      include: { institucion: true },
    });

    if (!estudiante || !estudiante.correo_acudiente?.trim()) {
      return NextResponse.json(
        { error: 'Estudiante no encontrado o sin correo de acudiente' },
        { status: 404 }
      );
    }

    const email = estudiante.correo_acudiente.trim();
    const nombre = estudiante.nombre_acudiente || 'Acudiente';
    const telefono = estudiante.telefono_acudiente || null;

    let acudiente = await prisma.acudientes.findUnique({
      where: {
        institucion_id_email: {
          institucion_id: estudiante.institucion_id,
          email,
        },
      },
    });

    if (!acudiente) {
      acudiente = await prisma.acudientes.create({
        data: {
          institucion_id: estudiante.institucion_id,
          email,
          nombre,
          telefono,
        },
      });
    }

    return NextResponse.json({
      acudienteId: acudiente.id,
      institucionId: acudiente.institucion_id,
      publicKey,
    });
  } catch (error) {
    console.error('Error en /api/push/activate:', error);
    return NextResponse.json(
      { error: 'Error al activar' },
      { status: 500 }
    );
  }
}
