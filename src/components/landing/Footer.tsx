import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-base font-semibold text-slate-900">Agenda Escolar Digital</p>
            <p className="mt-2 text-sm text-slate-600">
              Plataforma inteligente de recordatorios escolares para instituciones educativas.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Producto</p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="#features" className="text-slate-600 transition-colors hover:text-slate-900">
                  Características
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="text-slate-600 transition-colors hover:text-slate-900">
                  Cómo funciona
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-slate-600 transition-colors hover:text-slate-900">
                  Planes
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Cuenta</p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/registro-institucion" className="text-slate-600 transition-colors hover:text-slate-900">
                  Registrarse
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-slate-600 transition-colors hover:text-slate-900">
                  Iniciar sesión
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Legal</p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/#" className="text-slate-600 transition-colors hover:text-slate-900">
                  Términos de uso
                </Link>
              </li>
              <li>
                <Link href="/#" className="text-slate-600 transition-colors hover:text-slate-900">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-200 pt-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Agenda Escolar Digital. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
