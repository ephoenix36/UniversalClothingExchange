import { NextRequest, NextResponse } from 'next/server';
import { whopsdk } from '@/lib/whop-sdk';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { calculateShippingRates, type ShippingAddress } from '@/lib/logistics';

/**
 * POST /api/shipping/rates
 * Calculate shipping rates for an item
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
    const { itemId, toAddress } = body;
    
    if (!itemId || !toAddress) {
      return NextResponse.json(
        { success: false, error: 'Item ID and destination address required' },
        { status: 400 }
      );
    }
    
    // Get item with owner address
    const item = await prisma.wardrobeItem.findUnique({
      where: { id: itemId },
      include: {
        owner: {
          select: {
            shippingAddress: true,
          },
        },
      },
    });
    
    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }
    
    const fromAddress = item.owner.shippingAddress as ShippingAddress | null;
    
    if (!fromAddress) {
      return NextResponse.json(
        { success: false, error: 'Seller has not set up shipping address' },
        { status: 400 }
      );
    }
    
    // Calculate rates
    const weight = item.weight || 8; // default 8 oz if not specified
    const rates = calculateShippingRates(fromAddress, toAddress, weight);
    
    return NextResponse.json({
      success: true,
      rates,
    });
  } catch (error) {
    console.error('Error calculating shipping rates:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to calculate shipping rates' },
      { status: 500 }
    );
  }
}
