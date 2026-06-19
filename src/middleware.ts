import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { PLATFORM_ADMIN_LOGIN } from '@/lib/platform-admin/constants';

function getPlatformAdminEmails(): string[] {
  const raw = process.env.PLATFORM_ADMIN_EMAILS?.trim();
  if (!raw) return [];
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

function isPlatformAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getPlatformAdminEmails().includes(email.trim().toLowerCase());
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isPlatformRoute = pathname.startsWith('/gestion-vortico');

  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isPlatformRoute) {
    if (pathname.startsWith('/gestion-vortico/acceso')) {
      return response;
    }

    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = PLATFORM_ADMIN_LOGIN;
      return NextResponse.redirect(loginUrl);
    }

    if (!isPlatformAdminEmail(user.email)) {
      const deniedUrl = request.nextUrl.clone();
      deniedUrl.pathname = PLATFORM_ADMIN_LOGIN;
      deniedUrl.searchParams.set('error', 'no_access');
      return NextResponse.redirect(deniedUrl);
    }

    return response;
  }

  if (!user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ['/institucion/:path*', '/gestion-vortico/:path*'],
};
