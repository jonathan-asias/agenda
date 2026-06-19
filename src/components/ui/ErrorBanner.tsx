'use client';

import { type ReactNode } from 'react';
import Button from './Button';

export interface ErrorBannerProps {
  title: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
  children?: ReactNode;
}

export default function ErrorBanner({
  title,
  message,
  onRetry,
  retryLabel = 'Intentar de nuevo',
  className = '',
  children,
}: ErrorBannerProps) {
  return (
    <div
      role="alert"
      aria-live="polite"
      className={`rounded-xl border border-[var(--color-danger-border)] bg-[var(--color-danger-light)] p-4 ${className}`.trim()}
    >
      <div className="flex items-start gap-3">
        <svg
          className="w-5 h-5 shrink-0 text-[var(--color-danger)] mt-0.5"
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
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[var(--color-danger-text)]">{title}</p>
          {message && (
            <p className="text-sm text-[var(--color-danger-text)] mt-1 opacity-90">{message}</p>
          )}
          {children}
          {onRetry && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="mt-3 min-h-11"
            >
              {retryLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
