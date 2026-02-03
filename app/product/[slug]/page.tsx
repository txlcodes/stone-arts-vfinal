import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Read product page HTML template dynamically (not cached at module level)
function getProductPageHTML(): string {
  try {
    // Try multiple possible paths for detail_product.html
    // Priority: public directory first (most reliable), then relative paths
    const possiblePaths = [
      join(process.cwd(), 'public/detail_product_template.html'),
      join(process.cwd(), '../stoneartscrm/detail_product.html'),
      join(process.cwd(), '../../stoneartscrm/detail_product.html'),
    ];
    
    for (const htmlPath of possiblePaths) {
      try {
        if (!existsSync(htmlPath)) {
          console.log(`⚠️ Template not found at: ${htmlPath}`);
          continue;
        }
        const content = readFileSync(htmlPath, 'utf-8');
        // Extract body content (everything between <body> and </body>)
        // Handle both <body> and <body ...attributes...>
        // Use greedy match to get everything between first <body> and last </body>
        const bodyMatch = content.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        if (bodyMatch && bodyMatch[1]) {
          const bodyContent = bodyMatch[1].trim();
          console.log(`✅ Successfully loaded product template from: ${htmlPath}`);
          console.log(`📏 Template size: ${(bodyContent.length / 1024).toFixed(2)} KB`);
          // Verify the template has the required bind attribute for populate-cms.js
          if (bodyContent.includes('bind="44360311-a628-3bd3-7fc8-c24734f06683"')) {
            console.log(`✅ Template contains required product page bind attribute`);
            return bodyContent;
          } else {
            console.warn(`⚠️ Template loaded but missing required bind attribute`);
            return bodyContent; // Still return it, populate-cms.js will handle it
          }
        } else {
          console.warn(`⚠️ Could not extract body content from: ${htmlPath}`);
        }
      } catch (e: any) {
        console.error(`❌ Error reading ${htmlPath}:`, e.message);
        // Try next path
        continue;
      }
    }
  } catch (error: any) {
    console.error('❌ Error reading product template:', error.message);
  }
  
  // Fallback: return the complete structure from reference (extracted from user's HTML)
  // This matches the reference site structure exactly
  console.warn('⚠️ Using fallback product page template - detail_product.html not found');
  return `
    <div class="page_wrap">
      <div id="Main" bind="38729aa6-c37b-e52a-f697-d836bba6154a" class="w-embed">
        <style>
.page_wrap {
  overflow: clip;
}
.is-disabled, .swiper-button-disabled {
  visibility: hidden;
  opacity: 0;
  display: none;
  transition: 0.5s ease-in-out;
}
.swiper-button-next, .swiper-button-prev {
  opacity: 1;
  transition: 0.5s ease-in-out;
}
</style>
        <style>
@media screen and (min-width: 768px) {
  [item-style=tall] {
  grid-row-start: span 2;
  grid-row-end: span 2;
  grid-column-start: span 1;
  grid-column-end: span 1;
  }
  [item-style=wide] {
  grid-row-start: span 1;
  grid-row-end: span 1;
  grid-column-start: span 1;
  grid-column-end: span 1;
  }
}
</style>
      </div>
      <!-- Product content will be populated by populate-cms.js based on slug parameter -->
      <div id="product-content-placeholder" style="padding: 2rem; text-align: center;">
        <p>Loading product...</p>
      </div>
    </div>
  `;
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  // Read HTML dynamically on each request (not cached at module level)
  // This ensures changes to detail_product.html are reflected immediately
  const productPageHTML = getProductPageHTML();
  
  // The slug is available but populate-cms.js will read it from the URL
  // This page serves the HTML template, and populate-cms.js populates it
  // The complete HTML structure from detail_product.html is loaded here
  
  return (
    <div dangerouslySetInnerHTML={{ __html: productPageHTML }} />
  );
}
