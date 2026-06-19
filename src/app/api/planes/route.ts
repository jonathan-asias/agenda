import { NextResponse } from 'next/server';
import { withDbBypass } from '@/lib/db/rls-context';

/**
 * GET /api/planes
 * Lista planes activos para la landing (id, nombre, precio, features).
 */
export async function GET() {
  try {
    const planes = await withDbBypass(async (tx) =>
      tx.plan.findMany({
        where: { activo: true },
        orderBy: { precio: 'asc' },
        select: {
          id: true,
          nombre: true,
          precio: true,
          push: true,
          whatsapp: true,
          email: true,
        },
      })
    );

    return NextResponse.json({ planes });
  } catch (error) {
    console.error('Error listando planes:', error);
    return NextResponse.json({ error: 'Error al obtener planes' }, { status: 500 });
  }
}
