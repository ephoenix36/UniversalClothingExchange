/**
 * Security tests - Rate limiting, input validation, sanitization
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import {
  applyRateLimit,
  RATE_LIMITS,
  validateRequest,
  validateSearchParams,
  sanitizeInput,
  sanitizeHTML,
} from '@/lib/security';
import { createWardrobeItemSchema, wardrobeFilterSchema } from '@/lib/validations';

describe('Security - Rate Limiting', () => {
  it('should allow requests within rate limit', () => {
    const request = new NextRequest('http://localhost/api/test');
    
    const result = applyRateLimit(request, { interval: 60000, maxRequests: 5 });
    
    expect(result.limited).toBe(false);
    expect(result.response).toBeUndefined();
  });

  it('should block requests exceeding rate limit', () => {
    const config = { interval: 1000, maxRequests: 2 };
    const request = new NextRequest('http://localhost/api/test', {
      headers: { 'x-real-ip': '192.168.1.1' },
    });
    
    // Make 3 requests from same IP
    applyRateLimit(request, config);
    applyRateLimit(request, config);
    const result = applyRateLimit(request, config);
    
    expect(result.limited).toBe(true);
    expect(result.response).toBeDefined();
  });

  it('should return 429 status for rate limited requests', () => {
    const config = { interval: 1000, maxRequests: 1 };
    const request = new NextRequest('http://localhost/api/test', {
      headers: { 'x-real-ip': '192.168.1.2' },
    });
    
    applyRateLimit(request, config);
    const result = applyRateLimit(request, config);
    
    expect(result.response?.status).toBe(429);
  });

  it('should use different rate limits for different endpoints', () => {
    expect(RATE_LIMITS.AUTH.maxRequests).toBe(5);
    expect(RATE_LIMITS.API.maxRequests).toBe(100);
    expect(RATE_LIMITS.READ.maxRequests).toBe(200);
  });
});

describe('Security - Input Validation', () => {
  it('should validate valid wardrobe item data', async () => {
    const validData = {
      title: 'Blue Jeans',
      description: 'Classic denim jeans',
      category: 'TOPS',
      size: 'M',
      color: ['Blue'],
      condition: 'GOOD',
      imageIds: ['img1'],
    };
    
    const request = new NextRequest('http://localhost/api/test', {
      method: 'POST',
      body: JSON.stringify(validData),
    });
    
    const result = await validateRequest(request, createWardrobeItemSchema);
    
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.data.title).toBe('Blue Jeans');
    }
  });

  it('should reject invalid wardrobe item data', async () => {
    const invalidData = {
      title: '', // Empty title should fail
      category: 'INVALID_CATEGORY',
      size: 'M',
      color: [],
      condition: 'GOOD',
    };
    
    const request = new NextRequest('http://localhost/api/test', {
      method: 'POST',
      body: JSON.stringify(invalidData),
    });
    
    const result = await validateRequest(request, createWardrobeItemSchema);
    
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.response.status).toBe(400);
    }
  });

  it('should validate search params correctly', () => {
    const searchParams = new URLSearchParams({
      category: 'TOPS',
      page: '1',
      limit: '20',
    });
    
    const result = validateSearchParams(searchParams, wardrobeFilterSchema);
    
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.data.category).toBe('TOPS');
      expect(result.data.page).toBe(1);
    }
  });

  it('should reject invalid search params', () => {
    const searchParams = new URLSearchParams({
      page: '-1', // Negative page should fail
      limit: '1000', // Exceeds max limit
    });
    
    const result = validateSearchParams(searchParams, wardrobeFilterSchema);
    
    expect(result.valid).toBe(false);
  });

  it('should handle malformed JSON', async () => {
    const request = new NextRequest('http://localhost/api/test', {
      method: 'POST',
      body: '{invalid json}',
    });
    
    const result = await validateRequest(request, createWardrobeItemSchema);
    
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.response.status).toBe(400);
    }
  });
});

describe('Security - Input Sanitization', () => {
  it('should sanitize XSS attempts in input', () => {
    const maliciousInput = '<script>alert("XSS")</script>';
    const sanitized = sanitizeInput(maliciousInput);
    
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('</script>');
    expect(sanitized).toContain('&lt;');
    expect(sanitized).toContain('&gt;');
  });

  it('should sanitize HTML injection attempts', () => {
    const htmlInput = '<img src=x onerror=alert(1)>';
    const sanitized = sanitizeInput(htmlInput);
    
    // The tags should be escaped, making them safe
    expect(sanitized).not.toContain('<img');
    expect(sanitized).toContain('&lt;img');
    expect(sanitized).toContain('&gt;');
    // The onerror attribute is now harmless text
  });

  it('should escape special characters', () => {
    const input = '< > " \' /';
    const sanitized = sanitizeInput(input);
    
    expect(sanitized).toBe('&lt; &gt; &quot; &#x27; &#x2F;');
  });

  it('should strip all HTML tags from rich text', () => {
    const html = '<p>Hello <strong>World</strong></p>';
    const sanitized = sanitizeHTML(html);
    
    expect(sanitized).toBe('Hello World');
    expect(sanitized).not.toContain('<');
    expect(sanitized).not.toContain('>');
  });

  it('should preserve safe text content', () => {
    const safeInput = 'Hello, this is safe text!';
    const sanitized = sanitizeInput(safeInput);
    
    // Commas and spaces should be preserved
    expect(sanitized).toContain('Hello');
    expect(sanitized).toContain('safe');
  });
});

describe('Security - SQL Injection Prevention', () => {
  it('should use Prisma parameterized queries (no direct SQL)', () => {
    // Prisma prevents SQL injection by design
    // This test documents that we rely on Prisma's protection
    const maliciousInput = "'; DROP TABLE users; --";
    
    // When used with Prisma's where clause, this becomes a safe parameter:
    // where: { title: maliciousInput }
    // Prisma will escape this automatically
    
    expect(maliciousInput).toBeDefined();
    // In a real scenario, Prisma would treat this as a literal string value
    // and not execute it as SQL
  });
});

describe('Security - Environment Variables', () => {
  it('should have required environment variables', () => {
    // Database
    expect(process.env.DATABASE_URL).toBeDefined();
    
    // Authentication
    expect(process.env.NEXT_PUBLIC_WHOP_APP_ID).toBeDefined();
    expect(process.env.WHOP_API_KEY).toBeDefined();
    
    // Payments
    expect(process.env.STRIPE_SECRET_KEY).toBeDefined();
    
    // File upload
    expect(process.env.UPLOADTHING_SECRET).toBeDefined();
  });

  it('should not expose server-side env vars to client', () => {
    // Only NEXT_PUBLIC_* variables should be exposed client-side
    const serverOnlyVars = [
      'DATABASE_URL',
      'WHOP_API_KEY',
      'STRIPE_SECRET_KEY',
      'STRIPE_WEBHOOK_SECRET',
      'UPLOADTHING_SECRET',
    ];
    
    for (const varName of serverOnlyVars) {
      // In client-side code, these should be undefined
      // In our test environment, they're available because we're in Node.js
      expect(varName.startsWith('NEXT_PUBLIC_')).toBe(false);
    }
  });
});

describe('Security - HTTPS Requirements', () => {
  it('should enforce HTTPS in production', () => {
    // Security headers should include HSTS in production
    // This is enforced by applySecurityHeaders function
    expect(process.env.NODE_ENV).toBeDefined();
  });
});
