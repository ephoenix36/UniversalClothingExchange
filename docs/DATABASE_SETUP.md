# Database Setup Instructions

For now, the database schema is ready but needs a PostgreSQL connection.

## Quick Setup Options:

### Option 1: Vercel Postgres (Recommended for Development)
1. Go to https://vercel.com/dashboard
2. Click "Storage" → "Create Database" → "Postgres"
3. Copy the `DATABASE_URL` from the `.env.local` tab
4. Paste it into your `.env.local` file
5. Run: `npx prisma db push`

### Option 2: Local PostgreSQL with Docker
```bash
docker run --name clothing-exchange-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=clothing_exchange \
  -p 5432:5432 \
  -d postgres:16

# Then update .env.local:
DATABASE_URL="postgresql://postgres:password@localhost:5432/clothing_exchange"
```

### Option 3: Railway.app (Free Tier)
1. Go to https://railway.app
2. Create new project → Add PostgreSQL
3. Copy the connection string
4. Update `.env.local`

## After connecting:
```bash
npx prisma db push
npx prisma generate
```

The platform will work without database connection for browsing, but user profiles and wardrobe features require it.
