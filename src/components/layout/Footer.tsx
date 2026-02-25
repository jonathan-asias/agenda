'use client';

import { type ReactNode } from 'react';

export interface LayoutFooterProps {
  children: ReactNode;
  className?: string;
}

/**
 * Footer de layout: barra inferior. Usa tokens para fondo y texto.
 */
export default function LayoutFooter({ children, className = '' }: LayoutFooterProps) {
  return (
    <footer
      className={`mt-auto px-4 sm:px-6 lg:px-8 py-6 bg-[var(--color-secondary)] text-[var(--color-text-inverse)] border-t border-[var(--color-border-light)] ${className}`.trim()}
    >
      {children}
    </footer>
  );
}
