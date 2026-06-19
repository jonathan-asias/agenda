import { NextRequest, NextResponse } from 'next/server';
import { withSystemDb } from '@/lib/db/with-tenant-request';
import {
  platformAdminErrorToResponse,
  requirePlatformAdmin,
} from '@/lib/security/platform-admin';

export async function GET(request: NextRequest) {
  try {
    await requirePlatformAdmin(request);

    const stats = await withSystemDb(async (tx) => {
      const [
        instituciones,
        administradores,
        docentes,
        estudiantes,
        suscripcionesActivas,
        pagosAprobados,
      ] = await Promise.all([
        tx.instituciones.count(),
        tx.administradores.count(),
        tx.docentes.count(),
        tx.estudiantes.count(),
        tx.suscripcion.count({ where: { estado: 'ACTIVA' } }),
        tx.pago.count({ where: { estado: 'APPROVED' } }),
      ]);

      return {
        instituciones,
        administradores,
        docentes,
        estudiantes,
        suscripcionesActivas,
        pagosAprobados,
      };
    });

    return NextResponse.json(stats);
  } catch (error) {
    const resp = platformAdminErrorToResponse(error);
    if (resp) return resp;
    console.error('Error stats gestión:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
