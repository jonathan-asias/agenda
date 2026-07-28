'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import {
  PLATFORM_ADMIN_BASE,
  PLATFORM_ADMIN_LOGIN,
} from '@/lib/platform-admin/constants';
import {
  type PlatformThemePreference,
  readPlatformThemePreference,
  resolvePlatformTheme,
  writePlatformThemePreference,
} from '@/lib/platform-admin/theme';

const NAV = [
  { href: PLATFORM_ADMIN_BASE, label: 'Resumen', exact: true },
  { href: `${PLATFORM_ADMIN_BASE}/instituciones`, label: 'Instituciones' },
  { href: `${PLATFORM_ADMIN_BASE}/pruebas`, label: 'Pruebas' },
  { href: `${PLATFORM_ADMIN_BASE}/administradores`, label: 'Administradores' },
  { href: `${PLATFORM_ADMIN_BASE}/docentes`, label: 'Docentes' },
];

const THEME_OPTIONS: Array<{ value: PlatformThemePreference; label: string }> = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Oscuro' },
  { value: 'system', label: 'Sistema' },
];

export default function PlatformAdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useAuth();
  const [email, setEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [themePreference, setThemePreference] = useState<PlatformThemePreference>('dark');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const preference = readPlatformThemePreference();
    setThemePreference(preference);
    setResolvedTheme(resolvePlatformTheme(preference));
  }, []);

  useEffect(() => {
    setResolvedTheme(resolvePlatformTheme(themePreference));
    writePlatformThemePreference(themePreference);

    const resolved = resolvePlatformTheme(themePreference);
    document.documentElement.style.colorScheme = resolved;
    document.body.style.backgroundColor = resolved === 'light' ? '#f1f5f9' : '#020617';

    if (themePreference !== 'system') {
      return () => {
        document.documentElement.style.colorScheme = '';
        document.body.style.backgroundColor = '';
      };
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      const next = resolvePlatformTheme('system');
      setResolvedTheme(next);
      document.documentElement.style.colorScheme = next;
      document.body.style.backgroundColor = next === 'light' ? '#f1f5f9' : '#020617';
    };
    media.addEventListener('change', onChange);
    return () => {
      media.removeEventListener('change', onChange);
      document.documentElement.style.colorScheme = '';
      document.body.style.backgroundColor = '';
    };
  }, [themePreference]);

  useEffect(() => {
    fetch('/api/gestion-vortico/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.authorized && data.email) {
          setEmail(data.email);
        } else {
          router.replace(PLATFORM_ADMIN_LOGIN);
        }
      })
      .catch(() => router.replace(PLATFORM_ADMIN_LOGIN))
      .finally(() => setChecking(false));
  }, [router]);

  const handleSignOut = async () => {
    await signOut();
    router.push(PLATFORM_ADMIN_LOGIN);
  };

  const isLight = resolvedTheme === 'light';

  if (checking) {
    return (
      <div className="gv-shell min-h-screen bg-slate-950 flex items-center justify-center p-8" data-gv-theme={resolvedTheme}>
        <div className="w-full max-w-sm space-y-3" role="status" aria-label="Verificando acceso">
          <div className="h-3 w-32 rounded bg-slate-800 motion-safe:animate-pulse" />
          <div className="h-8 w-48 rounded bg-slate-800 motion-safe:animate-pulse" />
          <div className="h-3 w-40 rounded bg-slate-800 motion-safe:animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`gv-shell min-h-screen flex ${
        isLight ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'
      }`}
      data-gv-theme={resolvedTheme}
    >
      <aside
        className={`w-64 shrink-0 border-r flex flex-col ${
          isLight
            ? 'border-slate-200 bg-white'
            : 'border-slate-800 bg-slate-900/80'
        }`}
      >
        <div
          className={`p-5 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
            Gestión interna
          </p>
          <h1
            className={`text-lg font-bold mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}
          >
            Agenda Virtual
          </h1>
          {email && (
            <p className={`text-xs mt-2 truncate ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
              {email}
            </p>
          )}
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? isLight
                      ? 'bg-violet-100 text-violet-700'
                      : 'bg-violet-600/20 text-violet-300'
                    : isLight
                      ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div
          className={`p-3 border-t space-y-3 ${
            isLight ? 'border-slate-200' : 'border-slate-800'
          }`}
        >
          <div>
            <p
              className={`px-1 mb-2 text-[11px] font-semibold uppercase tracking-wide ${
                isLight ? 'text-slate-500' : 'text-slate-500'
              }`}
            >
              Apariencia
            </p>
            <div
              className={`grid grid-cols-3 gap-1 rounded-lg border p-1 ${
                isLight
                  ? 'border-slate-200 bg-slate-50'
                  : 'border-slate-700 bg-slate-950/60'
              }`}
              role="group"
              aria-label="Tema de la interfaz"
            >
              {THEME_OPTIONS.map((option) => {
                const selected = themePreference === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setThemePreference(option.value)}
                    aria-pressed={selected}
                    className={`rounded-md px-1.5 py-1.5 text-[11px] font-medium transition-colors ${
                      selected
                        ? 'bg-violet-600 text-white'
                        : isLight
                          ? 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className={`w-full rounded-lg px-3 py-2 text-sm text-left transition-colors ${
              isLight
                ? 'text-red-600 hover:bg-red-50'
                : 'text-red-400 hover:bg-red-950/40'
            }`}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className={`flex-1 overflow-auto ${isLight ? 'bg-slate-100' : 'bg-slate-950'}`}>
        <div className="max-w-7xl mx-auto p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
