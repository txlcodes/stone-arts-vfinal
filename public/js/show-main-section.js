/**
 * Show Main Product Section
 * Run this in console: showMainSection()
 */

window.showMainSection = function() {
  console.log('%c🔍 SHOWING MAIN PRODUCT SECTION...', 'color: blue; font-weight: bold; font-size: 16px;');
  
  const mainProductSectionId = 'w-node-_116c2318-c33b-dcc5-4ef0-b6d435cfdf0e-d3e03b91';
  const mainSection = document.getElementById(mainProductSectionId);
  
  if (!mainSection) {
    console.error('❌ Main section not found!');
    console.log('Available product_text_wrapper sections:');
    document.querySelectorAll('.product_text_wrapper').forEach((s, i) => {
      console.log(`  ${i}: ID="${s.id || 'no-id'}", display="${window.getComputedStyle(s).display}"`);
    });
    return;
  }
  
  console.log('✅ Found main section');
  
  // Show main section
  mainSection.style.display = 'block';
  mainSection.style.visibility = 'visible';
  mainSection.style.opacity = '1';
  mainSection.style.height = 'auto';
  mainSection.style.minHeight = 'auto';
  mainSection.style.position = 'relative';
  
  console.log('✅ Set main section styles');
  
  // Show parent section
  const parentSection = mainSection.closest('section.product, .section.product');
  if (parentSection) {
    parentSection.style.display = 'block';
    parentSection.style.visibility = 'visible';
    console.log('✅ Made parent section visible');
  }
  
  // Show all parent containers
  let parent = mainSection.parentElement;
  let depth = 0;
  while (parent && depth < 10) {
    const parentStyle = window.getComputedStyle(parent);
    if (parentStyle.display === 'none') {
      parent.style.display = '';
      parent.style.visibility = 'visible';
      console.log(`✅ Made parent visible (depth ${depth}):`, parent.className || parent.tagName);
    }
    parent = parent.parentElement;
    depth++;
  }
  
  // Final check
  setTimeout(() => {
    const finalStyle = window.getComputedStyle(mainSection);
    const rect = mainSection.getBoundingClientRect();
    console.log('Final status:', {
      display: finalStyle.display,
      visibility: finalStyle.visibility,
      opacity: finalStyle.opacity,
      width: rect.width,
      height: rect.height,
      visible: rect.width > 0 && rect.height > 0
    });
    
    if (rect.width > 0 && rect.height > 0) {
      console.log('%c✅ MAIN SECTION IS NOW VISIBLE!', 'color: green; font-weight: bold;');
    } else {
      console.error('%c❌ Main section still not visible!', 'color: red; font-weight: bold;');
    }
  }, 200);
};

console.log('%c📋 showMainSection() function loaded', 'color: blue; font-weight: bold;');
console.log('Run showMainSection() in console to manually show the main product section');
