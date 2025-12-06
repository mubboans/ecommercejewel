import { NextRequest, NextResponse } from 'next/server';

/**
 * Debug endpoint to see what redirect_uri NextAuth is sending to Google
 * Visit: http://localhost:3000/api/auth/debug-oauth
 */
export async function GET(request: NextRequest) {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const clientId = process.env.GOOGLE_CLIENT_ID;

    // This is what NextAuth constructs
    const callbackUrl = `${baseUrl}/api/auth/callback/google`;

    return NextResponse.json({
        debug: {
            NEXTAUTH_URL: process.env.NEXTAUTH_URL,
            constructedCallbackUrl: callbackUrl,
            GOOGLE_CLIENT_ID: clientId ? `${clientId.substring(0, 20)}...` : 'NOT_SET',

            instructions: [
                '1. Copy the "constructedCallbackUrl" value below',
                '2. Go to Google Cloud Console',
                '3. Add this EXACT URL to Authorized redirect URIs',
                '4. Save and wait 1-2 minutes',
            ],

            expectedGoogleConsoleEntry: callbackUrl,
        },

        troubleshooting: {
            commonIssues: [
                'Trailing slash in NEXTAUTH_URL (should not have one)',
                'Wrong protocol (http vs https)',
                'Duplicate NEXTAUTH_URL entries in .env.local',
                'Google Console changes not propagated yet (wait 2 minutes)',
                'Using wrong OAuth Client ID',
            ],
        },
    });
}
