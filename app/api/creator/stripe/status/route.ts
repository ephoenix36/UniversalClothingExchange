import { NextRequest, NextResponse } from 'next/server';
import { whopsdk } from '@/lib/whop-sdk';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';

/**
 * GET /api/creator/stripe/status
 * Check Stripe Connect account status
 */
export async function GET(request: NextRequest) {
  try {
    const { userId: whopUserId } = await whopsdk.verifyUserToken(await headers());
    
    const user = await prisma.user.findUnique({
      where: { whopUserId },
      include: { creatorProfile: true },
    });
    
    if (!user?.creatorProfile?.stripeConnectAccountId) {
      return NextResponse.json({
        success: true,
        status: 'not_connected',
        details_submitted: false,
        charges_enabled: false,
        payouts_enabled: false,
      });
    }
    
    // Get account details from Stripe
    const account = await stripe.accounts.retrieve(
      user.creatorProfile.stripeConnectAccountId
    );
    
    return NextResponse.json({
      success: true,
      status: 'connected',
      details_submitted: account.details_submitted,
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
      requirements: account.requirements,
    });
  } catch (error) {
    console.error('Error checking Stripe status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check Stripe status' },
      { status: 500 }
    );
  }
}
