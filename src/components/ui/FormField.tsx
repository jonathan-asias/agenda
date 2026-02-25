'use client';

import { type ReactNode } from 'react';

export interface FormFieldProps {
  /** Etiqueta del campo */
  label?: string;
  /** Contenido del campo (Input, select, etc.) */
  children: ReactNode;
  /** Mensaje de error debajo del campo */
  error?: string;
  /** Texto de ayuda debajo del campo */
  hint?: string;
  /** id para asociar label con el control (recomendado para accesibilidad) */
  id?: string;
  /** Si el campo es obligatorio (muestra indicador en label) */
  required?: boolean;
  className?: string;
}

/**
 * Envuelve un campo de formulario con label, error y hint.
 * Usa tokens de texto (color) para mantener consistencia.
 */
export default function FormField({
  label,
  children,
  error,
  hint,
  id,
  required = false,
  className = '',
}: FormFieldProps) {
  return (
    <div className={className || undefined}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1"
        >
          {label}
          {required && <span className="text-[var(--color-danger)] ml-0.5">*</span>}
        </label>
      )}
      <div>{children}</div>
      {error && (
        <p className="mt-1 text-sm text-[var(--color-danger)]" role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">{hint}</p>
      )}
    </div>
  );
}
