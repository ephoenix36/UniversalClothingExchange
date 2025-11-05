/**
 * Test utilities for React components
 */
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

/**
 * Custom render function that wraps components with necessary providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  // Add any global providers here (e.g., ThemeProvider, QueryClientProvider)
  return render(ui, { ...options });
}

/**
 * Wait for async operations with timeout
 */
export function waitFor(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Mock API response helper
 */
export function mockApiResponse<T>(data: T, status = 200) {
  return {
    json: async () => data,
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    headers: new Headers({ 'Content-Type': 'application/json' }),
  } as Response;
}

/**
 * Mock error response
 */
export function mockApiError(message: string, status = 500) {
  return {
    json: async () => ({ error: message }),
    ok: false,
    status,
    statusText: 'Error',
    headers: new Headers({ 'Content-Type': 'application/json' }),
  } as Response;
}

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
