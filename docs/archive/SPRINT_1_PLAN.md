# Universal Clothing Exchange - Technical Architecture

## Sprint 1: Core Platform Foundation - Implementation Plan

**Status**: In Progress  
**Started**: November 4, 2025  
**Goal**: Set up database schema, authentication flows, and basic user management

---

## Phase 1.1: Database Schema Design

### Core Entities

#### Users (extends Whop user data)
```typescript
interface User {
  id: string;                    // Whop user ID
  whopUsername: string;
  displayName?: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  bio?: string;
  
  // Platform-specific
  membershipTier: 'basic' | 'standard' | 'pro';
  subscriptionStatus: 'active' | 'past_due' | 'canceled';
  whopMembershipId?: string;
  
  // Profile photos for AI try-on
  profilePhotos: ProfilePhoto[];
  
  // Settings
  preferences: UserPreferences;
  privacySettings: PrivacySettings;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
}

interface ProfilePhoto {
  id: string;
  userId: string;
  url: string;
  type: 'headshot' | 'full_body';
  isDefault: boolean;
  consentForAI: boolean;
  uploadedAt: Date;
}

interface UserPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  locationZone?: string;
  preferredDeliveryMethod: 'in_person' | 'driver' | 'locker';
}

interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showSwapHistory: boolean;
  allowMessagesFrom: 'everyone' | 'friends' | 'none';
}
```

#### Wardrobe Items
```typescript
interface WardrobeItem {
  id: string;
  ownerId: string;               // User who currently owns it
  originalUploaderId: string;    // First person who added it
  
  // Item details
  title: string;
  description: string;
  category: ClothingCategory;
  subcategory?: string;
  brand?: string;
  size: string;
  color: string[];
  condition: 'new' | 'like_new' | 'good' | 'fair';
  
  // Images
  images: ItemImage[];
  
  // Availability
  status: 'available' | 'on_loan' | 'in_transit' | 'unavailable';
  availableForSwap: boolean;
  availableForSale: boolean;
  salePrice?: number;
  
  // Provenance (anonymized)
  history: ItemHistoryEvent[];
  swapCount: number;
  
  // Metadata
  tags: string[];
  estimatedValue?: number;
  
  createdAt: Date;
  updatedAt: Date;
}

type ClothingCategory = 
  | 'tops' | 'bottoms' | 'dresses' | 'outerwear' 
  | 'shoes' | 'accessories' | 'bags' | 'jewelry';

interface ItemImage {
  id: string;
  url: string;
  isPrimary: boolean;
  uploadedAt: Date;
}

interface ItemHistoryEvent {
  id: string;
  timestamp: Date;
  type: 'upload' | 'swap' | 'repair' | 'upcycle' | 'sale';
  anonymizedUserId: string;      // Hashed user ID
  notes?: string;                 // User-entered description
}
```

#### Collections
```typescript
interface Collection {
  id: string;
  userId: string;
  name: string;
  description?: string;
  isPublic: boolean;
  items: string[];               // Array of WardrobeItem IDs
  coverImageUrl?: string;
  tags: string[];
  
  createdAt: Date;
  updatedAt: Date;
}
```

#### Swap Requests
```typescript
interface SwapRequest {
  id: string;
  requesterId: string;
  ownerId: string;
  itemId: string;
  
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'canceled';
  
  // Messaging
  messages: SwapMessage[];
  
  // Logistics
  deliveryMethod: 'in_person' | 'driver' | 'locker';
  meetupLocation?: Location;
  scheduledPickup?: Date;
  scheduledReturn?: Date;
  
  // Deposit (if required)
  depositAmount?: number;
  depositPaid: boolean;
  depositRefunded: boolean;
  
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

interface SwapMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
}

interface Location {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}
```

---

## Phase 1.2: API Endpoints

### Authentication (Whop SDK)
- `GET /api/auth/verify` - Verify user token
- `GET /api/auth/user` - Get current user data
- `POST /api/auth/logout` - Logout

### Users
- `GET /api/users/:userId` - Get user profile
- `PATCH /api/users/:userId` - Update user profile
- `POST /api/users/:userId/photos` - Upload profile photo
- `DELETE /api/users/:userId/photos/:photoId` - Delete profile photo
- `PATCH /api/users/:userId/preferences` - Update preferences
- `PATCH /api/users/:userId/privacy` - Update privacy settings

### Wardrobe
- `GET /api/wardrobe` - Get user's wardrobe (with filters)
- `POST /api/wardrobe/items` - Add new item
- `GET /api/wardrobe/items/:itemId` - Get item details
- `PATCH /api/wardrobe/items/:itemId` - Update item
- `DELETE /api/wardrobe/items/:itemId` - Delete item
- `POST /api/wardrobe/items/:itemId/images` - Upload item images
- `PATCH /api/wardrobe/items/:itemId/availability` - Toggle availability

### Collections
- `GET /api/collections` - Get user's collections
- `POST /api/collections` - Create collection
- `GET /api/collections/:collectionId` - Get collection details
- `PATCH /api/collections/:collectionId` - Update collection
- `DELETE /api/collections/:collectionId` - Delete collection
- `POST /api/collections/:collectionId/items` - Add item to collection
- `DELETE /api/collections/:collectionId/items/:itemId` - Remove item

### Swap Requests
- `GET /api/swaps` - Get user's swap requests
- `POST /api/swaps` - Create swap request
- `GET /api/swaps/:swapId` - Get swap details
- `PATCH /api/swaps/:swapId/status` - Update swap status
- `POST /api/swaps/:swapId/messages` - Send message
- `DELETE /api/swaps/:swapId` - Cancel swap

---

## Phase 1.3: Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **State Management**: React Context + hooks
- **Forms**: React Hook Form + Zod validation
- **Image Upload**: @vercel/blob or AWS S3
- **AI Try-on**: Google Gemini 2.5 Flash

### Backend
- **Runtime**: Next.js API Routes (Edge runtime where applicable)
- **Database**: PostgreSQL (Vercel Postgres or Supabase)
- **ORM**: Prisma
- **File Storage**: Vercel Blob Storage
- **Authentication**: Whop SDK
- **Payments**: Stripe (Connect for creators)

### Infrastructure
- **Hosting**: Vercel
- **Database**: Vercel Postgres
- **CDN**: Vercel Edge Network
- **Monitoring**: Vercel Analytics + Sentry
- **Email**: Resend or SendGrid

---

## Phase 1.4: Implementation Steps

### Step 1: Database Setup ✅ (Next)
1. Install Prisma and PostgreSQL client
2. Create Prisma schema
3. Set up database connection
4. Run migrations

### Step 2: User Profile System
1. Create user profile page
2. Add photo upload functionality
3. Implement preferences UI
4. Build privacy settings

### Step 3: Basic Wardrobe CRUD
1. Create wardrobe list view
2. Build add item form
3. Implement item detail page
4. Add image upload
5. Create edit/delete functionality

### Step 4: Collections
1. Build collection creation UI
2. Implement drag-and-drop item organization
3. Add collection sharing

### Step 5: Testing & QA
1. Write unit tests for API routes
2. E2E tests with Playwright
3. Accessibility audit
4. Performance optimization

---

## Success Criteria

- ✅ Dev server running
- ⬜ Database schema defined and migrated
- ⬜ User can update profile
- ⬜ User can upload wardrobe items
- ⬜ User can create collections
- ⬜ All API endpoints functional
- ⬜ Responsive UI works on mobile
- ⬜ Passing test suite (>80% coverage)

---

## Next: Database Installation

Installing Prisma and setting up PostgreSQL connection...
