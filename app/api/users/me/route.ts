import { NextRequest, NextResponse } from 'next/server';
import { whopsdk } from '@/lib/whop-sdk';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { authenticateRequest } from '@/lib/dev-auth';

/**
 * GET /api/users/me
 * Get current user's profile
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate (works in dev mode without Whop token)
    const { whopUserId, isDev } = await authenticateRequest(whopsdk, await headers());
    
    // Get Whop user data (skip in dev mode)
    let whopUser: any = null;
    if (!isDev) {
      try {
        whopUser = await whopsdk.users.retrieve(whopUserId);
      } catch (error) {
        console.warn('Could not fetch Whop user data');
      }
    }
    
    // Find or create user in our database
    let user = await prisma.user.findUnique({
      where: { whopUserId },
      include: {
        profilePhotos: true,
      },
    });
    
    // If user doesn't exist in our DB, create them
    if (!user) {
      // In dev mode or if whopUser is null, use defaults
      const defaultData = {
        whopUserId,
        whopUsername: whopUser?.username || 'Dev User',
        displayName: whopUser?.name || whopUser?.username || 'Dev User',
        email: whopUser?.username || 'dev@example.com',
        avatarUrl: whopUser?.profile_picture || 'https://api.dicebear.com/7.x/avataaars/svg?seed=DevUser',
      };
      
      user = await prisma.user.create({
        data: defaultData,
        include: {
          profilePhotos: true,
        },
      });
    } else if (!isDev && whopUser) {
      // Update user data from Whop if changed (only in production with valid whopUser)
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          whopUsername: whopUser.username,
          email: whopUser.username, // Whop doesn't expose email
          avatarUrl: whopUser.profile_picture,
          lastLoginAt: new Date(),
        },
        include: {
          profilePhotos: true,
        },
      });
    } else {
      // In dev mode, just update lastLoginAt
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLoginAt: new Date(),
        },
        include: {
          profilePhotos: true,
        },
      });
    }
    
    return NextResponse.json({
      success: true,
      user: {
        ...user,
        preferences: typeof user.preferences === 'string' ? JSON.parse(user.preferences) : user.preferences,
        privacySettings: typeof user.privacySettings === 'string' ? JSON.parse(user.privacySettings) : user.privacySettings,
      },
      whopUser,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/users/me
 * Update current user profile
 */
export async function PATCH(request: NextRequest) {
  try {
    const { userId: whopUserId } = await whopsdk.verifyUserToken(await headers());
    const body = await request.json();
    
    const { displayName, bio, phoneNumber, preferences, privacySettings } = body;
    
    // Find user
    const existingUser = await prisma.user.findUnique({
      where: { whopUserId },
    });
    
    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        ...(displayName !== undefined && { displayName }),
        ...(bio !== undefined && { bio }),
        ...(phoneNumber !== undefined && { phoneNumber }),
        ...(preferences !== undefined && { preferences }),
        ...(privacySettings !== undefined && { privacySettings }),
      },
      include: {
        profilePhotos: true,
      },
    });
    
    return NextResponse.json({
      success: true,
      user: {
        ...updatedUser,
        preferences: typeof updatedUser.preferences === 'string' ? JSON.parse(updatedUser.preferences) : updatedUser.preferences,
        privacySettings: typeof updatedUser.privacySettings === 'string' ? JSON.parse(updatedUser.privacySettings) : updatedUser.privacySettings,
      },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
