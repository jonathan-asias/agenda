'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Loader from './Loader';
import { LOADING_EVENT, type LoadingDetail } from './ui-events';

function getLoadingOverlayZIndex(): number {
  if (typeof document === 'undefined') return 210;
  const roots = Array.from(document.querySelectorAll<HTMLElement>('[data-modal-root]'));
  const maxModalZ = roots.reduce((max, el) => {
    const z = Number(el.dataset.modalZIndex || 0);
    return z > max ? z : max;
  }, 0);
  return Math.max(maxModalZ + 20, 210);
}

export function LoadingHost() {
  const [loading, setLoading] = useState<LoadingDetail | null>(null);
  const [overlayZ, setOverlayZ] = useState(210);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<LoadingDetail>).detail;
      if (detail.open) {
        setOverlayZ(getLoadingOverlayZIndex());
        setLoading(detail);
      } else {
        setLoading(null);
      }
    };
    window.addEventListener(LOADING_EVENT, handler);
    return () => window.removeEventListener(LOADING_EVENT, handler);
  }, []);

  if (!loading || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
      style={{ zIndex: overlayZ }}
      data-modal-root
      data-modal-z-index={overlayZ}
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
    </div>,
    document.body
  );
}
