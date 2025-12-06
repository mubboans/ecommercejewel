/**
 * Auth Startup Validation
 * Validates required environment variables and configuration on application startup
 * 
 * CRITICAL: This should be called early in the application lifecycle
 * to fail fast if required configuration is missing.
 */

interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
    info: string[];
}

/**
 * Validate authentication environment variables
 * Fails fast in production if critical variables are missing
 */
export function validateAuthConfig(): ValidationResult {
    const result: ValidationResult = {
        valid: true,
        errors: [],
        warnings: [],
        info: [],
    };

    const isProduction = process.env.NODE_ENV === 'production';
    const isDevelopment = process.env.NODE_ENV === 'development';

    // Required in all environments
    const requiredVars = {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    };

    // Required for Google OAuth
    const googleOAuthVars = {
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    };

    // Optional but recommended
    const optionalVars = {
        AUTH_SESSION_STRATEGY: process.env.AUTH_SESSION_STRATEGY,
        ALLOWED_EMAIL_DOMAINS: process.env.ALLOWED_EMAIL_DOMAINS,
        NEXTAUTH_DEBUG: process.env.NEXTAUTH_DEBUG,
    };

    // Check required variables
    for (const [key, value] of Object.entries(requiredVars)) {
        if (!value) {
            result.valid = false;
            result.errors.push(`Missing required environment variable: ${key}`);

            if (key === 'NEXTAUTH_SECRET') {
                result.errors.push(
                    'Generate a secure secret with: openssl rand -base64 32'
                );
                result.errors.push(
                    'NEXTAUTH_SECRET must be at least 32 bytes for production security'
                );
            }

            if (key === 'NEXTAUTH_URL') {
                result.errors.push(
                    'NEXTAUTH_URL must match your application URL exactly (e.g., https://yourdomain.com)'
                );
                result.errors.push(
                    'Google Console callback URL must be: {NEXTAUTH_URL}/api/auth/callback/google'
                );
            }
        }
    }

    // Validate NEXTAUTH_SECRET strength
    if (requiredVars.NEXTAUTH_SECRET) {
        const secret = requiredVars.NEXTAUTH_SECRET;
        if (secret.length < 32) {
            if (isProduction) {
                result.valid = false;
                result.errors.push(
                    `NEXTAUTH_SECRET is too short (${secret.length} chars). Must be at least 32 characters for production.`
                );
            } else {
                result.warnings.push(
                    `NEXTAUTH_SECRET is short (${secret.length} chars). Recommended: 32+ characters.`
                );
            }
        }

        // Check if it's a weak/default secret
        const weakSecrets = ['secret', 'test', 'development', 'changeme', '12345'];
        if (weakSecrets.some(weak => secret.toLowerCase().includes(weak))) {
            if (isProduction) {
                result.valid = false;
                result.errors.push('NEXTAUTH_SECRET appears to be a weak/default value. Use a strong random secret.');
            } else {
                result.warnings.push('NEXTAUTH_SECRET appears weak. Use a strong random secret for production.');
            }
        }
    }

    // Check Google OAuth variables
    const googleEnabled = googleOAuthVars.GOOGLE_CLIENT_ID || googleOAuthVars.GOOGLE_CLIENT_SECRET;

    if (googleEnabled) {
        for (const [key, value] of Object.entries(googleOAuthVars)) {
            if (!value) {
                result.warnings.push(
                    `Google OAuth partially configured: Missing ${key}. Google sign-in will not work.`
                );
            }
        }

        if (googleOAuthVars.GOOGLE_CLIENT_ID && googleOAuthVars.GOOGLE_CLIENT_SECRET) {
            result.info.push('✓ Google OAuth configured');
            result.info.push(
                `  Callback URL: ${requiredVars.NEXTAUTH_URL}/api/auth/callback/google`
            );
        }
    } else {
        result.info.push('Google OAuth not configured (credentials sign-in only)');
    }

    // Check NEXTAUTH_URL format
    if (requiredVars.NEXTAUTH_URL) {
        const url = requiredVars.NEXTAUTH_URL;

        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            result.valid = false;
            result.errors.push('NEXTAUTH_URL must include protocol (http:// or https://)');
        }

        if (url.endsWith('/')) {
            result.warnings.push('NEXTAUTH_URL should not have trailing slash');
        }

        if (isProduction && url.startsWith('http://')) {
            result.valid = false;
            result.errors.push('NEXTAUTH_URL must use HTTPS in production');
        }

        if (url.includes('localhost') && isProduction) {
            result.valid = false;
            result.errors.push('NEXTAUTH_URL cannot be localhost in production');
        }
    }

    // Check session strategy
    const sessionStrategy = optionalVars.AUTH_SESSION_STRATEGY || 'jwt';
    if (!['jwt', 'database'].includes(sessionStrategy)) {
        result.warnings.push(
            `Invalid AUTH_SESSION_STRATEGY: "${sessionStrategy}". Must be "jwt" or "database". Defaulting to "jwt".`
        );
    } else {
        result.info.push(`✓ Session strategy: ${sessionStrategy}`);

        if (sessionStrategy === 'jwt') {
            result.info.push('  - Stateless sessions (no DB reads)');
            result.info.push('  - Manual refresh token rotation');
        } else {
            result.info.push('  - Server-side session persistence');
            result.info.push('  - Encrypted refresh token storage');
            result.info.push('  - Easier session revocation');
        }
    }

    // Check email domain filtering
    if (optionalVars.ALLOWED_EMAIL_DOMAINS) {
        const domains = optionalVars.ALLOWED_EMAIL_DOMAINS.split(',').map(d => d.trim());
        result.info.push(`✓ Email domain filtering enabled: ${domains.join(', ')}`);
    } else {
        result.info.push('Email domain filtering: disabled (all domains allowed)');
    }

    // Check debug mode
    const debugMode = optionalVars.NEXTAUTH_DEBUG === 'true';
    if (debugMode) {
        if (isProduction) {
            result.valid = false;
            result.errors.push('NEXTAUTH_DEBUG must be false in production');
        } else {
            result.info.push('✓ Debug mode enabled (development only)');
        }
    }

    // Production-specific checks
    if (isProduction) {
        result.info.push('Environment: PRODUCTION');
        result.info.push('Security requirements:');
        result.info.push('  - HTTPS required');
        result.info.push('  - Strong NEXTAUTH_SECRET (32+ bytes)');
        result.info.push('  - Secure cookies enabled');
        result.info.push('  - Debug mode disabled');
    } else if (isDevelopment) {
        result.info.push('Environment: DEVELOPMENT');
    }

    return result;
}

