'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatCop } from '@/lib/plan-details';
import {
  billingCycleQueryParam,
  getPlanPriceDisplay,
  type BillingCycle,
} from '@/lib/plan-billing';
import BillingCycleToggle from '@/components/billing/BillingCycleToggle';

interface PlanFromApi {
  id: number;
  nombre: string;
  precio: number;
  push: boolean;
  whatsapp: boolean;
  email: boolean;
}

const basicFeatures = [
  'Recordatorios por Email',
  'Gestión académica completa',
  'Panel administrativo',
  'Soporte estándar',
];

const plusFeatures = [
  'Todo lo del Básico',
  'Recordatorios por WhatsApp',
  'Notificaciones push',
  'Prioridad en soporte',
];

function PlanPriceBlock({
  monthlyPrice,
  cycle,
  variant,
}: {
  monthlyPrice: number;
  cycle: BillingCycle;
  variant: 'light' | 'dark';
}) {
  const display = getPlanPriceDisplay(monthlyPrice, cycle);
  const isDark = variant === 'dark';

  return (
    <div className="mt-4">
      <div className="flex items-baseline gap-1">
        <span className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {formatCop(display.amount)}
        </span>
        <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>
          COP {display.periodSuffix}
        </span>
      </div>
      {display.monthlyEquivalent != null && display.annualSavings != null && (
        <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Equivale a {formatCop(display.monthlyEquivalent)}/mes · Ahorra{' '}
          {formatCop(display.annualSavings)} (5%)
        </p>
      )}
    </div>
  );
}

export default function PricingSection() {
  const [planes, setPlanes] = useState<PlanFromApi[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/planes');
        const data = await res.json();
        if (!cancelled && res.ok && Array.isArray(data.planes)) {
          setPlanes(data.planes);
        }
      } catch {
        if (!cancelled) setPlanes([]);
      } finally {
        if (!cancelled) setLoadingPlans(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const planBasico = planes.find((p) => p.nombre === 'Plan Básico');
  const planPlus = planes.find((p) => p.nombre === 'Plan Plus');
  const cicloParam = billingCycleQueryParam(billingCycle);

  return (
    <section
      id="pricing"
      className="border-t border-slate-200 bg-white px-4 py-16 sm:px-6 sm:py-24"
      aria-labelledby="pricing-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2
            id="pricing-heading"
            className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
          >
            Planes para tu institución
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Elige el plan que mejor se adapte. Pago seguro con Mercado Pago.
            {billingCycle === 'annual'
              ? ' Facturación anual con 5% de descuento.'
              : ' Facturación mensual.'}
          </p>
          <BillingCycleToggle
            cycle={billingCycle}
            onChange={setBillingCycle}
            className="mt-8 justify-center"
          />
        </div>

        {loadingPlans ? (
          <p className="mt-16 text-center text-slate-500">Cargando planes...</p>
        ) : (
          <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-10 lg:max-w-4xl lg:mx-auto">
            {planBasico && (
              <div className="rounded-2xl border-2 border-slate-200 bg-white p-8 shadow-lg transition-all duration-300 hover:border-slate-300 hover:shadow-xl">
                <h3 className="text-xl font-bold text-slate-900">{planBasico.nombre}</h3>
                <PlanPriceBlock
                  monthlyPrice={planBasico.precio}
                  cycle={billingCycle}
                  variant="light"
                />
                <ul className="mt-8 space-y-4">
                  {basicFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-slate-700">
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-emerald-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/contratar-plan/${planBasico.id}?ciclo=${cicloParam}`}
                  className="mt-8 block w-full rounded-xl border-2 border-slate-900 bg-slate-900 px-6 py-4 text-center font-semibold text-white transition-all duration-200 hover:bg-slate-800"
                >
                  Elegir Plan Básico
                </Link>
              </div>
            )}

            {planPlus && (
              <div className="relative rounded-2xl border-2 border-slate-900 bg-slate-900 p-8 text-white shadow-xl transition-all duration-300 hover:shadow-2xl">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-4 py-1 text-sm font-bold text-slate-900">
                  Más popular
                </div>
                <h3 className="text-xl font-bold">{planPlus.nombre}</h3>
                <PlanPriceBlock
                  monthlyPrice={planPlus.precio}
                  cycle={billingCycle}
                  variant="dark"
                />
                <ul className="mt-8 space-y-4">
                  {plusFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-slate-200">
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-emerald-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/contratar-plan/${planPlus.id}?ciclo=${cicloParam}`}
                  className="mt-8 block w-full rounded-xl border-2 border-white bg-white px-6 py-4 text-center font-semibold text-slate-900 transition-all duration-200 hover:bg-slate-100"
                >
                  Elegir Plan Plus
                </Link>
              </div>
            )}

            {!planBasico && !planPlus && (
              <p className="lg:col-span-2 text-center text-slate-500">
                Los planes no están disponibles en este momento. Contacte al administrador.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
