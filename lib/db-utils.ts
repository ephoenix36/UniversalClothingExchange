// Database query optimization utilities

import { Prisma } from '@prisma/client';

/**
 * Common query includes to reduce N+1 problems
 */
export const COMMON_INCLUDES = {
  wardrobeItem: {
    images: {
      orderBy: { isPrimary: 'desc' as const },
      take: 5,
    },
    owner: {
      select: {
        id: true,
        whopUsername: true,
        avatarUrl: true,
      },
    },
  },

  swapRequest: {
    requester: {
      select: {
        id: true,
        whopUsername: true,
        avatarUrl: true,
      },
    },
    owner: {
      select: {
        id: true,
        whopUsername: true,
        avatarUrl: true,
      },
    },
    requestedItems: {
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
    },
    offeredItems: {
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
    },
  },

  collection: {
    items: {
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
      take: 12, // Limit items in collection listings
    },
    owner: {
      select: {
        id: true,
        whopUsername: true,
      },
    },
  },

  message: {
    sender: {
      select: {
        id: true,
        whopUsername: true,
        avatarUrl: true,
      },
    },
  },
} as const;

/**
 * Pagination helper
 */
export interface PaginationOptions {
  page?: number;
  pageSize?: number;
}

export function getPagination(options: PaginationOptions = {}) {
  const page = Math.max(1, options.page || 1);
  const pageSize = Math.min(100, Math.max(1, options.pageSize || 20));
  
  return {
    skip: (page - 1) * pageSize,
    take: pageSize,
    page,
    pageSize,
  };
}

/**
 * Build efficient where clause for search
 */
export function buildSearchWhere(
  searchTerm?: string,
  fields: string[] = ['title', 'description']
): any {
  if (!searchTerm) return undefined;

  const searchWords = searchTerm.toLowerCase().split(' ').filter(Boolean);
  
  if (searchWords.length === 0) return undefined;

  return {
    OR: fields.flatMap((field) =>
      searchWords.map((word) => ({
        [field]: {
          contains: word,
          mode: 'insensitive' as const,
        },
      }))
    ),
  };
}

/**
 * Optimize query by selecting only needed fields
 */
export const SELECT_MINIMAL_USER = {
  id: true,
  whopUsername: true,
  avatarUrl: true,
} as const;

export const SELECT_MINIMAL_ITEM = {
  id: true,
  title: true,
  category: true,
  size: true,
  color: true,
  condition: true,
  status: true,
  images: {
    where: { isPrimary: true },
    take: 1,
    select: {
      url: true,
    },
  },
} as const;

/**
 * Batch fetch helper to avoid N+1 queries
 */
export async function batchFetchItemImages(
  prisma: any,
  itemIds: string[]
): Promise<Map<string, any[]>> {
  const images = await prisma.wardrobeImage.findMany({
    where: {
      itemId: { in: itemIds },
    },
    orderBy: [{ isPrimary: 'desc' }, { createdAt: 'asc' }],
  });

  const imageMap = new Map<string, any[]>();
  
  for (const image of images) {
    if (!imageMap.has(image.itemId)) {
      imageMap.set(image.itemId, []);
    }
    imageMap.get(image.itemId)!.push(image);
  }

  return imageMap;
}

/**
 * Cache key generator for Redis/Memory cache
 */
export function generateCacheKey(
  entity: string,
  id: string,
  variant?: string
): string {
  return `${entity}:${id}${variant ? `:${variant}` : ''}`;
}

/**
 * Database connection pool optimization
 */
export const PRISMA_OPTIONS = {
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] as const
    : ['error'] as const,
  
  errorFormat: 'minimal' as const,
  
  // Connection pool settings
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
} as const;

/**
 * Soft delete helper
 */
export async function softDelete(
  prisma: any,
  model: string,
  id: string
): Promise<any> {
  return prisma[model].update({
    where: { id },
    data: {
      deletedAt: new Date(),
      status: 'DELETED',
    },
  });
}

/**
 * Bulk operations helper
 */
export async function bulkUpsert<T>(
  prisma: any,
  model: string,
  data: T[],
  uniqueField: keyof T
): Promise<void> {
  const operations = data.map((item: any) =>
    prisma[model].upsert({
      where: { [uniqueField]: item[uniqueField] },
      update: item,
      create: item,
    })
  );

  await prisma.$transaction(operations);
}
