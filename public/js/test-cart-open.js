/**
 * Test Cart Opening
 * Run this in console: testCartOpen()
 */

window.testCartOpen = function() {
  console.log('%c🧪 TESTING CART OPENING...', 'color: orange; font-weight: bold; font-size: 16px;');
  
  // Step 1: Check if cart elements exist
  console.group('1️⃣ Checking Cart Elements');
  const cartWrappers = document.querySelectorAll('[data-node-type="commerce-cart-wrapper"]');
  const cartContainers = document.querySelectorAll('[data-node-type="commerce-cart-container-wrapper"]');
  const cartOpenLinks = document.querySelectorAll('[data-node-type="commerce-cart-open-link"]');
  
  console.log('Cart wrappers found:', cartWrappers.length);
  console.log('Cart containers found:', cartContainers.length);
  console.log('Cart open links found:', cartOpenLinks.length);
  
  if (cartWrappers.length === 0) {
    console.error('❌ No cart wrappers found!');
    console.groupEnd();
    return;
  }
  
  if (cartContainers.length === 0) {
    console.error('❌ No cart containers found!');
    console.groupEnd();
    return;
  }
  
  if (cartOpenLinks.length === 0) {
    console.error('❌ No cart open links found!');
    console.groupEnd();
    return;
  }
  console.groupEnd();
  
  // Step 2: Check visibility
  console.group('2️⃣ Checking Visibility');
  cartWrappers.forEach((wrapper, i) => {
    const style = window.getComputedStyle(wrapper);
    console.log(`Wrapper ${i}:`, {
      display: style.display,
      visibility: style.visibility,
      opacity: style.opacity
    });
  });
  
  cartContainers.forEach((container, i) => {
    const style = window.getComputedStyle(container);
    console.log(`Container ${i}:`, {
      display: style.display,
      visibility: style.visibility,
      opacity: style.opacity,
      inlineStyle: container.style.display
    });
  });
  console.groupEnd();
  
  // Step 3: Try to open cart
  console.group('3️⃣ Attempting to Open Cart');
  
  // Method 1: Click the cart icon
  console.log('Method 1: Clicking cart icon...');
  if (cartOpenLinks.length > 0) {
    const firstLink = cartOpenLinks[0];
    console.log('Clicking link:', firstLink);
    firstLink.click();
    
    setTimeout(() => {
      const container = cartContainers[0];
      if (container) {
        const style = window.getComputedStyle(container);
        console.log('After click - Container display:', style.display);
        if (style.display === 'none') {
          console.warn('⚠️ Container still hidden after click');
        }
      }
    }, 200);
  }
  
  // Method 2: Force show container
  setTimeout(() => {
    console.log('Method 2: Force showing container...');
    cartContainers.forEach((container, i) => {
      container.style.display = 'block';
      container.style.visibility = 'visible';
      container.style.opacity = '1';
      container.style.position = 'fixed';
      container.style.right = '0';
      container.style.top = '0';
      container.style.width = '400px';
      container.style.height = '100vh';
      container.style.backgroundColor = '#fff';
      container.style.zIndex = '9999';
      container.style.boxShadow = '-2px 0 10px rgba(0,0,0,0.1)';
      
      console.log(`Container ${i} forced visible`);
    });
  }, 500);
  
  // Method 3: Check if Webflow classes are needed
  setTimeout(() => {
    console.log('Method 3: Checking Webflow classes...');
    cartContainers.forEach((container, i) => {
      console.log(`Container ${i} classes:`, container.className);
      
      // Try adding Webflow cart open class
      if (container.classList) {
        container.classList.add('w-commerce-commercecartopen');
        console.log('Added w-commerce-commercecartopen class');
      }
    });
    
    cartWrappers.forEach((wrapper, i) => {
      if (wrapper.classList) {
        wrapper.classList.add('w-commerce-commercecartopen');
        console.log(`Wrapper ${i} added w-commerce-commercecartopen class`);
      }
    });
  }, 700);
  
  console.groupEnd();
  
  // Step 4: Final check
  setTimeout(() => {
    console.group('4️⃣ Final Status Check');
    cartContainers.forEach((container, i) => {
      const style = window.getComputedStyle(container);
      const rect = container.getBoundingClientRect();
      console.log(`Container ${i} final state:`, {
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
        position: style.position,
        right: style.right,
        width: style.width,
        height: style.height,
        visible: rect.width > 0 && rect.height > 0,
        boundingRect: rect
      });
    });
    console.groupEnd();
    
    console.log('%c✅ TEST COMPLETE', 'color: green; font-weight: bold; font-size: 14px;');
    console.log('Check the container states above. If display is still "none", the cart HTML might be missing or CSS is hiding it.');
  }, 1000);
};

console.log('%c📋 Cart Test Function Loaded', 'color: blue; font-weight: bold;');
console.log('Run testCartOpen() in the console to test cart opening');
