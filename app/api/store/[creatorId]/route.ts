import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/store/[creatorId]
 * Get public creator storefront
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ creatorId: string }> }
) {
  try {
    const { creatorId } = await params;
    
    const creator = await prisma.creatorProfile.findUnique({
      where: { id: creatorId },
      include: {
        user: {
          select: {
            displayName: true,
            avatarUrl: true,
            bio: true,
          },
        },
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
    });
    
    if (!creator) {
      return NextResponse.json(
        { success: false, error: 'Creator not found' },
        { status: 404 }
      );
    }
    
    // Get creator's items for sale
    const items = await prisma.wardrobeItem.findMany({
      where: {
        ownerId: creator.userId,
        availableForSale: true,
        status: 'AVAILABLE',
      },
      include: {
        images: {
          orderBy: { isPrimary: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json({
      success: true,
      creator: {
        id: creator.id,
        storeName: creator.storeName,
        bio: creator.bio,
        brandingColors: creator.brandingColors,
        bannerImageUrl: creator.bannerImageUrl,
        socialLinks: creator.socialLinks,
        totalSales: creator.totalSales,
        isVerified: creator.isVerified,
        user: creator.user,
      },
      items,
      promotions: creator.promotions,
    });
  } catch (error) {
    console.error('Error fetching storefront:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch storefront' },
      { status: 500 }
    );
  }
}
