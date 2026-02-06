import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-3 px-6 py-6 text-sm text-slate-500 sm:flex-row">
        <span>© Agenda Escolar Digital</span>
        <div className="flex items-center gap-4">
          <Link href="/#" className="transition-colors hover:text-slate-700">
            Sobre la plataforma
          </Link>
          <Link href="/#" className="transition-colors hover:text-slate-700">
            Términos
          </Link>
          <Link href="/#" className="transition-colors hover:text-slate-700">
            Contacto
          </Link>
        </div>
      </div>
    </footer>
  );
}
