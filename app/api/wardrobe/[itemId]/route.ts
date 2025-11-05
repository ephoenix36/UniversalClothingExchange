import { NextRequest, NextResponse } from 'next/server';
import { whopsdk } from '@/lib/whop-sdk';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';

/**
 * GET /api/wardrobe/[itemId]
 * Get item details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { userId: whopUserId } = await whopsdk.verifyUserToken(await headers());
    const { itemId } = await params;
    
    const item = await prisma.wardrobeItem.findUnique({
      where: { id: itemId },
      include: {
        images: {
          orderBy: { isPrimary: 'desc' },
        },
        history: {
          orderBy: { timestamp: 'desc' },
        },
        owner: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
            membershipTier: true,
          },
        },
      },
    });
    
    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      item,
    });
  } catch (error) {
    console.error('Error fetching item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch item' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/wardrobe/[itemId]
 * Update item
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { userId: whopUserId } = await whopsdk.verifyUserToken(await headers());
    const { itemId } = await params;
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { whopUserId },
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check ownership
    const existingItem = await prisma.wardrobeItem.findUnique({
      where: { id: itemId },
    });
    
    if (!existingItem) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }
    
    if (existingItem.ownerId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to edit this item' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const {
      title,
      description,
      category,
      subcategory,
      brand,
      size,
      color,
      condition,
      tags,
      estimatedValue,
      availableForSwap,
      availableForSale,
      salePrice,
      status,
    } = body;
    
    // Update item
    const updatedItem = await prisma.wardrobeItem.update({
      where: { id: itemId },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category: category.toUpperCase() }),
        ...(subcategory !== undefined && { subcategory }),
        ...(brand !== undefined && { brand }),
        ...(size !== undefined && { size }),
        ...(color !== undefined && { color: Array.isArray(color) ? color : [color] }),
        ...(condition !== undefined && { condition: condition.toUpperCase() }),
        ...(tags !== undefined && { tags }),
        ...(estimatedValue !== undefined && { estimatedValue }),
        ...(availableForSwap !== undefined && { availableForSwap }),
        ...(availableForSale !== undefined && { availableForSale }),
        ...(salePrice !== undefined && { salePrice }),
        ...(status !== undefined && { status: status.toUpperCase() }),
      },
      include: {
        images: true,
        history: {
          orderBy: { timestamp: 'desc' },
        },
      },
    });
    
    return NextResponse.json({
      success: true,
      item: updatedItem,
    });
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update item' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/wardrobe/[itemId]
 * Delete item
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { userId: whopUserId } = await whopsdk.verifyUserToken(await headers());
    const { itemId } = await params;
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { whopUserId },
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check ownership
    const existingItem = await prisma.wardrobeItem.findUnique({
      where: { id: itemId },
    });
    
    if (!existingItem) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }
    
    if (existingItem.ownerId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to delete this item' },
        { status: 403 }
      );
    }
    
    // Delete item (cascade will handle images and history)
    await prisma.wardrobeItem.delete({
      where: { id: itemId },
    });
    
    return NextResponse.json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete item' },
      { status: 500 }
    );
  }
}
