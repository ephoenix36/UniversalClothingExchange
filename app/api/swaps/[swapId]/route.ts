import { NextRequest, NextResponse } from 'next/server';
import { whopsdk } from '@/lib/whop-sdk';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';

/**
 * GET /api/swaps/[swapId]
 * Get swap details with full message history
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ swapId: string }> }
) {
  try {
    const { userId: whopUserId } = await whopsdk.verifyUserToken(await headers());
    const { swapId } = await params;
    
    const user = await prisma.user.findUnique({
      where: { whopUserId },
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    const swap = await prisma.swapRequest.findUnique({
      where: { id: swapId },
      include: {
        item: {
          include: {
            images: true,
          },
        },
        requester: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
            membershipTier: true,
          },
        },
        owner: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
            membershipTier: true,
          },
        },
        messages: {
          orderBy: { timestamp: 'asc' },
        },
      },
    });
    
    if (!swap) {
      return NextResponse.json(
        { success: false, error: 'Swap not found' },
        { status: 404 }
      );
    }
    
    // Verify user is part of this swap
    if (swap.requesterId !== user.id && swap.ownerId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to view this swap' },
        { status: 403 }
      );
    }
    
    return NextResponse.json({
      success: true,
      swap,
    });
  } catch (error) {
    console.error('Error fetching swap:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch swap' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/swaps/[swapId]
 * Update swap status (accept, decline, complete, cancel)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ swapId: string }> }
) {
  try {
    const { userId: whopUserId } = await whopsdk.verifyUserToken(await headers());
    const { swapId } = await params;
    
    const user = await prisma.user.findUnique({
      where: { whopUserId },
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    const swap = await prisma.swapRequest.findUnique({
      where: { id: swapId },
      include: { item: true },
    });
    
    if (!swap) {
      return NextResponse.json(
        { success: false, error: 'Swap not found' },
        { status: 404 }
      );
    }
    
    // Verify user is part of this swap
    if (swap.requesterId !== user.id && swap.ownerId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Not authorized' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { status, action } = body;
    
    let newStatus = status?.toUpperCase();
    let itemStatus = swap.item.status;
    let itemOwner = swap.item.ownerId;
    
    // Handle different actions
    if (action === 'accept') {
      if (swap.ownerId !== user.id) {
        return NextResponse.json(
          { success: false, error: 'Only the owner can accept' },
          { status: 403 }
        );
      }
      if (swap.status !== 'PENDING') {
        return NextResponse.json(
          { success: false, error: 'Swap is not pending' },
          { status: 400 }
        );
      }
      newStatus = 'ACCEPTED';
      itemStatus = 'ON_LOAN';
    } else if (action === 'decline') {
      if (swap.ownerId !== user.id) {
        return NextResponse.json(
          { success: false, error: 'Only the owner can decline' },
          { status: 403 }
        );
      }
      newStatus = 'DECLINED';
      itemStatus = 'AVAILABLE';
    } else if (action === 'complete') {
      if (swap.status !== 'ACCEPTED') {
        return NextResponse.json(
          { success: false, error: 'Swap must be accepted first' },
          { status: 400 }
        );
      }
      newStatus = 'COMPLETED';
      itemStatus = 'AVAILABLE';
      // Transfer ownership
      itemOwner = swap.requesterId;
    } else if (action === 'cancel') {
      if (swap.status === 'COMPLETED') {
        return NextResponse.json(
          { success: false, error: 'Cannot cancel completed swap' },
          { status: 400 }
        );
      }
      newStatus = 'CANCELED';
      itemStatus = 'AVAILABLE';
    }
    
    // Update swap
    const updatedSwap = await prisma.swapRequest.update({
      where: { id: swapId },
      data: {
        status: newStatus,
        ...(newStatus === 'COMPLETED' && { completedAt: new Date() }),
      },
      include: {
        item: true,
        requester: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        owner: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        messages: true,
      },
    });
    
    // Update item
    await prisma.wardrobeItem.update({
      where: { id: swap.itemId },
      data: {
        status: itemStatus,
        ownerId: itemOwner,
        ...(newStatus === 'COMPLETED' && {
          swapCount: { increment: 1 },
          history: {
            create: {
              type: 'SWAP',
              anonymizedUserId: Buffer.from(swap.ownerId).toString('base64'),
              notes: `Swapped with ${swap.requester.displayName || 'another user'}`,
            },
          },
        }),
      },
    });
    
    return NextResponse.json({
      success: true,
      swap: updatedSwap,
    });
  } catch (error) {
    console.error('Error updating swap:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update swap' },
      { status: 500 }
    );
  }
}
