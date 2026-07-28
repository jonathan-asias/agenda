import Link from 'next/link';
import { landingBrandLinkClass, landingNavLinkClass } from '@/lib/landing-nav-styles';

export default function Footer() {
  return (
    <footer className="w-full border-t border-blue-950 bg-blue-800">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className={landingBrandLinkClass}>
              Agenda Virtual
            </Link>
            <p className="mt-3 text-sm text-blue-100">
              Plataforma de recordatorios escolares por Email y WhatsApp para instituciones educativas.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Producto</p>
            <ul className="mt-3 space-y-1">
              <li>
                <Link href="/#benefits" className={landingNavLinkClass}>
                  Beneficios
                </Link>
              </li>
              <li>
                <Link href="/#caracteristicas" className={landingNavLinkClass}>
                  Características
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className={landingNavLinkClass}>
                  Cómo funciona
                </Link>
              </li>
              <li>
                <Link href="/#planes" className={landingNavLinkClass}>
                  Planes
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Acceso</p>
            <ul className="mt-3 space-y-1">
              <li>
                <Link href="/login" className={landingNavLinkClass}>
                  Iniciar sesión
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Legal</p>
            <ul className="mt-3 space-y-1">
              <li>
                <Link href="/#" className={landingNavLinkClass}>
                  Términos de uso
                </Link>
              </li>
              <li>
                <Link href="/contacto" className={landingNavLinkClass}>
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-blue-900/50 pt-8 text-center text-sm text-blue-200">
          © {new Date().getFullYear()} Agenda Virtual. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
