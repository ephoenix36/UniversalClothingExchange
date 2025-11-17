import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ItemDetailDialog } from './ItemDetailDialog';
import type { WardrobeItem, ItemImage } from '@prisma/client';

const mockItem: WardrobeItem & { images: ItemImage[] } = {
  id: '1',
  ownerId: 'user1',
  originalUploaderId: 'user1',
  title: 'Vintage Denim Jacket',
  description: 'Classic 90s denim jacket in excellent condition',
  category: 'OUTERWEAR',
  subcategory: 'Jacket',
  brand: "Levi's",
  size: 'M',
  color: ['Blue', 'Indigo'],
  condition: 'LIKE_NEW',
  tags: ['vintage', 'denim', '90s'],
  estimatedValue: 85.00,
  availableForSwap: true,
  availableForSale: false,
  salePrice: null,
  status: 'AVAILABLE',
  swapCount: 3,
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
  images: [
    {
      id: 'img1',
      wardrobeItemId: '1',
      url: 'https://example.com/image1.jpg',
      isPrimary: true,
      createdAt: new Date('2024-01-15'),
    },
    {
      id: 'img2',
      wardrobeItemId: '1',
      url: 'https://example.com/image2.jpg',
      isPrimary: false,
      createdAt: new Date('2024-01-15'),
    },
  ],
};

