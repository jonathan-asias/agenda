import { NextRequest, NextResponse } from 'next/server';
import { withSystemDb } from '@/lib/db/with-tenant-request';
import {
  platformAdminErrorToResponse,
  requirePlatformAdmin,
} from '@/lib/security/platform-admin';

export async function GET(request: NextRequest) {
  try {
    await requirePlatformAdmin(request);

    const { searchParams } = request.nextUrl;
    const q = searchParams.get('q')?.trim().toLowerCase() ?? '';

    const instituciones = await withSystemDb(async (tx) => {
      const rows = await tx.instituciones.findMany({
        orderBy: { created_at: 'desc' },
        include: {
          plan: { select: { id: true, nombre: true } },
          suscripcion: { select: { id: true, estado: true, fecha_fin: true } },
          _count: {
            select: {
              administradores: true,
              docentes: true,
              estudiantes: true,
              sedes: true,
            },
          },
        },
      });

      if (!q) return rows;

      return rows.filter(
        (row) =>
          row.nombre.toLowerCase().includes(q) ||
          row.email.toLowerCase().includes(q) ||
          row.nit.toLowerCase().includes(q)
      );
    });

    return NextResponse.json({
      instituciones: instituciones.map((inst) => ({
        id: inst.id,
        nombre: inst.nombre,
        email: inst.email,
        nit: inst.nit,
        direccion_principal: inst.direccion_principal,
        nombre_contacto: inst.nombre_contacto,
        telefono_contacto: inst.telefono_contacto,
        push_enabled: inst.push_enabled,
        created_at: inst.created_at.toISOString(),
        plan: inst.plan,
        suscripcion: inst.suscripcion
          ? {
              id: inst.suscripcion.id,
              estado: inst.suscripcion.estado,
              fecha_fin: inst.suscripcion.fecha_fin?.toISOString() ?? null,
            }
          : null,
        counts: inst._count,
      })),
    });
  } catch (error) {
    const resp = platformAdminErrorToResponse(error);
    if (resp) return resp;
    console.error('Error listando instituciones:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
