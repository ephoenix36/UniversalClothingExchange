/**
 * Error Handling Utilities
 * 
 * Comprehensive error handling system for:
 * - Standardized API error responses
 * - User-friendly error messages
 * - Error logging and monitoring
 * - Retry logic with exponential backoff
 * - Error classification and severity
 */

// ============================================================================
// Error Types & Codes
// ============================================================================

/**
 * Standard error codes across the application
 */
export enum ErrorCode {
  // 4xx Client Errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // 5xx Server Errors
  SERVER_ERROR = 'SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  
  // Network Errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  
  // Application Errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

/**
 * HTTP status code to error code mapping
 */
export const HTTP_STATUS_TO_ERROR_CODE: Record<number, ErrorCode> = {
  400: ErrorCode.VALIDATION_ERROR,
  401: ErrorCode.UNAUTHORIZED,
  403: ErrorCode.FORBIDDEN,
  404: ErrorCode.NOT_FOUND,
  409: ErrorCode.CONFLICT,
  429: ErrorCode.RATE_LIMIT_EXCEEDED,
  500: ErrorCode.SERVER_ERROR,
  503: ErrorCode.SERVICE_UNAVAILABLE,
};

/**
 * Retryable error codes
 */
export const RETRYABLE_ERROR_CODES = [
  ErrorCode.NETWORK_ERROR,
  ErrorCode.TIMEOUT,
  ErrorCode.SERVICE_UNAVAILABLE,
  ErrorCode.RATE_LIMIT_EXCEEDED,
];

// ============================================================================
// Error Response Structure
// ============================================================================

/**
 * Standard API error response format
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: Record<string, unknown>;
    stack?: string; // Only in development
  };
  timestamp: string;
}

/**
 * Standard API success response format
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  timestamp: string;
}

/**
 * Combined API response type
 */
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// ============================================================================
// Application Error Class
// ============================================================================

/**
 * Custom application error class with enhanced context
 */
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly severity: ErrorSeverity;
  public readonly details?: Record<string, unknown>;
  public readonly timestamp: Date;
  public readonly isRetryable: boolean;

  constructor(
    code: ErrorCode,
    message: string,
    options?: {
      statusCode?: number;
      severity?: ErrorSeverity;
      details?: Record<string, unknown>;
      cause?: Error;
    }
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = options?.statusCode ?? this.getDefaultStatusCode(code);
    this.severity = options?.severity ?? this.getDefaultSeverity(code);
    this.details = options?.details;
    this.timestamp = new Date();
    this.isRetryable = RETRYABLE_ERROR_CODES.includes(code);

    if (options?.cause) {
      this.cause = options.cause;
    }

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  private getDefaultStatusCode(code: ErrorCode): number {
    const statusCodeMap: Partial<Record<ErrorCode, number>> = {
      [ErrorCode.VALIDATION_ERROR]: 400,
      [ErrorCode.UNAUTHORIZED]: 401,
      [ErrorCode.FORBIDDEN]: 403,
      [ErrorCode.NOT_FOUND]: 404,
      [ErrorCode.CONFLICT]: 409,
      [ErrorCode.RATE_LIMIT_EXCEEDED]: 429,
      [ErrorCode.SERVER_ERROR]: 500,
      [ErrorCode.SERVICE_UNAVAILABLE]: 503,
    };
    return statusCodeMap[code] ?? 500;
  }

  private getDefaultSeverity(code: ErrorCode): ErrorSeverity {
    if (code === ErrorCode.SERVER_ERROR || code === ErrorCode.SERVICE_UNAVAILABLE) {
      return ErrorSeverity.CRITICAL;
    }
    if (code === ErrorCode.UNAUTHORIZED || code === ErrorCode.FORBIDDEN) {
      return ErrorSeverity.WARNING;
    }
    return ErrorSeverity.ERROR;
  }

  /**
   * Convert error to API response format
   */
  toApiResponse(): ApiErrorResponse {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        details: this.details,
        stack: process.env.NODE_ENV === 'development' ? this.stack : undefined,
      },
      timestamp: this.timestamp.toISOString(),
    };
  }

  /**
   * Convert error to JSON for logging
   */
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      severity: this.severity,
      details: this.details,
      timestamp: this.timestamp.toISOString(),
      isRetryable: this.isRetryable,
      stack: this.stack,
    };
  }
}

// ============================================================================
// User-Friendly Error Messages
// ============================================================================

/**
 * Get user-friendly error message for error code
 */
