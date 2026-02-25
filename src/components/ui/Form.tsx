'use client';

import { type FormHTMLAttributes, type ReactNode } from 'react';

export interface FormProps extends Omit<FormHTMLAttributes<HTMLFormElement>, 'className'> {
  children: ReactNode;
  className?: string;
}

/**
 * Contenedor de formulario con estilos consistentes.
 * No añade lógica; solo estructura y espaciado.
 */
export default function Form({ children, className = '', ...rest }: FormProps) {
  return (
    <form className={`space-y-4 ${className}`.trim()} {...rest}>
      {children}
    </form>
  );
}
