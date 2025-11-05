import { NextRequest, NextResponse } from 'next/server';
import { whopsdk } from '@/lib/whop-sdk';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { generateStyleRecommendations, hasAICredits } from '@/lib/gemini';

/**
 * GET /api/ai/recommendations
 * Get personalized style recommendations based on wardrobe
 */
export async function GET(request: NextRequest) {
  try {
    const { userId: whopUserId } = await whopsdk.verifyUserToken(await headers());
    
    const user = await prisma.user.findUnique({
      where: { whopUserId },
      include: {
        wardrobeItems: {
          select: {
            category: true,
            color: true,
            pattern: true,
          },
        },
      },
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
        },
        { status: 429 }
      );
    }
    
    if (user.wardrobeItems.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Add some items to your wardrobe first' },
        { status: 400 }
      );
    }
    
    // Generate recommendations
    const recommendations = await generateStyleRecommendations(
      {
        preferredStyles: user.preferredStyles as string[] | undefined,
        size: user.size || undefined,
        favoriteColors: user.favoriteColors as string[] | undefined,
      },
      user.wardrobeItems
    );
    
    // Update AI credits
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
      recommendations,
      creditsRemaining: creditCheck.remaining - 1,
    });
  } catch (error: any) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}
