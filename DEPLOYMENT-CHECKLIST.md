# 🚀 Production Deployment Checklist

## ✅ Pre-Deployment Steps Completed

- [x] All changes committed to git
- [x] Code pushed to GitHub: `https://github.com/txlcodes/stone-arts-vfinal.git`

## 📋 Render Deployment Steps

### Step 1: Create PostgreSQL Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `stonearts-db` (or your preferred name)
   - **Database**: `stonearts`
   - **User**: `stonearts_user` (or auto-generated)
   - **Plan**: Free (or upgrade if needed)
4. Click **"Create Database"**
5. **IMPORTANT**: Copy both URLs:
   - **Internal Database URL** (for production app)
   - **External Database URL** (for migrations)

### Step 2: Create Web Service on Render

1. In Render Dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository:
   - Select **"Public Git repository"**
   - Repository URL: `https://github.com/txlcodes/stone-arts-vfinal.git`
   - Or connect via GitHub OAuth
3. Configure the service:

   **Basic Settings:**
   - **Name**: `stonearts-nextjs` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: Leave empty (or `stonearts-nextjs` if repo has subfolder)
   - **Environment**: `Node`
   - **Build Command**: 
     ```bash
     npm install && npm run prisma:generate && npm run build
     ```
   - **Start Command**: 
     ```bash
     npm start
     ```

### Step 3: Set Environment Variables

Add these environment variables in Render's dashboard:

#### Required Variables:

1. **DATABASE_URL**
   - Use the **Internal Database URL** from Step 1
   - Format: `postgresql://user:password@host:port/database?schema=public`

2. **NODE_ENV**
   - Value: `production`

3. **NEXTAUTH_URL**
   - Initially: `https://your-app-name.onrender.com` (update after first deploy)
   - **Important**: Update this after you get your app URL

4. **NEXTAUTH_SECRET**
   - Generate locally: `openssl rand -base64 32`
   - Or use any secure random 32+ character string
   - Example: `your-super-secret-key-here-minimum-32-chars`

#### Optional (Add when ready):

5. **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY**
   - From Stripe Dashboard → API Keys
   - Test: `pk_test_...` or Live: `pk_live_...`

6. **STRIPE_SECRET_KEY**
   - From Stripe Dashboard → API Keys
   - Test: `sk_test_...` or Live: `sk_live_...`

7. **STRIPE_WEBHOOK_SECRET**
   - From Stripe Dashboard → Webhooks
   - Format: `whsec_...`

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will:
   - Clone your repository
   - Install dependencies
   - Generate Prisma Client
   - Build the Next.js app
   - Start the service

3. **Wait for deployment** (usually 5-10 minutes)

### Step 5: Update NEXTAUTH_URL

After first deployment:

1. Copy your app URL from Render dashboard (e.g., `https://stonearts-nextjs.onrender.com`)
2. Go to **Environment** tab
3. Update **NEXTAUTH_URL** to match your app URL exactly
4. Click **"Save Changes"** (this will trigger a redeploy)

### Step 6: Run Database Migrations

After deployment, run Prisma migrations:

**Option A: Using Render Shell**
1. In Render dashboard, click **"Shell"** tab
2. Run:
   ```bash
   npx prisma migrate deploy
   ```

**Option B: Using External Database URL (Local)**
1. Temporarily set `DATABASE_URL` in your local `.env` to the **External Database URL**
2. Run:
   ```bash
   npx prisma migrate deploy
   ```
3. Remove the external URL from `.env` after migration

### Step 7: Verify Deployment

1. Visit your app URL: `https://your-app-name.onrender.com`
2. Check homepage loads correctly
3. Test product pages
4. Verify admin panel: `/admin`
5. Check database connection (products should load)

## 🔧 Troubleshooting

### Build Fails

- Check build logs in Render dashboard
- Verify all environment variables are set
- Ensure `DATABASE_URL` uses Internal URL format

### Database Connection Errors

- Verify `DATABASE_URL` is correct
- Check database is running in Render dashboard
- Ensure migrations ran successfully

### App Crashes on Start

- Check logs in Render dashboard
- Verify `NEXTAUTH_URL` matches your app URL exactly
- Ensure Prisma Client was generated (`npm run prisma:generate`)

### Products Not Loading

- Verify database migrations ran
- Check if products exist in database
- Verify API routes are working

## 📝 Post-Deployment

- [ ] Update domain/DNS if using custom domain
- [ ] Set up Stripe webhooks (if using Stripe)
- [ ] Configure SSL certificate (auto-handled by Render)
- [ ] Set up monitoring/alerts
- [ ] Test checkout flow (if implemented)
- [ ] Verify admin panel access

## 🔗 Useful Links

- [Render Dashboard](https://dashboard.render.com)
- [Render Documentation](https://render.com/docs)
- [Prisma Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

## ⚠️ Important Notes

1. **Free Tier Limitations**:
   - 512 MB RAM
   - 0.1 CPU
   - Spins down after 15 minutes of inactivity
   - First request after spin-down may be slow

2. **Database URLs**:
   - Use **Internal URL** for production app
   - Use **External URL** only for migrations from local machine

3. **Environment Variables**:
   - Never commit `.env` files
   - All secrets should be in Render dashboard only

4. **Auto-Deploy**:
   - Render auto-deploys on push to `main` branch
   - You can disable this in settings if needed
