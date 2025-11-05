import { NextRequest, NextResponse } from 'next/server';
import { whopsdk } from '@/lib/whop-sdk';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { hasReachedLimit, MembershipTier } from '@/lib/tiers';

/**
 * GET /api/users/limits
 * Check user's current usage against tier limits
 */
export async function GET(request: NextRequest) {
  try {
    const { userId: whopUserId } = await whopsdk.verifyUserToken(await headers());
    
    const user = await prisma.user.findUnique({
      where: { whopUserId },
      include: {
        wardrobeItems: { select: { id: true } },
        collections: { select: { id: true } },
        sentSwaps: {
          where: {
            status: { in: ['PENDING', 'ACCEPTED'] },
          },
          select: { id: true },
        },
        creatorProfile: {
          include: {
            promotions: {
              where: { isActive: true },
              select: { id: true },
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
    
    const tier = user.membershipTier as MembershipTier;
    
    const wardrobeCount = user.wardrobeItems.length;
    const collectionsCount = user.collections.length;
    const activeSwapsCount = user.sentSwaps.length;
    const promotionsCount = user.creatorProfile?.promotions.length || 0;
    
    return NextResponse.json({
      success: true,
      tier,
      usage: {
        wardrobeItems: wardrobeCount,
        collections: collectionsCount,
        activeSwaps: activeSwapsCount,
        promotions: promotionsCount,
      },
      limits: {
        wardrobeItemsReached: hasReachedLimit(tier, 'wardrobeItems', wardrobeCount),
        collectionsReached: hasReachedLimit(tier, 'collections', collectionsCount),
        activeSwapsReached: hasReachedLimit(tier, 'activeSwaps', activeSwapsCount),
        promotionsReached: hasReachedLimit(tier, 'promotionCodes', promotionsCount),
      },
    });
  } catch (error) {
    console.error('Error checking limits:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check limits' },
      { status: 500 }
    );
  }
}
