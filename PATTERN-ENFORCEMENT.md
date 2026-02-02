# Product Page Pattern Enforcement

This document explains how the system ensures all product pages follow the same pattern.

## Validation Layers

### 1. Admin Panel Validation
When saving a product in the admin panel, the system validates:

**Required Fields:**
- ✅ Product Name
- ✅ Slug
- ✅ Stone Description (detailed description)
- ✅ Dimensions (format: "240 x 60 x 2.3 cm (1.44m²)")
- ✅ Price Display
- ✅ Price Value (numeric)
- ✅ Main Image
- ✅ Selection Slider Image

**Warnings:**
- ⚠️ Image Gallery should have 4 images (panel, installation, stone, closeup)
- ⚠️ Image types should match: panel, installation, stone, closeup

### 2. Frontend Population Validation
When `populate-cms.js` loads a product page, it:

1. **Validates Required Fields**
   - Checks for missing required fields
   - Logs warnings to console
   - Uses fallbacks when possible

2. **Validates Image Gallery**
   - Ensures 4 images are present
   - Validates image types match pattern
   - Warns if pattern is not followed

3. **Consistent Population**
   - All product pages use the same population logic
   - Same HTML structure (bind attributes)
   - Same field mappings

## Pattern Consistency

### Field Mappings (All Products Follow Same Pattern)

| Field | HTML Element | Bind Attribute | Description |
|-------|-------------|----------------|-------------|
| Product Name | `<h2>` | `44360311-a628-3bd3-7fc8-c24734f06683` | Variant name (e.g., "Brush") |
| Stone Description | `<h3>` | `116c2318-c33b-dcc5-4ef0-b6d435cfdf1a` | Detailed stone description |
| Price | `<h3>` | `44360311-a628-3bd3-7fc8-c24734f0668a` | Formatted price |
| Dimensions | `<div>` | `.text-block-127` | Size per panel |
| Image Gallery (Mobile) | Swiper | `2fb8e092-727e-f3ca-475b-8178c0fc0239` | Mobile slider |
| Image Gallery (Desktop) | Grid | `ba91b3e9-080a-1c76-e14e-e7aa27382349` | Desktop grid |
| Variant Selector | Swiper | `116c2318-c33b-dcc5-4ef0-b6d435cfdf1f` | Product variants |

### Image Gallery Pattern

All products must have exactly 4 images in this order:

1. **panel** - Product panel image
2. **installation** - Installation/application scene (interior design)
3. **stone** - Stone texture/close-up
4. **closeup** - Product close-up detail

### Price Format

All prices follow the same format:
- Display: `€220.00 EUR`
- Value: `220.00` (numeric)

### Dimensions Format

All dimensions follow the same format:
- Display: `Größe pro Paneel - 240 x 60 x 2.3 cm (1.44m²)`
- Value: `240 x 60 x 2.3 cm (1.44m²)`

## Enforcement Mechanisms

### 1. Admin Panel
- Form validation prevents saving incomplete products
- Required fields marked with `*`
- Tooltips guide users on format
- Pattern guide banner explains structure

### 2. Database Sync
- API validates data structure before saving
- Ensures all required fields are present
- Normalizes data format

### 3. Frontend Population
- `populate-cms.js` validates data before populating
- Logs warnings for missing fields
- Uses consistent population logic for all products
- Ensures HTML structure matches pattern

## Ensuring Consistency

### When Creating New Products

1. **Use Admin Panel Form**
   - Follow the pattern guide banner
   - Fill all required fields (`*`)
   - Add 4 images with correct types
   - Follow format examples in tooltips

2. **Verify Pattern**
   - Check console for validation warnings
   - Ensure all required fields are present
   - Verify image gallery has 4 images

3. **Test Product Page**
   - Visit `/product/[slug]`
   - Verify all fields populate correctly
   - Check image gallery displays properly
   - Ensure variant selector works

### When Editing Products

1. **Maintain Pattern**
   - Don't remove required fields
   - Keep image gallery at 4 images
   - Maintain format consistency

2. **Update All Instances**
   - Changes sync to database automatically
   - Frontend updates immediately
   - Pattern remains consistent

## Troubleshooting

### Product Not Following Pattern

**Symptoms:**
- Missing fields on product page
- Images not displaying
- Price format incorrect

**Solutions:**
1. Check admin panel for validation errors
2. Verify all required fields are filled
3. Check console for populate-cms.js warnings
4. Ensure image gallery has 4 images
5. Verify field formats match pattern

### Pattern Validation Errors

**Common Issues:**
- Missing stone description → Add detailed description
- Missing dimensions → Add in format: "240 x 60 x 2.3 cm (1.44m²)"
- Missing images → Add 4 images (panel, installation, stone, closeup)
- Wrong image types → Ensure types match pattern

## Summary

All product pages follow the same pattern through:
- ✅ Admin panel validation
- ✅ Database structure enforcement
- ✅ Frontend population consistency
- ✅ HTML template structure
- ✅ Field mapping consistency

This ensures every product page looks and behaves the same way, providing a consistent user experience.
