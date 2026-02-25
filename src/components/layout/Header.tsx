'use client';

import { type ReactNode } from 'react';

export interface LayoutHeaderProps {
  /** Título o contenido principal del header */
  children?: ReactNode;
  /** Contenido a la derecha (acciones, usuario, etc.) */
  actions?: ReactNode;
  className?: string;
}

/**
 * Header de layout: barra superior con título y zona de acciones.
 * Usa tokens de diseño (fondos y bordes desde CSS vars).
 */
export default function LayoutHeader({ children, actions, className = '' }: LayoutHeaderProps) {
  return (
    <header
      className={`flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4 bg-[var(--color-surface)] border-b border-[var(--color-border-light)] shadow-sm ${className}`.trim()}
    >
      <div className="min-w-0 flex-1">{children}</div>
      {actions && <div className="flex-shrink-0 flex items-center gap-2">{actions}</div>}
    </header>
  );
}