export function getUserFriendlyMessage(code: ErrorCode, fallback?: string): string {
  const messages: Record<ErrorCode, string> = {
    [ErrorCode.VALIDATION_ERROR]: 'Please check your input and try again.',
    [ErrorCode.UNAUTHORIZED]: 'Please log in to continue.',
    [ErrorCode.FORBIDDEN]: "You don't have permission to do that.",
    [ErrorCode.NOT_FOUND]: "We couldn't find what you're looking for.",
    [ErrorCode.CONFLICT]: 'This action conflicts with existing data. Please refresh and try again.',
    [ErrorCode.RATE_LIMIT_EXCEEDED]: 'Too many requests. Please wait a moment and try again.',
    [ErrorCode.SERVER_ERROR]: 'Something went wrong on our end. Please try again later.',
    [ErrorCode.SERVICE_UNAVAILABLE]: 'The service is temporarily unavailable. Please try again in a few minutes.',
    [ErrorCode.NETWORK_ERROR]: 'Network error. Please check your internet connection and try again.',
    [ErrorCode.TIMEOUT]: 'The request took too long. Please try again.',
    [ErrorCode.UNKNOWN_ERROR]: fallback ?? 'An unexpected error occurred. Please try again.',
  };

  return messages[code];
}

/**
 * Get actionable guidance for error code
 */
export function getErrorAction(code: ErrorCode): string {
  const actions: Record<ErrorCode, string> = {
    [ErrorCode.VALIDATION_ERROR]: 'Check your input and fix any highlighted fields',
    [ErrorCode.UNAUTHORIZED]: 'Please log in to continue',
    [ErrorCode.FORBIDDEN]: 'Contact support if you believe this is an error',
    [ErrorCode.NOT_FOUND]: 'Go back or return to the homepage',
    [ErrorCode.CONFLICT]: 'Refresh the page and try again',
    [ErrorCode.RATE_LIMIT_EXCEEDED]: 'Please wait a moment before trying again',
    [ErrorCode.SERVER_ERROR]: 'Try again in a moment, or contact support if the issue persists',
    [ErrorCode.SERVICE_UNAVAILABLE]: 'Check our status page for updates',
    [ErrorCode.NETWORK_ERROR]: 'Check your internet connection and try again',
    [ErrorCode.TIMEOUT]: 'Try again with a faster connection',
    [ErrorCode.UNKNOWN_ERROR]: 'Try again or contact support if the issue persists',
  };

  return actions[code];
}

// ============================================================================
// Error Creation Helpers
// ============================================================================

/**
 * Create a validation error
 */
export function createValidationError(message: string, details?: Record<string, unknown>): AppError {
  return new AppError(ErrorCode.VALIDATION_ERROR, message, { details });
}

/**
 * Create an unauthorized error
 */
export function createUnauthorizedError(message: string = 'Please log in to continue'): AppError {
  return new AppError(ErrorCode.UNAUTHORIZED, message);
}

/**
 * Create a forbidden error
 */
export function createForbiddenError(message: string = "You don't have permission to do that"): AppError {
  return new AppError(ErrorCode.FORBIDDEN, message);
}

/**
 * Create a not found error
 */
export function createNotFoundError(resource: string): AppError {
  return new AppError(ErrorCode.NOT_FOUND, `${resource} not found`);
}

/**
 * Create a conflict error
 */
export function createConflictError(message: string): AppError {
  return new AppError(ErrorCode.CONFLICT, message);
}

/**
 * Create a rate limit error
 */
export function createRateLimitError(retryAfter?: number): AppError {
  const message = retryAfter
    ? `Rate limit exceeded. Try again in ${retryAfter} seconds.`
    : 'Rate limit exceeded. Please wait and try again.';
  return new AppError(ErrorCode.RATE_LIMIT_EXCEEDED, message, {
    details: retryAfter ? { retryAfter } : undefined,
  });
}

/**
 * Create a server error
 */
export function createServerError(message: string = 'Internal server error', cause?: Error): AppError {
  return new AppError(ErrorCode.SERVER_ERROR, message, {
    severity: ErrorSeverity.CRITICAL,
    cause,
  });
}

/**
 * Create a service unavailable error
 */
export function createServiceUnavailableError(service?: string): AppError {
  const message = service
    ? `${service} is temporarily unavailable`
    : 'Service temporarily unavailable';
  return new AppError(ErrorCode.SERVICE_UNAVAILABLE, message, {
    severity: ErrorSeverity.CRITICAL,
  });
}

// ============================================================================
// Error Handling Utilities
// ============================================================================

/**
 * Check if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof AppError) {
    return error.isRetryable;
  }

  // Check for network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return true;
  }

  return false;
}

/**
 * Convert unknown error to AppError
 */
