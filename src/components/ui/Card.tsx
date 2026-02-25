'use client';

import { type ReactNode } from 'react';
import { tokens } from '@/design/tokens';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'nested';

const variantClasses: Record<CardVariant, string> = {
  default:
    'bg-[var(--color-surface)] shadow-sm border border-[var(--color-border-light)]',
  elevated:
    'backdrop-blur-sm shadow-lg border border-[var(--color-border-glass)]',
  outlined:
    'bg-[var(--color-surface)] border border-[var(--color-border-light)]',
  nested:
    'bg-[var(--color-surface-nested)] border border-[var(--color-border-light)]',
};

export interface CardProps {
  variant?: CardVariant;
  className?: string;
  children: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export interface CardHeaderProps {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, action, className = '' }: CardHeaderProps) {
  return (
    <div className={`flex items-start justify-between gap-4 ${className}`.trim()}>
      <div>
        {title && <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{title}</h3>}
        {subtitle && <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

export default function Card({
  variant = 'default',
  className = '',
  children,
  padding = 'md',
}: CardProps) {
  const radius = variant === 'nested' ? tokens.radius.md : tokens.radius.lg;
  const classes = [
    variantClasses[variant],
    variant === 'elevated' ? 'bg-[var(--color-surface-glass)]' : '',
    paddingClasses[padding],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} style={{ borderRadius: radius }}>
      {children}
    </div>
  );
}
