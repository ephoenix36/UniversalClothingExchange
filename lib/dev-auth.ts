// Development mode authentication bypass
// ONLY use in development - NEVER in production!

import prisma from './prisma';

const DEV_MODE = process.env.NODE_ENV === 'development';
const DEV_USER_ID = 'dev-user-123';

/**
 * Get or create a development test user
 * This allows testing without Whop authentication in local development
 */
export async function getDevUser() {
  if (!DEV_MODE) {
    throw new Error('Dev mode only available in development');
  }

  // Check if dev user exists
  let user = await prisma.user.findUnique({
    where: { whopUserId: DEV_USER_ID },
  });

  // Create dev user if doesn't exist
  if (!user) {
    user = await prisma.user.create({
      data: {
        whopUserId: DEV_USER_ID,
        whopUsername: 'Dev User',
        displayName: 'Dev User',
        email: 'dev@example.com',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DevUser',
        membershipTier: 'PRO', // Give full access for testing
        subscriptionStatus: 'ACTIVE',
      },
    });

    console.log('✅ Created development test user:', user.id);
  }

  return user;
}

/**
 * Try to authenticate with Whop, fall back to dev user in development
 */
export async function authenticateRequest(whopsdk: any, headers: Headers): Promise<{
  userId: string;
  whopUserId: string;
  isDev: boolean;
}> {
  // Try Whop authentication first
  try {
    const { userId: whopUserId } = await whopsdk.verifyUserToken(headers);
    return { userId: whopUserId, whopUserId, isDev: false };
  } catch (error) {
    // If in development, use dev user
    if (DEV_MODE) {
      console.log('🔧 Using dev mode authentication');
      const devUser = await getDevUser();
      return { userId: devUser.whopUserId, whopUserId: devUser.whopUserId, isDev: true };
    }
    
    // In production, throw the error
    throw error;
  }
}
