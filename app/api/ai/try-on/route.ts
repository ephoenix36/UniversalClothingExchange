import { NextRequest, NextResponse } from 'next/server';
import { whopsdk } from '@/lib/whop-sdk';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { generateTryOnDescription, hasAICredits } from '@/lib/gemini';

/**
 * POST /api/ai/try-on
 * Generate virtual try-on description using Gemini AI
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
    
    // Check AI credits
    const creditCheck = hasAICredits(
      user.membershipTier,
      user.aiCreditsUsed || 0,
      user.creditsPeriodStart || new Date()
    );
    
    if (!creditCheck.hasCredits) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No AI credits remaining',
          remaining: 0,
          limit: creditCheck.limit,
        },
        { status: 429 }
      );
    }
    
    const body = await request.json();
    const { itemId, userPhotoUrl } = body;
    
    if (!itemId) {
      return NextResponse.json(
        { success: false, error: 'Item ID is required' },
        { status: 400 }
      );
    }
    
    // Get clothing item
    const item = await prisma.wardrobeItem.findUnique({
      where: { id: itemId },
      include: {
        images: {
          where: { isPrimary: true },
        },
      },
    });
    
    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }
    
    const clothingPhotoUrl = item.images[0]?.url || '';
    
    if (!clothingPhotoUrl) {
      return NextResponse.json(
        { success: false, error: 'Item has no image' },
        { status: 400 }
      );
    }
    
    // Generate try-on description
    const description = await generateTryOnDescription(
      userPhotoUrl || user.avatarUrl || '',
      clothingPhotoUrl,
      {
        title: item.title,
        category: item.category,
        color: item.color || undefined,
        pattern: item.pattern || undefined,
      }
    );
    
    // Update AI credits used
    const now = new Date();
    const isNewMonth = 
      !user.creditsPeriodStart ||
      now.getMonth() !== user.creditsPeriodStart.getMonth() ||
      now.getFullYear() !== user.creditsPeriodStart.getFullYear();
    
    await prisma.user.update({
      where: { id: user.id },
      data: {
        aiCreditsUsed: isNewMonth ? 1 : (user.aiCreditsUsed || 0) + 1,
        creditsPeriodStart: isNewMonth ? now : user.creditsPeriodStart,
      },
    });
    
    return NextResponse.json({
      success: true,
      description,
      creditsRemaining: creditCheck.remaining - 1,
      creditsLimit: creditCheck.limit,
    });
  } catch (error: any) {
    console.error('Error generating try-on:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate try-on' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ai/try-on/credits
 * Check remaining AI credits
 */
export async function GET(request: NextRequest) {
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
    
    const creditCheck = hasAICredits(
      user.membershipTier,
      user.aiCreditsUsed || 0,
      user.creditsPeriodStart || new Date()
    );
    
    return NextResponse.json({
      success: true,
      ...creditCheck,
      tier: user.membershipTier,
    });
  } catch (error) {
    console.error('Error checking credits:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check credits' },
      { status: 500 }
    );
  }
}
