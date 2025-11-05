/**
 * Accessibility Utilities
 * WCAG 2.2 Level AA Compliance Helpers
 * EU Accessibility Act 2025 Requirement
 */

/**
 * Generate unique IDs for aria-describedby, aria-labelledby
 * Ensures ID uniqueness across the application
 */
let idCounter = 0;
export function generateA11yId(prefix: string = 'a11y'): string {
  return `${prefix}-${Date.now()}-${++idCounter}`;
}

/**
 * Create skip navigation link configuration
 * WCAG 2.4.1 Bypass Blocks (Level A)
 * 
 * Usage in your component:
 * <a href="#main-content" className="skip-link">Skip to main content</a>
 * 
 * Add to Tailwind global.css:
 * .skip-link {
 *   @apply sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50;
 *   @apply focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground;
 * }
 */
export interface SkipLinkConfig {
  href: string;
  label: string;
  className: string;
}

export function createSkipLinkConfig(targetId: string, label: string = 'Skip to main content'): SkipLinkConfig {
  return {
    href: `#${targetId}`,
    label,
    className: 'skip-link',
  };
}

/**
 * Check if an element meets minimum target size
 * WCAG 2.5.8 Target Size (Minimum) (Level AA) - 24x24 CSS pixels
 */
export function meetsMinimumTargetSize(width: number, height: number): boolean {
  const MIN_SIZE = 24; // CSS pixels
  return width >= MIN_SIZE && height >= MIN_SIZE;
}

/**
 * Check if an element meets recommended touch target size
 * iOS Human Interface Guidelines: 44x44 points
 * Material Design: 48x48 dp
 */
export function meetsTouchTargetSize(width: number, height: number): boolean {
  const RECOMMENDED_SIZE = 44; // CSS pixels
  return width >= RECOMMENDED_SIZE && height >= RECOMMENDED_SIZE;
}

/**
 * Calculate contrast ratio between two colors
 * WCAG 2.1.4.3 Contrast (Minimum) (Level AA)
 * 
 * @param color1 - Hex color (e.g., '#FFFFFF')
 * @param color2 - Hex color (e.g., '#000000')
 * @returns Contrast ratio (1-21)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (hex: string): number => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;

    const [rs, gs, bs] = [r, g, b].map((c) => {
      const sRGB = c / 255;
      return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG AA standards
 * 
 * @param ratio - Contrast ratio (from getContrastRatio)
 * @param isLargeText - Text is ≥18pt or ≥14pt bold
 * @param level - 'AA' or 'AAA'
 */
export function meetsContrastRequirement(
  ratio: number,
  isLargeText: boolean = false,
  level: 'AA' | 'AAA' = 'AA'
): boolean {
  if (level === 'AAA') {
    return isLargeText ? ratio >= 4.5 : ratio >= 7;
  }
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Announce content to screen readers using aria-live
 * Creates a temporary live region for announcements
 * 
 * @param message - Message to announce
 * @param priority - 'polite' (wait for user to finish) or 'assertive' (interrupt)
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', priority === 'assertive' ? 'alert' : 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement (screen readers cache the message)
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Focus trap for modal dialogs
 * WCAG 2.4.3 Focus Order (Level A)
 * 
 * Usage:
 * const cleanupFocusTrap = trapFocus(modalElement);
 * // ... later ...
 * cleanupFocusTrap();
 */
export function trapFocus(element: HTMLElement): () => void {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  const focusableElements = Array.from(
    element.querySelectorAll(focusableSelectors)
  ) as HTMLElement[];

  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  // Store previously focused element to restore later
  const previouslyFocused = document.activeElement as HTMLElement;

  // Focus first element
  firstFocusable?.focus();

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab: moving backwards
      if (document.activeElement === firstFocusable) {
        lastFocusable?.focus();
        e.preventDefault();
      }
    } else {
      // Tab: moving forwards
      if (document.activeElement === lastFocusable) {
        firstFocusable?.focus();
        e.preventDefault();
      }
    }
  };

  element.addEventListener('keydown', handleTabKey);

  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleTabKey);
    previouslyFocused?.focus();
  };
}

/**
 * Manage focus when elements are removed from the DOM
 * Prevents focus loss when deleting items, closing modals, etc.
 * 
 * @param elementToRemove - Element that will be removed
 * @param fallbackElement - Element to focus after removal (optional, defaults to document.body)
 */
