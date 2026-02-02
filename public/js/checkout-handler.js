/**
 * Checkout Handler
 * Handles checkout form interactions, customer type display, and order capture
 * Works in conjunction with OrderManager to save orders
 */

(function() {
  'use strict';

  /**
   * Display customer type on checkout page
   */
  function displayCustomerType() {
    try {
      const customerType = localStorage.getItem('customerType') || 'individual';
      const displayEl = document.getElementById('customerTypeDisplay');
      const companyField = document.getElementById('companyField');
      const gstField = document.getElementById('gstField');
      const countrySelect = document.querySelector('.w-commerce-commercecheckoutshippingcountryselector');
      
      // Display customer type text
      if (displayEl) {
        const typeText = customerType === 'professional' 
          ? 'Architecture & Professional' 
          : 'Individual Property';
        displayEl.textContent = typeText;
      }
      
      // Show/hide professional fields based on customer type
      if (customerType === 'professional') {
        if (companyField) {
          companyField.style.display = 'block';
        }
        
        // Show GST field only if country is India
        if (gstField && countrySelect) {
          if (countrySelect.value === 'IN') {
            gstField.style.display = 'block';
          } else {
            gstField.style.display = 'none';
          }
        }
      } else {
        // Hide professional fields for individual customers
        if (companyField) {
          companyField.style.display = 'none';
        }
        if (gstField) {
          gstField.style.display = 'none';
        }
      }
      
      // Watch for country changes to show/hide GST field
      if (countrySelect && customerType === 'professional') {
        // Remove existing listener if any (to avoid duplicates)
        const newSelect = countrySelect.cloneNode(true);
        countrySelect.parentNode.replaceChild(newSelect, countrySelect);
        
        newSelect.addEventListener('change', function() {
          const gstFieldEl = document.getElementById('gstField');
          if (gstFieldEl) {
            if (this.value === 'IN') {
              gstFieldEl.style.display = 'block';
            } else {
              gstFieldEl.style.display = 'none';
            }
          }
        });
      }
    } catch (error) {
      console.error('Checkout Handler: Error displaying customer type:', error);
    }
  }

  /**
   * Extract form data from checkout form
   * @param {HTMLElement} form - Form element
   * @returns {Object} Form data object
   */
  function extractFormData(form) {
    try {
      const formData = new FormData(form);
      
      return {
        email: formData.get('email') || '',
        phone: formData.get('phone') || '',
        name: formData.get('name') || '',
        address: {
          line1: formData.get('address_line1') || '',
          line2: formData.get('address_line2') || '',
          city: formData.get('address_city') || '',
          state: formData.get('address_state') || '',
          zip: formData.get('address_zip') || '',
          country: formData.get('address_country') || ''
        },
        company: formData.get('company') || '',
        gst_vat: formData.get('gst_vat') || ''
      };
    } catch (error) {
      console.error('Checkout Handler: Error extracting form data:', error);
      return null;
    }
  }

  /**
   * Handle order submission - save order to localStorage
   * This is non-blocking and doesn't interfere with Webflow Commerce
   */
  function handleOrderSubmission(e) {
    try {
      // Find the checkout form container
      const form = e.target.closest('[data-node-type="commerce-checkout-form-container"]') ||
                   e.target.closest('form');
      
      if (!form) {
        return; // Not our form, let it proceed normally
      }

      // Check if this is the checkout form
      const isCheckoutForm = form.querySelector('[data-node-type="commerce-checkout-place-order-button"]') ||
                             form.querySelector('.w-commerce-commercecheckoutplaceorderbutton');
      
      if (!isCheckoutForm) {
        return; // Not the checkout form, let it proceed
      }

      // Extract form data
      const orderData = extractFormData(form);
      
      if (!orderData) {
        console.warn('Checkout Handler: Could not extract form data');
        return; // Don't block submission
      }

      // Save order locally (non-blocking)
      if (window.OrderManager) {
        // Use setTimeout to ensure this doesn't block Webflow Commerce submission
        setTimeout(function() {
          try {
            const savedOrder = window.OrderManager.saveOrder(orderData);
            if (savedOrder) {
              console.log('Checkout Handler: Order saved successfully', savedOrder.id);
            } else {
              console.warn('Checkout Handler: Failed to save order');
            }
          } catch (error) {
            console.error('Checkout Handler: Error saving order:', error);
            // Don't throw - we don't want to block the form submission
          }
        }, 100);
      } else {
        console.warn('Checkout Handler: OrderManager not available');
      }
    } catch (error) {
      console.error('Checkout Handler: Error handling order submission:', error);
      // Don't block form submission - let Webflow Commerce handle it
    }
  }

  /**
   * Initialize checkout handler
   */
  function init() {
    // Display customer type when page loads
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        // Small delay to ensure form fields are rendered
        setTimeout(displayCustomerType, 100);
      });
    } else {
      // Page already loaded
      setTimeout(displayCustomerType, 100);
    }

    // Listen for form submission (capture phase to catch early)
    // Use capture phase but don't prevent default - let Webflow Commerce handle payment
    document.addEventListener('submit', function(e) {
      handleOrderSubmission(e);
    }, true); // Capture phase

    // Also listen for place order button clicks as backup
    document.addEventListener('click', function(e) {
      const placeOrderButton = e.target.closest('[data-node-type="commerce-checkout-place-order-button"]') ||
                               e.target.closest('.w-commerce-commercecheckoutplaceorderbutton');
      
      if (placeOrderButton) {
        // Small delay to let form submission happen first
        setTimeout(function() {
          const form = placeOrderButton.closest('[data-node-type="commerce-checkout-form-container"]') ||
                       placeOrderButton.closest('form');
          if (form) {
            handleOrderSubmission({ target: placeOrderButton });
          }
        }, 200);
      }
    }, true);
  }

  // Initialize
  init();
  
  console.log('Checkout Handler: Initialized');
})();
