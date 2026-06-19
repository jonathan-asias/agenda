'use client';

import { type ReactNode } from 'react';
import Button from './Button';

export interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
  className?: string;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-12 px-4 rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-nested)] ${className}`.trim()}
    >
      {icon ?? (
        <div className="w-14 h-14 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center mb-4">
          <svg
            className="w-7 h-7 text-[var(--color-primary)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
      )}
      <h3 className="text-base font-semibold text-[var(--color-text-primary)]">{title}</h3>
      {description && (
        <p className="text-sm text-[var(--color-text-secondary)] mt-2 max-w-md">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button type="button" variant="primary" size="lg" onClick={onAction} className="mt-6 min-h-11">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
