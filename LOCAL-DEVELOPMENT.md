# Local Development Setup Guide

## Step 1: Install PostgreSQL Locally

### macOS (using Homebrew):
```bash
brew install postgresql@15
brew services start postgresql@15
```

### Create Database:
```bash
createdb stonearts
```

### Or using psql:
```bash
psql postgres
CREATE DATABASE stonearts;
\q
```

## Step 2: Set Up Environment Variables

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` with your local database URL:
```env
DATABASE_URL="postgresql://your-username@localhost:5432/stonearts?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="local-dev-secret-key-change-in-production"
NODE_ENV="development"
```

## Step 3: Install Dependencies & Setup Database

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
```

## Step 4: Run Development Server

```bash
npm run dev
```

## Step 5: Test Locally

1. Open http://localhost:3000/admin
2. Add/edit products
3. Check that they sync to local database
4. Verify data in Prisma Studio: `npm run prisma:studio`

## Step 6: Once Everything Works Locally

1. Commit your changes
2. Push to GitHub
3. Render will auto-deploy
4. Run migrations on Render: `npx prisma migrate deploy`

## Quick Commands Reference

```bash
# Start local PostgreSQL (macOS)
brew services start postgresql@15

# Create database
createdb stonearts

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# View database (GUI)
npm run prisma:studio

# Start dev server
npm run dev
```
