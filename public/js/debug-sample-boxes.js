/**
 * Sample Boxes Diagnostic Script
 * Run this in browser console to diagnose why sample boxes aren't showing
 */

(function() {
  'use strict';
  
  console.log('🔍 ========== SAMPLE BOXES DIAGNOSTIC ==========');
  
  // 1. Check localStorage
  console.log('\n1️⃣ Checking localStorage...');
  const stored = localStorage.getItem('stonearts_cms_data');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      const sampleBoxes = parsed.products?.filter(p => 
        p.category === 'AKUROCK Muster' || p.id?.includes('-sample')
      ) || [];
      console.log('✅ localStorage has data');
      console.log('   Total products:', parsed.products?.length || 0);
      console.log('   Sample boxes:', sampleBoxes.length);
      console.log('   Sample box IDs:', sampleBoxes.map(s => s.id));
    } catch (e) {
      console.error('❌ localStorage data is corrupted:', e);
    }
  } else {
    console.log('⚠️ No data in localStorage');
  }
  
  // 2. Check JSON file
  console.log('\n2️⃣ Checking JSON file...');
  fetch('/data/mock-cms-data.json')
    .then(response => {
      console.log('   Response status:', response.status, response.statusText);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const sampleBoxes = data.products?.filter(p => 
        p.category === 'AKUROCK Muster' || p.id?.includes('-sample')
      ) || [];
      console.log('✅ JSON file accessible');
      console.log('   Total products:', data.products?.length || 0);
      console.log('   Sample boxes:', sampleBoxes.length);
      console.log('   Sample box IDs:', sampleBoxes.map(s => s.id));
      console.log('   Sample box names:', sampleBoxes.map(s => s.name));
    })
    .catch(error => {
      console.error('❌ JSON file not accessible:', error);
    });
  
  // 3. Check container
  console.log('\n3️⃣ Checking container...');
  const container = document.querySelector('#sample-boxes-grid-container') ||
                    document.querySelector('[bind="59ce43f0-84b9-aae1-9f05-2619e4974db1"]') ||
                    document.querySelector('.sample-grid.w-dyn-items');
  if (container) {
    console.log('✅ Container found:', container);
    console.log('   Container visible?', window.getComputedStyle(container).display !== 'none');
    console.log('   Container children:', container.children.length);
    console.log('   Items with data-product-id:', container.querySelectorAll('[data-product-id]').length);
  } else {
    console.error('❌ Container NOT FOUND!');
    console.log('   Available .w-dyn-items:', document.querySelectorAll('.w-dyn-items').length);
  }
  
  // 4. Check if function is called
  console.log('\n4️⃣ Checking if populateSampleBoxesPage was called...');
  console.log('   Check console for "populate-cms.js: Populating sample boxes page..." message');
  
  // 5. Check cmsData global
  console.log('\n5️⃣ Checking global cmsData...');
  if (window.cmsData) {
    const sampleBoxes = window.cmsData.products?.filter(p => 
      p.category === 'AKUROCK Muster' || p.id?.includes('-sample')
    ) || [];
    console.log('✅ window.cmsData exists');
    console.log('   Total products:', window.cmsData.products?.length || 0);
    console.log('   Sample boxes:', sampleBoxes.length);
  } else {
    console.error('❌ window.cmsData does NOT exist');
  }
  
  // 6. Manual fix function
  console.log('\n6️⃣ To force reload from JSON, run:');
  console.log('   window.reloadCMSData()');
  console.log('   OR');
  console.log('   localStorage.clear(); location.reload();');
  
  console.log('\n🔍 ========== END DIAGNOSTIC ==========');
})();
