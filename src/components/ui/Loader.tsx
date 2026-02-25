'use client';

export type LoaderSize = 'sm' | 'md' | 'lg';

const sizeClasses: Record<LoaderSize, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-b-2',
};

export interface LoaderProps {
  size?: LoaderSize;
  className?: string;
}

export default function Loader({ size = 'md', className = '' }: LoaderProps) {
  return (
    <div
      className={`animate-spin rounded-full border-blue-600 border-t-transparent ${sizeClasses[size]} ${className}`.trim()}
      role="status"
      aria-label="Cargando"
    >
      <span className="sr-only">Cargando</span>
    </div>
  );
}

export function LoaderPage({ message = 'Cargando...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
      <Loader size="lg" />
      <p className="text-sm text-slate-600">{message}</p>
    </div>
  );
}
