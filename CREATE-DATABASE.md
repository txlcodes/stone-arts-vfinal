# 🗄️ Create PostgreSQL Database on Render

## Step-by-Step Guide

### 1. Go to Render Dashboard
Visit: https://dashboard.render.com

### 2. Create New PostgreSQL Database

1. Click the **"New +"** button (top right)
2. Select **"PostgreSQL"** from the dropdown

### 3. Configure Database

Fill in the form:

- **Name**: `stonearts-db` (or any name you prefer)
- **Database**: `stonearts` (or leave default)
- **User**: `stonearts_user` (or leave default - Render will auto-generate)
- **Region**: Choose closest to your users (e.g., Frankfurt, Oregon, etc.)
- **PostgreSQL Version**: Latest (default is fine)
- **Plan**: 
  - **Free** - For testing/development (limited to 90 days, then $7/month)
  - **Starter** - $7/month (recommended for production)
  - **Standard** - $20/month (for higher traffic)

### 4. Create Database

Click **"Create Database"**

### 5. Copy Database URLs

After creation, you'll see two URLs:

#### 🔒 Internal Database URL
- Use this for your **production app** (`DATABASE_URL` env var)
- Format: `postgresql://user:password@dpg-xxxxx-a/stonearts`
- Only accessible from other Render services

#### 🌐 External Database URL  
- Use this for **local migrations** (if needed)
- Format: `postgresql://user:password@dpg-xxxxx-a.frankfurt-postgres.render.com/stonearts`
- Accessible from anywhere

### 6. Save the Internal Database URL

**IMPORTANT**: Copy the **Internal Database URL** - you'll need it for the next step!

---

## ✅ Next Steps

After creating the database:

1. ✅ Database created
2. ⏭️ Create Web Service (see `DEPLOYMENT-CHECKLIST.md`)
3. ⏭️ Set `DATABASE_URL` environment variable
4. ⏭️ Deploy and run migrations

---

## 💡 Tips

- **Free tier**: Good for testing, but limited to 90 days
- **Starter tier ($7/month)**: Recommended for production
- Database name and user can be changed, but keep them simple
- You can always upgrade/downgrade later

## 🔗 Quick Links

- [Render Dashboard](https://dashboard.render.com)
- [Render PostgreSQL Docs](https://render.com/docs/databases)
