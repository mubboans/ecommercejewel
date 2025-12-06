/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { signInSchema } from '@/lib/validations';
import connectDB from '@/lib/db/mongodb';
import User from '@/models/User';
import { AuthUser } from '@/types';
import { logOAuthError } from './oauth-errors';

/**
 * Production-Ready NextAuth Configuration
 * 
 * Features:
 * - Google OAuth with minimal scopes
 * - Configurable session strategy (JWT or database)
 * - Secure cookie configuration with __Host- prefix
 * - Email domain filtering for OAuth
 * - Comprehensive event logging
 * - Refresh token handling
 * - Account linking by email
 * 
 * Required Environment Variables:
 * - NEXTAUTH_URL: Application base URL (must match Google Console)
 * - NEXTAUTH_SECRET: 32+ byte random string (generate with: openssl rand -base64 32)
 * - GOOGLE_CLIENT_ID: Google OAuth client ID
 * - GOOGLE_CLIENT_SECRET: Google OAuth client secret
 * 
 * Optional Environment Variables:
 * - AUTH_SESSION_STRATEGY: "jwt" (default) or "database"
 * - ALLOWED_EMAIL_DOMAINS: Comma-separated list of allowed email domains
 * - NEXTAUTH_DEBUG: "true" or "false" (default: false in production)
 */

// Session strategy from environment (default: jwt)
const SESSION_STRATEGY = (process.env.AUTH_SESSION_STRATEGY as 'jwt' | 'database') || 'jwt';

// Session strategy tradeoffs:
// - jwt: Stateless, no DB session reads, high throughput. Refresh token rotation is manual.
//        Use when you want maximum performance and don't need server-side session revocation.
// - database: Server-side session persistence, store provider refresh tokens encrypted,
//             easier session revocation and refresh token rotation.
//             Use when you need fine-grained session control and refresh token management.

// Allowed email domains for OAuth (optional filtering)
const ALLOWED_EMAIL_DOMAINS = process.env.ALLOWED_EMAIL_DOMAINS
  ? process.env.ALLOWED_EMAIL_DOMAINS.split(',').map(d => d.trim().toLowerCase())
  : null;

// Production environment check
const isProduction = process.env.NODE_ENV === 'production';

// Validate NEXTAUTH_SECRET in production
if (isProduction && !process.env.NEXTAUTH_SECRET) {
  console.error('FATAL: NEXTAUTH_SECRET is required in production');
  console.error('Generate a secure secret with: openssl rand -base64 32');
  throw new Error('NEXTAUTH_SECRET missing in production');
}

