import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendReminderEmailNotification } from '@/lib/notifications/reminder';
import {
  getAuthInstitutionId,
  enforceTenant,
  tenantErrorToResponse
} from '@/lib/tenant';

export async function POST(request: NextRequest) {
  try {
    const userInstitutionId = await getAuthInstitutionId(request);
    if (userInstitutionId == null) {
      return NextResponse.json({ error: 'Se requiere autenticación' }, { status: 401 });
    }

    const body = await request.json();
    const {
      nombre,
      descripcion,
      fecha,
      tipo,
      modoEnvio,
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

    // Validar que el docente existe y traer institución para notificaciones
    const docente = await prisma.docentes.findUnique({
      where: { id: parseInt(docenteId) },
      include: { institucion: true }
    });

    if (!docente) {
      return NextResponse.json(
        { error: 'Docente no encontrado' },
        { status: 404 }
      );
    }

    enforceTenant(userInstitutionId, docente.institucion_id);

    // Validar que los estudiantes existen y pertenecen al curso y a la institución
    const estudiantes = await prisma.estudiantes.findMany({
      where: {
        id: { in: estudiantesSeleccionados.map((id: number) => parseInt(id.toString())) },
        curso_id: parseInt(cursoId),
        institucion_id: userInstitutionId,
        activo: true
      }
    });

    if (estudiantes.length !== estudiantesSeleccionados.length) {
      return NextResponse.json(
        { error: 'Uno o más estudiantes no existen o no pertenecen al curso seleccionado' },
        { status: 400 }
      );
    }

    // Modo de envío: array a string comma-separated (ej. ["sms","email"] -> "sms,email")
    const modoEnviosValidos = ['sms', 'whatsapp', 'email'];
    let modoEnvioStr: string | null = null;
    if (Array.isArray(modoEnvio) && modoEnvio.length > 0) {
      const filtrados = modoEnvio.filter((m: string) => modoEnviosValidos.includes(String(m).toLowerCase()));
      if (filtrados.length > 0) {
        modoEnvioStr = filtrados.map((m: string) => String(m).toLowerCase()).join(',');
      }
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
          modo_envio: modoEnvioStr,
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

    // Notificación por email solo si el docente eligió "email" en modo de envío
    const enviarPorEmail = Array.isArray(modoEnvio) && modoEnvio.some(
      (m: string) => String(m).toLowerCase() === 'email'
    );
    if (enviarPorEmail) {
      const emailsDestino = [
        ...new Set(
          estudiantes
            .map((e) => e.correo_acudiente)
            .filter((email): email is string => Boolean(email?.trim()))
        )
      ];
      if (emailsDestino.length > 0) {
        const docenteNombre = `${docente.nombres} ${docente.apellidos}`.trim();
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl?.origin ?? '';
        const primerEstudianteId = estudiantes[0]?.id;
        sendReminderEmailNotification({
          institucionNombre: docente.institucion.nombre,
          docenteNombre,
          titulo: nombre.trim(),
          descripcion: descripcion.trim(),
          fechaLimite: fechaDateTime,
          emails: emailsDestino,
          baseUrl: baseUrl || undefined,
          primerEstudianteId,
        }).catch(() => {});
      }
    }

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
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error creando recordatorio:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

