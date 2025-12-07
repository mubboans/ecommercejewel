// middleware.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
    function middleware(req) {
        const { pathname } = req.nextUrl;
        const { token } = req.nextauth;

        // Admin routes protection
        if (pathname.startsWith('/admin') && token?.role !== 'admin') {
            // If user is logged in but not admin, redirect to home
            if (token) {
                return NextResponse.redirect(new URL('/', req.url));
            }
            // If user is not logged in, redirect to signin
            const url = new URL('/auth/signin', req.url);
            url.searchParams.set('callbackUrl', req.nextUrl.pathname);
            url.searchParams.set('error', 'AccessDenied');
            return NextResponse.redirect(url);
        }

        // API admin routes protection
        if (pathname.startsWith('/api/admin') && token?.role !== 'admin') {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }

        // Protected user routes
        const protectedRoutes = ['/profile', '/orders', '/checkout'];
        if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
            const url = new URL('/auth/signin', req.url);
            url.searchParams.set('callbackUrl', req.nextUrl.pathname);
            return NextResponse.redirect(url);
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;

                // Allow access to public routes and auth API
                const publicRoutes = [
                    '/',
                    '/products',
                    '/auth/signin',
                    '/auth/signup',
                    '/auth/forgot-password',
                    '/auth/reset-password',
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
                    '/returns',
                    '/cancel-refund',
                ];

                // Check if current path is public
                const isPublicRoute = publicRoutes.some(route =>
                    pathname === route ||
                    pathname.startsWith(route + '/') ||
                    pathname.startsWith('/api/auth/') // Explicitly allow all auth API routes
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
         * - api/auth (auth API routes - important!)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
        '/api/admin/:path*',
        '/api/orders/:path*',
        '/api/users/:path*',
    ],
};