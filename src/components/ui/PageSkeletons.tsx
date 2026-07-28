'use client';

import Skeleton from '@/components/ui/Skeleton';

/** Variante para paneles con fondo oscuro (Gestión Vortico). */
export function DarkSkeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded bg-slate-800 motion-safe:animate-pulse ${className}`}
      aria-hidden
    />
  );
}

export function StatsCardsSkeleton({
  count = 6,
  dark = false,
}: {
  count?: number;
  dark?: boolean;
}) {
  const Bar = dark ? DarkSkeleton : Skeleton;
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      role="status"
      aria-label="Cargando estadísticas"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={
            dark
              ? 'rounded-xl border border-slate-800 bg-slate-900/60 p-5'
              : 'rounded-xl border border-[var(--color-border-light)] bg-[var(--color-surface)] p-5'
          }
        >
          <Bar className="h-3 w-24 mb-3" />
          <Bar className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
}

export function TableRowsSkeleton({
  rows = 6,
  cols = 5,
  dark = false,
}: {
  rows?: number;
  cols?: number;
  dark?: boolean;
}) {
  const Bar = dark ? DarkSkeleton : Skeleton;
  return (
    <>
      {Array.from({ length: rows }).map((_, row) => (
        <tr key={row} className={dark ? 'border-t border-slate-800' : undefined}>
          {Array.from({ length: cols }).map((_, col) => (
            <td key={col} className="px-4 py-3">
              <Bar className={`h-3 ${col === 1 ? 'w-40' : 'w-20'}`} />
              {col === 1 && <Bar className="h-2.5 w-28 mt-2" />}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function CardListSkeleton({
  count = 4,
  dark = false,
}: {
  count?: number;
  dark?: boolean;
}) {
  const Bar = dark ? DarkSkeleton : Skeleton;
  return (
    <div className="space-y-4" role="status" aria-label="Cargando lista">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={
            dark
              ? 'rounded-xl border border-slate-800 bg-slate-900/50 p-5'
              : 'rounded-xl border border-[var(--color-border-light)] bg-[var(--color-surface)] p-5'
          }
        >
          <Bar className="h-4 w-48 mb-2" />
          <Bar className="h-3 w-56 mb-1" />
          <Bar className="h-3 w-32" />
        </div>
      ))}
    </div>
  );
}

export function DetailSectionsSkeleton({ dark = false }: { dark?: boolean }) {
  const Bar = dark ? DarkSkeleton : Skeleton;
  const card = dark
    ? 'rounded-xl border border-slate-800 bg-slate-900/50 p-5'
    : 'rounded-xl border border-[var(--color-border-light)] bg-[var(--color-surface)] p-5';

  return (
    <div role="status" aria-label="Cargando detalle">
      <Bar className="h-3 w-28 mb-4" />
      <Bar className="h-7 w-64 mb-2" />
      <Bar className="h-3 w-40 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {[0, 1].map((i) => (
          <div key={i} className={card}>
            <Bar className="h-4 w-36 mb-4" />
            <div className="space-y-3">
              <Bar className="h-3 w-full" />
              <Bar className="h-3 w-48" />
              <Bar className="h-3 w-40" />
              <Bar className="h-3 w-36" />
            </div>
          </div>
        ))}
      </div>
      <div className={`${card} mb-6`}>
        <Bar className="h-4 w-40 mb-4" />
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <Bar className="h-3.5 w-44" />
              <Bar className="h-3 w-56" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function InstitutionPageSkeleton() {
  return (
    <div className="min-h-screen bg-blue-50" role="status" aria-label="Cargando institución">
      <div className="h-20 bg-white border-b border-slate-200 px-4 flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>
      <div className="h-24 bg-blue-600/20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-3 w-72" />
          </div>
          <Skeleton className="h-10 w-40 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 bg-white p-5 space-y-3"
            >
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <Skeleton className="h-5 w-48" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DashboardPageSkeleton() {
  return (
    <div className="min-h-screen bg-blue-50" role="status" aria-label="Cargando panel">
      <div className="h-20 bg-white border-b border-slate-200 px-4 flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-3 w-80" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-36 rounded-lg" />
            <Skeleton className="h-10 w-28 rounded-lg" />
          </div>
        </div>
        <StatsCardsSkeleton count={6} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 bg-white p-5 space-y-4"
            >
              <Skeleton className="h-5 w-40" />
              {Array.from({ length: 4 }).map((_, j) => (
                <Skeleton key={j} className="h-3 w-full" />
              ))}
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <Skeleton className="h-5 w-48" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-3 items-center">
              <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProfilePageSkeleton() {
  return (
    <div className="min-h-screen bg-blue-50" role="status" aria-label="Cargando perfil">
      <div className="h-20 bg-white border-b border-slate-200" />
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-7 w-48" />
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function ListPageSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-4" role="status" aria-label="Cargando listado">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-64" />
            <Skeleton className="h-3 w-40" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Skeleton para datos guardados del Setup Wizard (grados, cursos, etc.). */
export function WizardDataSkeleton({
  label = 'Cargando elementos guardados…',
  sections = 3,
}: {
  label?: string;
  sections?: number;
}) {
  return (
    <div className="space-y-4" role="status" aria-live="polite" aria-label={label}>
      <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
        <svg className="h-5 w-5 shrink-0 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24" aria-hidden>
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <div>
          <p className="text-sm font-semibold text-blue-900">{label}</p>
          <p className="text-xs text-blue-700">Estamos recuperando la información ya configurada.</p>
        </div>
      </div>
      {Array.from({ length: sections }).map((_, section) => (
        <div key={section} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <Skeleton className="mb-4 h-4 w-36" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, card) => (
              <div key={card} className="rounded-lg border border-slate-200 bg-white p-3">
                <Skeleton className="mb-2 h-4 w-24" />
                <Skeleton className="mb-3 h-3 w-16" />
                <div className="flex flex-wrap gap-1.5">
                  <Skeleton className="h-6 w-14 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-12 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
