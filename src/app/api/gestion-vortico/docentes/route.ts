import { NextRequest, NextResponse } from 'next/server';
import { withSystemDb } from '@/lib/db/with-tenant-request';
import {
  platformAdminErrorToResponse,
  requirePlatformAdmin,
} from '@/lib/security/platform-admin';

export async function GET(request: NextRequest) {
  try {
    await requirePlatformAdmin(request);
    const q = request.nextUrl.searchParams.get('q')?.trim().toLowerCase() ?? '';

    const docentes = await withSystemDb(async (tx) => {
      const rows = await tx.docentes.findMany({
        orderBy: { created_at: 'desc' },
        include: {
          institucion: { select: { id: true, nombre: true } },
          sede: { select: { id: true, nombre: true } },
          _count: { select: { recordatorios: true, docenteAsignaciones: true } },
        },
      });

      if (!q) return rows;

      return rows.filter(
        (d) =>
          d.email.toLowerCase().includes(q) ||
          d.nombres.toLowerCase().includes(q) ||
          d.apellidos.toLowerCase().includes(q) ||
          d.institucion.nombre.toLowerCase().includes(q)
      );
    });

    return NextResponse.json({
      docentes: docentes.map((d) => ({
        id: d.id,
        nombres: d.nombres,
        apellidos: d.apellidos,
        email: d.email,
        telefono: d.telefono,
        activo: d.activo,
        auth_user_id: d.auth_user_id,
        institucion: d.institucion,
        sede: d.sede,
        counts: d._count,
        created_at: d.created_at.toISOString(),
      })),
    });
  } catch (error) {
    const resp = platformAdminErrorToResponse(error);
    if (resp) return resp;
    console.error('Error listando docentes:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
