'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscriptionAccess } from '@/contexts/SubscriptionAccessContext';

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  );
}

export default function SubscriptionAccessBanner() {
  const params = useParams();
  const pathname = usePathname();
  const { role } = useAuth();
  const institucionId = params?.id as string | undefined;
  const { mode, message, loading, graceDays, isTrial, trialDaysLeft } = useSubscriptionAccess();

  if (loading) {
    return null;
  }

  const isInstitutionOwner = role === 'institucion';
  const profileHref = institucionId ? `/institucion/${institucionId}/perfil` : '/';
  const isOnProfile = Boolean(institucionId && pathname.startsWith(profileHref));

  if (mode === 'full' && isTrial && trialDaysLeft > 0) {
    const daysLabel = `${trialDaysLeft} día${trialDaysLeft !== 1 ? 's' : ''}`;

    return (
      <div
        className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-amber-950"
        role="alert"
      >
        <div
          className={`mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center ${
            isInstitutionOwner ? 'sm:justify-between' : 'items-center justify-center'
          }`}
        >
          <div
            className={`flex gap-2 text-sm ${
              isInstitutionOwner
                ? 'items-start'
                : 'items-center justify-center text-center'
            }`}
          >
            <WarningIcon className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            {isInstitutionOwner ? (
              <p>
                <strong>Versión de prueba activa.</strong> Quedan {daysLabel} de acceso completo.
                Contrate un plan antes de que finalice el período para evitar interrupciones.
              </p>
            ) : (
              <p>
                <strong>Versión de prueba.</strong> Quedan {daysLabel} de acceso completo.
              </p>
            )}
          </div>
          {isInstitutionOwner && !isOnProfile && (
            <Link
              href={profileHref}
              className="inline-flex shrink-0 items-center justify-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 transition-colors"
            >
              Ver plan
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (mode === 'full' || !message) {
    return null;
  }

  const isGrace = mode === 'grace_readonly';
  const isTrialBilling = mode === 'trial_billing_only';
  const showBillingCta = isInstitutionOwner && (isGrace || isTrialBilling);

  return (
    <div
      className={`border-b px-4 py-3 ${
        isGrace
          ? 'bg-amber-50 border-amber-200 text-amber-950'
          : isTrialBilling
            ? 'bg-red-50 border-red-200 text-red-950'
            : 'bg-red-50 border-red-200 text-red-950'
      }`}
      role="alert"
    >
      <div
        className={`mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center ${
          isInstitutionOwner ? 'sm:justify-between' : 'items-center justify-center'
        }`}
      >
        <div
          className={`flex gap-2 text-sm ${
            isInstitutionOwner
              ? 'items-start'
              : 'items-center justify-center text-center'
          }`}
        >
          <WarningIcon
            className={`mt-0.5 h-5 w-5 shrink-0 ${isGrace ? 'text-amber-600' : 'text-red-600'}`}
          />
          <p>
            {message}
            {isGrace && graceDays > 0 && (
              <span className="mt-1 block font-medium">
                Quedan {graceDays} día{graceDays !== 1 ? 's' : ''} de período de gracia. Modo solo
                lectura.
              </span>
            )}
          </p>
        </div>
        {showBillingCta && (
          <Link
            href={profileHref}
            className={`inline-flex shrink-0 items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors ${
              isGrace ? 'bg-amber-600 hover:bg-amber-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isTrialBilling ? 'Contratar plan' : 'Renovar plan'}
          </Link>
        )}
      </div>
    </div>
  );
}
