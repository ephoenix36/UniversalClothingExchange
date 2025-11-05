import { Metadata } from 'next';

export const siteConfig = {
  name: 'Universal Clothing Exchange',
  description: 'Sustainable fashion marketplace - Swap, trade, and discover quality pre-loved clothing. Join the circular fashion revolution.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://universalclothingexchange.com',
  ogImage: '/og-image.jpg',
  links: {
    twitter: 'https://twitter.com/yourhandle',
    instagram: 'https://instagram.com/yourhandle',
    facebook: 'https://facebook.com/yourpage',
  },
};

export const defaultMetadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'clothing swap',
    'fashion marketplace',
    'sustainable fashion',
    'pre-loved clothing',
    'second hand fashion',
    'clothing exchange',
    'circular fashion',
    'eco fashion',
    'wardrobe management',
    'style swap',
  ],
  authors: [{ name: 'Universal Clothing Exchange Team' }],
  creator: 'Universal Clothing Exchange',
  publisher: 'Universal Clothing Exchange',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@yourhandle',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // other: 'your-other-verification-code',
  },
};

/**
 * Generate metadata for dynamic pages
 */
export function generatePageMetadata({
  title,
  description,
  image,
  path = '',
}: {
  title: string;
  description?: string;
  image?: string;
  path?: string;
}): Metadata {
  const url = `${siteConfig.url}${path}`;
  const ogImage = image || siteConfig.ogImage;

  return {
    title,
    description: description || siteConfig.description,
    openGraph: {
      title,
      description: description || siteConfig.description,
      url,
      images: [ogImage],
    },
    twitter: {
      title,
      description: description || siteConfig.description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
  };
}

/**
 * JSON-LD structured data for product
 */
export function generateProductSchema(item: {
  id: string;
  title: string;
  description?: string;
  price?: number;
  imageUrl: string;
  category: string;
  condition: string;
  brand?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: item.title,
    description: item.description,
    image: item.imageUrl,
    category: item.category,
    brand: {
      '@type': 'Brand',
      name: item.brand || 'Various',
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      price: item.price || 0,
      priceCurrency: 'USD',
      itemCondition: `https://schema.org/${item.condition === 'NEW' ? 'NewCondition' : 'UsedCondition'}`,
    },
  };
}

/**
 * JSON-LD structured data for organization
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    sameAs: [
      siteConfig.links.twitter,
      siteConfig.links.instagram,
      siteConfig.links.facebook,
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@universalclothingexchange.com',
    },
  };
}

/**
 * JSON-LD structured data for webpage
 */
export function generateWebPageSchema({
  title,
  description,
  url,
}: {
  title: string;
  description: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
  };
}
