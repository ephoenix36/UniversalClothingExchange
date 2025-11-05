import { NextRequest, NextResponse } from 'next/server';
import { whopsdk } from '@/lib/whop-sdk';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { authenticateRequest } from '@/lib/dev-auth';

/**
 * GET /api/wardrobe
 * Get user's wardrobe items with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const { whopUserId } = await authenticateRequest(whopsdk, await headers());
    
    // Find user in our database
    const user = await prisma.user.findUnique({
      where: { whopUserId },
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const availableForSwap = searchParams.get('availableForSwap');
    const search = searchParams.get('search');
    
    // Build where clause
    const where: any = { ownerId: user.id };
    
    if (category) {
      where.category = category.toUpperCase();
    }
    
    if (status) {
      where.status = status.toUpperCase();
    }
    
    if (availableForSwap !== null) {
      where.availableForSwap = availableForSwap === 'true';
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    // Fetch items
    const items = await prisma.wardrobeItem.findMany({
      where,
      include: {
        images: {
          orderBy: { isPrimary: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json({
      success: true,
      items,
      count: items.length,
    });
  } catch (error) {
    console.error('Error fetching wardrobe:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wardrobe' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/wardrobe
 * Add new item to wardrobe
 */
export async function POST(request: NextRequest) {
  try {
    const { whopUserId } = await authenticateRequest(whopsdk, await headers());
    
    // Find user
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
    const {
      title,
      description,
      category,
      subcategory,
      brand,
      size,
      color,
      condition,
      tags,
      estimatedValue,
      availableForSwap,
      availableForSale,
      salePrice,
      images,
    } = body;
    
    // Validation
    if (!title || !category || !size || !condition) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create item with images
    const item = await prisma.wardrobeItem.create({
      data: {
        ownerId: user.id,
        originalUploaderId: user.id,
        title,
        description,
        category: category.toUpperCase(),
        subcategory,
        brand,
        size,
        color: Array.isArray(color) ? color : [color],
        condition: condition.toUpperCase(),
        tags: tags || [],
        estimatedValue,
        availableForSwap: availableForSwap ?? true,
        availableForSale: availableForSale ?? false,
        salePrice,
        images: images ? {
          create: images.map((img: any, index: number) => ({
            url: img.url,
            isPrimary: index === 0,
          })),
        } : undefined,
        history: {
          create: {
            type: 'UPLOAD',
            anonymizedUserId: Buffer.from(user.id).toString('base64'),
            notes: 'Item uploaded to wardrobe',
          },
        },
      },
      include: {
        images: true,
        history: true,
      },
    });
    
    return NextResponse.json({
      success: true,
      item,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create item' },
      { status: 500 }
    );
  }
}
