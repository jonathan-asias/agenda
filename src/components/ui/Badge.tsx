'use client';

import { type ReactNode } from 'react';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'danger' | 'warning' | 'neutral';

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-800',
  primary: 'bg-blue-100 text-blue-800',
  success: 'bg-green-100 text-green-800',
  danger: 'bg-red-100 text-red-800',
  warning: 'bg-amber-100 text-amber-800',
  neutral: 'bg-slate-100 text-slate-600',
};

export interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

export default function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  const base = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium';
  const classes = `${base} ${variantClasses[variant]} ${className}`.trim();
  return <span className={classes}>{children}</span>;
}
