'use client';

import { type ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  className?: string;
  zIndex?: number;
  contentClassName?: string;
  headerClassName?: string;
  titleClassName?: string;
  closeButtonClassName?: string;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-[90vw] max-h-[90vh]',
};

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusableElements(panel: HTMLElement): HTMLElement[] {
  return Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true'
  );
}

function getInitialFocusTarget(panel: HTMLElement): HTMLElement | null {
  const focusable = getFocusableElements(panel);
  const field = focusable.find((el) => {
    const tag = el.tagName.toLowerCase();
    return tag === 'input' || tag === 'textarea' || tag === 'select';
  });
  return field ?? focusable[0] ?? panel;
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true,
  className = '',
  zIndex = 100,
  contentClassName = 'overflow-y-auto flex-1 min-h-0 px-6 py-4',
  headerClassName = '',
  titleClassName = '',
  closeButtonClassName = '',
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  const previouslyOpenRef = useRef(false);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) {
      previouslyOpenRef.current = false;
      return;
    }

    const justOpened = !previouslyOpenRef.current;
    previouslyOpenRef.current = true;

    if (justOpened) {
      triggerRef.current = document.activeElement as HTMLElement;
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      // Solo el modal superior (mayor z-index) debe cerrarse.
      const roots = Array.from(document.querySelectorAll<HTMLElement>('[data-modal-root]'));
      const maxZ = roots.reduce((max, el) => {
        const z = Number(el.dataset.modalZIndex || 0);
        return z > max ? z : max;
      }, 0);
      if (zIndex < maxZ) return;
      onCloseRef.current();
    };
    document.addEventListener('keydown', handleEscape);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const panel = panelRef.current;
    if (!panel) {
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = previousOverflow;
      };
    }

    // Solo enfocar al abrir; no en cada re-render / cambio de onClose.
    if (justOpened) {
      // Esperar un frame para que el contenido (inputs) ya esté en el DOM.
      requestAnimationFrame(() => {
        if (!panelRef.current) return;
        getInitialFocusTarget(panelRef.current)?.focus();
      });
    }

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusable = getFocusableElements(panelRef.current);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    panel.addEventListener('keydown', handleTab);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = previousOverflow;
      panel.removeEventListener('keydown', handleTab);
      // Solo devolver foco al cerrar de verdad (open pasa a false).
      if (!open) {
        triggerRef.current?.focus();
      }
    };
  }, [open, zIndex]);

  useEffect(() => {
    if (open) return;
    triggerRef.current?.focus();
  }, [open]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto"
      style={{ zIndex }}
      data-modal-root
      data-modal-z-index={zIndex}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={closeOnOverlayClick ? () => onCloseRef.current() : undefined}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        className={`relative my-auto w-full bg-[var(--color-surface)] rounded-2xl shadow-xl border border-[var(--color-border-light)] max-h-[min(90vh,100%)] flex flex-col ${sizeClasses[size]} ${className}`.trim()}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className={`flex items-center justify-between gap-4 px-6 py-4 border-b border-[var(--color-border-light)] flex-shrink-0 ${headerClassName}`.trim()}>
            {title && (
              <h2 id="modal-title" className={`text-lg font-semibold text-[var(--color-text-primary)] ${titleClassName}`.trim()}>
                {title}
              </h2>
            )}
            <div className={title ? '' : 'ml-auto'}>
              {showCloseButton && (
                <button
                  type="button"
                  onClick={() => onCloseRef.current()}
                  className={`p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-nested)] hover:text-[var(--color-text-primary)] transition-colors focus-ring-outline min-h-11 min-w-11 flex items-center justify-center ${closeButtonClassName}`.trim()}
                  aria-label="Cerrar"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}
        <div className={contentClassName}>{children}</div>
      </div>
    </div>,
    document.body
  );
}
