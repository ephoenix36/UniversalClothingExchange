import { NextRequest, NextResponse } from 'next/server';
import { whopsdk } from '@/lib/whop-sdk';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';

/**
 * POST /api/users/ai-consent
 * Grant consent for AI photo processing
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
    const { granted } = body;
    
    // Update consent
    await prisma.user.update({
      where: { id: user.id },
      data: {
        aiPhotoConsent: granted === true,
        aiConsentDate: granted ? new Date() : null,
      },
    });
    
    return NextResponse.json({
      success: true,
      consent: granted,
    });
  } catch (error) {
    console.error('Error updating AI consent:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update consent' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/users/ai-consent
 * Check current AI consent status
 */
export async function GET(request: NextRequest) {
  try {
    const { userId: whopUserId } = await whopsdk.verifyUserToken(await headers());
    
    const user = await prisma.user.findUnique({
      where: { whopUserId },
      select: {
        aiPhotoConsent: true,
        aiConsentDate: true,
      },
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      consent: user.aiPhotoConsent || false,
      consentDate: user.aiConsentDate,
    });
  } catch (error) {
    console.error('Error checking AI consent:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check consent' },
      { status: 500 }
    );
  }
}
