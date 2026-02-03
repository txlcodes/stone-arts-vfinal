# ⚡ Quick Deploy Guide

## 🎯 Fast Track to Production

### 1. Push to GitHub ✅ (DONE)
```bash
git push origin main
```

### 2. Create Database on Render

1. Go to: https://dashboard.render.com
2. **New +** → **PostgreSQL**
3. Name: `stonearts-db`
4. Copy **Internal Database URL**

### 3. Create Web Service

1. **New +** → **Web Service**
2. Connect repo: `https://github.com/txlcodes/stone-arts-vfinal.git`
3. Settings:
   - **Build**: `npm install && npm run prisma:generate && npm run build`
   - **Start**: `npm start`

### 4. Add Environment Variables

In Render dashboard → Environment tab:

```
DATABASE_URL=<Internal Database URL from step 2>
NODE_ENV=production
NEXTAUTH_URL=https://your-app-name.onrender.com (update after deploy)
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
```

### 5. Deploy & Migrate

1. Click **Create Web Service**
2. Wait for build (5-10 min)
3. Copy your app URL
4. Update `NEXTAUTH_URL` with your app URL
5. Run migrations:
   - Render Shell → `npx prisma migrate deploy`

### 6. Done! 🎉

Visit your app URL and verify it's working.

---

**Need help?** See `DEPLOYMENT-CHECKLIST.md` for detailed steps.
