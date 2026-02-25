'use client';

import { type ReactNode } from 'react';

export interface TableProps {
  children: ReactNode;
  className?: string;
  striped?: boolean;
  compact?: boolean;
}

export function Table({ children, className = '', striped = false, compact = false }: TableProps) {
  const tableClass = [
    'w-full text-sm text-left text-slate-700',
    compact ? 'text-xs' : '',
    striped ? '[&>tbody>tr:nth-child(even)]:bg-slate-50' : '',
    className,
  ].filter(Boolean).join(' ');
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className={tableClass}>
        {children}
      </table>
    </div>
  );
}

export interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

export function TableHeader({ children, className = '' }: TableHeaderProps) {
  return (
    <thead className={`bg-slate-50 border-b border-slate-200 text-slate-600 font-medium ${className}`.trim()}>
      {children}
    </thead>
  );
}

export interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

export function TableBody({ children, className = '' }: TableBodyProps) {
  return <tbody className={className}>{children}</tbody>;
}

export interface TableRowProps {
  children: ReactNode;
  className?: string;
}

export function TableRow({ children, className = '' }: TableRowProps) {
  return (
    <tr className={`border-b border-slate-200 last:border-b-0 hover:bg-slate-50/50 ${className}`.trim()}>
      {children}
    </tr>
  );
}

export interface TableHeadProps {
  children: ReactNode;
  className?: string;
}

export function TableHead({ children, className = '' }: TableHeadProps) {
  return (
    <th scope="col" className={`px-4 py-3 text-left font-medium ${className}`.trim()}>
      {children}
    </th>
  );
}

export interface TableCellProps {
  children: ReactNode;
  className?: string;
  header?: boolean;
}

export function TableCell({ children, className = '', header = false }: TableCellProps) {
  const Comp = header ? 'th' : 'td';
  return (
    <Comp className={`px-4 py-3 ${className}`.trim()}>
      {children}
    </Comp>
  );
}
