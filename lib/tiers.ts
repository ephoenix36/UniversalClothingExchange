// Whop Subscription Tier Configuration

export enum MembershipTier {
  BASIC = 'BASIC',
  STANDARD = 'STANDARD',
  PRO = 'PRO',
}

export interface TierFeatures {
  maxWardrobeItems: number;
  maxCollections: number;
  maxActiveSwaps: number;
  canSellItems: boolean;
  canCreateStorefront: boolean;
  aiTryOnCredits: number; // per month
  prioritySupport: boolean;
  customBranding: boolean;
  analyticsAccess: boolean;
  promotionCodes: number; // max active promotions
  featuredListings: number; // per month
}

export const TIER_FEATURES: Record<MembershipTier, TierFeatures> = {
  [MembershipTier.BASIC]: {
    maxWardrobeItems: 50,
    maxCollections: 3,
    maxActiveSwaps: 5,
    canSellItems: false,
    canCreateStorefront: false,
    aiTryOnCredits: 10,
    prioritySupport: false,
    customBranding: false,
    analyticsAccess: false,
    promotionCodes: 0,
    featuredListings: 0,
  },
  [MembershipTier.STANDARD]: {
    maxWardrobeItems: 200,
    maxCollections: 10,
    maxActiveSwaps: 15,
    canSellItems: true,
    canCreateStorefront: false,
    aiTryOnCredits: 50,
    prioritySupport: false,
    customBranding: false,
    analyticsAccess: true,
    promotionCodes: 3,
    featuredListings: 2,
  },
  [MembershipTier.PRO]: {
    maxWardrobeItems: -1, // unlimited
    maxCollections: -1, // unlimited
    maxActiveSwaps: -1, // unlimited
    canSellItems: true,
    canCreateStorefront: true,
    aiTryOnCredits: 200,
    prioritySupport: true,
    customBranding: true,
    analyticsAccess: true,
    promotionCodes: 10,
    featuredListings: 10,
  },
};

export const TIER_PRICING = {
  [MembershipTier.BASIC]: { monthly: 9.99, annual: 99 },
  [MembershipTier.STANDARD]: { monthly: 24.99, annual: 249 },
  [MembershipTier.PRO]: { monthly: 49.99, annual: 499 },
};

// Helper functions
export function getTierFeatures(tier: MembershipTier): TierFeatures {
  return TIER_FEATURES[tier];
}

export function canPerformAction(
  tier: MembershipTier,
  action: keyof TierFeatures
): boolean {
  const features = getTierFeatures(tier);
  const value = features[action];
  
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value > 0 || value === -1;
  
  return false;
}

export function hasReachedLimit(
  tier: MembershipTier,
  resource: 'wardrobeItems' | 'collections' | 'activeSwaps' | 'promotionCodes' | 'featuredListings',
  currentCount: number
): boolean {
  const features = getTierFeatures(tier);
  const limitKey = `max${resource.charAt(0).toUpperCase()}${resource.slice(1)}` as keyof TierFeatures;
  const limit = features[limitKey] as number;
  
  if (limit === -1) return false; // unlimited
  
  return currentCount >= limit;
}

export function getUpgradeMessage(tier: MembershipTier, feature: string): string {
  if (tier === MembershipTier.PRO) {
    return 'You have access to all features!';
  }
  
  const nextTier = tier === MembershipTier.BASIC ? 'Standard' : 'Pro';
  
  return `Upgrade to ${nextTier} to unlock ${feature}`;
}
