# Stone Arts - Next.js E-commerce Platform

A modern e-commerce platform migrated from Webflow to Next.js, featuring product management, Stripe payments, and order tracking.

## 🚀 Features

- **Product Management**: Admin panel for adding/editing products
- **Stripe Integration**: Secure payment processing
- **Order Tracking**: Complete order management system
- **User Accounts**: Authentication and user management
- **PostgreSQL Database**: Robust data persistence with Prisma ORM

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database (local or hosted)
- Stripe account (for payments)

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/txlcodes/stone-arts-vfinal.git
cd stone-arts-vfinal
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: Your app URL (e.g., `http://localhost:3000`)
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: From Stripe dashboard
- `STRIPE_SECRET_KEY`: From Stripe dashboard
- `STRIPE_WEBHOOK_SECRET`: From Stripe webhook settings

### 3. Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations (creates tables)
npm run prisma:migrate

# (Optional) Open Prisma Studio to view/edit data
npm run prisma:studio
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

### 5. Access Admin Panel

Navigate to [http://localhost:3000/admin](http://localhost:3000/admin) to manage products.

## 📁 Project Structure

```
stonearts-nextjs/
├── app/
│   ├── admin/              # Admin panel pages
│   ├── api/                # API routes
│   │   └── admin/
│   │       └── sync-products/  # Product sync endpoint
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── prisma/
│   └── schema.prisma      # Database schema
├── public/
│   ├── admin/             # Admin panel assets
│   ├── data/              # Mock CMS data
│   ├── images/            # Product images
│   └── js/                # Client-side scripts
└── styles/                # CSS files
```

## 🔧 Admin Panel Usage

1. **View Products**: Products are loaded from the database or fallback JSON file
2. **Add/Edit Products**: Use the admin interface to manage products
3. **Sync to Database**: Click "Sync to Server" to save products to PostgreSQL
4. **Export/Import**: Export products as JSON or import from JSON files

### Syncing Products

When you add or edit products in the admin panel, they are saved to localStorage by default. To persist them to the database:

```javascript
// In admin panel, after saving:
await window.AdminDataManager.saveCMSDataAndSync(data, true);
```

Or use the sync button in the admin UI (if implemented).

## 🗄️ Database Schema

The database includes:
- **Users**: User accounts and authentication
- **Products**: Product catalog with images, pricing, categories
- **Orders**: Order records with status tracking
- **OrderItems**: Individual items within orders

See `prisma/schema.prisma` for the complete schema.

## 🚢 Deployment to Render

### 1. Create PostgreSQL Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Create a new PostgreSQL database
3. Copy the **Internal Database URL** (for your app) and **External Database URL** (for Prisma migrations)

### 2. Set Environment Variables in Render

Add all environment variables from your `.env` file to Render's environment variables section.

**Important**: Use the **Internal Database URL** for `DATABASE_URL` in production.

### 3. Deploy

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Use these settings:
   - **Build Command**: `npm install && npm run prisma:generate && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node

### 4. Run Migrations

After first deployment, run migrations:

```bash
# Using Render Shell or locally with External Database URL
npx prisma migrate deploy
```

Or use Render's shell feature to run:
```bash
npm run prisma:migrate
```

## 📝 API Endpoints

### Admin API

- `POST /api/admin/sync-products` - Sync products to database
  ```json
  {
    "products": [
      {
        "productId": "...",
        "variantId": "...",
        "name": "...",
        "price": "...",
        ...
      }
    ]
  }
  ```

- `GET /api/admin/sync-products` - Get all products from database

## 🔐 Authentication (Coming Soon)

NextAuth.js integration for user authentication is planned. See `IMPLEMENTATION-PLAN.md` for details.

## 💳 Stripe Integration (Coming Soon)

Stripe checkout and webhook handlers are planned. See `IMPLEMENTATION-PLAN.md` for details.

## 🐛 Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check PostgreSQL is running (if local)
- Ensure database exists and user has permissions

### Prisma Client Not Found

```bash
npm run prisma:generate
```

### Build Errors

- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Regenerate Prisma: `npm run prisma:generate`

## 📄 License

Private project - All rights reserved

## 🤝 Contributing

This is a private project. Contact the repository owner for access.
