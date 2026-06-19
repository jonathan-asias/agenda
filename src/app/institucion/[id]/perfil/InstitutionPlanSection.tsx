'use client';

import { useCallback, useEffect, useState } from 'react';
import { showConfirm, showError, showSuccess, showLoading, closeLoading } from '@/lib/notifications';
import { useSubscriptionAccess } from '@/contexts/SubscriptionAccessContext';
import { formatCop, getPlanMarketingDetail } from '@/lib/plan-details';
import {
  billingCycleQueryParam,
  getPlanChargeAmount,
  getPlanPriceDisplay,
  parseBillingCycle,
  type BillingCycle,
} from '@/lib/plan-billing';
import BillingCycleToggle from '@/components/billing/BillingCycleToggle';
import type { InstitutionPlanInfo } from '@/lib/subscription/get-institution-plan';

const ESTADO_LABELS: Record<string, string> = {
  ACTIVA: 'Activa',
  CANCELADA: 'Cancelada',
  USADA: 'Usada',
  VENCIDA: 'Vencida',
};

const ESTADO_STYLES: Record<string, string> = {
  ACTIVA: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  CANCELADA: 'bg-red-100 text-red-800 border-red-200',
  USADA: 'bg-slate-100 text-slate-700 border-slate-200',
  VENCIDA: 'bg-amber-100 text-amber-800 border-amber-200',
};

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function InstitutionPlanSection({ institucionId }: { institucionId: number }) {
  const [planInfo, setPlanInfo] = useState<InstitutionPlanInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [gracePeriodDays, setGracePeriodDays] = useState(7);
  const [paymentsConfig, setPaymentsConfig] = useState({
    mercadoPagoConfigured: false,
    wompiConfigured: false,
    wompiMinAmountCop: 1500,
  });
  const { refresh: refreshSubscriptionAccess } = useSubscriptionAccess();

  const fetchPlanInfo = useCallback(async () => {
    try {
      const res = await fetch(`/api/instituciones/${institucionId}/plan`);
      if (res.ok) {
        setPlanInfo(await res.json());
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [institucionId]);

  useEffect(() => {
    fetchPlanInfo();
    fetch('/api/payments/config')
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          setPaymentsConfig({
            mercadoPagoConfigured: Boolean(data.mercadoPagoConfigured),
            wompiConfigured: Boolean(data.wompiConfigured),
            wompiMinAmountCop: data.wompiMinAmountCop ?? 1500,
          });
        }
      })
      .catch(() => {});
    fetch(`/api/instituciones/${institucionId}/subscription-access`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.gracePeriodDays != null) {
          setGracePeriodDays(data.gracePeriodDays);
        }
      })
      .catch(() => {});
  }, [fetchPlanInfo, institucionId]);

  const handleCancel = async () => {
    const confirmed = await showConfirm({
      title: '¿Cancelar suscripción?',
      html: `
        <div class="text-left space-y-3">
          <p class="font-semibold text-red-700">Esta acción tiene consecuencias importantes:</p>
          <ul class="list-disc pl-5 text-sm space-y-1">
            <li>Su suscripción quedará <strong>cancelada</strong> de inmediato en Agenda Virtual.</li>
            <li>Se desactivará el enlace de pago en Wompi (si aplica).</li>
            <li>Tendrá <strong>${gracePeriodDays} días</strong> para ingresar en modo <strong>solo lectura</strong> (consultar, no crear ni editar).</li>
            <li>Después de ese periodo <strong>no podrá ingresar</strong> hasta renovar el plan o contactar soporte.</li>
          </ul>
          <p class="text-sm text-slate-600">¿Está seguro de que desea continuar?</p>
        </div>
      `,
      confirmButtonText: 'Sí, cancelar suscripción',
      cancelButtonText: 'No, mantener plan',
      confirmButtonColor: '#dc2626',
    });
    if (!confirmed) return;

    setActionLoading('cancel');
    showLoading(
      'Cancelando suscripción',
      'Estamos actualizando su plan y las pasarelas de pago. Por favor espere…'
    );
    try {
      const res = await fetch(`/api/instituciones/${institucionId}/plan/cancel`, {
        method: 'POST',
      });
      const data = await res.json();
      closeLoading();
      if (!res.ok) {
        await showError('No se pudo cancelar', data.error ?? 'Intente de nuevo.');
        return;
      }
      const until = data.graceUntil
        ? new Date(data.graceUntil).toLocaleDateString('es-CO', { dateStyle: 'long' })
        : '';
      await showSuccess(
        'Suscripción cancelada',
        `Podrá consultar su información hasta el ${until}. Después deberá renovar el plan o contactar soporte.`
      );
      await fetchPlanInfo();
      await refreshSubscriptionAccess();
    } catch {
      closeLoading();
      await showError('Error', 'No se pudo cancelar la suscripción.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleChangePlan = async (planId: number, gateway: 'mercadopago' | 'wompi') => {
    const targetPlan = planInfo?.availablePlans.find((p) => p.id === planId);
    if (!targetPlan) return;

    const chargeAmount = getPlanChargeAmount(targetPlan.precio, billingCycle);
    if (gateway === 'wompi' && chargeAmount < paymentsConfig.wompiMinAmountCop) {
      await showError(
        'Monto mínimo Wompi',
        `El total (${formatCop(chargeAmount)}) es menor al mínimo de Wompi (${formatCop(paymentsConfig.wompiMinAmountCop)}). Use Mercado Pago o facturación anual.`
      );
      return;
    }

    setActionLoading(`${gateway}-${planId}`);
    try {
      const res = await fetch(`/api/instituciones/${institucionId}/plan/change-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          gateway,
          ciclo: billingCycleQueryParam(billingCycle),
          returnOrigin: window.location.origin,
        }),
      });
      const data = await res.json();
      if (res.ok && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      await showError('No se pudo iniciar el pago', data.error ?? 'Intente de nuevo.');
    } catch {
      await showError('Error', 'No se pudo conectar con la pasarela de pago.');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
        <p className="text-sm text-slate-500">Cargando información del plan...</p>
      </div>
    );
  }

  if (!planInfo) {
    return null;
  }

  const { plan, suscripcion, availablePlans } = planInfo;
  const isActive = suscripcion?.estado === 'ACTIVA';
  const plansToOffer =
    !isActive || !plan ? availablePlans : availablePlans.filter((p) => p.id !== plan.id);
  const currentDetail = plan ? getPlanMarketingDetail(plan) : null;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-800">Plan y suscripción</h2>
        {suscripcion && (
          <span
            className={`inline-flex self-start items-center px-3 py-1 rounded-full text-xs font-semibold border ${
              ESTADO_STYLES[suscripcion.estado] ?? ESTADO_STYLES.USADA
            }`}
          >
            {ESTADO_LABELS[suscripcion.estado] ?? suscripcion.estado}
          </span>
        )}
      </div>

      {plan ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Plan actual</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{plan.nombre}</p>
              {currentDetail && (
                <p className="text-sm text-slate-600 mt-1">{currentDetail.tagline}</p>
              )}
              <p className="text-lg font-semibold text-blue-700 mt-3">
                {formatCop(plan.precio)}
                <span className="text-sm font-normal text-slate-500"> / mes</span>
              </p>
            </div>
            <div className="text-sm text-slate-600 space-y-1 min-w-[200px]">
              {suscripcion?.fecha_inicio && (
                <p>
                  <span className="font-medium text-slate-700">Fecha de compra:</span>{' '}
                  {formatDate(suscripcion.fecha_inicio)}
                </p>
              )}
              {suscripcion?.ciclo_facturacion && isActive && (
                <p>
                  <span className="font-medium text-slate-700">Facturación:</span>{' '}
                  <span className="capitalize">{suscripcion.ciclo_facturacion}</span>
                </p>
              )}
              {suscripcion?.fecha_fin && (
                <p>
                  <span className="font-medium text-slate-700">
                    {suscripcion.estado === 'CANCELADA' || suscripcion.estado === 'VENCIDA'
                      ? 'Acceso hasta:'
                      : 'Fecha de caducidad:'}
                  </span>{' '}
                  {formatDate(suscripcion.fecha_fin)}
                </p>
              )}
              {isActive && !suscripcion?.fecha_fin && (
                <p className="text-slate-500 italic">Caducidad no registrada</p>
              )}
            </div>
          </div>

          {currentDetail && (
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
              {currentDetail.sections
                .find((s) => s.title === 'Canales incluidos')
                ?.items.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="text-emerald-600">✓</span>
                    {item}
                  </li>
                ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 mb-6">
          <p className="text-amber-900 font-medium">Sin plan contratado</p>
          <p className="text-sm text-amber-800 mt-1">
            Elija un plan para activar todas las funciones de Agenda Virtual.
          </p>
        </div>
      )}

      {plansToOffer.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">
              {!plan || !isActive ? 'Contratar un plan' : 'Cambiar de plan'}
            </h3>
            <BillingCycleToggle cycle={billingCycle} onChange={setBillingCycle} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plansToOffer.map((targetPlan) => {
              const priceDisplay = getPlanPriceDisplay(targetPlan.precio, billingCycle);
              const chargeAmount = getPlanChargeAmount(targetPlan.precio, billingCycle);
              const detail = getPlanMarketingDetail(targetPlan);
              const wompiAllowed = chargeAmount >= paymentsConfig.wompiMinAmountCop;

              return (
                <div
                  key={targetPlan.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col"
                >
                  <p className="font-semibold text-slate-900">{targetPlan.nombre}</p>
                  <p className="text-sm text-slate-600 mt-1">{detail.tagline}</p>
                  <p className="text-xl font-bold text-blue-700 mt-3">
                    {formatCop(priceDisplay.amount)}
                    <span className="text-sm font-normal text-slate-500">
                      {priceDisplay.periodSuffix}
                    </span>
                  </p>

                  <div className="mt-4 space-y-2 flex-1">
                    {paymentsConfig.mercadoPagoConfigured && (
                      <button
                        type="button"
                        disabled={actionLoading !== null}
                        onClick={() => handleChangePlan(targetPlan.id, 'mercadopago')}
                        className="w-full rounded-lg bg-[#009ee3] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0088c7] disabled:opacity-60"
                      >
                        {actionLoading === `mercadopago-${targetPlan.id}`
                          ? 'Procesando...'
                          : 'Pagar con Mercado Pago'}
                      </button>
                    )}
                    {paymentsConfig.wompiConfigured && (
                      <button
                        type="button"
                        disabled={actionLoading !== null || !wompiAllowed}
                        onClick={() => handleChangePlan(targetPlan.id, 'wompi')}
                        className="w-full rounded-lg border-2 border-slate-900 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
                      >
                        {actionLoading === `wompi-${targetPlan.id}`
                          ? 'Procesando...'
                          : 'Pagar con Wompi'}
                      </button>
                    )}
                    {!wompiAllowed && paymentsConfig.wompiConfigured && (
                      <p className="text-xs text-amber-700 text-center">
                        Wompi requiere mínimo {formatCop(paymentsConfig.wompiMinAmountCop)}.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isActive && plan && (
        <div className="pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={handleCancel}
            disabled={actionLoading === 'cancel'}
            className="text-sm font-semibold text-red-600 hover:text-red-700 disabled:opacity-60"
          >
            {actionLoading === 'cancel' ? 'Cancelando...' : 'Cancelar suscripción'}
          </button>
          <p className="text-xs text-slate-500 mt-1">
            Puede volver a contratar un plan en cualquier momento.
          </p>
        </div>
      )}
    </div>
  );
}
