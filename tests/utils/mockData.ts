/**
 * Mock data factories for testing
 * Uses realistic data that matches database schema
 */

import { 
  MembershipTier, 
  SubscriptionStatus, 
  ClothingCategory, 
  ItemCondition,
  SwapStatus,
  ItemStatus,
  PhotoType 
} from '@prisma/client';

let mockIdCounter = 1;

function generateId(): string {
  return `mock_${mockIdCounter++}`;
}

/**
 * User mock factory
 */
export function createMockUser(overrides?: Partial<any>) {
  return {
    id: generateId(),
    whopUserId: `whop_user_${Math.random().toString(36).substring(7)}`,
    whopUsername: `testuser${mockIdCounter}`,
    displayName: `Test User ${mockIdCounter}`,
    email: `test${mockIdCounter}@example.com`,
    phoneNumber: '+1234567890',
    avatarUrl: 'https://example.com/avatar.jpg',
    bio: 'Test user bio',
    membershipTier: MembershipTier.STANDARD,
    subscriptionStatus: SubscriptionStatus.ACTIVE,
    whopMembershipId: `membership_${mockIdCounter}`,
    preferences: {},
    privacySettings: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLoginAt: new Date(),
    ...overrides,
  };
}

/**
 * Wardrobe item mock factory
 */
export function createMockWardrobeItem(overrides?: Partial<any>) {
  return {
    id: generateId(),
    ownerId: generateId(),
    originalUploaderId: generateId(),
    title: 'Test Item',
    description: 'A test clothing item',
    category: ClothingCategory.TOPS,
    subcategory: 'T-Shirt',
    brand: 'Test Brand',
    size: 'M',
    color: ['Blue'],
    condition: ItemCondition.GOOD,
    status: ItemStatus.AVAILABLE,
    availableForSwap: true,
    availableForSale: false,
    salePrice: null,
    swapCount: 0,
    tags: ['casual', 'summer'],
    estimatedValue: 30.00,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

/**
 * Collection mock factory
 */
export function createMockCollection(overrides?: Partial<any>) {
  return {
    id: generateId(),
    userId: generateId(),
    name: 'Test Collection',
    description: 'A test collection',
    isPublic: true,
    coverImageUrl: 'https://example.com/collection.jpg',
    itemCount: 5,
    viewCount: 20,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

/**
 * Swap request mock factory
 */
export function createMockSwapRequest(overrides?: Partial<any>) {
  return {
    id: generateId(),
    requesterId: generateId(),
    ownerId: generateId(),
    itemId: generateId(),
    status: SwapStatus.PENDING,
    deliveryMethod: 'IN_PERSON' as const,
    meetupLocation: null,
    scheduledPickup: null,
    scheduledReturn: null,
    depositAmount: null,
    depositPaid: false,
    depositRefunded: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    completedAt: null,
    ...overrides,
  };
}

/**
 * Message mock factory
 */
export function createMockMessage(overrides?: Partial<any>) {
  return {
    id: generateId(),
    swapId: generateId(),
    senderId: generateId(),
    content: 'Test message',
    timestamp: new Date(),
    ...overrides,
  };
}

/**
 * Creator profile mock factory
 */
export function createMockCreatorProfile(overrides?: Partial<any>) {
  return {
    id: generateId(),
    userId: generateId(),
    storeName: 'Test Creator Store',
    storeDescription: 'Test creator store description',
    storeBannerUrl: 'https://example.com/banner.jpg',
    storeLogoUrl: 'https://example.com/logo.jpg',
    customDomain: null,
    stripeAccountId: `acct_${Math.random().toString(36).substring(7)}`,
    stripeOnboarded: true,
    totalSales: 50,
    rating: 4.5,
    reviewCount: 10,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

/**
 * Profile photo mock factory
 */
export function createMockProfilePhoto(overrides?: Partial<any>) {
  return {
    id: generateId(),
    userId: generateId(),
    url: 'https://example.com/profile.jpg',
    type: PhotoType.FULL_BODY,
    isDefault: false,
    consentForAI: false,
    uploadedAt: new Date(),
    ...overrides,
  };
}

/**
 * Create a complete user with wardrobe and profile
 */
export function createMockUserWithWardrobe() {
  const user = createMockUser();
  const items = [
    createMockWardrobeItem({ ownerId: user.id, category: ClothingCategory.TOPS }),
    createMockWardrobeItem({ ownerId: user.id, category: ClothingCategory.BOTTOMS }),
    createMockWardrobeItem({ ownerId: user.id, category: ClothingCategory.SHOES }),
  ];
  const collection = createMockCollection({ userId: user.id });
  
  return {
    user,
    items,
    collection,
  };
}

/**
 * Create a complete swap scenario
 */
export function createMockSwapScenario() {
  const requester = createMockUser({ displayName: 'Alice' });
  const owner = createMockUser({ displayName: 'Bob' });
  const requesterItem = createMockWardrobeItem({ ownerId: requester.id });
  const ownerItem = createMockWardrobeItem({ ownerId: owner.id });
  const swapRequest = createMockSwapRequest({
    requesterId: requester.id,
    ownerId: owner.id,
    itemId: ownerItem.id,
  });
  const messages = [
    createMockMessage({ swapId: swapRequest.id, senderId: requester.id }),
    createMockMessage({ swapId: swapRequest.id, senderId: owner.id }),
  ];
  
  return {
    requester,
    owner,
    requesterItem,
    ownerItem,
    swapRequest,
    messages,
  };
}

/**
 * Reset mock ID counter (useful between tests)
 */
export function resetMockIds() {
  mockIdCounter = 1;
}
