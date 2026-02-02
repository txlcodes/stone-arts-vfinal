# Render Deployment Setup Guide

## Build & Start Commands

### Build Command:
```
npm install && npm run prisma:generate && npm run build
```

### Start Command:
```
npm start
```

## Environment Variables

Add these environment variables in Render's dashboard:

### Required Variables:

1. **DATABASE_URL**
   - Get this from your PostgreSQL database in Render
   - Format: `postgresql://user:password@host:port/database?schema=public`
   - Use the **Internal Database URL** (for production)

2. **NEXTAUTH_URL**
   - Your Render app URL (e.g., `https://your-app-name.onrender.com`)
   - Will be available after first deployment

3. **NEXTAUTH_SECRET**
   - Generate with: `openssl rand -base64 32`
   - Or use any random 32+ character string

4. **NODE_ENV**
   - Value: `production`

### Stripe Variables (Add when ready):

5. **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY**
   - From Stripe Dashboard → API Keys
   - Format: `pk_test_...` or `pk_live_...`

6. **STRIPE_SECRET_KEY**
   - From Stripe Dashboard → API Keys
   - Format: `sk_test_...` or `sk_live_...`

7. **STRIPE_WEBHOOK_SECRET**
   - From Stripe Dashboard → Webhooks
   - Format: `whsec_...`

## Quick Setup Steps:

1. **Update Build Command** in Render:
   - Change from: `npm install; npm run build`
   - To: `npm install && npm run prisma:generate && npm run build`

2. **Update Start Command** in Render:
   - Change from: `npm run start`
   - To: `npm start`

3. **Create PostgreSQL Database** in Render:
   - Go to "New" → "PostgreSQL"
   - Copy the Internal Database URL

4. **Add Environment Variables**:
   - Click "Add Environment Variable" for each variable above
   - Or use "Add from .env" button to paste all at once

5. **Deploy**:
   - Click "Deploy Web Service"
   - Wait for build to complete

6. **After First Deployment**:
   - Run migrations: `npx prisma migrate deploy`
   - Use Render Shell or connect locally with External Database URL

## Notes:

- Use **Internal Database URL** for `DATABASE_URL` in production
- `NEXTAUTH_URL` should match your Render app URL exactly
- Stripe keys can be added later if not ready yet
- Free tier has 512 MB RAM and 0.1 CPU
