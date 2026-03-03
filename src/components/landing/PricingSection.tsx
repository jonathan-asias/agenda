'use client';

import { useState } from 'react';

type PlanSlug = 'basic' | 'plus';

const basicFeatures = [
  'Recordatorios por Email',
  'Gestión académica completa',
  'Panel administrativo',
  'Soporte estándar',
];

const plusFeatures = [
  'Todo lo del Básico',
  'Recordatorios por WhatsApp',
  'Prioridad en soporte',
  'Futuras notificaciones push',
];

export default function PricingSection() {
  const [loadingPlan, setLoadingPlan] = useState<PlanSlug | null>(null);

  const handleSelectPlan = async (plan: PlanSlug) => {
    setLoadingPlan(plan);
    try {
      // institucionId: 0 en landing (usuario aún no registrado). Tras login, se enviará el id real.
      const res = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, institucionId: 0 }),
      });
      const data = await res.json();
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }
      if (!res.ok) throw new Error(data.error || 'Error al crear sesión');
    } catch {
      setLoadingPlan(null);
      // Fallback: redirigir a registro con plan en query (sin Wompi)
      const params = new URLSearchParams({ plan });
      window.location.href = `/registro-institucion?${params.toString()}`;
    }
  };

  return (
    <section id="pricing" className="border-t border-slate-200 bg-white px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Planes para tu institución
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Elige el plan que mejor se adapte. Puedes cambiar o cancelar cuando lo necesites.
          </p>
        </div>
        <div className="mt-16 grid gap-8 lg:grid-cols-2 lg:gap-10 lg:max-w-4xl lg:mx-auto">
          {/* Plan Básico */}
          <div className="rounded-2xl border-2 border-slate-200 bg-white p-8 shadow-lg transition-all duration-300 hover:border-slate-300 hover:shadow-xl">
            <h3 className="text-xl font-bold text-slate-900">Plan Básico</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-slate-900">$39.900</span>
              <span className="text-slate-600">COP / mes</span>
            </div>
            <ul className="mt-8 space-y-4">
              {basicFeatures.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700">
                  <svg className="h-5 w-5 flex-shrink-0 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => handleSelectPlan('basic')}
              disabled={loadingPlan !== null}
              className="mt-8 w-full rounded-xl border-2 border-slate-900 bg-slate-900 px-6 py-4 font-semibold text-white transition-all duration-200 hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loadingPlan === 'basic' ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Procesando...
                </span>
              ) : (
                'Elegir Plan Básico'
              )}
            </button>
          </div>

          {/* Plan Plus - Destacado */}
          <div className="relative rounded-2xl border-2 border-slate-900 bg-slate-900 p-8 text-white shadow-xl transition-all duration-300 hover:shadow-2xl">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-4 py-1 text-sm font-bold text-slate-900">
              Más popular
            </div>
            <h3 className="text-xl font-bold">Plan Plus</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold">$79.900</span>
              <span className="text-slate-300">COP / mes</span>
            </div>
            <ul className="mt-8 space-y-4">
              {plusFeatures.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-200">
                  <svg className="h-5 w-5 flex-shrink-0 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => handleSelectPlan('plus')}
              disabled={loadingPlan !== null}
              className="mt-8 w-full rounded-xl border-2 border-white bg-white px-6 py-4 font-semibold text-slate-900 transition-all duration-200 hover:bg-slate-100 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loadingPlan === 'plus' ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Procesando...
                </span>
              ) : (
                'Elegir Plan Plus'
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
