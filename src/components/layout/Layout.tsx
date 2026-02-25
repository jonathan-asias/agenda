'use client';

import { type ReactNode } from 'react';

export interface LayoutProps {
  children: ReactNode;
  /** Slot opcional encima del contenido principal */
  header?: ReactNode;
  /** Slot opcional de barra lateral (se muestra a la izquierda en desktop) */
  sidebar?: ReactNode;
  /** Slot opcional debajo del contenido principal */
  footer?: ReactNode;
  className?: string;
}

/**
 * Layout principal: compone header, sidebar, contenido y footer.
 * No impone lógica; solo estructura y contenedores.
 */
export default function Layout({ children, header, sidebar, footer, className = '' }: LayoutProps) {
  const hasSidebar = Boolean(sidebar);

  return (
    <div className={`min-h-screen flex flex-col bg-[var(--color-background)] ${className}`.trim()}>
      {header && <header className="flex-shrink-0">{header}</header>}
      <div className="flex flex-1 min-w-0">
        {sidebar && (
          <aside className="hidden lg:block flex-shrink-0 w-64 border-r border-[var(--color-border-light)] bg-[var(--color-surface)]">
            {sidebar}
          </aside>
        )}
        <main className={`flex-1 min-w-0 ${hasSidebar ? 'lg:pl-0' : ''}`}>
          {children}
        </main>
      </div>
      {footer && <footer className="flex-shrink-0">{footer}</footer>}
    </div>
  );
}
