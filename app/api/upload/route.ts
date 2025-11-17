import { NextRequest, NextResponse } from 'next/server';
import { whopsdk } from '@/lib/whop-sdk';
import { headers } from 'next/headers';
import { UTApi } from 'uploadthing/server';

const utapi = new UTApi();

/**
 * POST /api/upload
 * Upload multiple images for wardrobe items
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const { userId } = await whopsdk.verifyUserToken(await headers());
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get form data
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      );
    }

    // Validate file count (max 5)
    if (files.length > 5) {
      return NextResponse.json(
        { success: false, error: 'Maximum 5 files allowed' },
        { status: 400 }
      );
    }

    // Validate each file
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    for (const file of files) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { success: false, error: `Invalid file type: ${file.name}` },
          { status: 400 }
        );
      }

      // Check file size
      if (file.size > maxFileSize) {
        return NextResponse.json(
          { success: false, error: `File too large: ${file.name}` },
          { status: 400 }
        );
      }
    }

    // Upload files to UploadThing
    const uploadedFiles = await utapi.uploadFiles(files);

    // Extract URLs
    const urls = uploadedFiles
      .filter((result) => result.data)
      .map((result) => result.data!.url);

    if (urls.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Upload failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      urls,
      count: urls.length,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/upload
 * Delete uploaded images
 */
export async function DELETE(request: NextRequest) {
  try {
    // Authenticate user
    const { userId } = await whopsdk.verifyUserToken(await headers());
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { fileKeys } = body;

    if (!fileKeys || !Array.isArray(fileKeys) || fileKeys.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No file keys provided' },
        { status: 400 }
      );
    }

    // Delete files from UploadThing
    await utapi.deleteFiles(fileKeys);

    return NextResponse.json({
      success: true,
      deleted: fileKeys.length,
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete files' },
      { status: 500 }
    );
  }
}
