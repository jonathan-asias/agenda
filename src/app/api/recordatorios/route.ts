import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      nombre,
      descripcion,
      fecha,
      tipo,
      docenteId,
      gradoId,
      cursoId,
      areaId,
      materiaId,
      estudiantesSeleccionados
    } = body;

    // Validaciones
    if (!nombre || !descripcion || !fecha || !tipo) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    if (!docenteId || !gradoId || !cursoId || !areaId || !materiaId) {
      return NextResponse.json(
        { error: 'Faltan relaciones requeridas (docente, grado, curso, área, materia)' },
        { status: 400 }
      );
    }

    if (!Array.isArray(estudiantesSeleccionados) || estudiantesSeleccionados.length === 0) {
      return NextResponse.json(
        { error: 'Debe seleccionar al menos un estudiante' },
        { status: 400 }
      );
    }

    // Validar que el tipo sea válido
    const tiposValidos = ['tarea', 'examen', 'evento', 'otro'];
    if (!tiposValidos.includes(tipo)) {
      return NextResponse.json(
        { error: 'Tipo de recordatorio inválido' },
        { status: 400 }
      );
    }

    // Validar que el docente existe
    const docente = await prisma.docentes.findUnique({
      where: { id: parseInt(docenteId) }
    });

    if (!docente) {
      return NextResponse.json(
        { error: 'Docente no encontrado' },
        { status: 404 }
      );
    }

    // Validar que los estudiantes existen y pertenecen al curso
    const estudiantes = await prisma.estudiantes.findMany({
      where: {
        id: { in: estudiantesSeleccionados.map((id: number) => parseInt(id.toString())) },
        curso_id: parseInt(cursoId),
        activo: true
      }
    });

    if (estudiantes.length !== estudiantesSeleccionados.length) {
      return NextResponse.json(
        { error: 'Uno o más estudiantes no existen o no pertenecen al curso seleccionado' },
        { status: 400 }
      );
    }

    // Convertir la fecha a DateTime
    const fechaDateTime = new Date(fecha);

    // Crear el recordatorio y sus relaciones con estudiantes en una transacción
    const recordatorio = await prisma.$transaction(async (tx) => {
      // Crear el recordatorio
      const nuevoRecordatorio = await tx.recordatorios.create({
        data: {
          nombre: nombre.trim(),
          descripcion: descripcion.trim(),
          fecha: fechaDateTime,
          tipo: tipo,
          docente_id: parseInt(docenteId),
          grado_id: parseInt(gradoId),
          curso_id: parseInt(cursoId),
          area_id: parseInt(areaId),
          materia_id: parseInt(materiaId)
        }
      });

      // Crear las relaciones con estudiantes
      await tx.recordatorioEstudiantes.createMany({
        data: estudiantesSeleccionados.map((estudianteId: number) => ({
          recordatorio_id: nuevoRecordatorio.id,
          estudiante_id: parseInt(estudianteId.toString())
        }))
      });

      return nuevoRecordatorio;
    });

    return NextResponse.json({
      success: true,
      recordatorio: {
        id: recordatorio.id,
        nombre: recordatorio.nombre,
        descripcion: recordatorio.descripcion,
        fecha: recordatorio.fecha,
        tipo: recordatorio.tipo
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creando recordatorio:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

