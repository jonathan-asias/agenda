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
    'w-full px-4 py-2.5 text-sm border rounded-lg bg-white text-slate-900 placeholder:text-slate-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  const stateClass = error
    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
    : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500';
  const inputClassName = `${base} focus:outline-none focus:ring-2 ${stateClass} ${className}`.trim();

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
        <p id={inputId ? `${inputId}-error` : undefined} className="mt-1 text-sm text-red-600">
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
