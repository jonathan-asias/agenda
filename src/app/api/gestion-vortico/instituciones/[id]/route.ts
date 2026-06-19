import { NextRequest, NextResponse } from 'next/server';
import { withSystemDb } from '@/lib/db/with-tenant-request';
import { sanitizeInstitucionResponse } from '@/lib/security/sanitize-response';
import {
  platformAdminErrorToResponse,
  requirePlatformAdmin,
} from '@/lib/security/platform-admin';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePlatformAdmin(request);
    const { id } = await params;
    const institucionId = Number.parseInt(id, 10);
    if (Number.isNaN(institucionId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const data = await withSystemDb(async (tx) => {
      const institucion = await tx.instituciones.findUnique({
        where: { id: institucionId },
        include: {
          plan: true,
          suscripcion: { include: { plan: true } },
          sedes: true,
          administradores: true,
          docentes: {
            select: {
              id: true,
              nombres: true,
              apellidos: true,
              email: true,
              telefono: true,
              activo: true,
              sede_id: true,
              auth_user_id: true,
              created_at: true,
            },
          },
          _count: {
            select: {
              estudiantes: true,
              grados: true,
              cursos: true,
              areas: true,
              materias: true,
              acudientes: true,
            },
          },
        },
      });

      if (!institucion) return null;

      const pagos = await tx.pago.findMany({
        where: { email: institucion.email.toLowerCase() },
        orderBy: { created_at: 'desc' },
        take: 10,
        select: {
          id: true,
          referencia: true,
          monto: true,
          estado: true,
          procesado: true,
          created_at: true,
          plan: { select: { nombre: true } },
        },
      });

      return { institucion, pagos };
    });

    if (!data) {
      return NextResponse.json({ error: 'Institución no encontrada' }, { status: 404 });
    }

    return NextResponse.json({
      institucion: sanitizeInstitucionResponse(data.institucion),
      pagos: data.pagos.map((p) => ({
        ...p,
        created_at: p.created_at.toISOString(),
      })),
      counts: data.institucion._count,
    });
  } catch (error) {
    const resp = platformAdminErrorToResponse(error);
    if (resp) return resp;
    console.error('Error detalle institución:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
