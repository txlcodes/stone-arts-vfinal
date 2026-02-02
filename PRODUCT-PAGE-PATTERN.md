# Product Page Pattern Guide

This document explains the structure and pattern that each product page follows, based on the HTML template provided.

## Overview

Each product page follows a consistent structure with specific fields that must be populated from the admin panel. The pattern ensures visual consistency and proper data display across all product pages.

## Required Fields

The following fields are **required** and must be filled when creating/editing products:

### 1. Basic Information
- **Product Name** (`name`) - The variant name (e.g., "Brush", "Whisper", "Yami")
- **Slug** (`slug`) - URL-friendly name used in `/product/[slug]` (e.g., "brush", "whisper")
- **Stone Description** (`stone`) - Detailed description of the stone
  - Example: `"Cremefarbener Sandsteinfelsen aus den sonnigen Landschaften Rajasthans."`
  - This appears in the variant selector section

### 2. Pricing
- **Price Display** (`price`) - Formatted price string (e.g., "€220.00")
- **Price Value** (`priceValue`) - Numeric value for calculations (e.g., 220.00)
- **Currency** (`currency`) - Default: "EUR"

### 3. Images
- **Main Image** (`mainImage`) - Primary product image
  - Used in product cards, galleries, and as fallback
  - Can be URL or local path: `images/filename.webp`
  
- **Selection Slider Image** (`selection_slider_image`) - Thumbnail for variant selector
  - Small image (95px width recommended)
  - Appears in the product variant selector slider
  - Shows all available product variants

- **Image Gallery** (`images`) - Array of 4 images following this pattern:
  1. **panel** - Product panel image
  2. **installation** - Installation/application scene (interior design example)
  3. **stone** - Stone texture/close-up
  4. **closeup** - Product close-up detail
  
  Each image object should have:
  ```json
  {
    "url": "images/filename.webp",
    "type": "panel|installation|stone|closeup",
    "sort_order": 1
  }
  ```

### 4. Technical Specifications
- **Dimensions** (`dimensions`) - Formatted dimensions string
  - Format: `"240 x 60 x 2.3 cm (1.44m²)"`
  - Displays as: "Größe pro Paneel - [dimensions]"

- **Delivery Time** (`deliveryTime`) - Display text (e.g., "5-10 Tage" or "5-10 days")

## Optional Fields

These fields enhance the product page but are not required:

- **Description** (`description`) - Additional product description
- **Alt Text** (`alt_text`) - Image alt text for accessibility
- **Category** (`category`) - Product category (e.g., "AKUROCK Akustikpaneele")
- **Special Images** (`special_image`, `special_image_2`, `hover_image`, `hover_image_installation`)
- **Marketing Content** (`special_field_slogan`, `special_field_text`, `special_field_button`)
- **Colors** (`color`, `button_header_color`) - HSL color values

## Page Structure

The product page HTML template includes:

1. **Product Header Section**
   - Product name (h2)
   - Stone description (h3)
   - Price display
   - Dimensions

2. **Image Gallery**
   - Mobile: Swiper slider with product images
   - Desktop: Grid layout with product images
   - Images populated from `images` array

3. **Variant Selector**
   - Horizontal slider showing all product variants
   - Uses `selection_slider_image` for thumbnails
   - Links to other product pages

4. **Add to Cart Section**
   - Quantity selector
   - Add to cart button
   - Delivery time display

5. **Accessories Section**
   - Related accessories/products
   - Populated from accessories collection

6. **Product Details Tabs**
   - Produktdetails (Product Details)
   - Hauptmerkmale (Key Features)
   - Installation & Downloads
   - Unsere Steine (Our Stones)
   - Nachhaltigkeit (Sustainability)

7. **Related Content**
   - Visualizer CTA
   - Sample box CTA
   - Social media feed
   - Reviews section

## Admin Panel Form

When creating/editing products in the admin panel:

1. Fill in all **required fields** (marked with *)
2. Follow the **format guidelines** shown in tooltips
3. Add **4 images** to the gallery with proper types
4. Ensure **dimensions** follow the format: "240 x 60 x 2.3 cm (1.44m²)"
5. Write a **detailed stone description** (not just "stone type")

## Data Flow

1. **Admin Panel** → User fills form with product data
2. **Local Storage** → Data saved to `stonearts_cms_data` in localStorage
3. **API Sync** → Data synced to PostgreSQL via `/api/admin/sync-products`
4. **Frontend** → `populate-cms.js` reads data and populates HTML template
5. **Display** → Product page renders following the HTML pattern

## Example Product Data

```json
{
  "name": "Brush",
  "slug": "brush",
  "stone": "Cremefarbener Sandsteinfelsen aus den sonnigen Landschaften Rajasthans.",
  "dimensions": "240 x 60 x 2.3 cm (1.44m²)",
  "price": "€220.00",
  "priceValue": 220.00,
  "currency": "EUR",
  "mainImage": "images/Brush_Paneele.webp",
  "selection_slider_image": "images/Brush.webp",
  "images": [
    {
      "url": "images/Brush_Paneele.webp",
      "type": "panel",
      "sort_order": 1
    },
    {
      "url": "images/Brush_Installation.webp",
      "type": "installation",
      "sort_order": 2
    },
    {
      "url": "images/Brush_Stone.webp",
      "type": "stone",
      "sort_order": 3
    },
    {
      "url": "images/Brush_CloseUp.webp",
      "type": "closeup",
      "sort_order": 4
    }
  ],
  "deliveryTime": "5-10 Tage",
  "category": "AKUROCK Akustikpaneele"
}
```

## Notes

- All products follow this same pattern for consistency
- The HTML template uses Webflow bindings (`bind` attributes) that are populated by JavaScript
- Image paths can be URLs or local paths (prefixed with `images/`)
- The variant selector automatically shows all products in the same category
- Interior design/installation images are prioritized for display in sliders