export function manageFocusOnRemoval(
  elementToRemove: HTMLElement,
  fallbackElement?: HTMLElement
): void {
  if (elementToRemove.contains(document.activeElement)) {
    const target = fallbackElement || (document.body as HTMLElement);
    target.focus();
  }
}

/**
 * Create a visually hidden element (for screen readers only)
 * Use for:
 * - Skip links
 * - Additional context for icon-only buttons
 * - Live region announcements
 */
export const srOnlyStyles: Record<string, string | number> = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: '0',
};

/**
 * Get accessible name for an element
 * Follows ARIA naming computation
 */
export function getAccessibleName(element: HTMLElement): string {
  // 1. aria-labelledby
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy);
    if (labelElement) return labelElement.textContent || '';
  }

  // 2. aria-label
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;

  // 3. <label> element (for inputs)
  if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
    const id = element.getAttribute('id');
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) return label.textContent || '';
    }
  }

  // 4. Text content
  return element.textContent || '';
}

/**
 * Check if element is keyboard accessible
 * Verifies element can receive focus via keyboard
 */
export function isKeyboardAccessible(element: HTMLElement): boolean {
  // Native focusable elements
  const nativeFocusable = ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'];
  if (nativeFocusable.includes(element.tagName)) {
    return !element.hasAttribute('disabled');
  }

  // Elements with tabindex >= 0
  const tabIndex = element.getAttribute('tabindex');
  if (tabIndex !== null) {
    return parseInt(tabIndex, 10) >= 0;
  }

  return false;
}

/**
 * WCAG 2.2 Specific Helpers
 */

/**
 * 3.2.6 Consistent Help (Level A)
 * Validate that help mechanism is in consistent location
 */
export function validateConsistentHelp(
  helpElement: HTMLElement,
  expectedPosition: { x: number; y: number },
  tolerance: number = 50
): boolean {
  const rect = helpElement.getBoundingClientRect();
  const xDiff = Math.abs(rect.x - expectedPosition.x);
  const yDiff = Math.abs(rect.y - expectedPosition.y);

  return xDiff <= tolerance && yDiff <= tolerance;
}

/**
 * 2.4.11 Focus Not Obscured (Minimum) (Level AA)
 * Check if focused element is obscured by fixed/sticky content
 */
export function isFocusObscured(
  focusedElement: HTMLElement,
  stickyElements: HTMLElement[] = []
): boolean {
  const focusRect = focusedElement.getBoundingClientRect();

  for (const sticky of stickyElements) {
    const stickyRect = sticky.getBoundingClientRect();

    // Check if focused element overlaps with sticky element
    const overlapsVertically =
      focusRect.top < stickyRect.bottom && focusRect.bottom > stickyRect.top;
    const overlapsHorizontally =
      focusRect.left < stickyRect.right && focusRect.right > stickyRect.left;

    if (overlapsVertically && overlapsHorizontally) {
      return true; // Focus is obscured
    }
  }

  return false; // Focus is not obscured
}

/**
 * 3.3.8 Accessible Authentication (Level AA)
 * Prevent cognitive function tests for authentication
 * This is a policy helper - implementation must allow:
 * - Copy/paste for passwords
 * - Alternative auth methods (magic links, OAuth)
 */
export function isAuthenticationAccessible(passwordInput: HTMLInputElement): boolean {
  // Check if paste is allowed
  const hasPasteHandler = passwordInput.hasAttribute('onpaste');
  const pasteEventPrevented = hasPasteHandler && passwordInput.getAttribute('onpaste') === 'return false';

  return !pasteEventPrevented; // Paste must be allowed
}

/**
 * Live region for form validation errors
 * Announces errors to screen readers without disrupting flow
 */
export function createFormErrorRegion(): HTMLDivElement {
  const errorRegion = document.createElement('div');
  errorRegion.setAttribute('role', 'alert');
  errorRegion.setAttribute('aria-live', 'assertive');
  errorRegion.setAttribute('aria-atomic', 'true');
  errorRegion.className = 'sr-only';
  document.body.appendChild(errorRegion);

  return errorRegion;
}

export function announceFormError(message: string, errorRegion?: HTMLDivElement): void {
  const region = errorRegion || createFormErrorRegion();
  region.textContent = message;

  // Clear after announcement
  setTimeout(() => {
    region.textContent = '';
  }, 1000);
}
