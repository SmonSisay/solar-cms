import createMiddleware from 'next-intl/middleware';
import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const VALID_ROLES = ['super_admin', 'admin', 'editor', 'content_manager'];
const SUPER_ADMIN_PATHS = ['/admin/users', '/admin/settings'];

// Edge-safe auth using only the config (no Mongoose providers)
const { auth } = NextAuth(authConfig);

const intlMiddleware = createMiddleware({
  locales: ['en', 'am'],
  defaultLocale: 'en',
  localePrefix: 'always',
});

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Admin route guard (JWT-only, Edge-safe) ──────────────────────────────
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    const session = await auth();
    const role = session?.user?.role;

    if (!session?.user || !role || !VALID_ROLES.includes(role)) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (SUPER_ADMIN_PATHS.some((p) => pathname.startsWith(p)) && role !== 'super_admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    return NextResponse.next();
  }

  // ── i18n for all public routes ────────────────────────────────────────────
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};

