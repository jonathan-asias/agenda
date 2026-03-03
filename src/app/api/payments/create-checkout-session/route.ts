import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/payments/create-checkout-session
 *
 * Prepara la creación de una sesión de checkout para suscripción SaaS.
 * Body: { plan: "basic" | "plus", institucionId: number }
 *
 * INTEGRACIÓN WOMPI (futura):
 * - Instalar SDK: npm i @wompi/sdk o usar API REST de Wompi.
 * - Crear transacción/referencia con el plan seleccionado y institucionId.
 * - Persistir en tabla suscripciones (ver comentarios de escalabilidad abajo).
 * - Devolver { redirectUrl: urlCheckoutWompi } para redirigir al usuario.
 *
 * Escalabilidad - Estructura de datos futura (NO implementada aún):
 * - Tabla: suscripciones (id, institucion_id, plan_actual, estado_suscripcion, fecha_expiracion, referencia_wompi, ...)
 * - Instituciones: agregar campo plan_actual (enum: 'basic' | 'plus' | null)
 * - Campos sugeridos: estado_suscripcion ('activa' | 'cancelada' | 'vencida' | 'trial'), fecha_expiracion (DateTime)
 * - Al confirmar pago en Wompi (webhook), actualizar suscripciones e institucion.plan_actual.
 */

export type CheckoutPlan = 'basic' | 'plus';

export interface CreateCheckoutSessionBody {
  plan: CheckoutPlan;
  institucionId: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateCheckoutSessionBody;
    const { plan, institucionId } = body;

    if (!plan || (plan !== 'basic' && plan !== 'plus')) {
      return NextResponse.json(
        { error: 'plan es requerido y debe ser "basic" o "plus"' },
        { status: 400 }
      );
    }

    if (typeof institucionId !== 'number') {
      return NextResponse.json(
        { error: 'institucionId debe ser un número' },
        { status: 400 }
      );
    }

    // TODO: Integración Wompi. Ejemplo conceptual:
    // const wompi = new WompiClient(process.env.WOMPI_PRIVATE_KEY);
    // const checkout = await wompi.createCheckout({ plan, institucionId, ... });
    // return NextResponse.json({ redirectUrl: checkout.url });

    // Mientras no haya Wompi: redirigir a registro con plan en query (institucionId 0 = landing)
    const origin = request.nextUrl.origin;
    const path =
      institucionId === 0
        ? `/registro-institucion?plan=${plan}`
        : `/institucion/${institucionId}/configuracion?plan=${plan}`;
    const redirectUrl = `${origin}${path}`;

    return NextResponse.json({ redirectUrl });
  } catch (error) {
    console.error('Error en create-checkout-session:', error);
    return NextResponse.json(
      { error: 'Error al crear sesión de pago' },
      { status: 500 }
    );
  }
}