describe('ItemDetailDialog', () => {
  const mockOnClose = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders item details correctly', () => {
    render(
      <ItemDetailDialog
        item={mockItem}
        open={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Vintage Denim Jacket')).toBeInTheDocument();
    expect(screen.getByText("Levi's")).toBeInTheDocument();
    expect(screen.getByText(/Classic 90s denim jacket/i)).toBeInTheDocument();
  });

  it('displays all item metadata', () => {
    render(
      <ItemDetailDialog
        item={mockItem}
        open={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('OUTERWEAR')).toBeInTheDocument();
    expect(screen.getByText('M')).toBeInTheDocument();
    expect(screen.getByText('LIKE_NEW')).toBeInTheDocument();
    expect(screen.getByText('$85.00')).toBeInTheDocument();
  });

  it('shows image carousel with navigation', async () => {
    const user = userEvent.setup();
    render(
      <ItemDetailDialog
        item={mockItem}
        open={true}
        onClose={mockOnClose}
      />
    );

    // Should show primary image first
    const carousel = screen.getByRole('region', { name: /image carousel/i });
    expect(carousel).toBeInTheDocument();

    // Should have next/previous buttons
    const nextButton = screen.getByRole('button', { name: /next/i });
    const prevButton = screen.getByRole('button', { name: /previous/i });

    expect(nextButton).toBeInTheDocument();
    expect(prevButton).toBeInTheDocument();

    // Click next to see second image
    await user.click(nextButton);
    await waitFor(() => {
      expect(screen.getByAltText(/image 2/i)).toBeInTheDocument();
    });
  });

  it('displays color palette', () => {
    render(
      <ItemDetailDialog
        item={mockItem}
        open={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Blue')).toBeInTheDocument();
    expect(screen.getByText('Indigo')).toBeInTheDocument();
  });

  it('shows tags', () => {
    render(
      <ItemDetailDialog
        item={mockItem}
        open={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('vintage')).toBeInTheDocument();
    expect(screen.getByText('denim')).toBeInTheDocument();
    expect(screen.getByText('90s')).toBeInTheDocument();
  });

  it('displays swap statistics', () => {
    render(
      <ItemDetailDialog
        item={mockItem}
        open={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText(/3 swaps/i)).toBeInTheDocument();
  });

  it('shows availability status', () => {
    render(
      <ItemDetailDialog
        item={mockItem}
        open={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('AVAILABLE')).toBeInTheDocument();
  });

  it('has edit button that calls onEdit', async () => {
    const user = userEvent.setup();
    render(
      <ItemDetailDialog
        item={mockItem}
        open={true}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
      />
    );

    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith('1');
  });

  it('has delete button that calls onDelete with confirmation', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    
    render(
      <ItemDetailDialog
        item={mockItem}
        open={true}
        onClose={mockOnClose}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    expect(confirmSpy).toHaveBeenCalled();
    expect(mockOnDelete).toHaveBeenCalledWith('1');
    
    confirmSpy.mockRestore();
  });

  it('does not delete if confirmation is cancelled', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    
    render(
      <ItemDetailDialog
        item={mockItem}
        open={true}
        onClose={mockOnClose}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    expect(mockOnDelete).not.toHaveBeenCalled();
    
    confirmSpy.mockRestore();
  });

  it('has share button that copies link', async () => {
    const user = userEvent.setup();
    const writeTextSpy = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextSpy,
      },
    });

    render(
      <ItemDetailDialog
        item={mockItem}
        open={true}
        onClose={mockOnClose}
      />
    );

    const shareButton = screen.getByRole('button', { name: /share/i });
    await user.click(shareButton);

    await waitFor(() => {
      expect(writeTextSpy).toHaveBeenCalled();
    });
  });

  it('closes dialog when close button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ItemDetailDialog
        item={mockItem}
        open={true}
        onClose={mockOnClose}
      />
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('shows empty state for no images', () => {
    const itemWithoutImages = { ...mockItem, images: [] };
    render(
      <ItemDetailDialog
        item={itemWithoutImages}
        open={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText(/no images available/i)).toBeInTheDocument();
  });

  it('displays created date', () => {
    render(
      <ItemDetailDialog
        item={mockItem}
        open={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText(/added/i)).toBeInTheDocument();
    expect(screen.getByText(/Jan.*2024/i)).toBeInTheDocument();
  });

  it('shows condition badge with appropriate styling', () => {
    render(
      <ItemDetailDialog
        item={mockItem}
        open={true}
        onClose={mockOnClose}
      />
    );

    const conditionBadge = screen.getByText('LIKE_NEW');
    expect(conditionBadge).toHaveClass(/blue/i); // Should have blue styling
  });

  it('supports keyboard navigation in carousel', async () => {
    const user = userEvent.setup();
    render(
      <ItemDetailDialog
        item={mockItem}
        open={true}
        onClose={mockOnClose}
      />
    );

    const carousel = screen.getByRole('region', { name: /image carousel/i });
    
    // Focus carousel
    carousel.focus();
    
    // Press right arrow
    await user.keyboard('{ArrowRight}');
    
    await waitFor(() => {
      expect(screen.getByAltText(/image 2/i)).toBeInTheDocument();
    });
  });

  it('shows full-screen image on click', async () => {
    const user = userEvent.setup();
    render(
      <ItemDetailDialog
        item={mockItem}
        open={true}
        onClose={mockOnClose}
      />
    );

    const image = screen.getByAltText(/image 1/i);
    await user.click(image);

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /full screen/i })).toBeInTheDocument();
    });
  });

  it('displays swap history when available', async () => {
    const itemWithHistory = {
      ...mockItem,
      history: [
        {
          id: 'hist1',
          type: 'SWAP',
          timestamp: new Date('2024-02-01'),
          notes: 'Swapped with user123',
        },
      ],
    };

    render(
      <ItemDetailDialog
        item={itemWithHistory as any}
        open={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText(/swap history/i)).toBeInTheDocument();
    expect(screen.getByText(/Swapped with user123/i)).toBeInTheDocument();
  });

  it('shows match suggestions section', () => {
    render(
      <ItemDetailDialog
        item={mockItem}
        open={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText(/similar items/i)).toBeInTheDocument();
  });

  it('is responsive and adapts to mobile', () => {
    // Mock mobile viewport
    global.innerWidth = 375;
    global.innerHeight = 667;

    render(
      <ItemDetailDialog
        item={mockItem}
        open={true}
        onClose={mockOnClose}
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass(/full-screen|mobile/i); // Should have mobile classes
  });

  it('handles missing optional fields gracefully', () => {
    const minimalItem = {
      ...mockItem,
      description: null,
      brand: null,
      estimatedValue: null,
      tags: [],
    };

    render(
      <ItemDetailDialog
        item={minimalItem as any}
        open={true}
        onClose={mockOnClose}
      />
    );

    // Should still render without errors
    expect(screen.getByText('Vintage Denim Jacket')).toBeInTheDocument();
  });
});
