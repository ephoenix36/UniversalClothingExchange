import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfilePage from '../page';

// Mock the Navigation and Footer components
vi.mock('@/components/Navigation', () => ({
  default: () => <div data-testid="navigation">Navigation</div>
}));

vi.mock('@/components/Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>
}));

vi.mock('@whop/react/components', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>
}));

describe('ProfilePage', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch = vi.fn();
  });

  describe('Loading State', () => {
    it('should show loading spinner while fetching user data', () => {
      // Mock fetch to never resolve (simulating loading)
      global.fetch = vi.fn(() => new Promise<Response>(() => {})) as any;

      render(<ProfilePage />);

      // Should show loading spinner
      const spinner = screen.getByRole('status', { name: /loading/i });
      expect(spinner).toBeInTheDocument();
      
      // Should NOT show profile content yet
      expect(screen.queryByText(/profile settings/i)).not.toBeInTheDocument();
    });

    it('should have accessible loading state with aria-label', () => {
      global.fetch = vi.fn(() => new Promise<Response>(() => {})) as any;

      render(<ProfilePage />);

      const loadingContainer = screen.getByRole('status');
      expect(loadingContainer).toHaveAttribute('aria-label', 'Loading profile');
    });
  });

  describe('Error State', () => {
    it('should show error message when user is null', async () => {
      // Mock API returning null user
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, user: null })
        } as Response)
      );

      render(<ProfilePage />);

      await waitFor(() => {
        expect(screen.getByText(/profile unavailable/i)).toBeInTheDocument();
      });

      // Should show reload button
      const reloadButton = screen.getByRole('button', { name: /reload/i });
      expect(reloadButton).toBeInTheDocument();
    });

    it('should show error message when API fails', async () => {
      // Mock API failure
      global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));

      render(<ProfilePage />);

      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      });
    });

    it('should reload page when reload button is clicked', async () => {
      const reloadSpy = vi.spyOn(window.location, 'reload');
      
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, user: null })
        } as Response)
      );

      render(<ProfilePage />);

      await waitFor(() => {
        const reloadButton = screen.getByRole('button', { name: /reload/i });
        reloadButton.click();
        expect(reloadSpy).toHaveBeenCalled();
      });
    });
  });

  describe('Success State', () => {
    const mockUser = {
      id: 'user-123',
      displayName: 'John Doe',
      bio: 'Test bio',
      phoneNumber: '+1234567890',
      avatarUrl: 'https://example.com/avatar.jpg',
      membershipTier: 'PRO',
      profilePhotos: []
    };

    it('should display user profile when data is loaded', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, user: mockUser })
        } as Response)
      );

      render(<ProfilePage />);

      await waitFor(() => {
        expect(screen.getByText(mockUser.displayName)).toBeInTheDocument();
        expect(screen.getByText(mockUser.bio)).toBeInTheDocument();
      });
    });

    it('should NOT show loading spinner after data is loaded', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, user: mockUser })
        } as Response)
      );

      render(<ProfilePage />);

      await waitFor(() => {
        expect(screen.queryByRole('status', { name: /loading/i })).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', async () => {
      const mockUser = {
        id: 'user-123',
        displayName: 'John Doe',
        membershipTier: 'PRO',
        profilePhotos: []
      };

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, user: mockUser })
        } as Response)
      );

      render(<ProfilePage />);

      await waitFor(() => {
        const mainHeading = screen.getByRole('heading', { level: 1 });
        expect(mainHeading).toBeInTheDocument();
      });
    });

    it('should have main landmark for screen readers', () => {
      global.fetch = vi.fn(() => new Promise<Response>(() => {})) as any;

      render(<ProfilePage />);

      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
    });
  });
});
