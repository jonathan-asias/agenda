'use client';

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`rounded bg-[var(--color-border-light)] motion-safe:animate-pulse ${className}`}
      aria-hidden
    />
  );
}
