import { NextRequest, NextResponse } from 'next/server';
import { whopsdk } from '@/lib/whop-sdk';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';

/**
 * GET /api/creator/profile
 * Get current user's creator profile
 */
export async function GET(request: NextRequest) {
  try {
    const { userId: whopUserId } = await whopsdk.verifyUserToken(await headers());
    
    const user = await prisma.user.findUnique({
      where: { whopUserId },
      include: {
        creatorProfile: {
          include: {
            promotions: {
              where: {
                isActive: true,
                OR: [
                  { expiresAt: null },
                  { expiresAt: { gte: new Date() } },
                ],
              },
            },
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
    
    return NextResponse.json({
      success: true,
      creatorProfile: user.creatorProfile,
    });
  } catch (error) {
    console.error('Error fetching creator profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch creator profile' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/creator/profile
 * Create or update creator profile
 */
export async function POST(request: NextRequest) {
  try {
    const { userId: whopUserId } = await whopsdk.verifyUserToken(await headers());
    
    const user = await prisma.user.findUnique({
      where: { whopUserId },
      include: { creatorProfile: true },
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    const body = await request.json();
    const {
      storeName,
      bio,
      brandingColors,
      bannerImageUrl,
      socialLinks,
      commissionRate,
      stripeConnectAccountId,
    } = body;
    
    if (!storeName) {
      return NextResponse.json(
        { success: false, error: 'Store name is required' },
        { status: 400 }
      );
    }
    
    let creatorProfile;
    
    if (user.creatorProfile) {
      // Update existing profile
      creatorProfile = await prisma.creatorProfile.update({
        where: { userId: user.id },
        data: {
          storeName,
          ...(bio !== undefined && { bio }),
          ...(brandingColors !== undefined && { brandingColors }),
          ...(bannerImageUrl !== undefined && { bannerImageUrl }),
          ...(socialLinks !== undefined && { socialLinks }),
          ...(commissionRate !== undefined && { commissionRate }),
          ...(stripeConnectAccountId !== undefined && { stripeConnectAccountId }),
        },
      });
    } else {
      // Create new profile
      creatorProfile = await prisma.creatorProfile.create({
        data: {
          userId: user.id,
          storeName,
          bio,
          brandingColors,
          bannerImageUrl,
          socialLinks,
          commissionRate: commissionRate || 10, // Default 10%
          stripeConnectAccountId,
        },
      });
    }
    
    return NextResponse.json({
      success: true,
      creatorProfile,
    });
  } catch (error) {
    console.error('Error creating/updating creator profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create/update creator profile' },
      { status: 500 }
    );
  }
}
