'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PhoneInputField, { isPhoneValid } from '@/components/ui/PhoneInputField';
import BillingCycleToggle from '@/components/billing/BillingCycleToggle';
import {
  formatCop,
  getPlanMarketingDetail,
} from '@/lib/plan-details';
import {
  billingCycleQueryParam,
  getPlanChargeAmount,
  getPlanPriceDisplay,
  parseBillingCycle,
  type BillingCycle,
} from '@/lib/plan-billing';
import type { PreRegistroInstitucion } from '@/types/pre-registro-institucion';

interface PlanFromDb {
  id: number;
  nombre: string;
  precio: number;
  push: boolean;
  whatsapp: boolean;
  email: boolean;
}

interface TestCardHint {
  number: string;
  cvv: string;
  expiry: string;
  cardholder: string;
  document: string;
  note: string;
  alternativeCards?: Array<{ label: string; number: string }>;
  browserSteps?: string[];
}

interface WompiTestCardHint {
  cardApproved: string;
  cardDeclined: string;
  expiry: string;
  cvv: string;
  nequiApproved: string;
  note: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidNIT(nit: string): boolean {
  return /^\d{9}$/.test(nit);
}

const formInputClassName =
  'w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';

export default function ContratarPlanForm({ plan }: { plan: PlanFromDb }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(() =>
    parseBillingCycle(searchParams.get('ciclo'))
  );
  const [wompiMinAmountCop, setWompiMinAmountCop] = useState(1500);

  const priceDisplay = getPlanPriceDisplay(plan.precio, billingCycle);
  const chargeAmount = getPlanChargeAmount(plan.precio, billingCycle);
  const wompiChargeAllowed = chargeAmount >= wompiMinAmountCop;

  const handleBillingChange = useCallback(
    (cycle: BillingCycle) => {
      setBillingCycle(cycle);
      const params = new URLSearchParams(searchParams.toString());
      params.set('ciclo', billingCycleQueryParam(cycle));
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const detail = getPlanMarketingDetail(plan);
  const isPlus = plan.nombre.toLowerCase().includes('plus');

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [nit, setNit] = useState('');
  const [nombreContacto, setNombreContacto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [error, setError] = useState('');
  const [loadingProvider, setLoadingProvider] = useState<'mercadopago' | 'wompi' | null>(null);
  const [testCardHint, setTestCardHint] = useState<TestCardHint | null>(null);
  const [devMockCheckout, setDevMockCheckout] = useState(false);
  const [mercadoPagoConfigured, setMercadoPagoConfigured] = useState(false);
  const [wompiConfigured, setWompiConfigured] = useState(false);
  const [wompiTestCardHint, setWompiTestCardHint] = useState<WompiTestCardHint | null>(null);
  const [wompiMissing, setWompiMissing] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/payments/config');
        const data = await res.json();
        if (!cancelled && res.ok) {
          if (data.testCardHint) setTestCardHint(data.testCardHint as TestCardHint);
          setDevMockCheckout(Boolean(data.devMockCheckout));
          setMercadoPagoConfigured(Boolean(data.mercadoPagoConfigured ?? data.configured));
          setWompiConfigured(Boolean(data.wompiConfigured));
          if (data.wompiTestCardHint) {
            setWompiTestCardHint(data.wompiTestCardHint as WompiTestCardHint);
          }
          if (Array.isArray(data.wompiMissing)) {
            setWompiMissing(data.wompiMissing);
          }
          if (typeof data.wompiMinAmountCop === 'number') {
            setWompiMinAmountCop(data.wompiMinAmountCop);
          }
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const validateForm = (): PreRegistroInstitucion | null => {
    setError('');

    const trimmedNombre = nombre.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedDireccion = direccion.trim();
    const trimmedNit = nit.trim();
    const trimmedContacto = nombreContacto.trim();
    const trimmedTelefono = telefono.trim();

    if (!trimmedNombre) {
      setError('Ingrese el nombre de la institución.');
      return null;
    }
    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      setError('Ingrese un correo electrónico válido.');
      return null;
    }
    if (!trimmedDireccion) {
      setError('Ingrese la dirección principal.');
      return null;
    }
    if (!isValidNIT(trimmedNit)) {
      setError('El NIT debe tener exactamente 9 dígitos (sin dígito de verificación).');
      return null;
    }
    if (!trimmedContacto) {
      setError('Ingrese el nombre de contacto.');
      return null;
    }
    if (!trimmedTelefono || !isPhoneValid(trimmedTelefono)) {
      setError('Ingrese un teléfono válido con indicativo de país.');
      return null;
    }

    return {
      nombre: trimmedNombre,
      email: trimmedEmail,
      direccion_principal: trimmedDireccion,
      nit: trimmedNit,
      nombre_contacto: trimmedContacto,
      telefono_contacto: trimmedTelefono,
    };
  };

  const handlePayment = async (provider: 'mercadopago' | 'wompi') => {
    const preRegistro = validateForm();
    if (!preRegistro) return;

    if (provider === 'mercadopago' && !mercadoPagoConfigured && !devMockCheckout) {
      setError('Mercado Pago no está configurado.');
      return;
    }
    if (provider === 'wompi' && !wompiConfigured) {
      setError('Wompi no está configurado.');
      return;
    }
    if (provider === 'wompi' && !wompiChargeAllowed) {
      setError(
        `Wompi exige un monto mínimo de ${formatCop(wompiMinAmountCop)} COP. Elija otro plan o use Mercado Pago.`
      );
      return;
    }

    setLoadingProvider(provider);

    try {
      const checkRes = await fetch(
        `/api/payments/check-email?email=${encodeURIComponent(preRegistro.email)}`
      );
      const checkData = await checkRes.json();
      if (checkRes.ok && !checkData.available) {
        setError(
          checkData.message ??
            'Ya existe una cuenta registrada con este correo. Inicie sesión o use otro correo.'
        );
        setLoadingProvider(null);
        return;
      }

      const checkoutEndpoint =
        provider === 'wompi'
          ? '/api/wompi/create-transaction'
          : devMockCheckout
            ? '/api/payments/dev-mock-checkout'
            : '/api/payments/create-preference';

      const res = await fetch(checkoutEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: preRegistro.email,
          planId: plan.id,
          nombre: preRegistro.nombre_contacto,
          preRegistro,
          ciclo: billingCycle === 'annual' ? 'anual' : 'mensual',
          returnOrigin: window.location.origin,
        }),
      });

      const data = await res.json();
      if (res.ok && data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }
      if (res.ok && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      setError(
        data?.error ??
          (res.status === 409
            ? 'Ya existe una cuenta registrada con este correo.'
            : 'Error al iniciar el pago')
      );
    } catch {
      setError('Error de conexión. Intente de nuevo.');
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        href="/#pricing"
        className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 mb-8"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver a planes
      </Link>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 lg:items-start">
        {/* Panel izquierdo — detalle del plan */}
        <div
          className={`rounded-2xl p-8 lg:sticky lg:top-8 ${
            isPlus
              ? 'bg-slate-900 text-white shadow-xl'
              : 'border-2 border-slate-200 bg-white shadow-lg'
          }`}
        >
          {isPlus && (
            <span className="inline-block rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-slate-900 mb-4">
              Más popular
            </span>
          )}
          <h1 className={`text-2xl font-bold ${isPlus ? 'text-white' : 'text-slate-900'}`}>
            {plan.nombre}
          </h1>
          <p className={`mt-2 text-sm ${isPlus ? 'text-slate-300' : 'text-slate-600'}`}>
            {detail.tagline}
          </p>
          <div className="mt-6 flex items-baseline gap-2">
            <span className={`text-4xl font-bold ${isPlus ? 'text-white' : 'text-slate-900'}`}>
              {formatCop(priceDisplay.amount)}
            </span>
            <span className={isPlus ? 'text-slate-400' : 'text-slate-600'}>
              COP {priceDisplay.periodSuffix}
            </span>
          </div>
          {priceDisplay.monthlyEquivalent != null && priceDisplay.annualSavings != null && (
            <p className={`mt-2 text-sm ${isPlus ? 'text-slate-400' : 'text-slate-600'}`}>
              Equivale a {formatCop(priceDisplay.monthlyEquivalent)}/mes · Ahorra{' '}
              {formatCop(priceDisplay.annualSavings)} (5%)
            </p>
          )}
          <p className={`mt-6 text-sm leading-relaxed ${isPlus ? 'text-slate-300' : 'text-slate-700'}`}>
            {detail.description}
          </p>

          <div className="mt-8 space-y-6">
            {detail.sections.map((section) => (
              <div key={section.title}>
                <h2
                  className={`text-sm font-semibold uppercase tracking-wide ${
                    isPlus ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {section.title}
                </h2>
                <ul className="mt-3 space-y-2">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className={`flex items-start gap-2 text-sm ${
                        isPlus ? 'text-slate-200' : 'text-slate-700'
                      }`}
                    >
                      <svg
                        className={`mt-0.5 h-4 w-4 flex-shrink-0 ${isPlus ? 'text-emerald-400' : 'text-emerald-500'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className={`mt-8 rounded-xl p-4 ${isPlus ? 'bg-slate-800' : 'bg-slate-50'}`}>
            <h2 className={`text-sm font-semibold ${isPlus ? 'text-white' : 'text-slate-900'}`}>
              Ideal para
            </h2>
            <ul className={`mt-2 space-y-1 text-sm ${isPlus ? 'text-slate-300' : 'text-slate-600'}`}>
              {detail.idealFor.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Panel derecho — formulario */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Total a pagar
            </p>
            <p className="mt-1 text-sm font-medium text-slate-900">{plan.nombre}</p>
            <BillingCycleToggle
              cycle={billingCycle}
              onChange={handleBillingChange}
              className="mt-4"
            />
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">
                {formatCop(priceDisplay.amount)}
              </span>
              <span className="text-slate-600">COP {priceDisplay.periodSuffix}</span>
            </div>
            {priceDisplay.monthlyEquivalent != null && priceDisplay.annualSavings != null && (
              <p className="mt-2 text-sm text-slate-600">
                Equivale a {formatCop(priceDisplay.monthlyEquivalent)}/mes · Ahorra{' '}
                {formatCop(priceDisplay.annualSavings)} (5%)
              </p>
            )}
          </div>

          <h2 className="mt-6 text-xl font-bold text-slate-900">Datos de su institución</h2>
          <p className="mt-2 text-sm text-slate-600">
            Complete la información básica. Tras el pago, recibirá un correo con un enlace para
            continuar el registro con estos datos precargados.
          </p>

          {devMockCheckout && (
            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900">
              <p className="font-semibold mb-1">Modo desarrollo — pago simulado</p>
              <p>
                No se abrirá Mercado Pago. El pago se aprueba en local y continuará a la página de
                confirmación.
              </p>
            </div>
          )}

          {testCardHint && !devMockCheckout && (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
              <p className="font-semibold mb-1">Modo prueba Colombia — datos en Mercado Pago:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Número: {testCardHint.number}</li>
                <li>
                  CVV: {testCardHint.cvv} · Vence: {testCardHint.expiry}
                </li>
                <li>
                  <strong>Titular: {testCardHint.cardholder}</strong>
                </li>
                <li>Documento: {testCardHint.document}</li>
              </ul>
              {testCardHint.note && <p className="mt-2 text-amber-800">{testCardHint.note}</p>}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="inst-nombre" className="block text-sm font-medium text-slate-700 mb-1">
                Nombre de la institución *
              </label>
              <input
                id="inst-nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Colegio San José"
                className={formInputClassName}
                autoComplete="organization"
                required
                maxLength={200}
              />
            </div>

            <div>
              <label htmlFor="inst-email" className="block text-sm font-medium text-slate-700 mb-1">
                Correo electrónico *
              </label>
              <input
                id="inst-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@institucion.edu.co"
                className={formInputClassName}
                autoComplete="email"
                required
                maxLength={254}
              />
              <p className="mt-1 text-xs text-slate-500">
                Será el correo del superadministrador y debe coincidir con el del registro final.
              </p>
            </div>

            <div>
              <label htmlFor="inst-direccion" className="block text-sm font-medium text-slate-700 mb-1">
                Dirección principal *
              </label>
              <input
                id="inst-direccion"
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Calle, barrio, ciudad"
                className={formInputClassName}
                autoComplete="street-address"
                required
                maxLength={500}
              />
            </div>

            <div>
              <label htmlFor="inst-nit" className="block text-sm font-medium text-slate-700 mb-1">
                NIT * (9 dígitos)
              </label>
              <p className="text-xs text-slate-500 mb-1">Sin dígito de verificación.</p>
              <input
                id="inst-nit"
                type="text"
                value={nit}
                onChange={(e) => setNit(e.target.value.replace(/\D/g, '').slice(0, 9))}
                placeholder="900123456"
                className={formInputClassName}
                inputMode="numeric"
                required
                minLength={9}
                maxLength={9}
              />
            </div>

            <div>
              <label htmlFor="inst-contacto" className="block text-sm font-medium text-slate-700 mb-1">
                Nombre de contacto *
              </label>
              <input
                id="inst-contacto"
                type="text"
                value={nombreContacto}
                onChange={(e) => setNombreContacto(e.target.value)}
                placeholder="Nombre del responsable"
                className={formInputClassName}
                autoComplete="name"
                required
                maxLength={150}
              />
            </div>

            <div>
              <label htmlFor="inst-telefono" className="block text-sm font-medium text-slate-700 mb-1">
                Teléfono de contacto *
              </label>
              <PhoneInputField
                id="inst-telefono"
                value={telefono}
                onChange={setTelefono}
                showValidState
                numberInputClassName="placeholder:!text-slate-500"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => handlePayment('mercadopago')}
                disabled={loadingProvider !== null || (!mercadoPagoConfigured && !devMockCheckout)}
                className="w-full rounded-xl bg-[#009ee3] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#0088c7] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loadingProvider === 'mercadopago'
                  ? 'Procesando...'
                  : `Continuar con Mercado Pago — ${formatCop(chargeAmount)}${priceDisplay.periodSuffix}`}
              </button>

              <button
                type="button"
                onClick={() => handlePayment('wompi')}
                disabled={loadingProvider !== null || !wompiConfigured || !wompiChargeAllowed}
                className="w-full rounded-xl border-2 border-slate-900 bg-white px-6 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loadingProvider === 'wompi'
                  ? 'Procesando...'
                  : `Continuar con Wompi — ${formatCop(chargeAmount)}${priceDisplay.periodSuffix}`}
              </button>
            </div>

            {wompiConfigured && !wompiChargeAllowed && (
              <p className="text-center text-xs text-amber-700">
                Wompi no acepta pagos menores a {formatCop(wompiMinAmountCop)} COP. Use Mercado Pago,
                el Plan Plus o facturación anual.
              </p>
            )}

            {wompiConfigured && typeof window !== 'undefined' && !window.location.hostname.includes('localhost') && (
              <p className="text-center text-xs text-amber-700">
                Para evitar error 403 con Wompi en desarrollo, abra esta página en{' '}
                <strong>http://localhost:3000</strong>.
              </p>
            )}

            {wompiTestCardHint && wompiConfigured && (
              <div className="rounded-lg border border-violet-200 bg-violet-50 p-3 text-xs text-violet-900">
                <p className="font-semibold mb-1">Modo prueba Wompi — tarjeta aprobada:</p>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li>Número: {wompiTestCardHint.cardApproved}</li>
                  <li>
                    {wompiTestCardHint.expiry} · CVV: {wompiTestCardHint.cvv}
                  </li>
                  <li>Nequi aprobado: {wompiTestCardHint.nequiApproved}</li>
                </ul>
                <p className="mt-2 text-violet-800">{wompiTestCardHint.note}</p>
              </div>
            )}

            {!wompiConfigured && (
              <p className="text-center text-xs text-amber-700">
                Wompi no está listo.
                {wompiMissing.length > 0
                  ? ` Falta: ${wompiMissing.join(', ')}.`
                  : ' Revise .env.local y reinicie el servidor.'}
              </p>
            )}

            <p className="text-center text-xs text-slate-500">
              Pago seguro.
              {billingCycle === 'annual'
                ? ' Facturación anual con 5% de descuento.'
                : ' Facturación mensual.'}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