/**
 * Print validation results to console
 */
export function printValidationResults(result: ValidationResult): void {
    console.log('\n' + '='.repeat(60));
    console.log('🔐 NextAuth Configuration Validation');
    console.log('='.repeat(60));

    if (result.errors.length > 0) {
        console.error('\n❌ ERRORS:');
        result.errors.forEach(error => console.error(`   ${error}`));
    }

    if (result.warnings.length > 0) {
        console.warn('\n⚠️  WARNINGS:');
        result.warnings.forEach(warning => console.warn(`   ${warning}`));
    }

    if (result.info.length > 0) {
        console.log('\nℹ️  CONFIGURATION:');
        result.info.forEach(info => console.log(`   ${info}`));
    }

    console.log('\n' + '='.repeat(60));

    if (!result.valid) {
        console.error('\n❌ Configuration validation FAILED\n');
    } else {
        console.log('\n✅ Configuration validation PASSED\n');
    }
}

/**
 * Validate and fail fast if configuration is invalid
 * Call this early in your application startup
 */
export function validateAuthConfigOrFail(): void {
    const result = validateAuthConfig();
    printValidationResults(result);

    if (!result.valid && process.env.NODE_ENV === 'production') {
        console.error('FATAL: Invalid authentication configuration in production');
        console.error('Application cannot start with invalid auth config');
        process.exit(1);
    }
}

/**
 * Generate sample curl command for testing OAuth redirect
 */
export function generateTestCommands(): string[] {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    return [
        '# Test OAuth redirect:',
        `curl -I "${baseUrl}/api/auth/signin/google"`,
        '',
        '# Expected: 302 redirect to accounts.google.com',
        '',
        '# Test credentials signin:',
        `curl -I "${baseUrl}/api/auth/signin"`,
        '',
        '# Expected: 200 OK',
    ];
}
