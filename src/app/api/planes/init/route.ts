import { NextRequest, NextResponse } from 'next/server';
import { withDbBypass } from '@/lib/db/rls-context';
import { PLAN_SEED_DATA } from '@/lib/planes';

/**
 * POST /api/planes/init
 * Crea planes base si no existen. Protegido por PLANS_INIT_SECRET o primer arranque sin planes.
 */
export async function POST(request: NextRequest) {
  const initSecret = process.env.PLANS_INIT_SECRET?.trim();
  const headerSecret = request.headers.get('x-plans-init-secret');

  const created = await withDbBypass(async (tx) => {
    const existingCount = await tx.plan.count();
    if (existingCount > 0) {
      const allowed =
        initSecret && headerSecret && headerSecret === initSecret;
      if (!allowed) {
        return { forbidden: true as const, created: 0 };
      }
    }

    let createdCount = 0;
    let updatedCount = 0;
    for (const plan of PLAN_SEED_DATA) {
      const exists = await tx.plan.findUnique({
        where: { nombre: plan.nombre },
      });
      if (!exists) {
        await tx.plan.create({ data: plan });
        createdCount += 1;
      } else if (initSecret && headerSecret && headerSecret === initSecret) {
        await tx.plan.update({
          where: { nombre: plan.nombre },
          data: {
            precio: plan.precio,
            push: plan.push,
            whatsapp: plan.whatsapp,
            email: plan.email,
            activo: plan.activo,
          },
        });
        updatedCount += 1;
      }
    }
    return { forbidden: false as const, created: createdCount, updated: updatedCount };
  });

  if (created.forbidden) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  return NextResponse.json({
    message: 'Planes inicializados',
    created: created.created,
    updated: created.updated,
  });
}
