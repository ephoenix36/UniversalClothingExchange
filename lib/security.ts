/**
 * API Security Utilities
 * Provides rate limiting, request validation, and security headers
 */

import { NextRequest, NextResponse } from 'next/server';
import { ZodSchema, ZodError } from 'zod';

// ============================================================================
// RATE LIMITING
// ============================================================================

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  /**
   * Check if request should be rate limited
   * @returns true if rate limit exceeded
   */
  isRateLimited(identifier: string, config: RateLimitConfig): boolean {
    const now = Date.now();
    const windowStart = now - config.interval;
    
    // Get existing requests for this identifier
    const existingRequests = this.requests.get(identifier) || [];
    
    // Filter to only requests within current window
    const recentRequests = existingRequests.filter(time => time > windowStart);
    
    // Check if limit exceeded
    if (recentRequests.length >= config.maxRequests) {
      return true;
    }
    
    // Add current request
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);
    
    // Cleanup old entries periodically
    if (Math.random() < 0.01) { // 1% chance
      this.cleanup(windowStart);
    }
    
    return false;
  }

  private cleanup(cutoffTime: number) {
    for (const [key, times] of this.requests.entries()) {
      const recentTimes = times.filter(time => time > cutoffTime);
      if (recentTimes.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, recentTimes);
      }
    }
  }
}

// Singleton instance
const rateLimiter = new RateLimiter();

/**
 * Default rate limit configs by endpoint type
 */
export const RATE_LIMITS = {
  // Strict limits for auth and sensitive endpoints
  AUTH: { interval: 60 * 1000, maxRequests: 5 }, // 5 per minute
  PAYMENT: { interval: 60 * 1000, maxRequests: 10 }, // 10 per minute
  AI: { interval: 60 * 1000, maxRequests: 20 }, // 20 per minute
  
  // Standard limits for regular API endpoints
  API: { interval: 60 * 1000, maxRequests: 100 }, // 100 per minute
  
  // Relaxed limits for read-only endpoints
  READ: { interval: 60 * 1000, maxRequests: 200 }, // 200 per minute
};

/**
 * Apply rate limiting to a request
 */
export function applyRateLimit(
  request: NextRequest,
  config: RateLimitConfig = RATE_LIMITS.API
): { limited: boolean; response?: NextResponse } {
  // Use IP address as identifier (with fallback to headers)
  const identifier = 
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    'unknown';
  
  const isLimited = rateLimiter.isRateLimited(identifier, config);
  
  if (isLimited) {
    return {
      limited: true,
      response: NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil(config.interval / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil(config.interval / 1000)),
            'X-RateLimit-Limit': String(config.maxRequests),
            'X-RateLimit-Remaining': '0',
          },
        }
      ),
    };
  }
  
  return { limited: false };
}

// ============================================================================
// REQUEST VALIDATION
// ============================================================================

/**
 * Validate request body against a Zod schema
 */
export async function validateRequest<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<{ valid: true; data: T } | { valid: false; response: NextResponse }> {
  try {
    const body = await request.json();
    const validated = schema.parse(body);
    
    return { valid: true, data: validated };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        valid: false,
        response: NextResponse.json(
          {
            success: false,
            error: 'Validation failed',
            details: error.issues.map((err: any) => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          },
          { status: 400 }
        ),
      };
    }
    
    // JSON parse error
    return {
      valid: false,
      response: NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      ),
    };
  }
}

/**
 * Validate URL search params against a Zod schema
 */
export function validateSearchParams<T>(
  searchParams: URLSearchParams,
  schema: ZodSchema<T>
): { valid: true; data: T } | { valid: false; response: NextResponse } {
  try {
    const params = Object.fromEntries(searchParams.entries());
    const validated = schema.parse(params);
    
    return { valid: true, data: validated };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        valid: false,
        response: NextResponse.json(
          {
            success: false,
            error: 'Invalid query parameters',
            details: error.issues.map((err: any) => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          },
          { status: 400 }
        ),
      };
    }
    
    return {
      valid: false,
      response: NextResponse.json(
        { success: false, error: 'Invalid query parameters' },
        { status: 400 }
      ),
    };
  }
}

// ============================================================================
// SECURITY HEADERS
// ============================================================================

/**
 * Apply security headers to a response
 */
export function applySecurityHeaders(response: NextResponse): NextResponse {
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.whop.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.whop.com https://api.stripe.com https://generativelanguage.googleapis.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')
  );
  
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // XSS Protection
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Frame options
  response.headers.set('X-Frame-Options', 'DENY');
  
  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(self)'
  );
  
  // HSTS (only in production with HTTPS)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }
  
  return response;
}

// ============================================================================
// INPUT SANITIZATION
// ============================================================================

/**
 * Sanitize user input to prevent XSS
 * Note: React escapes by default, this is for additional safety
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize HTML for rich text (if needed)
 * Allows only safe tags and attributes
 */
export function sanitizeHTML(html: string): string {
  // For now, strip all HTML
  // In production, use a library like DOMPurify on the client side
  return html.replace(/<[^>]*>/g, '');
}

// ============================================================================
// CORS CONFIGURATION
// ============================================================================

/**
 * Apply CORS headers for API routes
 */
export function applyCORS(
  response: NextResponse,
  allowedOrigins: string[] = []
): NextResponse {
  const origin = allowedOrigins.length > 0 ? allowedOrigins.join(', ') : '*';
  
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours
  
  return response;
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  error: unknown,
  message: string = 'An error occurred',
  status: number = 500
): NextResponse {
  console.error(`API Error: ${message}`, error);
  
  // Don't expose internal error details in production
  const errorMessage = process.env.NODE_ENV === 'development' && error instanceof Error
    ? error.message
    : message;
  
  return NextResponse.json(
    {
      success: false,
      error: errorMessage,
    },
    { status }
  );
}

/**
 * Create a success response with security headers
 */
export function createSuccessResponse<T>(data: T, status: number = 200): NextResponse {
  const response = NextResponse.json(
    {
      success: true,
      ...data,
    },
    { status }
  );
  
  return applySecurityHeaders(response);
}
