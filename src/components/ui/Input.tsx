'use client';

import { type InputHTMLAttributes, type ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  className?: string;
  containerClassName?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export default function Input({
  label,
  error,
  hint,
  className = '',
  containerClassName = '',
  inputRef,
  id,
  ...rest
}: InputProps) {
  const inputId = id ?? (label ? `input-${label.replace(/\s/g, '-').toLowerCase()}` : undefined);
  const base =
    'w-full px-4 py-2.5 text-base border rounded-lg bg-[var(--color-surface)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  const stateClass = error
    ? 'border-[var(--color-danger-border-input)] focus-visible:ring-[var(--color-danger-focus)] focus-visible:border-[var(--color-danger)]'
    : 'border-[var(--color-border)] focus-visible:ring-[var(--color-primary-focus)] focus-visible:border-[var(--color-primary)]';
  const inputClassName = `${base} focus-visible:outline-none focus-visible:ring-2 ${stateClass} ${className}`.trim();

  return (
    <div className={containerClassName || undefined}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}
      <input
        ref={inputRef}
        id={inputId}
        className={inputClassName}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...rest}
      />
      {error && (
        <p id={inputId ? `${inputId}-error` : undefined} className="mt-1 text-sm text-[var(--color-danger)]" role="alert" aria-live="polite">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={inputId ? `${inputId}-hint` : undefined} className="mt-1 text-sm text-slate-500">
          {hint}
        </p>
      )}
    </div>
  );
}
