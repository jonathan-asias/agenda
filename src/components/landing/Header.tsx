'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LANDING_NAV_ITEMS, resolveLandingNavHref } from '@/lib/landing-sections';
import {
  landingBrandLinkClass,
  landingNavLinkClass,
  landingPrimaryButtonClass,
} from '@/lib/landing-nav-styles';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-950 bg-blue-800 shadow-md">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-4">
        <Link href="/" className={landingBrandLinkClass}>
          Agenda Virtual
        </Link>

        <nav
          className="hidden items-center justify-center gap-3 md:flex lg:gap-4"
          aria-label="Navegación principal"
        >
          {LANDING_NAV_ITEMS.map((link) => (
            <Link key={link.slug} href={resolveLandingNavHref(link, pathname)} className={landingNavLinkClass}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex justify-end">
          <Link href="/login" className={landingPrimaryButtonClass}>
            Iniciar sesión
          </Link>
        </div>
      </div>

      <nav
        className="flex items-center justify-start gap-2 overflow-x-auto border-t border-blue-900/50 px-6 py-2.5 md:hidden"
        aria-label="Navegación móvil"
      >
        {LANDING_NAV_ITEMS.map((link) => (
          <Link
            key={`mobile-${link.slug}`}
            href={resolveLandingNavHref(link, pathname)}
            className={landingNavLinkClass}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
