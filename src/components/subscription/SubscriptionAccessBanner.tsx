'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useSubscriptionAccess } from '@/contexts/SubscriptionAccessContext';

export default function SubscriptionAccessBanner() {
  const params = useParams();
  const institucionId = params?.id as string | undefined;
  const { mode, message, loading, graceDays } = useSubscriptionAccess();

  if (loading || mode === 'full' || !message) {
    return null;
  }

  const isGrace = mode === 'grace_readonly';
  const profileHref = institucionId ? `/institucion/${institucionId}/perfil` : '/';

  return (
    <div
      className={`border-b px-4 py-3 ${
        isGrace
          ? 'bg-amber-50 border-amber-200 text-amber-950'
          : 'bg-red-50 border-red-200 text-red-950'
      }`}
      role="alert"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2 text-sm">
          <svg
            className={`w-5 h-5 shrink-0 mt-0.5 ${isGrace ? 'text-amber-600' : 'text-red-600'}`}
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
          <p>
            {message}
            {isGrace && graceDays > 0 && (
              <span className="block mt-1 font-medium">
                Quedan {graceDays} día{graceDays !== 1 ? 's' : ''} de período de gracia. Modo solo lectura: no puede crear, editar ni eliminar información.
              </span>
            )}
          </p>
        </div>
        {isGrace && (
          <Link
            href={profileHref}
            className="shrink-0 inline-flex items-center justify-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 transition-colors"
          >
            Renovar plan
          </Link>
        )}
      </div>
    </div>
  );
}
