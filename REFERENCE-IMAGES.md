# Reference Images - Implementation Guide

## Overview
This document explains how the reference images provided by the user match the implementation in the codebase.

## Image 1: Homepage Slider (Interior Design Examples)
**Location**: Horizontal product carousel showing 4 products (Brush, Gaia, Ligia, Whisper)

### What It Shows:
- **Layout**: Horizontal slider with 4 product cards side-by-side
- **Image Type**: Interior design scenes (bathrooms, living rooms, etc.) - NOT product shots
- **Content Structure**:
  - Product Name (e.g., "Brush")
  - Stone Description (e.g., "Cremefarbener Sandstein")
  - Price (e.g., "€ 220.00 EUR")
- **Visual Style**: Each product is shown in a realistic room setting

### Implementation:
**File**: `public/js/populate-cms.js` - `populateHomePageSlider()` function

**Image Selection Priority** (lines 1572-1605):
1. ✅ **First Priority**: `images` array with `type: 'installation'` or `type: 'application'` or `type: 'interior'`
2. ✅ **Second Priority**: `hover_image_installation` field (interior design scene)
3. ✅ **Third Priority**: `selection_slider_image` (usually interior design)
4. ⚠️ **Last Resort**: `mainImage` (product shot - only if no interior images available)

**Content Population** (lines 1625-1649):
- Product Name: `product.name` → `<h3 class="heading-142">`
- Stone Description: `product.stone` → `<h4 class="heading-144">` (NOT product.description)
- Price: `product.price` + `product.currency` → `<h3 class="heading-143">`

**Pattern Enforcement**:
- Only displays products with `name` and `slug` (line 1563)
- Validates required fields before rendering
- Ensures interior design images are prioritized over product shots

---

## Image 2: Product Grid/Catalog (Product Cards)
**Location**: Product catalog/grid showing 3 products (Whisper, Yami, Yuki)

### What It Shows:
- **Layout**: Grid of product cards (can be horizontal scroll or grid)
- **Image Type**: Mix of product shots and interior scenes (acceptable for catalog)
- **Content Structure**:
  - Product Name (e.g., "Yami")
  - Stone Description (e.g., "Schwarzer Schieferstein")
  - Price (e.g., "€ 220.00 EUR")
- **Visual Style**: Clean product cards suitable for catalog browsing

### Implementation:
**File**: `public/js/populate-cms.js` - `populateHomepageProductGrid()` function

**Image Selection** (lines 1419-1430):
- Uses `mainImage` or first image from `images` array
- Can display product shots OR interior scenes (more flexible than slider)
- Falls back to `productImages[0]` if `mainImage` not available

**Content Population** (lines 1441-1458):
- Product Name: `product.name` → `.text-block-65`
- Stone Description: `product.stone` → `.text-block-70`
- Price: `product.price` → `.text-block-68`

**Pattern Enforcement**:
- Only displays products with `name`, `slug`, and `mainImage` (line 1414)
- Validates required fields before rendering

---

## Key Differences

| Aspect | Homepage Slider (Image 1) | Product Grid (Image 2) |
|--------|---------------------------|------------------------|
| **Image Priority** | Interior design scenes ONLY | Product shots OR interior scenes |
| **Use Case** | Hero section showcase | Catalog/product listing |
| **Image Types** | `installation`, `application`, `interior` | `mainImage` or first from `images` |
| **Fallback** | `selection_slider_image` → `mainImage` | `mainImage` → `images[0]` |
| **Purpose** | Show products in context | Show product options |

---

## Admin Panel Guidance

When adding products, ensure:

1. **For Homepage Slider** (Image 1 reference):
   - ✅ Add at least one image with `type: 'installation'` or `type: 'application'`
   - ✅ Or provide `hover_image_installation` field
   - ✅ Or provide `selection_slider_image` (interior design scene)
   - ❌ Don't rely on `mainImage` alone (product shot)

2. **For Product Grid** (Image 2 reference):
   - ✅ Provide `mainImage` (can be product shot or interior scene)
   - ✅ Or ensure `images` array has at least one image
   - ✅ Both product shots and interior scenes are acceptable

---

## Pattern Consistency

Both sections follow the same content pattern:
- **Product Name**: Always displayed
- **Stone Description**: Always `product.stone` (detailed description)
- **Price**: Always formatted as "€XXX.XX EUR"

The difference is in **image selection priority**, not content structure.

---

## Next.js Routing

All product links have been updated to use Next.js routing:
- ✅ Homepage slider: `/product/${product.slug}`
- ✅ Product grid: `/product/${product.slug}` (via card click)
- ✅ Variant selector: `/product/${product.slug}`

Old format (`detail_product.html?product=...`) has been replaced.
