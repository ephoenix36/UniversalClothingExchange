import { NextRequest, NextResponse } from 'next/server';
import { whopsdk } from '@/lib/whop-sdk';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { authenticateRequest } from '@/lib/dev-auth';

/**
 * GET /api/swaps
 * Get user's swap requests (sent, received, or all)
 */
export async function GET(request: NextRequest) {
  try {
    const { whopUserId } = await authenticateRequest(whopsdk, await headers());
    
    const user = await prisma.user.findUnique({
      where: { whopUserId },
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'sent' | 'received' | 'all'
    const status = searchParams.get('status');
    
    const where: any = {
      OR: [
        { requesterId: user.id },
        { ownerId: user.id },
      ],
    };
    
    if (type === 'sent') {
      delete where.OR;
      where.requesterId = user.id;
    } else if (type === 'received') {
      delete where.OR;
      where.ownerId = user.id;
    }
    
    if (status) {
      where.status = status.toUpperCase();
    }
    
    const swaps = await prisma.swapRequest.findMany({
      where,
      include: {
        item: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
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
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json({
      success: true,
      swaps,
    });
  } catch (error) {
    console.error('Error fetching swaps:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch swaps' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/swaps
 * Create new swap request
 */
export async function POST(request: NextRequest) {
  try {
    const { userId: whopUserId } = await whopsdk.verifyUserToken(await headers());
    
    const user = await prisma.user.findUnique({
      where: { whopUserId },
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    const body = await request.json();
    const {
      itemId,
      deliveryMethod,
      message,
      scheduledPickup,
      scheduledReturn,
    } = body;
    
    if (!itemId || !deliveryMethod) {
      return NextResponse.json(
        { success: false, error: 'Item ID and delivery method are required' },
        { status: 400 }
      );
    }
    
    // Get the item and verify it's available
    const item = await prisma.wardrobeItem.findUnique({
      where: { id: itemId },
    });
    
    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }
    
    if (item.ownerId === user.id) {
      return NextResponse.json(
        { success: false, error: 'Cannot swap your own item' },
        { status: 400 }
      );
    }
    
    if (!item.availableForSwap) {
      return NextResponse.json(
        { success: false, error: 'Item is not available for swap' },
        { status: 400 }
      );
    }
    
    if (item.status !== 'AVAILABLE') {
      return NextResponse.json(
        { success: false, error: 'Item is currently unavailable' },
        { status: 400 }
      );
    }
    
    // Create swap request
    const swap = await prisma.swapRequest.create({
      data: {
        requesterId: user.id,
        ownerId: item.ownerId,
        itemId,
        deliveryMethod: deliveryMethod.toUpperCase(),
        scheduledPickup: scheduledPickup ? new Date(scheduledPickup) : null,
        scheduledReturn: scheduledReturn ? new Date(scheduledReturn) : null,
        messages: message ? {
          create: {
            senderId: user.id,
            content: message,
          },
        } : undefined,
      },
      include: {
        item: {
          include: {
            images: true,
          },
        },
        requester: {
          select: {
            displayName: true,
            avatarUrl: true,
          },
        },
        owner: {
          select: {
            displayName: true,
            avatarUrl: true,
          },
        },
        messages: true,
      },
    });
    
    // Update item status to reflect pending swap
    await prisma.wardrobeItem.update({
      where: { id: itemId },
      data: { status: 'ON_LOAN' }, // Temporarily mark as on loan pending approval
    });
    
    return NextResponse.json({
      success: true,
      swap,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating swap:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create swap request' },
      { status: 500 }
    );
  }
}
