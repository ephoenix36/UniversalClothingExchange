import { NextRequest, NextResponse } from 'next/server';
import { whopsdk } from '@/lib/whop-sdk';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { analyzeClothingImage, hasAICredits } from '@/lib/gemini';

/**
 * POST /api/ai/analyze
 * Analyze clothing image with Gemini AI
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
    
    // Check if user has their own API key
    if (!user.geminiApiKey) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Please add your Gemini API key in Settings to use AI features',
          needsApiKey: true,
        },
        { status: 403 }
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
    
    const body = await request.json();
    const { imageUrl } = body;
    
    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Image URL is required' },
        { status: 400 }
      );
    }
    
    // Analyze image with user's API key
    const analysis = await analyzeClothingImage(imageUrl, user.geminiApiKey);
    
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
      analysis,
      creditsRemaining: creditCheck.remaining - 1,
    });
  } catch (error: any) {
    console.error('Error analyzing image:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to analyze image' },
      { status: 500 }
    );
  }
}
