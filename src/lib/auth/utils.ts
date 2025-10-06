import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth.config';
import { AppError } from '@/types';

/**
 * Hash password with bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Verify password with bcrypt
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * Get current user session (server-side)
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Get current authenticated user or throw error
 */
export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.user) {
    throw new AppError('Unauthorized', 401);
  }
  return session.user;
}

/**
 * Check if user is admin
 */
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (user.role !== 'admin') {
    throw new AppError('Access denied. Admin role required.', 403);
  }
  return user;
}

/**
 * Get user ID from session
 */
export async function getCurrentUserId(): Promise<string> {
  const user = await getCurrentUser();
  return user.id;
}

/**
 * Generate secure random token
 */
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number = 15 * 60 * 1000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  isRateLimited(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    // Get existing requests for this identifier
    let requests = this.requests.get(identifier) || [];

    // Filter out old requests
    requests = requests.filter(time => time > windowStart);

    // Check if rate limit exceeded
    if (requests.length >= this.maxRequests) {
      return true;
    }

    // Add current request
    requests.push(now);
    this.requests.set(identifier, requests);

    return false;
  }

  cleanup(): void {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    for (const [identifier, requests] of this.requests.entries()) {
      const validRequests = requests.filter(time => time > windowStart);
      if (validRequests.length === 0) {
        this.requests.delete(identifier);
      } else {
        this.requests.set(identifier, validRequests);
      }
    }
  }
}

// Global rate limiters
export const authRateLimiter = new RateLimiter(15 * 60 * 1000, 5); // 5 attempts per 15 minutes
export const apiRateLimiter = new RateLimiter(15 * 60 * 1000, 100); // 100 requests per 15 minutes

// Clean up rate limiters every 30 minutes
if (typeof window === 'undefined') {
  setInterval(() => {
    authRateLimiter.cleanup();
    apiRateLimiter.cleanup();
  }, 30 * 60 * 1000);
}