if (isProduction && process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length < 32) {
  console.error('FATAL: NEXTAUTH_SECRET must be at least 32 characters in production');
  throw new Error('NEXTAUTH_SECRET too short');
}

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth Provider
    // Scopes: openid (user ID), email, profile (name, picture)
    // Additional scopes can be added via GOOGLE_OAUTH_SCOPES env var
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline', // Request refresh token
          response_type: 'code',
          scope: 'openid email profile',
        },
      },
      // Profile mapping
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          emailVerified: profile.email_verified,
          role: 'user' as const, // OAuth users default to 'user' role
        };
      },
    }),

    // Credentials Provider (existing email/password auth)
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          // Validate input
          const { email, password } = signInSchema.parse(credentials);

          // Connect to database
          await connectDB();

          // Find user
          const user = await User.findOne({ email }).select('+passwordHash');
          if (!user) {
            return null;
          }

          // Verify password (only for non-OAuth users)
          if (!user.passwordHash) {
            console.warn('User has no password (OAuth-only account)');
            return null;
          }

          const isValidPassword = await bcrypt.compare(password, user.passwordHash);
          if (!isValidPassword) {
            return null;
          }

          // Return user object
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.avatar,
          } as AuthUser;
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    })
  ],

  // Custom pages
  pages: {
    signIn: '/auth/signin',
    newUser: '/auth/signup',
    error: '/auth/signin', // Redirect errors to signin page
  },

  // Session configuration
  session: {
    strategy: SESSION_STRATEGY,
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Update session every 24 hours
  },

  // JWT configuration
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Cookies configuration
  // Using __Host- prefix for enhanced security when possible
  // See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#cookie_prefixes
  cookies: {
    sessionToken: {
      name: isProduction ? '__Host-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: isProduction, // HTTPS only in production
        // Note: If behind CDN/edge, ensure NEXTAUTH_URL and cookie domain match hosting setup
      },
    },
    callbackUrl: {
      name: isProduction ? '__Host-next-auth.callback-url' : 'next-auth.callback-url',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: isProduction,
      },
    },
    csrfToken: {
      name: isProduction ? '__Host-next-auth.csrf-token' : 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: isProduction,
      },
    },
  },

  // Callbacks
  callbacks: {
    /**
     * JWT Callback
     * Runs whenever a JWT is created or updated
     * Captures access_token, refresh_token, expires_at from OAuth provider
     */
    async jwt({ token, user, account, trigger }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = (user as AuthUser).role;
        token.email = user.email ?? undefined;
        token.name = user.name ?? undefined;
        token.picture = user.image ?? undefined;
      }

      // OAuth sign in - capture provider tokens
      if (account) {
        token.provider = account.provider;
        token.accessToken = account.access_token;
        token.expiresAt = account.expires_at;

        // Store refresh token (for database sessions, encrypt this at rest)
        // For JWT sessions, refresh token rotation must be handled manually
        if (SESSION_STRATEGY === 'database' && account.refresh_token) {
          // TODO: Encrypt refresh token before storing in database
          // Use your existing KMS or environment encryption key
          token.refreshToken = account.refresh_token;
        }

        // Link OAuth account to existing user by email
        if (account.provider === 'google' && user?.email) {
          try {
            await connectDB();
            await User.findOneAndUpdate(
              { email: user.email },
              {
                $set: {
                  googleId: account.providerAccountId,
                  isEmailVerified: true, // Google emails are verified
                  avatar: user.image,
                },
              },
              { upsert: true }
            );
          } catch (error) {
            console.error('Error linking OAuth account:', error);
          }
        }
      }

      // Handle token refresh (if implementing refresh token rotation)
      if (trigger === 'update' && token.expiresAt) {
        const now = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = (token.expiresAt as number) - now;

        // Refresh token if expiring in less than 5 minutes
        if (timeUntilExpiry < 300) {
          // TODO: Implement refresh token rotation
          console.log('Token expiring soon, should refresh');
        }
      }

      return token;
    },

    /**
     * Session Callback
     * Runs whenever session is checked
     * Returns minimal safe fields to client
     */
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'user' | 'admin';
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;

        // Only expose access token pointer if necessary (don't expose full token)
        // session.accessTokenExpiry = token.expiresAt;
      }
      return session;
    },

    /**
     * SignIn Callback
     * Controls whether user is allowed to sign in
     * Implements email domain filtering
     */
    async signIn({ user, account, profile }) {
      // Allow credentials sign-in
      if (account?.provider === 'credentials') {
        return true;
      }

      // OAuth sign-in validation
      if (account?.provider === 'google') {
        const email = user.email || (profile as any)?.email;

        if (!email) {
          console.error('No email provided by OAuth provider');
          return false;
        }

        // Email domain filtering (if configured)
        if (ALLOWED_EMAIL_DOMAINS && ALLOWED_EMAIL_DOMAINS.length > 0) {
          const emailDomain = email.split('@')[1]?.toLowerCase();

          if (!emailDomain || !ALLOWED_EMAIL_DOMAINS.includes(emailDomain)) {
            console.warn(`Sign-in denied: Email domain ${emailDomain} not in allowed list`);
            logOAuthError('access_denied', {
              email: email.split('@')[0] + '@***', // Partial email for privacy
              domain: emailDomain,
              allowedDomains: ALLOWED_EMAIL_DOMAINS,
            });
            return false;
          }
        }

        // Create or update user in database
        try {
          await connectDB();

          const existingUser = await User.findOne({ email });

          if (existingUser) {
            // Update existing user with OAuth info
            await User.findByIdAndUpdate(existingUser._id, {
              $set: {
                googleId: account.providerAccountId,
                isEmailVerified: true,
                avatar: user.image,
                lastLoginAt: new Date(),
                registerBy: 'google', // Track OAuth registration
              },
              $inc: { loginCount: 1 },
            });
          } else {
            // Create new user from OAuth
            await User.create({
              name: user.name || 'User',
              email: email,
              googleId: account.providerAccountId,
              isEmailVerified: true,
              avatar: user.image,
              role: 'user',
              registerBy: 'google', // Track OAuth registration
              lastLoginAt: new Date(),
              loginCount: 1,
              // No password for OAuth-only users
            });
          }

          return true;
        } catch (error) {
          console.error('Error creating/updating OAuth user:', error);
          return false;
        }
      }

      return true;
    },

    /**
     * Redirect Callback
     * Controls where user is redirected after sign-in
     */
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  // Events for logging and monitoring
  events: {
    async signIn({ user, account, isNewUser }) {
      console.log('[Auth Event] Sign In', {
        userId: user.id,
        email: user.email?.split('@')[0] + '@***', // Partial email for privacy
        provider: account?.provider,
        isNewUser,
        timestamp: new Date().toISOString(),
      });

      // TODO: Integrate with your logging/monitoring stack
      // Examples: Sentry, LogRocket, DataDog, CloudWatch
    },

    async signOut({ token }) {
      console.log('[Auth Event] Sign Out', {
        userId: token?.id,
        timestamp: new Date().toISOString(),
      });
    },

    async createUser({ user }) {
      console.log('[Auth Event] User Created', {
        userId: user.id,
        email: user.email?.split('@')[0] + '@***',
        timestamp: new Date().toISOString(),
      });
    },

    async linkAccount({ user, account }) {
      console.log('[Auth Event] Account Linked', {
        userId: user.id,
        provider: account.provider,
        timestamp: new Date().toISOString(),
      });
    },

    async session({ session, token }) {
      // Log session checks (can be noisy, consider rate limiting)
      if (process.env.NEXTAUTH_DEBUG === 'true') {
        console.log('[Auth Event] Session Check', {
          userId: token?.id || session?.user?.id,
          timestamp: new Date().toISOString(),
        });
      }
    },
  },

  // Secret (validated above)
  secret: process.env.NEXTAUTH_SECRET,

  // Debug mode (disabled in production)
  debug: process.env.NEXTAUTH_DEBUG === 'true' && !isProduction,
};