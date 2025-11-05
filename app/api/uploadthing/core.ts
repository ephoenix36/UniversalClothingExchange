import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { whopsdk } from '@/lib/whop-sdk';
import { headers } from 'next/headers';

const f = createUploadthing();

export const ourFileRouter = {
  // User avatar upload
  avatar: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(async () => {
      try {
        const { userId } = await whopsdk.verifyUserToken(await headers());
        return { userId };
      } catch {
        throw new Error('Unauthorized');
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Avatar upload complete for user:', metadata.userId);
      console.log('File URL:', file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  // Wardrobe item images
  wardrobeImage: f({ image: { maxFileSize: '8MB', maxFileCount: 5 } })
    .middleware(async () => {
      try {
        const { userId } = await whopsdk.verifyUserToken(await headers());
        return { userId };
      } catch {
        throw new Error('Unauthorized');
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Wardrobe image uploaded by:', metadata.userId);
      return { url: file.url };
    }),

  // User photos for AI try-on (requires explicit consent)
  aiTryOnPhoto: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(async () => {
      try {
        const { userId } = await whopsdk.verifyUserToken(await headers());
        // In production, verify user has given AI consent
        return { userId };
      } catch {
        throw new Error('Unauthorized');
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('AI try-on photo uploaded by:', metadata.userId);
      return { url: file.url };
    }),

  // Creator storefront banner
  storefrontBanner: f({ image: { maxFileSize: '8MB', maxFileCount: 1 } })
    .middleware(async () => {
      try {
        const { userId } = await whopsdk.verifyUserToken(await headers());
        return { userId };
      } catch {
        throw new Error('Unauthorized');
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Storefront banner uploaded by:', metadata.userId);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
