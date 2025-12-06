/**
 * OAuth Error Mapping
 * Maps common OAuth provider errors to user-friendly messages
 */

export interface OAuthError {
    code: string;
    message: string;
    userMessage: string;
    troubleshooting: string[];
}

export const OAUTH_ERRORS: Record<string, OAuthError> = {
    redirect_uri_mismatch: {
        code: 'redirect_uri_mismatch',
        message: 'OAuth redirect URI mismatch',
        userMessage: 'Authentication configuration error. Please contact support.',
        troubleshooting: [
            'Verify Google Console redirect URI exactly matches: {NEXTAUTH_URL}/api/auth/callback/google',
            'Check that NEXTAUTH_URL includes the correct scheme (http/https)',
            'Ensure no trailing slashes in NEXTAUTH_URL',
            'Verify the authorized redirect URIs in Google Cloud Console',
        ],
    },
    invalid_client: {
        code: 'invalid_client',
        message: 'Invalid OAuth client credentials',
        userMessage: 'Authentication service configuration error. Please contact support.',
        troubleshooting: [
            'Verify GOOGLE_CLIENT_ID is set correctly in environment variables',
            'Verify GOOGLE_CLIENT_SECRET is set correctly in environment variables',
            'Check that credentials match those in Google Cloud Console',
            'Ensure OAuth client is enabled in Google Cloud Console',
        ],
    },
    access_denied: {
        code: 'access_denied',
        message: 'User denied access or domain not allowed',
        userMessage: 'Sign-in was cancelled or your email domain is not authorized.',
        troubleshooting: [
            'User cancelled the OAuth consent screen',
            'Email domain may not be in the allowed list (check ALLOWED_EMAIL_DOMAINS)',
            'User may not have permission to access this application',
        ],
    },
    invalid_grant: {
        code: 'invalid_grant',
        message: 'Invalid authorization code or refresh token',
        userMessage: 'Authentication session expired. Please try signing in again.',
        troubleshooting: [
            'Authorization code may have expired (10 minutes timeout)',
            'Refresh token may have been revoked',
            'Check system clock synchronization (time skew)',
        ],
    },
    no_cookie: {
        code: 'no_cookie',
        message: 'Session cookie not set or blocked',
        userMessage: 'Unable to maintain session. Please check your browser settings.',
        troubleshooting: [
            'Ensure cookies are enabled in browser',
            'Check that secure flag matches protocol (HTTPS in production)',
            'Verify cookie domain matches application domain',
            'Check for browser extensions blocking cookies',
            'Ensure SameSite cookie policy is compatible',
        ],
    },
    OAuthSignin: {
        code: 'OAuthSignin',
        message: 'Error constructing OAuth authorization URL',
        userMessage: 'Unable to start sign-in process. Please try again.',
        troubleshooting: [
            'Check GOOGLE_CLIENT_ID is set',
            'Verify NEXTAUTH_URL is configured correctly',
            'Check network connectivity',
        ],
    },
    OAuthCallback: {
        code: 'OAuthCallback',
        message: 'Error handling OAuth callback',
        userMessage: 'Sign-in failed. Please try again.',
        troubleshooting: [
            'Check server logs for detailed error',
            'Verify callback URL configuration',
            'Check database connectivity (if using database sessions)',
        ],
    },
    OAuthAccountNotLinked: {
        code: 'OAuthAccountNotLinked',
        message: 'Email already exists with different provider',
        userMessage: 'An account with this email already exists. Please sign in with your original method.',
        troubleshooting: [
            'User may have signed up with credentials first',
            'Try signing in with email/password instead',
            'Account linking may need to be enabled',
        ],
    },
    EmailSignin: {
        code: 'EmailSignin',
        message: 'Error sending verification email',
        userMessage: 'Unable to send verification email. Please try again.',
        troubleshooting: [
            'Check email service configuration',
            'Verify email address is valid',
        ],
    },
    CredentialsSignin: {
        code: 'CredentialsSignin',
        message: 'Invalid credentials',
        userMessage: 'Invalid email or password.',
        troubleshooting: [
            'Verify email and password are correct',
            'Check if account exists',
            'Try password reset if forgotten',
        ],
    },
    SessionRequired: {
        code: 'SessionRequired',
        message: 'Authentication required',
        userMessage: 'Please sign in to continue.',
        troubleshooting: [
            'Session may have expired',
            'Sign in again to access this page',
        ],
    },
};

/**
 * Get user-friendly error message for OAuth error code
 */
export function getOAuthErrorMessage(errorCode: string): string {
    const error = OAUTH_ERRORS[errorCode];
    return error?.userMessage || 'An authentication error occurred. Please try again.';
}

/**
 * Get troubleshooting steps for OAuth error
 */
export function getOAuthTroubleshooting(errorCode: string): string[] {
    const error = OAUTH_ERRORS[errorCode];
    return error?.troubleshooting || ['Check server logs for more details', 'Contact support if the issue persists'];
}

/**
 * Log OAuth error with context
 */
export function logOAuthError(errorCode: string, context?: Record<string, unknown>): void {
    const error = OAUTH_ERRORS[errorCode];

    console.error('[OAuth Error]', {
        code: errorCode,
        message: error?.message || 'Unknown error',
        timestamp: new Date().toISOString(),
        ...context,
    });

    if (error?.troubleshooting) {
        console.error('[OAuth Troubleshooting]', error.troubleshooting);
    }
}
