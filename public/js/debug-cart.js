/**
 * Cart Debugging Script
 * Run this in the browser console to diagnose cart issues
 */

(function() {
  'use strict';
  
  console.log('%c🔍 CART DEBUG SCRIPT LOADED', 'color: blue; font-weight: bold; font-size: 14px;');
  
  // Wait for page to fully load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runDiagnostics);
  } else {
    runDiagnostics();
  }
  
  function runDiagnostics() {
    console.log('%c📊 RUNNING CART DIAGNOSTICS...', 'color: green; font-weight: bold;');
    
    // Check 1: Scripts loaded
    console.group('1️⃣ Script Availability');
    console.log('CartManager:', window.CartManager ? '✅ Available' : '❌ Missing');
    console.log('CMS Data:', window.cmsData ? '✅ Available' : '❌ Missing');
    console.log('jQuery:', window.jQuery ? '✅ Available' : '❌ Missing');
    console.groupEnd();
    
    // Check 2: Forms found
    console.group('2️⃣ Add-to-Cart Forms');
    const forms = document.querySelectorAll('[data-node-type="commerce-add-to-cart-form"]');
    console.log('Total forms found:', forms.length);
    
    forms.forEach((form, index) => {
      const productId = form.getAttribute('data-wf-product-id');
      const variantId = form.getAttribute('data-wf-variant-id');
      const hasHandler = form.dataset.cartHandlerAttached === 'true';
      
      console.log(`Form ${index}:`, {
        productId: productId || '❌ Missing',
        variantId: variantId || '❌ Missing',
        hasHandler: hasHandler ? '✅ Yes' : '❌ No',
        formHTML: form.outerHTML.substring(0, 200)
      });
    });
    console.groupEnd();
    
    // Check 3: Buttons found
    console.group('3️⃣ Add-to-Cart Buttons');
    const buttons = document.querySelectorAll('[data-node-type="commerce-add-to-cart-button"]');
    console.log('Total buttons found:', buttons.length);
    
    buttons.forEach((button, index) => {
      const form = button.closest('[data-node-type="commerce-add-to-cart-form"]') || 
                   button.closest('form');
      console.log(`Button ${index}:`, {
        type: button.tagName,
        value: button.value || button.textContent,
        hasForm: !!form,
        formProductId: form ? form.getAttribute('data-wf-product-id') : 'N/A'
      });
    });
    console.groupEnd();
    
    // Check 4: Event listeners
    console.group('4️⃣ Event Listeners');
    if (forms.length > 0) {
      const form = forms[0];
      const listeners = getEventListeners ? getEventListeners(form) : 'Cannot check (getEventListeners not available)';
      console.log('Form event listeners:', listeners);
    }
    console.groupEnd();
    
    // Check 5: Cart state
    console.group('5️⃣ Cart State');
    if (window.CartManager) {
      const cart = window.CartManager.getCart();
      console.log('Cart items:', cart.items.length);
      console.log('Cart total:', window.CartManager.getCartTotal());
      console.log('Cart data:', cart);
    } else {
      console.log('CartManager not available');
    }
    console.groupEnd();
    
    // Check 6: Test click handler
    console.group('6️⃣ Manual Test');
    console.log('To manually test, run:');
    console.log('%ctestAddToCart()', 'color: blue; font-weight: bold;');
    console.groupEnd();
    
    // Make test function available globally
    window.testAddToCart = function() {
      console.log('%c🧪 TESTING ADD TO CART...', 'color: orange; font-weight: bold;');
      
      const form = document.querySelector('[data-node-type="commerce-add-to-cart-form"]');
      if (!form) {
        console.error('❌ No form found!');
        return;
      }
      
      const productId = form.getAttribute('data-wf-product-id');
      const variantId = form.getAttribute('data-wf-variant-id');
      
      console.log('Form data:', { productId, variantId });
      
      if (!productId || !variantId) {
        console.error('❌ Missing product/variant IDs!');
        return;
      }
      
      if (!window.CartManager) {
        console.error('❌ CartManager not available!');
        return;
      }
      
      if (!window.cmsData) {
        console.error('❌ CMS data not available!');
        return;
      }
      
      const quantityInput = form.querySelector('input[name="commerce-add-to-cart-quantity-input"]') ||
                            form.querySelector('input.q-num');
      const quantity = quantityInput ? parseInt(quantityInput.value, 10) || 1 : 1;
      
      console.log('Adding to cart:', { productId, variantId, quantity });
      
      const success = window.CartManager.addToCart(productId, variantId, quantity);
      
      if (success) {
        console.log('✅ Successfully added to cart!');
        setTimeout(() => {
          window.CartManager.openCart();
          console.log('✅ Cart drawer opened');
        }, 150);
      } else {
        console.error('❌ Failed to add to cart');
      }
    };
    
    console.log('%c✅ DIAGNOSTICS COMPLETE', 'color: green; font-weight: bold; font-size: 14px;');
    console.log('Run testAddToCart() to manually test adding to cart');
  }
  
  // Monitor form submissions
  document.addEventListener('submit', function(e) {
    const form = e.target;
    if (form && form.matches('[data-node-type="commerce-add-to-cart-form"]')) {
      console.log('%c📤 FORM SUBMISSION DETECTED', 'color: red; font-weight: bold;');
      console.log('Form:', form);
      console.log('Default prevented:', e.defaultPrevented);
      console.log('Product ID:', form.getAttribute('data-wf-product-id'));
      console.log('Variant ID:', form.getAttribute('data-wf-variant-id'));
      
      if (!e.defaultPrevented) {
        console.warn('⚠️ Form submission NOT prevented! Page will refresh.');
      }
    }
  }, true);
  
  // Monitor button clicks
  document.addEventListener('click', function(e) {
    const button = e.target.closest('[data-node-type="commerce-add-to-cart-button"]');
    if (button) {
      console.log('%c🖱️ ADD TO CART BUTTON CLICKED', 'color: purple; font-weight: bold;');
      console.log('Button:', button);
      console.log('Default prevented:', e.defaultPrevented);
      console.log('Event phase:', e.eventPhase === 1 ? 'Capture' : e.eventPhase === 2 ? 'Target' : 'Bubble');
    }
  }, true);
})();
