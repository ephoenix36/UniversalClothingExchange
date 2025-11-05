import { NextRequest, NextResponse } from 'next/server';
import { whopsdk } from '@/lib/whop-sdk';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { authenticateRequest } from '@/lib/dev-auth';

/**
 * GET /api/collections
 * Get user's wardrobe collections
 */
export async function GET(request: NextRequest) {
  try {
    const { whopUserId } = await authenticateRequest(whopsdk, await headers());
    
    const user = await prisma.user.findUnique({
      where: { whopUserId },
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    const collections = await prisma.collection.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            item: {
              include: {
                images: {
                  where: { isPrimary: true },
                  take: 1,
                },
              },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json({
      success: true,
      collections,
    });
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch collections' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/collections
 * Create new collection
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
    const { name, description, isPublic, tags, coverImageUrl } = body;
    
    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Collection name is required' },
        { status: 400 }
      );
    }
    
    const collection = await prisma.collection.create({
      data: {
        userId: user.id,
        name,
        description,
        isPublic: isPublic ?? false,
        tags: tags || [],
        coverImageUrl,
      },
    });
    
    return NextResponse.json({
      success: true,
      collection,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating collection:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create collection' },
      { status: 500 }
    );
  }
}
