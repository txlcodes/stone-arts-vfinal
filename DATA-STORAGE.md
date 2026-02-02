# Data Storage Guide

## Where Data is Saved

### 1. **Products** ✅
- **Local Storage:** `AdminPanel.cmsData.products` array → Saved to `localStorage` via `AdminDataManager.saveCMSData()`
- **Database:** Auto-synced to PostgreSQL `Product` table via `/api/admin/sync-products`
- **Location:** `public/data/mock-cms-data.json` (fallback/initial data)

**How it works:**
1. User adds/edits product in admin panel
2. Product saved to `localStorage` immediately
3. **Auto-syncs** to PostgreSQL database via API
4. Database stores in `Product` table with unique `productId` and `variantId`

---

### 2. **Accessories** ✅ (FIXED)
- **Local Storage:** `AdminPanel.cmsData.accessories` array → Saved to `localStorage`
- **Database:** Auto-synced to PostgreSQL `Product` table (as products with category "AKUROCK Zubehör")
- **Location:** `public/data/mock-cms-data.json` (fallback/initial data)

**How it works:**
1. User adds/edits accessory in admin panel
2. Accessory saved to `localStorage` immediately
3. **Auto-syncs** to PostgreSQL database (converted to product format)
4. Database stores in `Product` table with category "AKUROCK Zubehör"

---

### 3. **Sample Boxes** ✅ (FIXED)
- **Local Storage:** `AdminPanel.cmsData.products` array (filtered by category "AKUROCK Muster")
- **Database:** Auto-synced to PostgreSQL `Product` table (as products with category "AKUROCK Muster")
- **Location:** `public/data/mock-cms-data.json` (fallback/initial data)

**How it works:**
1. User adds/edits sample box in admin panel
2. Sample box saved to `products` array in `localStorage`
3. **Auto-syncs** to PostgreSQL database via API
4. Database stores in `Product` table with category "AKUROCK Muster"

---

### 4. **Categories** 📋
- **Local Storage:** `AdminPanel.cmsData.categories` array
- **Database:** Not synced yet (static reference data)
- **Location:** `public/data/mock-cms-data.json`

**Note:** Categories are currently static. They can be managed in the JSON file or added to database schema later.

---

## Data Flow Diagram

```
Admin Panel (User Input)
    ↓
localStorage (Immediate Save)
    ↓
Auto-Sync to Database
    ↓
PostgreSQL Product Table
```

## Database Schema

All products, accessories, and sample boxes are stored in the **same `Product` table**, differentiated by:
- **Products:** `category = "AKUROCK Akustikpaneele"`
- **Accessories:** `category = "AKUROCK Zubehör"`
- **Sample Boxes:** `category = "AKUROCK Muster"`

## What Was Fixed

### ✅ Before (Problems):
1. Products saved only to localStorage, not syncing to database
2. Accessories saved only to localStorage, not syncing to database
3. Sample boxes saved only to localStorage, not syncing to database
4. New items used template defaults (€220.00, "AKUROCK Akustikpaneele")
5. Missing unique IDs (`productId`, `variantId`) for new items

### ✅ After (Fixed):
1. **Products:** Auto-sync to database ✅
2. **Accessories:** Auto-sync to database ✅
3. **Sample Boxes:** Auto-sync to database ✅
4. **No template defaults:** Users must fill in category and price
5. **Auto-generated IDs:** Unique `productId` and `variantId` for all new items

## API Endpoints

### Sync Products to Database
- **POST** `/api/admin/sync-products`
- **Body:** `{ products: [...] }`
- **Response:** `{ success: true, results: { created: X, updated: Y } }`

### Get All Products from Database
- **GET** `/api/admin/sync-products`
- **Response:** `{ products: [...] }`

## Testing Locally

1. **Start dev server:** `npm run dev`
2. **Open admin:** http://localhost:3000/admin
3. **Add product/accessory/sample box**
4. **Check localStorage:** Open browser DevTools → Application → Local Storage
5. **Check database:** `npm run prisma:studio` → View `Product` table

## Troubleshooting

### Data not syncing to database?
- Check browser console for errors
- Verify `DATABASE_URL` in `.env` is correct
- Check network tab for API call to `/api/admin/sync-products`
- Verify database is running: `npm run prisma:studio`

### Template values appearing?
- Clear localStorage: `localStorage.clear()` in browser console
- Reload admin panel
- New items should have empty category/price fields

### Missing IDs?
- New items automatically get unique `productId` and `variantId`
- If missing, check browser console for errors during save
