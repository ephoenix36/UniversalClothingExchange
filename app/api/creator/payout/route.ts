import { NextRequest, NextResponse } from 'next/server';
import { whopsdk } from '@/lib/whop-sdk';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';

/**
 * POST /api/creator/payout
 * Request payout to Stripe Connect account
 */
export async function POST(request: NextRequest) {
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
    
    if (!user.creatorProfile.stripeConnectAccountId) {
      return NextResponse.json(
        { success: false, error: 'Stripe account not connected' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const { amount } = body; // amount in dollars
    
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid amount' },
        { status: 400 }
      );
    }
    
    // Create payout
    const payout = await stripe.payouts.create(
      {
        amount: Math.round(amount * 100), // convert to cents
        currency: 'usd',
      },
      {
        stripeAccount: user.creatorProfile.stripeConnectAccountId,
      }
    );
    
    return NextResponse.json({
      success: true,
      payout: {
        id: payout.id,
        amount: payout.amount / 100,
        status: payout.status,
        arrivalDate: payout.arrival_date,
      },
    });
  } catch (error: any) {
    console.error('Error creating payout:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create payout',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/creator/payout
 * Get payout history
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
    
    if (!user?.creatorProfile?.stripeConnectAccountId) {
      return NextResponse.json({
        success: true,
        payouts: [],
      });
    }
    
    // Get payout history from Stripe
    const payouts = await stripe.payouts.list(
      { limit: 20 },
      { stripeAccount: user.creatorProfile.stripeConnectAccountId }
    );
    
    return NextResponse.json({
      success: true,
      payouts: payouts.data.map((payout) => ({
        id: payout.id,
        amount: payout.amount / 100,
        status: payout.status,
        arrivalDate: payout.arrival_date,
        created: payout.created,
      })),
    });
  } catch (error) {
    console.error('Error fetching payouts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payouts' },
      { status: 500 }
    );
  }
}