export function normalizeError(error: unknown): AppError {
  // Already an AppError
  if (error instanceof AppError) {
    return error;
  }

  // Standard Error
  if (error instanceof Error) {
    // Network error
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return new AppError(ErrorCode.NETWORK_ERROR, 'Network request failed', {
        cause: error,
      });
    }

    // Timeout error
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      return new AppError(ErrorCode.TIMEOUT, 'Request timeout', { cause: error });
    }

    // Generic error
    return new AppError(ErrorCode.UNKNOWN_ERROR, error.message, { cause: error });
  }

  // Unknown error type
  return new AppError(ErrorCode.UNKNOWN_ERROR, String(error));
}

/**
 * Extract error code from HTTP response
 */
export function getErrorCodeFromStatus(status: number): ErrorCode {
  return HTTP_STATUS_TO_ERROR_CODE[status] ?? ErrorCode.UNKNOWN_ERROR;
}

// ============================================================================
// Retry Logic with Exponential Backoff
// ============================================================================

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxRetries: number;
  baseDelay: number; // ms
  maxDelay: number; // ms
  backoffStrategy: 'exponential' | 'linear' | 'constant';
  retryableErrors?: ErrorCode[];
}

/**
 * Default retry configuration
 */
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  backoffStrategy: 'exponential',
  retryableErrors: RETRYABLE_ERROR_CODES,
};

/**
 * Calculate retry delay based on attempt number
 */
export function calculateRetryDelay(
  attempt: number,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): number {
  let delay: number;

  switch (config.backoffStrategy) {
    case 'exponential':
      delay = config.baseDelay * Math.pow(2, attempt - 1);
      break;
    case 'linear':
      delay = config.baseDelay * attempt;
      break;
    case 'constant':
    default:
      delay = config.baseDelay;
      break;
  }

  // Cap at max delay
  return Math.min(delay, config.maxDelay);
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= retryConfig.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry if error is not retryable
      if (!isRetryableError(error)) {
        throw normalizeError(error);
      }

      // Don't retry on last attempt
      if (attempt === retryConfig.maxRetries) {
        throw normalizeError(error);
      }

      // Wait before next retry
      const delay = calculateRetryDelay(attempt, retryConfig);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // Should never reach here, but TypeScript needs it
  throw normalizeError(lastError);
}

// ============================================================================
// Error Logging
// ============================================================================

/**
 * Error context for logging
 */
export interface ErrorContext {
  userId?: string;
  route?: string;
  component?: string;
  action?: string;
  userAgent?: string;
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  [key: string]: unknown;
}

/**
 * Redact sensitive information from error context
 */
export function redactSensitiveInfo(data: unknown): unknown {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  const sensitiveKeys = [
    'password',
    'token',
    'apiKey',
    'secret',
    'creditCard',
    'ssn',
    'authorization',
  ];

  if (Array.isArray(data)) {
    return data.map(redactSensitiveInfo);
  }

  const redacted: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
      redacted[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      redacted[key] = redactSensitiveInfo(value);
    } else {
      redacted[key] = value;
    }
  }

  return redacted;
}

/**
 * Log error to monitoring service (Sentry, Vercel Analytics, etc.)
 */
export function logError(error: unknown, context?: ErrorContext): void {
  const normalizedError = normalizeError(error);
  const redactedContext = context ? redactSensitiveInfo(context) : undefined;

  // In production, send to monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Example: Sentry integration
    // Sentry.captureException(normalizedError, { contexts: { custom: redactedContext } });

    // Example: Custom analytics endpoint
    if (typeof window !== 'undefined' && navigator.sendBeacon) {
      const payload = JSON.stringify({
        error: normalizedError.toJSON(),
        context: redactedContext,
      });
      navigator.sendBeacon('/api/analytics/errors', payload);
    }
  }

  // Always log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('[Error]', {
      error: normalizedError.toJSON(),
      context: redactedContext,
    });
  }
}

// ============================================================================
// Error Boundary Utilities
// ============================================================================

/**
 * Error info from React error boundary
 */
export interface ErrorBoundaryInfo {
  componentStack: string;
}

/**
 * Format error for error boundary display
 */
export function formatErrorBoundaryError(
  error: Error,
  errorInfo?: ErrorBoundaryInfo
): {
  title: string;
  message: string;
  action: string;
  details?: string;
} {
  const normalizedError = normalizeError(error);

  return {
    title: 'Something went wrong',
    message: getUserFriendlyMessage(normalizedError.code, error.message),
    action: getErrorAction(normalizedError.code),
    details: process.env.NODE_ENV === 'development' ? errorInfo?.componentStack : undefined,
  };
}
