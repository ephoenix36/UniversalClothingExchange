# Universal Clothing Exchange

A subscription-based clothing swap platform that enables sustainable fashion through community-driven clothing exchanges. Built with Next.js 16, React 19, and the Whop SDK.

## 🌱 Overview

Universal Clothing Exchange is a modern web application that facilitates clothing swaps between users, promoting sustainability and reducing fashion waste. Members can add items to their virtual wardrobe, browse available items, and swap clothing with other community members.

### Key Features

- **Virtual Wardrobe**: Add and manage your clothing items with photos and descriptions
- **Browse & Discover**: Explore clothing items available for swap
- **Smart Matching**: AI-powered recommendations for clothing swaps
- **Swap Management**: Track your swap history and active exchanges
- **User Dashboard**: Manage your profile, preferences, and swap activity
- **Secure Authentication**: Built on Whop's authentication system

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- A Whop account and app configured on the [Whop Developer Dashboard](https://whop.com/dashboard/developer/)
- Environment variables (see [SETUP.md](./SETUP.md))

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd UniversalClothingExchange
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.development .env.local
   # Edit .env.local with your Whop credentials
   ```

4. Run the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

For detailed setup instructions, see [SETUP.md](./SETUP.md).

## 📚 Documentation

- [Setup Guide](./SETUP.md) - Complete setup and configuration instructions
- [Style Guide](./STYLE_GUIDE.md) - Design system and component guidelines
- [API Security](./docs/API_KEY_SECURITY.md) - Security best practices
- [Database Setup](./docs/DATABASE_SETUP.md) - Database configuration
- [Performance Optimization](./docs/PERFORMANCE_OPTIMIZATION.md) - Performance tips
- [SEO Guide](./docs/SEO_GUIDE.md) - SEO best practices
- [AI Features](./docs/AI_FEATURES_USER_GUIDE.md) - AI-powered features guide

## 🏗️ Tech Stack

- **Framework**: Next.js 16 with App Router and Turbopack
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Authentication**: Whop SDK
- **Database**: Prisma ORM
- **Image Upload**: UploadThing
- **AI**: Google Generative AI
- **Payment**: Stripe
- **Testing**: Vitest, Playwright
- **Type Safety**: TypeScript

## 📁 Project Structure

```
UniversalClothingExchange/
├── app/                    # Next.js app directory
│   ├── api/               # API routes and webhooks
│   ├── dashboard/         # Company dashboard pages
│   ├── discover/          # Marketing and discovery pages
│   └── experiences/       # User experience pages
├── components/            # React components
├── lib/                   # Utilities and SDK configuration
├── prisma/               # Database schema and migrations
├── public/               # Static assets
├── docs/                 # Documentation
│   └── archive/          # Development history
└── tests/                # Test suites
```

## 🧪 Testing

Run tests with:

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage report
pnpm test:coverage
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com/new)
3. Configure environment variables from `.env.local`
4. Deploy

### Environment Variables

Ensure these are set in your production environment:
- `WHOP_API_KEY`
- `NEXT_PUBLIC_WHOP_APP_ID`
- `NEXT_PUBLIC_WHOP_AGENT_USER_ID`
- `NEXT_PUBLIC_WHOP_COMPANY_ID`
- `WHOP_WEBHOOK_SECRET`
- Database and API keys (see [SETUP.md](./SETUP.md))

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines in the docs folder.

## 📄 License

This project is private and proprietary.

## 🔗 Links

- [Whop Developer Docs](https://dev.whop.com/introduction)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 💡 Support

For issues or questions:
1. Check the [SETUP.md](./SETUP.md) troubleshooting section
2. Review documentation in the `/docs` folder
3. Contact the development team

---

Built with ♻️ for sustainable fashion
