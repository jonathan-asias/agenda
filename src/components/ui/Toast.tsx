'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { TOAST_EVENT, type ToastDetail, type ToastType } from './ui-events';

interface ToastItem extends ToastDetail {
  id: string;
}

/** Por encima de modales (100–130), confirm (200+) y loading (210+). */
const TOAST_Z_INDEX = 400;

const iconByType: Record<ToastType, string> = {
  success: 'text-[var(--color-success)]',
  error: 'text-[var(--color-danger)]',
  warning: 'text-[var(--color-warning)]',
  info: 'text-[var(--color-primary)]',
};

const borderByType: Record<ToastType, string> = {
  success: 'border-[var(--color-success-border)] bg-[var(--color-success-light)]',
  error: 'border-[var(--color-danger-border)] bg-[var(--color-danger-light)]',
  warning: 'border-[var(--color-warning-border)] bg-[var(--color-warning-light)]',
  info: 'border-[var(--color-border-light)] bg-[var(--color-surface)]',
};

function ToastIcon({ type }: { type: ToastType }) {
  const cls = `w-5 h-5 shrink-0 ${iconByType[type]}`;
  if (type === 'success') {
    return (
      <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    );
  }
  if (type === 'error') {
    return (
      <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  }
  return (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
    </svg>
  );
}

export function ToastHost() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ToastDetail>).detail;
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const defaultDuration = detail.type === 'error' ? 0 : 4000;
      const duration = detail.duration ?? defaultDuration;
      setToasts((prev) => [...prev, { ...detail, id }]);
      if (duration > 0) {
        window.setTimeout(() => removeToast(id), duration);
      }
    };
    window.addEventListener(TOAST_EVENT, handler);
    return () => window.removeEventListener(TOAST_EVENT, handler);
  }, [removeToast]);

  if (!mounted || toasts.length === 0 || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed bottom-4 right-4 flex max-w-sm w-full flex-col gap-2 px-4 pointer-events-none sm:px-0"
      style={{ zIndex: TOAST_Z_INDEX }}
      aria-live="polite"
      aria-relevant="additions"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-lg motion-safe:animate-in motion-safe:slide-in-from-bottom-2 ${borderByType[toast.type]}`}
        >
          <ToastIcon type={toast.type} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">{toast.title}</p>
            {toast.text && (
              <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">{toast.text}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            className="-mr-1 flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-md p-1 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-nested)] focus-ring-outline"
            aria-label="Cerrar notificación"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>,
    document.body
  );
}
