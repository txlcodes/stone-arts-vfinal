/**
 * Test Add to Cart Button
 * Run this in console to debug add to cart issues
 */

window.testAddToCart = function() {
  console.log('%c🧪 TESTING ADD TO CART...', 'color: orange; font-weight: bold; font-size: 16px;');
  
  // Step 1: Check if forms exist
  console.group('1️⃣ Checking Forms');
  const forms = document.querySelectorAll('[data-node-type="commerce-add-to-cart-form"]');
  console.log('Found', forms.length, 'add-to-cart forms');
  
  forms.forEach((form, i) => {
    const productId = form.getAttribute('data-wf-product-id');
    const variantId = form.getAttribute('data-wf-variant-id');
    console.log(`Form ${i}:`, {
      productId: productId || '❌ MISSING',
      variantId: variantId || '❌ MISSING',
      hasHandler: form.dataset.cartHandlerAttached === 'true',
      form: form
    });
  });
  console.groupEnd();
  
  // Step 2: Check if buttons exist
  console.group('2️⃣ Checking Buttons');
  const buttons = document.querySelectorAll('[data-node-type="commerce-add-to-cart-button"]');
  console.log('Found', buttons.length, 'add-to-cart buttons');
  
  buttons.forEach((button, i) => {
    const form = button.closest('[data-node-type="commerce-add-to-cart-form"]');
    console.log(`Button ${i}:`, {
      value: button.value,
      form: form ? '✅ Found' : '❌ No form',
      productId: form ? form.getAttribute('data-wf-product-id') : 'N/A',
      variantId: form ? form.getAttribute('data-wf-variant-id') : 'N/A'
    });
  });
  console.groupEnd();
  
  // Step 3: Check CartManager
  console.group('3️⃣ Checking CartManager');
  console.log('CartManager available:', !!window.CartManager);
  console.log('CMS data available:', !!window.cmsData);
  if (window.CartManager) {
    const cart = window.CartManager.getCart();
    console.log('Current cart:', cart);
  }
  console.groupEnd();
  
  // Step 4: Try to manually add to cart
  console.group('4️⃣ Manual Add to Cart Test');
  const firstForm = forms[0];
  if (firstForm) {
    const productId = firstForm.getAttribute('data-wf-product-id');
    const variantId = firstForm.getAttribute('data-wf-variant-id');
    
    if (productId && variantId && window.CartManager) {
      console.log('Attempting to add:', { productId, variantId });
      const success = window.CartManager.addToCart(productId, variantId, 1);
      console.log('Result:', success ? '✅ Success' : '❌ Failed');
      
      if (success) {
        setTimeout(() => {
          window.CartManager.openCart();
        }, 200);
      }
    } else {
      console.error('❌ Cannot test - missing IDs or CartManager');
      console.log('Product ID:', productId || 'MISSING');
      console.log('Variant ID:', variantId || 'MISSING');
      console.log('CartManager:', window.CartManager ? 'Available' : 'MISSING');
    }
  } else {
    console.error('❌ No forms found');
  }
  console.groupEnd();
  
  // Step 5: Check event listeners
  console.group('5️⃣ Event Listeners');
  console.log('Run this to check event listeners:');
  console.log('getEventListeners(document.querySelector("[data-node-type=\\"commerce-add-to-cart-form\\"]"))');
  console.groupEnd();
};

console.log('%c📋 testAddToCart() function loaded', 'color: blue; font-weight: bold;');
console.log('Run testAddToCart() in console to debug add to cart issues');
