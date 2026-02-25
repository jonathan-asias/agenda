'use client';

import { type ReactNode } from 'react';

export interface SidebarProps {
  children: ReactNode;
  className?: string;
}

/**
 * Sidebar de layout: columna lateral. Pensado para navegación o bloques secundarios.
 * El contenedor padre (Layout) controla visibilidad y ancho.
 */
export default function Sidebar({ children, className = '' }: SidebarProps) {
  return (
    <aside
      className={`w-64 flex-shrink-0 border-r border-[var(--color-border-light)] bg-[var(--color-surface)] overflow-y-auto ${className}`.trim()}
    >
      {children}
    </aside>
  );
}
