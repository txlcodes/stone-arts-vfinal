import { readFileSync } from 'fs';
import { join } from 'path';

// Read product page HTML template at build time
function getProductPageHTML(): string {
  try {
    // Try multiple possible paths
    const possiblePaths = [
      join(process.cwd(), '../stoneartscrm/detail_product.html'),
      join(process.cwd(), 'public/detail_product_template.html'),
      join(process.cwd(), '../../stoneartscrm/detail_product.html'),
    ];
    
    for (const htmlPath of possiblePaths) {
      try {
        const content = readFileSync(htmlPath, 'utf-8');
        // Extract body content (everything between <body> and </body>)
        const bodyMatch = content.match(/<body>([\s\S]*)<\/body>/);
        if (bodyMatch && bodyMatch[1]) {
          return bodyMatch[1];
        }
      } catch (e) {
        // Try next path
        continue;
      }
    }
  } catch (error) {
    console.error('Error reading product template:', error);
  }
  
  // Fallback: return basic structure that populate-cms.js will populate
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

// Cache the HTML at module level (loaded once at build/startup)
const productPageHTML = getProductPageHTML();

export default function ProductPage({ params }: { params: { slug: string } }) {
  // The slug is available but populate-cms.js will read it from the URL
  // This page serves the HTML template, and populate-cms.js populates it
  
  return (
    <div dangerouslySetInnerHTML={{ __html: productPageHTML }} />
  );
}
