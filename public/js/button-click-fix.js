/**
 * AGGRESSIVE BUTTON CLICK FIX
 * This script ensures add-to-cart buttons work by:
 * 1. Intercepting clicks at the earliest possible moment
 * 2. Adding direct onclick handlers
 * 3. Changing button types immediately
 * 4. Preventing Webflow from handling the clicks
 */

(function() {
  'use strict';
  
  console.log('🔧 Button Click Fix: Initializing...');
  
  // Function to make a button work
  function makeButtonWork(button) {
    if (!button) return;
    
    // Mark as processed
    if (button.dataset.clickFixApplied === 'true') return;
    button.dataset.clickFixApplied = 'true';
    
    const form = button.closest('[data-node-type="commerce-add-to-cart-form"]') ||
                 button.closest('form');
    
    if (!form) {
      console.warn('⚠️ Button Click Fix: No form found for button', button);
      return;
    }
    
    const productId = form.getAttribute('data-wf-product-id');
    const variantId = form.getAttribute('data-wf-variant-id');
    
    if (!productId || !variantId) {
      console.warn('⚠️ Button Click Fix: Form missing IDs', { productId, variantId });
      return;
    }
    
    console.log('✅ Button Click Fix: Setting up button', { productId, variantId });
    
    // Change button type to prevent form submission BEFORE cloning
    if (button.type === 'submit' || button.getAttribute('type') === 'submit') {
      button.setAttribute('type', 'button');
      button.type = 'button';
      console.log('✅ Button Click Fix: Changed button type to "button"');
    }
    
    // Prevent form submission
    form.setAttribute('action', 'javascript:void(0);');
    form.setAttribute('onsubmit', 'return false;');
    form.action = 'javascript:void(0);';
    form.onsubmit = function() { return false; };
    
    // Remove all existing event listeners by cloning
    const newButton = button.cloneNode(true);
    
    // CRITICAL: Ensure the cloned button also has type="button"
    // Sometimes cloning doesn't preserve the type change
    if (newButton.type === 'submit' || newButton.getAttribute('type') === 'submit') {
      newButton.setAttribute('type', 'button');
      newButton.type = 'button';
      console.log('✅ Button Click Fix: Fixed cloned button type');
    }
    
    // Replace the old button with the new one
    button.parentNode.replaceChild(newButton, button);
    
    // Add multiple event handlers
    const handleClick = function(e) {
      console.log('🎯 Button Click Fix: DIRECT CLICK HANDLER FIRED!', { productId, variantId });
      
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      const quantityInput = form.querySelector('input[name="commerce-add-to-cart-quantity-input"]') ||
                            form.querySelector('input.q-num') ||
                            form.querySelector('input[type="number"]');
      const quantity = quantityInput ? parseInt(quantityInput.value, 10) || 1 : 1;
      
      console.log('🛒 Button Click Fix: Adding to cart', { productId, variantId, quantity });
      
      function tryAddToCart() {
        if (window.CartManager) {
          try {
            const success = window.CartManager.addToCart(productId, variantId, quantity);
            if (success) {
              console.log('✅ Button Click Fix: Item added successfully (cart will open automatically)');
            } else {
              console.error('❌ Button Click Fix: addToCart returned false');
            }
          } catch (error) {
            console.error('❌ Button Click Fix: Error', error);
          }
        } else {
          console.warn('⚠️ Button Click Fix: CartManager not ready, retrying...');
          setTimeout(tryAddToCart, 100);
        }
      }
      
      tryAddToCart();
      return false;
    };
    
    // Add handlers to multiple events
    newButton.addEventListener('click', handleClick, true); // Capture phase
    newButton.addEventListener('mousedown', handleClick, true); // Even earlier
    newButton.addEventListener('mouseup', function(e) {
      e.preventDefault();
      e.stopPropagation();
    }, true);
    
    // Also add inline onclick as ultimate fallback
    newButton.onclick = handleClick;
    newButton.setAttribute('onclick', 'return false;'); // Prevent default, our handler will run
    
    console.log('✅ Button Click Fix: Handlers attached to button');
  }
  
  // Function to find and fix all buttons
  function fixAllButtons() {
    console.log('🔧 Button Click Fix: Searching for buttons...');
    
    const buttons = document.querySelectorAll('[data-node-type="commerce-add-to-cart-button"]');
    console.log(`🔧 Button Click Fix: Found ${buttons.length} buttons`);
    
    buttons.forEach((button, index) => {
      console.log(`🔧 Button Click Fix: Processing button ${index + 1}`, button);
      makeButtonWork(button);
    });
    
    // Also find submit buttons inside add-to-cart forms
    const forms = document.querySelectorAll('[data-node-type="commerce-add-to-cart-form"]');
    forms.forEach(form => {
      const submitButtons = form.querySelectorAll('input[type="submit"], button[type="submit"]');
      submitButtons.forEach(button => {
        if (!button.hasAttribute('data-node-type')) {
          // This is a submit button that might not have the data attribute
          makeButtonWork(button);
        }
      });
    });
  }
  
  // Run immediately if DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(fixAllButtons, 100);
      setTimeout(fixAllButtons, 500);
      setTimeout(fixAllButtons, 1000);
    });
  } else {
    setTimeout(fixAllButtons, 100);
    setTimeout(fixAllButtons, 500);
    setTimeout(fixAllButtons, 1000);
  }
  
  // Watch for new buttons being added
  const observer = new MutationObserver(function(mutations) {
    let shouldFix = false;
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeType === 1) {
          if (node.matches && node.matches('[data-node-type="commerce-add-to-cart-button"]')) {
            shouldFix = true;
          } else if (node.querySelector && node.querySelector('[data-node-type="commerce-add-to-cart-button"]')) {
            shouldFix = true;
          }
        }
      });
    });
    
    if (shouldFix) {
      console.log('🔧 Button Click Fix: New buttons detected, fixing...');
      setTimeout(fixAllButtons, 100);
    }
  });
  
  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  // Also intercept at document level (most aggressive)
  document.addEventListener('mousedown', function(e) {
    const button = e.target.closest('[data-node-type="commerce-add-to-cart-button"]') ||
                   (e.target.matches && e.target.matches('[data-node-type="commerce-add-to-cart-button"]') ? e.target : null);
    
    if (button) {
      console.log('🎯 Button Click Fix: MOUSEDOWN intercepted on button!');
      const form = button.closest('[data-node-type="commerce-add-to-cart-form"]');
      if (form) {
        const productId = form.getAttribute('data-wf-product-id');
        const variantId = form.getAttribute('data-wf-variant-id');
        
        if (productId && variantId) {
          // Prevent default immediately
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          
          // Trigger our handler
          setTimeout(() => {
            const quantityInput = form.querySelector('input[name="commerce-add-to-cart-quantity-input"]') ||
                                  form.querySelector('input.q-num') ||
                                  form.querySelector('input[type="number"]');
            const quantity = quantityInput ? parseInt(quantityInput.value, 10) || 1 : 1;
            
            if (window.CartManager) {
              const success = window.CartManager.addToCart(productId, variantId, quantity);
              if (success) {
                console.log('✅ Button Click Fix: Item added via mousedown (cart will open automatically)');
              }
            }
          }, 10);
        }
      }
    }
  }, true); // Capture phase - runs FIRST
  
  console.log('✅ Button Click Fix: Initialized');
})();
