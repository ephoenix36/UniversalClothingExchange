import { NextRequest, NextResponse } from 'next/server';
import { whopsdk } from '@/lib/whop-sdk';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';

/**
 * GET /api/creator/promotions
 * Get creator's promotions
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
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
    });
    
    if (!user?.creatorProfile) {
      return NextResponse.json(
        { success: false, error: 'Creator profile not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      promotions: user.creatorProfile.promotions,
    });
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch promotions' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/creator/promotions
 * Create new promotion
 */
export async function POST(request: NextRequest) {
  try {
    const { userId: whopUserId } = await whopsdk.verifyUserToken(await headers());
    
    const user = await prisma.user.findUnique({
      where: { whopUserId },
      include: { creatorProfile: true },
    });
    
    if (!user?.creatorProfile) {
      return NextResponse.json(
        { success: false, error: 'Creator profile not found' },
        { status: 404 }
      );
    }
    
    const body = await request.json();
    const {
      title,
      description,
      code,
      discountType,
      discountValue,
      minPurchaseAmount,
      maxUses,
      expiresAt,
    } = body;
    
    if (!title || !code || !discountType || !discountValue) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if code already exists
    const existing = await prisma.promotion.findFirst({
      where: {
        creatorId: user.creatorProfile.id,
        code: code.toUpperCase(),
      },
    });
    
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Promotion code already exists' },
        { status: 400 }
      );
    }
    
    const promotion = await prisma.promotion.create({
      data: {
        creatorId: user.creatorProfile.id,
        title,
        description,
        code: code.toUpperCase(),
        discountType: discountType.toUpperCase(),
        discountValue,
        minPurchaseAmount,
        maxUses,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });
    
    return NextResponse.json({
      success: true,
      promotion,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating promotion:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create promotion' },
      { status: 500 }
    );
  }
}
