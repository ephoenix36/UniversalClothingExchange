import { NextRequest, NextResponse } from 'next/server';
import { whopsdk } from '@/lib/whop-sdk';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { createConnectAccount, createAccountLink } from '@/lib/stripe';

/**
 * POST /api/creator/stripe/onboard
 * Create Stripe Connect account and return onboarding link
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
    
    if (!user.creatorProfile) {
      return NextResponse.json(
        { success: false, error: 'Creator profile not found. Create one first.' },
        { status: 400 }
      );
    }
    
    // Check if already has Stripe account
    if (user.creatorProfile.stripeConnectAccountId) {
      // Create new account link for existing account
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const accountLink = await createAccountLink(
        user.creatorProfile.stripeConnectAccountId,
        `${baseUrl}/creator/stripe/return`,
        `${baseUrl}/creator/stripe/refresh`,
      );
      
      return NextResponse.json({
        success: true,
        url: accountLink.url,
      });
    }
    
    // Create new Stripe Connect account
    const account = await createConnectAccount(user.email || '');
    
    // Save account ID to database
    await prisma.creatorProfile.update({
      where: { id: user.creatorProfile.id },
      data: { stripeConnectAccountId: account.id },
    });
    
    // Create onboarding link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const accountLink = await createAccountLink(
      account.id,
      `${baseUrl}/creator/stripe/return`,
      `${baseUrl}/creator/stripe/refresh`,
    );
    
    return NextResponse.json({
      success: true,
      url: accountLink.url,
    });
  } catch (error) {
    console.error('Error creating Stripe account:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create Stripe account' },
      { status: 500 }
    );
  }
}
