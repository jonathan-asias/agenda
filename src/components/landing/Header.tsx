import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <div className="text-lg font-semibold text-slate-900">
          Agenda Escolar Digital
        </div>
        <Link
          href="/login"
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900"
        >
          Iniciar sesión
        </Link>
      </div>
    </header>
  );
}
