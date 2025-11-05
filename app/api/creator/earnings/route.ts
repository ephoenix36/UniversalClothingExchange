import { NextRequest, NextResponse } from 'next/server';
import { whopsdk } from '@/lib/whop-sdk';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { calculateCommission, formatCurrency } from '@/lib/stripe';

/**
 * GET /api/creator/earnings
 * Get creator's earnings and commission breakdown
 */
export async function GET(request: NextRequest) {
  try {
    const { userId: whopUserId } = await whopsdk.verifyUserToken(await headers());
    
    const user = await prisma.user.findUnique({
      where: { whopUserId },
      include: {
        creatorProfile: true,
      },
    });
    
    if (!user?.creatorProfile) {
      return NextResponse.json(
        { success: false, error: 'Creator profile not found' },
        { status: 404 }
      );
    }
    
    // Get all sold items
    const soldItems = await prisma.itemHistory.findMany({
      where: {
        item: {
          ownerId: user.id,
        },
        type: 'SALE',
      },
      include: {
        item: {
          select: {
            salePrice: true,
            title: true,
          },
        },
      },
    });
    
    // Calculate total earnings
    let totalGross = 0;
    let totalPlatformFee = 0;
    let totalCreatorCommission = 0;
    let totalNet = 0;
    
    const platformCommissionRate = 10; // 10%
    const creatorCommissionRate = user.creatorProfile.commissionRate || 0;
    
    soldItems.forEach((sale: any) => {
      const salePrice = sale.item.salePrice || 0;
      const priceInCents = Math.round(salePrice * 100);
      
      const platformFee = calculateCommission(priceInCents, platformCommissionRate);
      const creatorFee = calculateCommission(priceInCents, creatorCommissionRate);
      const netEarnings = priceInCents - platformFee - creatorFee;
      
      totalGross += priceInCents;
      totalPlatformFee += platformFee;
      totalCreatorCommission += creatorFee;
      totalNet += netEarnings;
    });
    
    return NextResponse.json({
      success: true,
      earnings: {
        totalGross: totalGross / 100,
        totalPlatformFee: totalPlatformFee / 100,
        totalCreatorCommission: totalCreatorCommission / 100,
        totalNet: totalNet / 100,
        salesCount: soldItems.length,
        formatted: {
          totalGross: formatCurrency(totalGross),
          totalPlatformFee: formatCurrency(totalPlatformFee),
          totalCreatorCommission: formatCurrency(totalCreatorCommission),
          totalNet: formatCurrency(totalNet),
        },
      },
      recentSales: soldItems.slice(0, 10).map((sale: any) => ({
        itemTitle: sale.item.title,
        salePrice: sale.item.salePrice,
        date: sale.timestamp,
      })),
    });
  } catch (error) {
    console.error('Error fetching earnings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch earnings' },
      { status: 500 }
    );
  }
}
