import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;

    // Admin routes protection
    if (pathname.startsWith('/admin') && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/auth/signin?error=AccessDenied', req.url));
    }

    // API admin routes protection
    if (pathname.startsWith('/api/admin') && token?.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Protected user routes
    const protectedRoutes = ['/profile', '/orders', '/checkout'];
    if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow access to public routes
        const publicRoutes = [
          '/',
          '/products',
          '/auth/signin',
          '/auth/signup',
          '/api/auth',
          '/api/products',
          '/about',
            '/contact',
          '/help',
          '/press',
          '/privacy',
          '/size-guide',
          '/shipping',
          '/terms',
          '/returns'
        ];

        // Check if current path is public
        const isPublicRoute = publicRoutes.some(route => 
          pathname === route || pathname.startsWith(route + '/')
        );

        if (isPublicRoute) {
          return true;
        }

        // For protected routes, require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/api/admin/:path*',
    '/api/orders/:path*',
    '/api/users/:path*',
  ],
};