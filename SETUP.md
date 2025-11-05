# Universal Clothing Exchange - Whop App Setup

## Overview
This is a subscription-based clothing swap platform built on Whop using Next.js 16, React 19, and the Whop SDK.

## Setup Complete ✅

### 1. Environment Variables
The following environment variables have been configured in `.env.local`:
- `WHOP_API_KEY` - Your Whop API key
- `NEXT_PUBLIC_WHOP_APP_ID` - Your Whop app ID
- `NEXT_PUBLIC_WHOP_AGENT_USER_ID` - Your Whop agent user ID
- `NEXT_PUBLIC_WHOP_COMPANY_ID` - Your Whop company ID
- `WHOP_WEBHOOK_SECRET` - (To be added after webhook setup)

### 2. Dependencies Installed
All dependencies have been installed using pnpm, including:
- Next.js 16.0.0
- React 19.2.0
- @whop/sdk 0.0.3
- @whop/react 0.3.0
- Tailwind CSS 4.1.14
- TypeScript 5.9.3

### 3. Authentication Setup
The app uses Whop SDK authentication out of the box:
- `whopsdk.verifyUserToken()` - Validates user tokens from headers
- `whopsdk.users.retrieve()` - Fetches user data
- `whopsdk.users.checkAccess()` - Verifies user access to experiences/companies

## Running the App

### Development Server
```bash
pnpm dev
```
This will:
1. Start the Next.js dev server with Turbopack
2. Run the Whop proxy to enable local development
3. Make the app available at `http://localhost:3000`

### Accessing Your App
1. In the Whop dashboard settings (top right), select "localhost"
2. The app will load at the configured paths:
   - Landing: `/`
   - Discover: `/discover`
   - Experience: `/experiences/[experienceId]`
   - Dashboard: `/dashboard/[companyId]`

## Whop Dashboard Configuration

Make sure these settings are configured in your [Whop Developer Dashboard](https://whop.com/dashboard/developer/):

### Hosting Section
- **Base URL**: Your production domain (or localhost for dev)
- **App path**: `/experiences/[experienceId]`
- **Dashboard path**: `/dashboard/[companyId]`
- **Discover path**: `/discover`

### Webhooks
After creating a webhook in the app settings:
1. Copy the webhook secret
2. Add it to `.env.local` as `WHOP_WEBHOOK_SECRET`

## App Structure

```
app/
├── api/
│   └── webhooks/          # Webhook handlers
├── dashboard/
│   └── [companyId]/       # Company dashboard with auth
├── discover/              # App discovery/marketing page
├── experiences/
│   └── [experienceId]/    # User experience pages with auth
├── layout.tsx             # Root layout with WhopApp wrapper
└── page.tsx               # Landing page

lib/
└── whop-sdk.ts           # Whop SDK configuration
```

## Key Features Implemented

### Authentication
- ✅ Whop SDK integration
- ✅ User token verification
- ✅ Access control for experiences and companies
- ✅ Secure API routes

### Pages
- ✅ Landing page (branded as Universal Clothing Exchange)
- ✅ Discover page for marketing
- ✅ Dashboard page with user data
- ✅ Experience pages with access control

## Next Steps

1. **Configure Whop Dashboard Paths**
   - Set the hosting paths as described above
   - Add your app to a Whop company in the tools section

2. **Set Up Webhooks**
   - Create a webhook in the app settings
   - Add the secret to `.env.local`

3. **Customize the App**
   - Build out the wardrobe management features
   - Add clothing swap functionality
   - Implement AI try-on integration
   - Create creator storefronts

4. **Deploy to Production**
   - Push to GitHub
   - Deploy to Vercel
   - Update base URL in Whop dashboard
   - Configure production environment variables

## Resources

- [Whop Developer Docs](https://dev.whop.com/introduction)
- [Whop App Template](https://github.com/whopio/whop-nextjs-app-template)
- [Next.js Documentation](https://nextjs.org/docs)

## Troubleshooting

**App not loading?**
- Ensure all hosting paths are explicitly set in the Whop dashboard (placeholders don't count)
- Check that `.env.local` has all required variables
- Verify the app is added to your Whop company's tools section

**Authentication errors?**
- Verify `WHOP_API_KEY` is correct
- Check that `NEXT_PUBLIC_WHOP_APP_ID` matches your app
- Ensure user has access to the experience/company
