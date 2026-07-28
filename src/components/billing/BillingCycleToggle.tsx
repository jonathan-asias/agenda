'use client';

import type { BillingCycle } from '@/lib/plan-billing';

interface BillingCycleToggleProps {
  cycle: BillingCycle;
  onChange: (cycle: BillingCycle) => void;
  className?: string;
}

export default function BillingCycleToggle({
  cycle,
  onChange,
  className = '',
}: BillingCycleToggleProps) {
  const isAnnual = cycle === 'annual';

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <span
        className={`text-sm font-medium transition-colors ${
          !isAnnual ? 'text-slate-900' : 'text-slate-500'
        }`}
      >
        Mensual
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={isAnnual}
        aria-label="Alternar entre facturación mensual y anual"
        onClick={() => onChange(isAnnual ? 'monthly' : 'annual')}
        className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-ring-toggle ${
          isAnnual ? 'bg-slate-900' : 'bg-slate-300'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
            isAnnual ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </button>
      <span
        className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${
          isAnnual ? 'text-slate-900' : 'text-slate-500'
        }`}
      >
        Anual
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
          -5%
        </span>
      </span>
    </div>
  );
}
