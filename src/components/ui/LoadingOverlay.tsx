'use client';

import { useEffect, useState } from 'react';
import Loader from './Loader';
import { LOADING_EVENT, type LoadingDetail } from './ui-events';

export function LoadingHost() {
  const [loading, setLoading] = useState<LoadingDetail | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<LoadingDetail>).detail;
      setLoading(detail.open ? detail : null);
    };
    window.addEventListener(LOADING_EVENT, handler);
    return () => window.removeEventListener(LOADING_EVENT, handler);
  }, []);

  if (!loading) return null;

  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="loading-overlay-title"
      aria-busy="true"
    >
      <div className="bg-[var(--color-surface)] rounded-2xl shadow-xl border border-[var(--color-border-light)] px-8 py-6 text-center max-w-sm mx-4">
        <Loader size="lg" className="mx-auto mb-4" />
        <h2 id="loading-overlay-title" className="text-base font-semibold text-[var(--color-text-primary)]">
          {loading.title ?? 'Procesando…'}
        </h2>
        {loading.text && (
          <p className="text-sm text-[var(--color-text-secondary)] mt-2">{loading.text}</p>
        )}
      </div>
    </div>
  );
}
