import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-slate-900 transition-opacity hover:opacity-90">
          Agenda Virtual
        </Link>
        <nav className="flex items-center gap-4">
          <a
            href="#pricing"
            className="hidden text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 sm:inline-block"
          >
            Planes
          </a>
          <Link
            href="/login"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900"
          >
            Iniciar sesión
          </Link>
        </nav>
      </div>
    </header>
  );
}
