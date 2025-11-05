import { NextRequest, NextResponse } from 'next/server';
import { whopsdk } from '@/lib/whop-sdk';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { createPaymentIntent, calculateCommission } from '@/lib/stripe';

/**
 * POST /api/payments/create-intent
 * Create payment intent for item purchase
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
    const { itemId } = body;
    
    if (!itemId) {
      return NextResponse.json(
        { success: false, error: 'Item ID is required' },
        { status: 400 }
      );
    }
    
    // Get item with owner's creator profile
    const item = await prisma.wardrobeItem.findUnique({
      where: { id: itemId },
      include: {
        owner: {
          include: {
            creatorProfile: true,
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
    
    if (!item.availableForSale || !item.salePrice) {
      return NextResponse.json(
        { success: false, error: 'Item is not for sale' },
        { status: 400 }
      );
    }
    
    if (!item.owner.creatorProfile?.stripeConnectAccountId) {
      return NextResponse.json(
        { success: false, error: 'Seller has not set up payment processing' },
        { status: 400 }
      );
    }
    
    // Calculate amounts
    const priceInCents = Math.round(item.salePrice * 100);
    const platformCommissionRate = 10; // 10% platform fee
    const creatorCommissionRate = item.owner.creatorProfile.commissionRate || 0;
    const totalCommission = calculateCommission(
      priceInCents,
      platformCommissionRate + creatorCommissionRate
    );
    
    // Create payment intent
    const paymentIntent = await createPaymentIntent(
      priceInCents,
      'usd',
      item.owner.creatorProfile.stripeConnectAccountId,
      totalCommission
    );
    
    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      amount: priceInCents,
      platformFee: totalCommission,
      sellerReceives: priceInCents - totalCommission,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
