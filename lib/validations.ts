/**
 * Zod validation schemas for API endpoints
 * Ensures type-safe input validation and prevents injection attacks
 */
import { z } from 'zod';
import { ClothingCategory, ItemCondition, ItemStatus, SwapStatus, DeliveryMethod } from '@prisma/client';

// ============================================================================
// WARDROBE ITEM SCHEMAS
// ============================================================================

export const createWardrobeItemSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(2000, 'Description too long').optional(),
  category: z.nativeEnum(ClothingCategory, { message: 'Invalid category' }),
  subcategory: z.string().max(100).optional(),
  brand: z.string().max(100).optional(),
  size: z.string().min(1, 'Size is required').max(50),
  color: z.array(z.string().max(50)).min(1, 'At least one color required'),
  condition: z.nativeEnum(ItemCondition, { message: 'Invalid condition' }),
  availableForSwap: z.boolean().default(true),
  availableForSale: z.boolean().default(false),
  salePrice: z.number().positive().optional().nullable(),
  tags: z.array(z.string().max(50)).max(20, 'Too many tags').default([]),
  estimatedValue: z.number().positive().optional().nullable(),
  imageIds: z.array(z.string()).min(1, 'At least one image required').max(10),
});

export const updateWardrobeItemSchema = createWardrobeItemSchema.partial().extend({
  itemId: z.string().cuid(),
});

export const wardrobeFilterSchema = z.object({
  category: z.nativeEnum(ClothingCategory).optional(),
  status: z.nativeEnum(ItemStatus).optional(),
  availableForSwap: z.enum(['true', 'false']).optional(),
  search: z.string().max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// ============================================================================
// COLLECTION SCHEMAS
// ============================================================================

export const createCollectionSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(1000).optional(),
  isPublic: z.boolean().default(false),
  coverImageUrl: z.string().url().optional().nullable(),
  tags: z.array(z.string().max(50)).max(20).default([]),
});

export const updateCollectionSchema = createCollectionSchema.partial().extend({
  collectionId: z.string().cuid(),
});

export const addToCollectionSchema = z.object({
  collectionId: z.string().cuid(),
  itemId: z.string().cuid(),
  order: z.number().int().nonnegative().optional(),
});

// ============================================================================
// SWAP REQUEST SCHEMAS
// ============================================================================

export const createSwapRequestSchema = z.object({
  itemId: z.string().cuid('Invalid item ID'),
  deliveryMethod: z.nativeEnum(DeliveryMethod, { message: 'Invalid delivery method' }),
  meetupLocation: z.object({
    address: z.string().max(200),
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }).optional().nullable(),
  scheduledPickup: z.coerce.date().optional().nullable(),
  scheduledReturn: z.coerce.date().optional().nullable(),
  message: z.string().max(1000).optional(),
});

export const updateSwapStatusSchema = z.object({
  swapId: z.string().cuid(),
  status: z.nativeEnum(SwapStatus, { message: 'Invalid status' }),
  responseMessage: z.string().max(1000).optional(),
});

export const swapMessageSchema = z.object({
  swapId: z.string().cuid(),
  content: z.string().min(1, 'Message cannot be empty').max(2000, 'Message too long'),
});

// ============================================================================
// USER & PROFILE SCHEMAS
// ============================================================================

export const updateUserProfileSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional().nullable(),
  avatarUrl: z.string().url().optional().nullable(),
});

export const userPreferencesSchema = z.object({
  emailNotifications: z.boolean().default(true),
  swapNotifications: z.boolean().default(true),
  messageNotifications: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
});

export const privacySettingsSchema = z.object({
  profileVisibility: z.enum(['PUBLIC', 'FRIENDS', 'PRIVATE']).default('PUBLIC'),
  showWardrobePublicly: z.boolean().default(true),
  allowMessages: z.enum(['EVERYONE', 'FRIENDS', 'NONE']).default('EVERYONE'),
  showSwapHistory: z.boolean().default(true),
});

// ============================================================================
// CREATOR PROFILE SCHEMAS
// ============================================================================

export const createCreatorProfileSchema = z.object({
  storeName: z.string().min(1, 'Store name required').max(100),
  storeDescription: z.string().max(2000).optional(),
  storeBannerUrl: z.string().url().optional().nullable(),
  storeLogoUrl: z.string().url().optional().nullable(),
  customDomain: z.string().regex(/^[a-z0-9-]+$/, 'Invalid custom domain').max(50).optional().nullable(),
});

export const updateCreatorProfileSchema = createCreatorProfileSchema.partial();

// ============================================================================
// AI INTEGRATION SCHEMAS
// ============================================================================

export const analyzeItemSchema = z.object({
  imageUrl: z.string().url('Invalid image URL'),
  itemId: z.string().cuid().optional(),
});

export const tryOnRequestSchema = z.object({
  itemId: z.string().cuid(),
  profilePhotoId: z.string().cuid(),
});

export const geminiKeySchema = z.object({
  apiKey: z.string().min(20, 'Invalid API key format').max(200),
  consent: z.boolean().refine((val: boolean) => val === true, { message: 'Consent required' }),
});

// ============================================================================
// PAYMENT & STRIPE SCHEMAS
// ============================================================================

export const createPaymentIntentSchema = z.object({
  amount: z.number().int().positive().max(1000000, 'Amount too large'), // Max $10,000
  currency: z.enum(['usd', 'eur', 'gbp']).default('usd'),
  description: z.string().max(500).optional(),
  itemId: z.string().cuid().optional(),
});

export const stripeOnboardingSchema = z.object({
  returnUrl: z.string().url(),
  refreshUrl: z.string().url(),
});

// ============================================================================
// PAGINATION & COMMON SCHEMAS
// ============================================================================

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().max(50).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const idParamSchema = z.object({
  id: z.string().cuid('Invalid ID format'),
});

// ============================================================================
// HELPER TYPE EXPORTS
// ============================================================================

export type CreateWardrobeItemInput = z.infer<typeof createWardrobeItemSchema>;
export type UpdateWardrobeItemInput = z.infer<typeof updateWardrobeItemSchema>;
export type WardrobeFilterInput = z.infer<typeof wardrobeFilterSchema>;
export type CreateCollectionInput = z.infer<typeof createCollectionSchema>;
export type CreateSwapRequestInput = z.infer<typeof createSwapRequestSchema>;
export type UpdateSwapStatusInput = z.infer<typeof updateSwapStatusSchema>;
export type SwapMessageInput = z.infer<typeof swapMessageSchema>;
export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>;
export type GeminiKeyInput = z.infer<typeof geminiKeySchema>;
