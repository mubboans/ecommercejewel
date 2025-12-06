import { NextRequest, NextResponse } from 'next/server';

/**
 * Debug endpoint to check OAuth configuration
 * 
 * This endpoint is secured with AUTH_DEBUG_TOKEN and should be disabled in production
 * unless explicitly needed for troubleshooting.
 * 
 * Usage:
 * GET /api/auth/config-check?token=YOUR_DEBUG_TOKEN
 * 
 * Returns:
 * - Environment variable status (without exposing values)
 * - Callback URL configuration
 * - Session strategy
 * - Security settings
 */

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    // Security check: require debug token
    const debugToken = process.env.AUTH_DEBUG_TOKEN;
    const isProduction = process.env.NODE_ENV === 'production';

    // Disable in production unless explicitly enabled
    if (isProduction && !debugToken) {
        return NextResponse.json(
            { error: 'Debug endpoint disabled in production' },
            { status: 403 }
        );
    }

    // Verify token if set
    if (debugToken && token !== debugToken) {
        return NextResponse.json(
            { error: 'Invalid debug token' },
            { status: 401 }
        );
    }

    // If no debug token is set in development, allow access
    if (!debugToken && !isProduction) {
        // Continue to show config
    } else if (!token) {
        return NextResponse.json(
            { error: 'Debug token required. Set AUTH_DEBUG_TOKEN in environment.' },
            { status: 401 }
        );
    }

    // Gather configuration status
    const config = {
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),

        // Required variables (check presence only, don't expose values)
        requiredVars: {
            NEXTAUTH_URL: {
                set: !!process.env.NEXTAUTH_URL,
                value: process.env.NEXTAUTH_URL || 'NOT_SET',
            },
            NEXTAUTH_SECRET: {
                set: !!process.env.NEXTAUTH_SECRET,
                length: process.env.NEXTAUTH_SECRET?.length || 0,
                isStrong: (process.env.NEXTAUTH_SECRET?.length || 0) >= 32,
            },
            GOOGLE_CLIENT_ID: {
                set: !!process.env.GOOGLE_CLIENT_ID,
                preview: process.env.GOOGLE_CLIENT_ID
                    ? `${process.env.GOOGLE_CLIENT_ID.substring(0, 10)}...`
                    : 'NOT_SET',
            },
            GOOGLE_CLIENT_SECRET: {
                set: !!process.env.GOOGLE_CLIENT_SECRET,
                length: process.env.GOOGLE_CLIENT_SECRET?.length || 0,
            },
        },

        // Optional variables
        optionalVars: {
            AUTH_SESSION_STRATEGY: process.env.AUTH_SESSION_STRATEGY || 'jwt (default)',
            ALLOWED_EMAIL_DOMAINS: process.env.ALLOWED_EMAIL_DOMAINS || 'none (all domains allowed)',
            NEXTAUTH_DEBUG: process.env.NEXTAUTH_DEBUG || 'false',
        },

        // Computed values
        callbackUrls: {
            google: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
            base: process.env.NEXTAUTH_URL,
        },

        // Security checks
        security: {
            httpsEnabled: process.env.NEXTAUTH_URL?.startsWith('https://') || false,
            secretStrength: (process.env.NEXTAUTH_SECRET?.length || 0) >= 32 ? 'strong' : 'weak',
            debugMode: process.env.NEXTAUTH_DEBUG === 'true',
            isProduction: isProduction,
        },

        // Validation status
        validation: {
            allRequiredVarsSet:
                !!process.env.NEXTAUTH_URL &&
                !!process.env.NEXTAUTH_SECRET &&
                !!process.env.GOOGLE_CLIENT_ID &&
                !!process.env.GOOGLE_CLIENT_SECRET,

            productionReady:
                !!process.env.NEXTAUTH_URL &&
                process.env.NEXTAUTH_URL.startsWith('https://') &&
                !!process.env.NEXTAUTH_SECRET &&
                (process.env.NEXTAUTH_SECRET?.length || 0) >= 32 &&
                process.env.NEXTAUTH_DEBUG !== 'true' &&
                !!process.env.GOOGLE_CLIENT_ID &&
                !!process.env.GOOGLE_CLIENT_SECRET,
        },

        // Test commands
        testCommands: {
            curlOAuthRedirect: `curl -I "${process.env.NEXTAUTH_URL}/api/auth/signin/google"`,
            expectedResult: '302 redirect to accounts.google.com',
        },
    };

    return NextResponse.json(config, {
        headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
    });
}
