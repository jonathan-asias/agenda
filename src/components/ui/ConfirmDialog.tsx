'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Button from './Button';
import Input from './Input';
import { CONFIRM_EVENT, type ConfirmDetail } from './ui-events';

function getConfirmOverlayZIndex(): number {
  if (typeof document === 'undefined') return 200;
  const roots = Array.from(document.querySelectorAll<HTMLElement>('[data-modal-root]'));
  const maxModalZ = roots.reduce((max, el) => {
    const z = Number(el.dataset.modalZIndex || 0);
    return z > max ? z : max;
  }, 0);
  return Math.max(maxModalZ + 10, 200);
}

export function ConfirmHost() {
  const [dialog, setDialog] = useState<ConfirmDetail | null>(null);
  const [overlayZ, setOverlayZ] = useState(200);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ConfirmDetail>).detail;
      triggerRef.current = document.activeElement as HTMLElement;
      setInputValue('');
      setInputError('');
      setOverlayZ(getConfirmOverlayZIndex());
      setDialog(detail);
    };
    window.addEventListener(CONFIRM_EVENT, handler);
    return () => window.removeEventListener(CONFIRM_EVENT, handler);
  }, []);

  useEffect(() => {
    if (!dialog || !panelRef.current) return;

    const panel = panelRef.current;
    const focusable = panel.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || focusable.length === 0) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dialog.resolve(false);
        setDialog(null);
        triggerRef.current?.focus();
      }
    };

    panel.addEventListener('keydown', handleTab);
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      panel.removeEventListener('keydown', handleTab);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [dialog]);

  if (!dialog || typeof document === 'undefined') return null;

  const confirmVariant =
    dialog.variant === 'danger' ? 'destructive' : dialog.variant === 'warning' ? 'primary' : 'primary';

  const handleConfirm = () => {
    if (dialog.inputValidator) {
      const err = dialog.inputValidator(inputValue);
      if (err) {
        setInputError(err);
        return;
      }
    }
    dialog.resolve(true);
    setDialog(null);
    triggerRef.current?.focus();
  };

  const handleCancel = () => {
    dialog.resolve(false);
    setDialog(null);
    triggerRef.current?.focus();
  };

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: overlayZ }}
      data-modal-root
      data-modal-z-index={overlayZ}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={handleCancel}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        className="relative w-full max-w-md bg-[var(--color-surface)] rounded-2xl shadow-xl border border-[var(--color-border-light)] max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-[var(--color-border-light)]">
          <h2 id="confirm-dialog-title" className="text-lg font-semibold text-[var(--color-text-primary)]">
            {dialog.title}
          </h2>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">
          {dialog.text && (
            <p className="text-sm text-[var(--color-text-secondary)]">{dialog.text}</p>
          )}
          {dialog.html && (
            <div
              className="text-sm text-[var(--color-text-secondary)] prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: dialog.html }}
            />
          )}
          {dialog.inputValidator && (
            <Input
              label="Confirmación"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setInputError('');
              }}
              placeholder={dialog.inputPlaceholder}
              error={inputError}
              autoComplete="off"
            />
          )}
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-2 px-6 py-4 border-t border-[var(--color-border-light)]">
          <Button type="button" variant="outline" size="lg" onClick={handleCancel} className="min-h-11">
            {dialog.cancelButtonText ?? 'Cancelar'}
          </Button>
          <Button
            type="button"
            variant={confirmVariant}
            size="lg"
            onClick={handleConfirm}
            className="min-h-11 sm:ml-auto"
          >
            {dialog.confirmButtonText ?? 'Confirmar'}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
