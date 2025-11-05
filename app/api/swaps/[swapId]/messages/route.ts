import { NextRequest, NextResponse } from 'next/server';
import { whopsdk } from '@/lib/whop-sdk';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';

/**
 * POST /api/swaps/[swapId]/messages
 * Send message in swap conversation
 */
export async function POST(
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
    const { content } = body;
    
    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, error: 'Message content is required' },
        { status: 400 }
      );
    }
    
    const message = await prisma.swapMessage.create({
      data: {
        swapId,
        senderId: user.id,
        content: content.trim(),
      },
    });
    
    return NextResponse.json({
      success: true,
      message,
    }, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
