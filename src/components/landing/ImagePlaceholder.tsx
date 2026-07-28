interface ImagePlaceholderProps {
  label?: string;
  className?: string;
}

export default function ImagePlaceholder({
  label = 'Imagen',
  className = '',
}: ImagePlaceholderProps) {
  return (
    <div
      className={`flex aspect-[4/3] w-full items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-100/80 ${className}`}
      role="img"
      aria-label={label}
    >
      <div className="flex flex-col items-center gap-3 text-slate-400">
        <svg
          className="h-24 w-24 sm:h-32 sm:w-32"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.25}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
}
