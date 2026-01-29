'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showNavigation?: boolean;
  showBranding?: boolean;
}

interface BrandingData {
  logoUrl?: string | null;
  bannerUrl?: string | null;
  colorPrimario?: string | null;
  colorSecundario?: string | null;
}

const getCachedBranding = (institucionId?: string) => {
  if (!institucionId || typeof window === 'undefined') {
    return null;
  }
  try {
    const cached = localStorage.getItem(`branding:${institucionId}`);
    return cached ? (JSON.parse(cached) as BrandingData) : null;
  } catch (error) {
    console.error('Error leyendo branding del cache:', error);
    return null;
  }
};

export default function Header({ title, subtitle, showNavigation = true, showBranding = true }: HeaderProps) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const { signOut, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userType, setUserType] = useState<'institucion' | 'admin' | 'docente' | null>(null);
  const institucionId = params?.id as string;
  const [branding, setBranding] = useState<BrandingData | null>(() => getCachedBranding(institucionId));
  const [brandingChecked, setBrandingChecked] = useState(Boolean(getCachedBranding(institucionId)));

  // Detectar el tipo de usuario basándose en la ruta actual
  useEffect(() => {
    if (pathname.includes('/admin')) {
      setUserType('admin');
    } else if (pathname.includes('/docente')) {
      setUserType('docente');
    } else {
      setUserType('institucion');
    }
  }, [pathname]);

  // Cerrar el menú cuando cambia la ruta
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const fetchBranding = async () => {
      if (!showBranding || !institucionId) {
        setBranding(null);
        setBrandingChecked(true);
        return;
      }

      try {
        const cached = getCachedBranding(institucionId);
        if (cached) {
          setBranding(cached);
          setBrandingChecked(true);
        }
        const response = await fetch(`/api/instituciones/${institucionId}/branding`);
        if (response.ok) {
          const data = await response.json();
          const brandingData = {
            logoUrl: data.logoUrl,
            bannerUrl: data.bannerUrl,
            colorPrimario: data.color_primario,
            colorSecundario: data.color_secundario
          };
          setBranding(brandingData);
          try {
            localStorage.setItem(`branding:${institucionId}`, JSON.stringify(brandingData));
          } catch (error) {
            console.error('Error guardando branding en cache:', error);
          }
        }
      } catch (error) {
        console.error('Error al cargar branding:', error);
      } finally {
        setBrandingChecked(true);
      }
    };

    fetchBranding();
  }, [institucionId, showBranding]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Determinar los enlaces según el tipo de usuario
  const getNavigationLinks = () => {
    const baseLinks = [
      {
        name: 'Dashboard',
        href: userType === 'admin' 
          ? `/institucion/${institucionId}/admin`
          : userType === 'docente'
          ? `/institucion/${institucionId}/docente`
          : `/institucion/${institucionId}`,
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        ),
      },
      {
        name: 'Perfil',
        href: userType === 'admin'
          ? `/institucion/${institucionId}/admin/perfil`
          : userType === 'docente'
          ? `/institucion/${institucionId}/docente/perfil`
          : `/institucion/${institucionId}/perfil`,
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        ),
      },
    ];

    // Solo mostrar Configuración para instituciones
    if (userType === 'institucion') {
      baseLinks.push({
        name: 'Configuración',
        href: `/institucion/${institucionId}/configuracion`,
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
      });
    }

    // Enlaces adicionales para administradores
    if (userType === 'admin') {
      baseLinks.push(
        {
          name: 'Grados',
          href: `/institucion/${institucionId}/admin/grados`,
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" />
            </svg>
          )
        },
        {
          name: 'Cursos',
          href: `/institucion/${institucionId}/admin/cursos`,
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          )
        },
        {
          name: 'Áreas',
          href: `/institucion/${institucionId}/admin/areas`,
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h4l2 2h6a2 2 0 012 2v1H4V6zM4 9h16v7a2 2 0 01-2 2H6a2 2 0 01-2-2V9z" />
            </svg>
          )
        },
        {
          name: 'Materias',
          href: `/institucion/${institucionId}/admin/materias`,
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5" />
            </svg>
          )
        },
        {
          name: 'Docentes',
          href: `/institucion/${institucionId}/admin/docentes`,
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )
        },
        {
          name: 'Estudiantes',
          href: `/institucion/${institucionId}/admin/estudiantes`,
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            </svg>
          )
        }
      );
    }

    return baseLinks;
  };

  const navigationLinks = getNavigationLinks();

  return (
    <>
      <header
        className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50"
        style={{
          backgroundColor: branding?.colorSecundario || undefined
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo y Título */}
            <div className="flex items-center">
              <Link
                href={`/institucion/${institucionId}`}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              >
                <div
                  className="w-20 h-20 rounded-lg flex items-center justify-center overflow-hidden bg-transparent relative"
                >
                  {showBranding && branding?.logoUrl ? (
                    <Image
                      src={branding.logoUrl}
                      alt="Logo institución"
                      fill
                      sizes="80px"
                      className="object-contain"
                      priority
                      unoptimized
                    />
                  ) : showBranding && !brandingChecked ? (
                    <div className="w-full h-full animate-pulse bg-slate-200" />
                  ) : (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  )}
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900">
                    Agenda Virtual
                  </h1>
                  {subtitle && (
                    <p className="text-xs text-slate-900">
                      {subtitle}
                    </p>
                  )}
                </div>
              </Link>
              {title && (
                <div className="ml-8 pl-8 border-l border-slate-200 hidden md:block">
                  <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                </div>
              )}
            </div>

            {/* Usuario y Acciones */}
            <div className="flex items-center space-x-3">
              {user && (
                <div className="hidden sm:flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">{user.email}</p>
                    <p className="text-xs text-slate-500">Usuario activo</p>
                  </div>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Menú hamburguesa - Visible en todas las pantallas */}
              {showNavigation && (
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    aria-label="Toggle menu"
                    aria-expanded={isMenuOpen}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {isMenuOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      )}
                    </svg>
                  </button>

                  {/* Menú desplegable del hamburguesa */}
                  {isMenuOpen && (
                    <>
                      {/* Overlay para cerrar al hacer clic fuera */}
                      <div
                        className="fixed inset-0 bg-black/20 z-40"
                        onClick={() => setIsMenuOpen(false)}
                      />
                      {/* Menú desplegable */}
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 z-50">
                        <nav className="py-2">
                          {navigationLinks.map((link) => (
                            <Link
                              key={link.name}
                              href={link.href}
                              onClick={() => setIsMenuOpen(false)}
                              className="flex items-center px-4 py-3 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                              <span className="mr-3 text-blue-600">{link.icon}</span>
                              {link.name}
                            </Link>
                          ))}
                          <div className="border-t border-slate-200 my-2"></div>
                          <button
                            onClick={() => {
                              setIsMenuOpen(false);
                              handleSignOut();
                            }}
                            className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Cerrar Sesión
                          </button>
                        </nav>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      {showBranding && (
        <div
          className="w-full flex justify-center"
          style={{ backgroundColor: branding?.colorPrimario || '#2563eb' }}
        >
          {branding?.bannerUrl ? (
            <Image
              src={branding.bannerUrl}
              alt="Banner institución"
              width={1600}
              height={400}
              sizes="100vw"
              className="w-auto h-auto block"
              priority
              unoptimized
            />
          ) : !brandingChecked ? (
            <div className="w-full max-w-7xl h-20 animate-pulse bg-white/30" />
          ) : null}
        </div>
      )}
    </>
  );
}
