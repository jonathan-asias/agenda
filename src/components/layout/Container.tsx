'use client';

import { type ReactNode } from 'react';

export interface ContainerProps {
  children: ReactNode;
  /** Ancho máximo: narrow (prose), default (7xl), wide (full) */
  size?: 'narrow' | 'default' | 'wide';
  className?: string;
}

const sizeClasses = {
  narrow: 'max-w-3xl',
  default: 'max-w-7xl',
  wide: 'max-w-[1600px]',
};

/**
 * Contenedor de ancho máximo y padding horizontal estándar.
 * Centra el contenido y usa tokens de diseño implícitos (padding consistente).
 */
export default function Container({ children, size = 'default', className = '' }: ContainerProps) {
  return (
    <div
      className={`w-full mx-auto px-4 sm:px-6 lg:px-8 ${sizeClasses[size]} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
