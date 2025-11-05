import { NextRequest, NextResponse } from 'next/server';
import { whopsdk } from '@/lib/whop-sdk';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';

/**
 * GET /api/collections/[collectionId]
 * Get collection details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ collectionId: string }> }
) {
  try {
    const { collectionId } = await params;
    
    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
      include: {
        items: {
          include: {
            item: {
              include: {
                images: {
                  orderBy: { isPrimary: 'desc' },
                },
              },
            },
          },
          orderBy: { order: 'asc' },
        },
        user: {
          select: {
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    });
    
    if (!collection) {
      return NextResponse.json(
        { success: false, error: 'Collection not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      collection,
    });
  } catch (error) {
    console.error('Error fetching collection:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch collection' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/collections/[collectionId]
 * Update collection
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ collectionId: string }> }
) {
  try {
    const { userId: whopUserId } = await whopsdk.verifyUserToken(await headers());
    const { collectionId } = await params;
    
    const user = await prisma.user.findUnique({
      where: { whopUserId },
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
    });
    
    if (!collection || collection.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Collection not found or unauthorized' },
        { status: 404 }
      );
    }
    
    const body = await request.json();
    const { name, description, isPublic, tags, coverImageUrl } = body;
    
    const updatedCollection = await prisma.collection.update({
      where: { id: collectionId },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(isPublic !== undefined && { isPublic }),
        ...(tags !== undefined && { tags }),
        ...(coverImageUrl !== undefined && { coverImageUrl }),
      },
    });
    
    return NextResponse.json({
      success: true,
      collection: updatedCollection,
    });
  } catch (error) {
    console.error('Error updating collection:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update collection' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/collections/[collectionId]
 * Delete collection
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ collectionId: string }> }
) {
  try {
    const { userId: whopUserId } = await whopsdk.verifyUserToken(await headers());
    const { collectionId } = await params;
    
    const user = await prisma.user.findUnique({
      where: { whopUserId },
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
    });
    
    if (!collection || collection.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Collection not found or unauthorized' },
        { status: 404 }
      );
    }
    
    await prisma.collection.delete({
      where: { id: collectionId },
    });
    
    return NextResponse.json({
      success: true,
      message: 'Collection deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting collection:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete collection' },
      { status: 500 }
    );
  }
}
