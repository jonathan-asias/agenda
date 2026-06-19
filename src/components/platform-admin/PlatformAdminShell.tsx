'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import {
  PLATFORM_ADMIN_BASE,
  PLATFORM_ADMIN_LOGIN,
} from '@/lib/platform-admin/constants';

const NAV = [
  { href: PLATFORM_ADMIN_BASE, label: 'Resumen', exact: true },
  { href: `${PLATFORM_ADMIN_BASE}/instituciones`, label: 'Instituciones' },
  { href: `${PLATFORM_ADMIN_BASE}/administradores`, label: 'Administradores' },
  { href: `${PLATFORM_ADMIN_BASE}/docentes`, label: 'Docentes' },
];

export default function PlatformAdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useAuth();
  const [email, setEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

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

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Verificando acceso…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <aside className="w-64 shrink-0 border-r border-slate-800 bg-slate-900/80 flex flex-col">
        <div className="p-5 border-b border-slate-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
            Gestión interna
          </p>
          <h1 className="text-lg font-bold text-white mt-1">Agenda Virtual</h1>
          {email && <p className="text-xs text-slate-500 mt-2 truncate">{email}</p>}
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
                    ? 'bg-violet-600/20 text-violet-300'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-slate-800">
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-950/40 transition-colors text-left"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
