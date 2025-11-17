import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImageUpload } from './ImageUpload';

// Mock UploadThing
vi.mock('@uploadthing/react', () => ({
  useUploadThing: vi.fn(),
}));

describe('ImageUpload', () => {
  const mockOnUploadComplete = vi.fn();
  const mockOnUploadError = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders upload area with instructions', () => {
    render(
      <ImageUpload
        maxFiles={5}
        onUploadComplete={mockOnUploadComplete}
        onUploadError={mockOnUploadError}
      />
    );

    expect(screen.getByText(/click to upload/i)).toBeInTheDocument();
    expect(screen.getByText(/png, jpg/i)).toBeInTheDocument();
  });

  it('shows file count limit', () => {
    render(
      <ImageUpload
        maxFiles={3}
        onUploadComplete={mockOnUploadComplete}
      />
    );

    expect(screen.getByText(/up to 3 images/i)).toBeInTheDocument();
  });

  it('allows file selection through input', async () => {
    const user = userEvent.setup();
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    render(
      <ImageUpload
        maxFiles={5}
        onUploadComplete={mockOnUploadComplete}
      />
    );

    const input = screen.getByLabelText(/upload images/i);
    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText('test.jpg')).toBeInTheDocument();
    });
  });

  it('prevents uploading more than max files', async () => {
    const user = userEvent.setup();
    const files = [
      new File(['1'], '1.jpg', { type: 'image/jpeg' }),
      new File(['2'], '2.jpg', { type: 'image/jpeg' }),
      new File(['3'], '3.jpg', { type: 'image/jpeg' }),
    ];
    
    render(
      <ImageUpload
        maxFiles={2}
        onUploadComplete={mockOnUploadComplete}
        onUploadError={mockOnUploadError}
      />
    );

    const input = screen.getByLabelText(/upload images/i);
    await user.upload(input, files);

    await waitFor(() => {
      expect(mockOnUploadError).toHaveBeenCalledWith(
        expect.stringContaining('maximum')
      );
    });
  });

  it('shows preview images after selection', async () => {
    const user = userEvent.setup();
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    render(
      <ImageUpload
        maxFiles={5}
        onUploadComplete={mockOnUploadComplete}
      />
    );

    const input = screen.getByLabelText(/upload images/i);
    await user.upload(input, file);

    await waitFor(() => {
      const img = screen.getByAltText(/preview/i);
      expect(img).toBeInTheDocument();
    });
  });

  it('allows removing selected images', async () => {
    const user = userEvent.setup();
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    render(
      <ImageUpload
        maxFiles={5}
        onUploadComplete={mockOnUploadComplete}
      />
    );

    const input = screen.getByLabelText(/upload images/i);
    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText('test.jpg')).toBeInTheDocument();
    });

    const removeButton = screen.getByRole('button', { name: /remove/i });
    await user.click(removeButton);

    await waitFor(() => {
      expect(screen.queryByText('test.jpg')).not.toBeInTheDocument();
    });
  });

  it('displays upload progress', async () => {
    const user = userEvent.setup();
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    render(
      <ImageUpload
        maxFiles={5}
        onUploadComplete={mockOnUploadComplete}
      />
    );

    const input = screen.getByLabelText(/upload images/i);
    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  it('marks first image as primary', async () => {
    const user = userEvent.setup();
    const files = [
      new File(['1'], '1.jpg', { type: 'image/jpeg' }),
      new File(['2'], '2.jpg', { type: 'image/jpeg' }),
    ];
    
    render(
      <ImageUpload
        maxFiles={5}
        onUploadComplete={mockOnUploadComplete}
      />
    );

    const input = screen.getByLabelText(/upload images/i);
    await user.upload(input, files);

    await waitFor(() => {
      expect(screen.getByText(/primary/i)).toBeInTheDocument();
    });
  });

  it('validates file types', async () => {
    const user = userEvent.setup();
    const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    
    render(
      <ImageUpload
        maxFiles={5}
        onUploadComplete={mockOnUploadComplete}
        onUploadError={mockOnUploadError}
      />
    );

    const input = screen.getByLabelText(/upload images/i);
    await user.upload(input, invalidFile);

    await waitFor(() => {
      expect(mockOnUploadError).toHaveBeenCalledWith(
        expect.stringContaining('image')
      );
    });
  });

  it('validates file sizes', async () => {
    const user = userEvent.setup();
    // Create a file larger than 10MB
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.jpg', {
      type: 'image/jpeg',
    });
    
    render(
      <ImageUpload
        maxFiles={5}
        maxFileSize={10 * 1024 * 1024}
        onUploadComplete={mockOnUploadComplete}
        onUploadError={mockOnUploadError}
      />
    );

    const input = screen.getByLabelText(/upload images/i);
    await user.upload(input, largeFile);

    await waitFor(() => {
      expect(mockOnUploadError).toHaveBeenCalledWith(
        expect.stringContaining('size')
      );
    });
  });

  it('allows drag and drop', async () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    render(
      <ImageUpload
        maxFiles={5}
        onUploadComplete={mockOnUploadComplete}
      />
    );

    const dropzone = screen.getByText(/click to upload/i).closest('div');
    
    fireEvent.drop(dropzone!, {
      dataTransfer: {
        files: [file],
        items: [{ kind: 'file', type: file.type, getAsFile: () => file }],
        types: ['Files'],
      },
    });

    await waitFor(() => {
      expect(screen.getByText('test.jpg')).toBeInTheDocument();
    });
  });

  it('calls onUploadComplete with URLs', async () => {
    const user = userEvent.setup();
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const mockUrls = ['https://example.com/image1.jpg'];
    
    // Mock successful upload
    const { useUploadThing } = await import('@uploadthing/react');
    vi.mocked(useUploadThing).mockReturnValue({
      startUpload: vi.fn().mockResolvedValue(
        mockUrls.map(url => ({ url, key: 'test' }))
      ),
      isUploading: false,
    } as any);
    
    render(
      <ImageUpload
        maxFiles={5}
        onUploadComplete={mockOnUploadComplete}
      />
    );

    const input = screen.getByLabelText(/upload images/i);
    await user.upload(input, file);

    const uploadButton = screen.getByRole('button', { name: /upload/i });
    await user.click(uploadButton);

    await waitFor(() => {
      expect(mockOnUploadComplete).toHaveBeenCalledWith(mockUrls);
    });
  });

  it('disables upload when no files selected', () => {
    render(
      <ImageUpload
        maxFiles={5}
        onUploadComplete={mockOnUploadComplete}
      />
    );

    const uploadButton = screen.getByRole('button', { name: /upload/i });
    expect(uploadButton).toBeDisabled();
  });

  it('shows loading state during upload', async () => {
    const user = userEvent.setup();
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    const { useUploadThing } = await import('@uploadthing/react');
    vi.mocked(useUploadThing).mockReturnValue({
      startUpload: vi.fn().mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 1000))
      ),
      isUploading: true,
    } as any);
    
    render(
      <ImageUpload
        maxFiles={5}
        onUploadComplete={mockOnUploadComplete}
      />
    );

    const input = screen.getByLabelText(/upload images/i);
    await user.upload(input, file);

    const uploadButton = screen.getByRole('button', { name: /upload/i });
    await user.click(uploadButton);

    expect(screen.getByText(/uploading/i)).toBeInTheDocument();
    expect(uploadButton).toBeDisabled();
  });
});
