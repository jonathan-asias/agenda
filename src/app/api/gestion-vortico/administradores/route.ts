import { NextRequest, NextResponse } from 'next/server';
import { withSystemDb } from '@/lib/db/with-tenant-request';
import { omitPasswordFromList } from '@/lib/security/sanitize-response';
import {
  platformAdminErrorToResponse,
  requirePlatformAdmin,
} from '@/lib/security/platform-admin';

export async function GET(request: NextRequest) {
  try {
    await requirePlatformAdmin(request);
    const q = request.nextUrl.searchParams.get('q')?.trim().toLowerCase() ?? '';

    const administradores = await withSystemDb(async (tx) => {
      const rows = await tx.administradores.findMany({
        orderBy: { created_at: 'desc' },
        include: {
          institucion: { select: { id: true, nombre: true } },
          sede: { select: { id: true, nombre: true } },
        },
      });

      const filtered = q
        ? rows.filter(
            (a) =>
              a.correo.toLowerCase().includes(q) ||
              a.nombre.toLowerCase().includes(q) ||
              a.apellido.toLowerCase().includes(q) ||
              a.institucion.nombre.toLowerCase().includes(q)
          )
        : rows;

      return omitPasswordFromList(filtered);
    });

    return NextResponse.json({ administradores });
  } catch (error) {
    const resp = platformAdminErrorToResponse(error);
    if (resp) return resp;
    console.error('Error listando administradores:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
