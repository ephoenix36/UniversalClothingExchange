import { NextRequest, NextResponse } from 'next/server';
import { whopsdk } from '@/lib/whop-sdk';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';

/**
 * POST /api/collections/[collectionId]/items
 * Add item to collection
 */
export async function POST(
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
    const { itemId } = body;
    
    if (!itemId) {
      return NextResponse.json(
        { success: false, error: 'Item ID is required' },
        { status: 400 }
      );
    }
    
    // Check if item exists and belongs to user
    const item = await prisma.wardrobeItem.findUnique({
      where: { id: itemId },
    });
    
    if (!item || item.ownerId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Item not found or unauthorized' },
        { status: 404 }
      );
    }
    
    // Check if item already in collection
    const existing = await prisma.collectionItem.findUnique({
      where: {
        collectionId_itemId: {
          collectionId,
          itemId,
        },
      },
    });
    
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Item already in collection' },
        { status: 400 }
      );
    }
    
    // Get max order for this collection
    const maxOrder = await prisma.collectionItem.aggregate({
      where: { collectionId },
      _max: { order: true },
    });
    
    const collectionItem = await prisma.collectionItem.create({
      data: {
        collectionId,
        itemId,
        order: (maxOrder._max.order || 0) + 1,
      },
      include: {
        item: {
          include: {
            images: true,
          },
        },
      },
    });
    
    return NextResponse.json({
      success: true,
      collectionItem,
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding item to collection:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add item to collection' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/collections/[collectionId]/items/[itemId]
 * Remove item from collection
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ collectionId: string; itemId: string }> }
) {
  try {
    const { userId: whopUserId } = await whopsdk.verifyUserToken(await headers());
    const { collectionId, itemId } = await params;
    
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
    
    await prisma.collectionItem.delete({
      where: {
        collectionId_itemId: {
          collectionId,
          itemId,
        },
      },
    });
    
    return NextResponse.json({
      success: true,
      message: 'Item removed from collection',
    });
  } catch (error) {
    console.error('Error removing item from collection:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove item from collection' },
      { status: 500 }
    );
  }
}
