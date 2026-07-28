'use client';

import { useId, useState, type ReactNode } from 'react';

type TooltipPlacement = 'left' | 'right' | 'center';
type TooltipPanelVariant = 'dark' | 'light';
type TooltipTriggerVariant = 'amber' | 'muted';

export interface InfoTooltipProps {
  /** Etiqueta accesible del botón de ayuda */
  label: string;
  children: ReactNode;
  placement?: TooltipPlacement;
  /** Tamaño del ícono */
  size?: 'sm' | 'md';
  panelVariant?: TooltipPanelVariant;
  triggerVariant?: TooltipTriggerVariant;
  className?: string;
}

const placementClasses: Record<TooltipPlacement, string> = {
  left: 'left-0',
  right: 'right-0',
  center: 'left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0',
};

const arrowPlacementClasses: Record<TooltipPlacement, string> = {
  left: 'left-4',
  right: 'right-4',
  center: 'left-1/2 -translate-x-1/2 sm:left-4 sm:translate-x-0',
};

const panelClasses: Record<TooltipPanelVariant, string> = {
  dark: 'bg-slate-800 text-white',
  light: 'bg-white text-slate-600 border border-slate-200',
};

const arrowClasses: Record<TooltipPanelVariant, string> = {
  dark: 'bg-slate-800',
  light: 'bg-white border-l border-t border-slate-200',
};

const triggerClasses: Record<TooltipTriggerVariant, string> = {
  amber:
    'p-1 rounded-full bg-amber-100 text-amber-600 hover:bg-amber-200 hover:text-amber-700 focus-visible:ring-amber-600',
  muted:
    'p-0.5 rounded-full text-slate-400 hover:text-slate-600 focus-visible:ring-slate-600',
};

export default function InfoTooltip({
  label,
  children,
  placement = 'left',
  size = 'md',
  panelVariant = 'dark',
  triggerVariant = 'amber',
  className = '',
}: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  const show = () => setOpen(true);
  const hide = () => setOpen(false);
  const toggle = () => setOpen((prev) => !prev);

  return (
    <div className={`relative inline-flex ${className}`.trim()}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={tooltipId}
        aria-label={label}
        onClick={toggle}
        onFocus={show}
        onBlur={hide}
        onMouseEnter={show}
        onMouseLeave={hide}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            hide();
          }
        }}
        className={`${triggerClasses[triggerVariant]} transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
      >
        {triggerVariant === 'muted' ? (
          <svg className={iconSize} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 8a1 1 0 112 0v5a1 1 0 11-2 0V8zm1-4a1.25 1.25 0 110 2.5A1.25 1.25 0 0110 4z" />
          </svg>
        ) : (
          <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
      </button>
      <div
        id={tooltipId}
        role="tooltip"
        className={`absolute ${placementClasses[placement]} top-full mt-1.5 z-20 min-w-[200px] max-w-[min(28rem,calc(100vw-2rem))] w-[calc(100vw-2rem)] sm:w-auto sm:min-w-[280px] p-3 sm:p-4 text-sm sm:text-base rounded-xl shadow-xl transition-all duration-200 text-left ${panelClasses[panelVariant]} ${
          open ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        {children}
        <div
          className={`absolute -top-1.5 ${arrowPlacementClasses[placement]} w-3 h-3 rotate-45 pointer-events-none ${arrowClasses[panelVariant]}`}
          aria-hidden
        />
      </div>
    </div>
  );
}
