/**
 * Admin Panel Logic
 * 
 * Handles all UI interactions, form handling, validation, and user interactions
 * for the admin panel. Works in conjunction with AdminDataManager for data operations.
 */

(function() {
  'use strict';

  // Admin Panel State
  const AdminPanel = {
    currentSection: 'dashboard',
    currentEditingProduct: null,
    currentEditingAccessory: null,
    currentEditingSampleBox: null,
    cmsData: null
  };

  /**
   * Initialize admin panel
   */
  async function init() {
    console.log('AdminPanel: Initializing...');
    
    // Wait for AdminDataManager to be available
    if (!window.AdminDataManager) {
      console.error('AdminPanel: AdminDataManager not found. Waiting...');
      // Wait a bit and try again
      setTimeout(() => {
        if (!window.AdminDataManager) {
          document.body.innerHTML = `
            <div style="padding: 2rem; text-align: center; font-family: Arial, sans-serif;">
              <h1 style="color: #dc3545;">Error Loading Admin Panel</h1>
              <p>AdminDataManager script failed to load. Please check:</p>
              <ul style="text-align: left; display: inline-block;">
                <li>admin/admin-data-manager.js file exists</li>
                <li>Browser console for errors</li>
                <li>File paths are correct</li>
              </ul>
              <p style="margin-top: 1rem;"><a href="admin.html" style="color: #0d0d0d;">Reload Page</a></p>
            </div>
          `;
          return;
        }
        init();
      }, 100);
      return;
    }
    
    // Check if user is logged in
    if (!checkAuth()) {
      showLoginPage();
      return;
    }

    // Load CMS data
    try {
      AdminPanel.cmsData = await window.AdminDataManager.loadCMSData();
      console.log('AdminPanel: CMS data loaded', AdminPanel.cmsData);
    } catch (error) {
      console.error('AdminPanel: Failed to load CMS data:', error);
      document.body.innerHTML = `
        <div style="padding: 2rem; text-align: center; font-family: Arial, sans-serif;">
          <h1 style="color: #dc3545;">Error Loading CMS Data</h1>
          <p>${error.message || 'Unknown error occurred'}</p>
          <p style="margin-top: 1rem;"><a href="admin.html" style="color: #0d0d0d;">Reload Page</a></p>
        </div>
      `;
      return;
    }

    // Show dashboard
    showDashboard();
    
    // Attach event listeners
    attachEventListeners();
    
    // Listen for data updates from frontend (real-time sync)
    window.addEventListener('cmsDataUpdated', function(event) {
      console.log('AdminPanel: Received data update event from frontend');
      if (event.detail && AdminPanel.cmsData) {
        AdminPanel.cmsData = event.detail;
        // Refresh current view if needed
        if (AdminPanel.currentSection === 'products') {
          renderProductsList();
        } else if (AdminPanel.currentSection === 'accessories') {
          renderAccessoriesList();
        } else if (AdminPanel.currentSection === 'sampleBoxes') {
          renderSampleBoxesList();
        }
        updateDashboardStats();
      }
    });
    
    console.log('AdminPanel: Initialized successfully');
  }

  /**
   * Check authentication status
   */
  function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('admin_logged_in') === 'true';
    return isLoggedIn;
  }

  /**
   * Show login page
   */
  function showLoginPage() {
    // Remove loading indicator if present
    const loading = document.getElementById('admin-loading');
    if (loading) loading.remove();
    
    document.body.innerHTML = `
      <div class="admin-login-container">
        <div class="admin-login-box">
          <h1 class="admin-login-title">🔐 Admin Login</h1>
          <p class="admin-login-subtitle">stonearts® Content Management System</p>
          <form id="adminLoginForm">
            <div class="admin-form-group">
              <label class="admin-form-label" for="adminUsername">👤 Username</label>
              <input type="text" id="adminUsername" class="admin-form-input" required autocomplete="username" placeholder="Enter admin username">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label" for="adminPassword">🔒 Password</label>
              <input type="password" id="adminPassword" class="admin-form-input" required autocomplete="current-password" placeholder="Enter password">
            </div>
            <div class="admin-error-message" id="loginError"></div>
            <button type="submit" class="admin-btn">🚀 Login</button>
          </form>
        </div>
      </div>
    `;

    // Attach login form handler
    document.getElementById('adminLoginForm').addEventListener('submit', handleLogin);
  }

  /**
   * Handle login form submission
   */
  function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value.trim();
    const errorEl = document.getElementById('loginError');
    
    // Simple authentication (admin/admin)
    if (username === 'admin' && password === 'admin') {
      sessionStorage.setItem('admin_logged_in', 'true');
      errorEl.classList.remove('show');
      // Reload to show dashboard
      location.reload();
    } else {
      errorEl.textContent = 'Invalid username or password';
      errorEl.classList.add('show');
    }
  }

  /**
   * Show dashboard
   */
  function showDashboard() {
    // Remove loading indicator if present
    const loading = document.getElementById('admin-loading');
    if (loading) loading.remove();
    
    const meta = window.AdminDataManager.getMetadata();
    const lastUpdated = meta ? new Date(meta.lastUpdated).toLocaleString() : 'Never';
    
    document.body.className = 'admin-panel';
    document.body.innerHTML = `
      <div class="admin-container">
        <header class="admin-header">
          <h1 class="admin-header-title">stonearts® Admin Panel</h1>
          <div class="admin-header-actions">
            <button class="admin-btn-secondary" id="exportBtn" title="Export all data as JSON file">📥 Export</button>
            <button class="admin-btn-secondary" id="importBtn" title="Import data from JSON file">📤 Import</button>
            <button class="admin-btn-secondary" id="resetBtn" title="Reset all data to default">🔄 Reset</button>
            <button class="admin-btn-secondary" id="logoutBtn" title="Logout from admin panel">🚪 Logout</button>
          </div>
        </header>
        
        <main class="admin-main">
          <!-- Navigation Tabs -->
          <nav class="admin-nav">
            <button class="admin-nav-item active" data-section="dashboard" onclick="AdminPanel.showSection('dashboard')">📊 Dashboard</button>
            <button class="admin-nav-item" data-section="products" onclick="AdminPanel.showSection('products')">🛍️ Products</button>
            <button class="admin-nav-item" data-section="accessories" onclick="AdminPanel.showSection('accessories')">🔧 Accessories</button>
            <button class="admin-nav-item" data-section="sampleBoxes" onclick="AdminPanel.showSection('sampleBoxes')">📦 Sample Boxes</button>
            <button class="admin-nav-item" data-section="orders" onclick="AdminPanel.showSection('orders')">📋 Orders</button>
          </nav>

          <!-- Dashboard Section -->
          <section class="admin-section active" id="dashboardSection">
            <div class="admin-overview">
              <div class="admin-card">
                <div class="admin-card-title">Total Products</div>
                <div class="admin-card-value" id="totalProducts">0</div>
                <div class="admin-card-meta">Active products</div>
              </div>
              <div class="admin-card">
                <div class="admin-card-title">Total Accessories</div>
                <div class="admin-card-value" id="totalAccessories">0</div>
                <div class="admin-card-meta">Available accessories</div>
              </div>
              <div class="admin-card">
                <div class="admin-card-title">Total Orders</div>
                <div class="admin-card-value" id="totalOrders">0</div>
                <div class="admin-card-meta">All orders</div>
              </div>
              <div class="admin-card">
                <div class="admin-card-title">Pending Orders</div>
                <div class="admin-card-value" id="pendingOrders">0</div>
                <div class="admin-card-meta">Awaiting processing</div>
              </div>
              <div class="admin-card">
                <div class="admin-card-title">Last Updated</div>
                <div class="admin-card-value" style="font-size: 1.25rem;" id="lastUpdated">${lastUpdated}</div>
                <div class="admin-card-meta">Data modification time</div>
              </div>
            </div>
            
            <div class="admin-card">
              <h2 class="admin-section-title">Quick Actions</h2>
              <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1rem;">
                <button class="admin-btn" onclick="AdminPanel.showSection('products')">Manage Products</button>
                <button class="admin-btn-secondary" onclick="AdminPanel.showSection('accessories')">Manage Accessories</button>
              </div>
            </div>
          </section>

          <!-- Products Section -->
          <section class="admin-section" id="productsSection">
            <div class="admin-section-header">
              <h2 class="admin-section-title">🛍️ Products</h2>
              <button class="admin-btn" id="addProductBtn" onclick="AdminPanel.addProduct()">➕ Add New Product</button>
            </div>
            <div id="productsList"></div>
          </section>

          <!-- Accessories Section -->
          <section class="admin-section" id="accessoriesSection">
            <div class="admin-section-header">
              <h2 class="admin-section-title">🔧 Accessories</h2>
              <button class="admin-btn" id="addAccessoryBtn" onclick="AdminPanel.addAccessory()">➕ Add New Accessory</button>
            </div>
            <div id="accessoriesList"></div>
          </section>

          <!-- Sample Boxes Section -->
          <section class="admin-section" id="sampleBoxesSection">
            <div class="admin-section-header">
              <h2 class="admin-section-title">📦 Sample Boxes</h2>
              <button class="admin-btn" id="addSampleBoxBtn" onclick="AdminPanel.addSampleBox()">➕ Add New Sample Box</button>
            </div>
            <div id="sampleBoxesList"></div>
          </section>

          <!-- Orders Section -->
          <section class="admin-section" id="ordersSection">
            <div class="admin-section-header">
              <h2 class="admin-section-title">📋 Orders</h2>
              <button class="admin-btn-secondary" id="exportOrdersBtn" onclick="AdminPanel.exportOrders()">📥 Export Orders</button>
            </div>
            <div id="ordersList"></div>
          </section>
        </main>

        <!-- Modal Overlay -->
        <div class="admin-modal-overlay" id="modalOverlay">
          <div class="admin-modal" id="modalContent"></div>
        </div>

        <!-- Notification Container -->
        <div class="admin-notification" id="notification"></div>
      </div>
    `;

    // Update dashboard stats
    updateDashboardStats();
    
    // Render lists
    renderProductsList();
    renderAccessoriesList();
  }

  /**
   * Update dashboard statistics
   */
  function updateDashboardStats() {
    if (!AdminPanel.cmsData) return;
    
    // Combine products and samples arrays (matching frontend logic)
    const allProducts = [
      ...(AdminPanel.cmsData.products || []),
      ...(AdminPanel.cmsData.samples || []) // Include samples array if it exists
    ];
    
    // Filter main products (exclude sample boxes) - matching frontend logic
    const productsCount = allProducts.filter(p => {
      if (!p) return false;
      return p.category === 'AKUROCK Akustikpaneele' && 
             !(p.id && p.id.includes('-sample')) &&
             p.category !== 'AKUROCK Muster';
    }).length;
    
    const accessoriesCount = AdminPanel.cmsData.accessories ? AdminPanel.cmsData.accessories.length : 0;
    
    // Filter sample boxes - matching frontend logic exactly
    const sampleBoxesCount = allProducts.filter(p => {
      if (!p) return false;
      return p.category === 'AKUROCK Muster' || 
             (p.id && p.id.includes('-sample')) || 
             (p.name && p.name.toLowerCase().includes('sample'));
    }).length;
    
    const productsEl = document.getElementById('totalProducts');
    const accessoriesEl = document.getElementById('totalAccessories');
    const sampleBoxesEl = document.getElementById('totalSampleBoxes');
    const totalOrdersEl = document.getElementById('totalOrders');
    const pendingOrdersEl = document.getElementById('pendingOrders');
    
    if (productsEl) productsEl.textContent = productsCount;
    if (accessoriesEl) accessoriesEl.textContent = accessoriesCount;
    if (sampleBoxesEl) sampleBoxesEl.textContent = sampleBoxesCount;
    
    // Update order statistics if OrderManager is available
    if (window.OrderManager && totalOrdersEl && pendingOrdersEl) {
      try {
        const stats = window.OrderManager.getStatistics();
        totalOrdersEl.textContent = stats.total;
        pendingOrdersEl.textContent = stats.pending;
      } catch (error) {
        console.error('AdminPanel: Error getting order statistics:', error);
        if (totalOrdersEl) totalOrdersEl.textContent = '0';
        if (pendingOrdersEl) pendingOrdersEl.textContent = '0';
      }
    }
  }

  /**
   * Show section (dashboard, products, accessories)
   */
  AdminPanel.showSection = function(section) {
    // Map section names to IDs
    const sectionMap = {
      'dashboard': 'dashboardSection',
      'products': 'productsSection',
      'accessories': 'accessoriesSection',
      'sampleBoxes': 'sampleBoxesSection',
      'sample-boxes': 'sampleBoxesSection'
    };
    
    const sectionId = sectionMap[section] || `${section}Section`;
    
    // Update nav
    document.querySelectorAll('.admin-nav-item').forEach(item => {
      item.classList.remove('active');
      const itemSection = item.dataset.section || item.getAttribute('data-section');
      if (itemSection === section || itemSection === section.replace(/([A-Z])/g, '-$1').toLowerCase()) {
        item.classList.add('active');
      }
    });

    // Update sections
    document.querySelectorAll('.admin-section').forEach(sec => {
      sec.classList.remove('active');
    });

    // Reload data when switching sections to ensure sync with frontend
    if (window.AdminDataManager) {
      window.AdminDataManager.loadCMSData().then(data => {
        AdminPanel.cmsData = data;
        
        const sectionEl = document.getElementById(sectionId);
        if (sectionEl) {
          sectionEl.classList.add('active');
          AdminPanel.currentSection = section;
          
          // Render lists if needed
          if (section === 'products' || sectionId === 'productsSection') {
            renderProductsList();
          } else if (section === 'accessories' || sectionId === 'accessoriesSection') {
            renderAccessoriesList();
          } else if (section === 'sampleBoxes' || section === 'sample-boxes' || sectionId === 'sampleBoxesSection') {
            if (typeof renderSampleBoxesList === 'function') {
              renderSampleBoxesList();
            }
          } else if (section === 'orders' || sectionId === 'ordersSection') {
            if (typeof renderOrdersList === 'function') {
              renderOrdersList();
            }
          } else if (section === 'dashboard' || sectionId === 'dashboardSection') {
            updateDashboardStats();
          }
        }
      }).catch(error => {
        console.error('AdminPanel: Error reloading data:', error);
        // Fallback to original behavior if reload fails
        const sectionEl = document.getElementById(sectionId);
        if (sectionEl) {
          sectionEl.classList.add('active');
          AdminPanel.currentSection = section;
          if (section === 'products' || sectionId === 'productsSection') {
            renderProductsList();
          } else if (section === 'accessories' || sectionId === 'accessoriesSection') {
            renderAccessoriesList();
          } else if (section === 'sampleBoxes' || section === 'sample-boxes' || sectionId === 'sampleBoxesSection') {
            if (typeof renderSampleBoxesList === 'function') {
              renderSampleBoxesList();
            }
          } else if (section === 'orders' || sectionId === 'ordersSection') {
            if (typeof renderOrdersList === 'function') {
              renderOrdersList();
            }
          }
        }
      });
    } else {
      // Fallback if AdminDataManager not available
      const sectionEl = document.getElementById(sectionId);
      if (sectionEl) {
        sectionEl.classList.add('active');
        AdminPanel.currentSection = section;
        if (section === 'products' || sectionId === 'productsSection') {
          renderProductsList();
        } else if (section === 'accessories' || sectionId === 'accessoriesSection') {
          renderAccessoriesList();
        } else if (section === 'sampleBoxes' || section === 'sample-boxes' || sectionId === 'sampleBoxesSection') {
          if (typeof renderSampleBoxesList === 'function') {
            renderSampleBoxesList();
          }
        }
      }
    }
  };

  /**
   * Render products list
   */
  function renderProductsList() {
    const container = document.getElementById('productsList');
    if (!container || !AdminPanel.cmsData) return;

    // Combine products and samples arrays
    const allProducts = [
      ...(AdminPanel.cmsData.products || []),
      ...(AdminPanel.cmsData.samples || [])
    ];

    // Filter to only main products (exclude sample boxes) - matching frontend
    const mainProducts = allProducts.filter(p => {
      if (!p) return false;
      return p.category === 'AKUROCK Akustikpaneele' && 
             !(p.id && p.id.includes('-sample')) &&
             p.category !== 'AKUROCK Muster';
    });

    if (mainProducts.length === 0) {
      container.innerHTML = `
        <div class="admin-empty-state">
          <div class="admin-empty-state-icon">📦</div>
          <h3 class="admin-empty-state-title">No Products Yet</h3>
          <p class="admin-empty-state-text">Get started by adding your first product to the catalog.</p>
          <button class="admin-btn" onclick="AdminPanel.addProduct()" style="margin-top: 1rem;">➕ Add Your First Product</button>
        </div>
      `;
      return;
    }

    const html = `
      <div class="admin-table">
        <div class="admin-table-header">
          <div>Product</div>
          <div>Price</div>
          <div>Category</div>
          <div>Actions</div>
        </div>
        ${mainProducts.map(product => `
          <div class="admin-table-row">
            <div class="admin-table-cell">
              ${product.mainImage ? `<img src="${product.mainImage}" alt="${product.name}" class="admin-table-image">` : ''}
              <div>
                <div class="admin-table-name">${product.name || 'Unnamed Product'}</div>
                <div class="admin-text-small admin-text-muted">${product.slug || ''}</div>
              </div>
            </div>
            <div class="admin-table-price">${product.price || 'N/A'}</div>
            <div class="admin-table-category">${product.category || 'N/A'}</div>
            <div class="admin-table-actions">
              <button class="admin-btn-small admin-btn-edit" onclick="AdminPanel.editProduct('${product.id}')">Edit</button>
              <button class="admin-btn-small admin-btn-delete" onclick="AdminPanel.deleteProduct('${product.id}')">Delete</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    container.innerHTML = html;
  }

  /**
   * Render accessories list
   */
  function renderAccessoriesList() {
    const container = document.getElementById('accessoriesList');
    if (!container || !AdminPanel.cmsData || !AdminPanel.cmsData.accessories) return;

    if (AdminPanel.cmsData.accessories.length === 0) {
      container.innerHTML = `
        <div class="admin-empty-state">
          <div class="admin-empty-state-icon">🔧</div>
          <h3 class="admin-empty-state-title">No Accessories Yet</h3>
          <p class="admin-empty-state-text">Start adding accessories to complement your products.</p>
          <button class="admin-btn" onclick="AdminPanel.addAccessory()" style="margin-top: 1rem;">➕ Add Your First Accessory</button>
        </div>
      `;
      return;
    }

    const html = `
      <div class="admin-table">
        <div class="admin-table-header">
          <div>Accessory</div>
          <div>Price</div>
          <div>Category</div>
          <div>Actions</div>
        </div>
        ${AdminPanel.cmsData.accessories.map(accessory => `
          <div class="admin-table-row">
            <div class="admin-table-cell">
              ${accessory.mainImage ? `<img src="${accessory.mainImage}" alt="${accessory.name}" class="admin-table-image">` : ''}
              <div>
                <div class="admin-table-name">${accessory.name || 'Unnamed Accessory'}</div>
                <div class="admin-text-small admin-text-muted">${accessory.slug || ''}</div>
              </div>
            </div>
            <div class="admin-table-price">${accessory.price || 'N/A'}</div>
            <div class="admin-table-category">${accessory.category || 'N/A'}</div>
            <div class="admin-table-actions">
              <button class="admin-btn-small admin-btn-edit" onclick="AdminPanel.editAccessory('${accessory.id}')" title="Edit accessory">✏️ Edit</button>
              <button class="admin-btn-small admin-btn-delete" onclick="AdminPanel.deleteAccessory('${accessory.id}')" title="Delete accessory">🗑️ Delete</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    container.innerHTML = html;
  }

  /**
   * Show product edit form
   */
  AdminPanel.editProduct = function(productId) {
    const product = AdminPanel.cmsData.products.find(p => p.id === productId);
    if (!product) {
      showNotification('Product not found', 'error');
      return;
    }

    AdminPanel.currentEditingProduct = product;
    showProductForm(product);
  };

  /**
   * Show new product form
   */
  AdminPanel.addProduct = function() {
    // Create empty product template
    const newProduct = {
      id: '',
      productId: '',
      variantId: '',
      name: '',
      slug: '',
      handle: '',
      type: 'Physical',
      description: '',
      stone: '',
      alt_text: '',
      category: 'AKUROCK Akustikpaneele',
      price: '',
      priceValue: 0,
      currency: 'EUR',
      mainImage: '',
      special_image: '',
      special_image_2: '',
      hover_image: '',
      hover_image_installation: '',
      selection_slider_image: '',
      images: [],
      color: '',
      button_header_color: '',
      special_field_slogan: '',
      special_field_text: '',
      special_field_button: '',
      item_style: 'Tall',
      sorting: 999,
      video: null,
      dimensions: '',
      size: '',
      area: '',
      weight: null,
      width: null,
      height: null,
      length: null,
      variant: {
        weight: null,
        width: null,
        height: null,
        length: null,
        download_files: []
      },
      deliveryTime: '5-10 days',
      requiresShipping: true,
      createdOn: new Date().toISOString(),
      updatedOn: new Date().toISOString(),
      publishedOn: new Date().toISOString()
    };

    AdminPanel.currentEditingProduct = null;
    showProductForm(newProduct, true);
  };

  /**
   * Normalize image path - handles both URLs and local paths
   * @param {string} path - Image path (URL or local)
   * @returns {string} Normalized path
   */
  function normalizeImagePath(path) {
    if (!path || path.trim() === '') return '';
    const trimmed = path.trim();
    
    // If it's already a URL, keep it as-is
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    
    // If it's a local path without 'images/' prefix, add it
    if (!trimmed.startsWith('images/') && !trimmed.startsWith('/images/')) {
      return 'images/' + trimmed;
    }
    
    // Otherwise return as-is (already has images/ prefix)
    return trimmed;
  }

  /**
   * Get preview image source - handles both URLs and local paths
   * @param {string} path - Image path
   * @returns {string} Preview source path
   */
  function getPreviewImageSrc(path) {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    // For local paths, ensure they start with images/
    if (path.startsWith('images/') || path.startsWith('/images/')) {
      return path.startsWith('/') ? path : path;
    }
    return 'images/' + path;
  }

  /**
   * Show product form modal
   */
  function showProductForm(product, isNew = false) {
    const modal = document.getElementById('modalOverlay');
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = `
      <div class="admin-modal-header">
        <h2 class="admin-modal-title">${isNew ? '➕ Add New Product' : '✏️ Edit Product'}</h2>
        <button class="admin-modal-close" onclick="AdminPanel.closeModal()">&times;</button>
      </div>
      <div class="admin-modal-body">
        <form id="productForm" class="admin-form">
          <!-- Basic Information -->
          <div class="admin-form-section">
            <h3 class="admin-form-section-title">📋 Basic Information</h3>
            <div class="admin-form-row">
              <div class="admin-form-group">
                <label class="admin-form-label">Product Name *</label>
                <input type="text" name="name" class="admin-form-input" value="${escapeHtml(product.name || '')}" required>
              </div>
              <div class="admin-form-group">
                <label class="admin-form-label">Slug *</label>
                <input type="text" name="slug" class="admin-form-input" value="${escapeHtml(product.slug || '')}" required>
              </div>
            </div>
            <div class="admin-form-row">
              <div class="admin-form-group">
                <label class="admin-form-label">Handle</label>
                <input type="text" name="handle" class="admin-form-input" value="${escapeHtml(product.handle || '')}">
              </div>
              <div class="admin-form-group">
                <label class="admin-form-label">Category</label>
                <select name="category" class="admin-form-select">
                  <option value="AKUROCK Akustikpaneele" ${product.category === 'AKUROCK Akustikpaneele' ? 'selected' : ''}>AKUROCK Akustikpaneele</option>
                  <option value="AKUROCK Zubehör" ${product.category === 'AKUROCK Zubehör' ? 'selected' : ''}>AKUROCK Zubehör</option>
                </select>
              </div>
            </div>
            <div class="admin-form-group admin-form-group-full">
              <label class="admin-form-label">Description</label>
              <textarea name="description" class="admin-form-textarea" rows="3">${escapeHtml(product.description || '')}</textarea>
            </div>
            <div class="admin-form-row">
              <div class="admin-form-group">
                <label class="admin-form-label">Stone Type</label>
                <input type="text" name="stone" class="admin-form-input" value="${escapeHtml(product.stone || '')}">
              </div>
              <div class="admin-form-group">
                <label class="admin-form-label">Alt Text</label>
                <input type="text" name="alt_text" class="admin-form-input" value="${escapeHtml(product.alt_text || '')}">
              </div>
            </div>
          </div>

          <!-- Pricing -->
          <div class="admin-form-section">
            <h3 class="admin-form-section-title">💰 Pricing</h3>
          <div class="admin-form-row">
            <div class="admin-form-group">
              <label class="admin-form-label">Price Display (e.g., €220.00)</label>
              <input type="text" name="price" class="admin-form-input" value="${escapeHtml(product.price || '')}">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Price Value (numeric)</label>
              <input type="number" name="priceValue" class="admin-form-input" step="0.01" value="${product.priceValue || 0}">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Currency</label>
              <select name="currency" class="admin-form-select">
                <option value="EUR" ${product.currency === 'EUR' ? 'selected' : ''}>EUR</option>
                <option value="USD" ${product.currency === 'USD' ? 'selected' : ''}>USD</option>
              </select>
            </div>
          </div>

          <!-- Images -->
          <div class="admin-form-section">
            <h3 class="admin-form-section-title">🖼️ Images</h3>
            <div class="admin-form-row">
              <div class="admin-form-group admin-form-group-full">
                <label class="admin-form-label">Main Image</label>
                <div style="margin-bottom: 0.5rem;">
                  <span class="admin-text-small admin-text-muted">
                    💡 Enter either: <strong>URL</strong> (https://...) or <strong>Local Path</strong> (images/filename.webp)
                  </span>
                </div>
                <input type="text" name="mainImage" class="admin-form-input" value="${escapeHtml(product.mainImage || '')}" placeholder="https://cdn... OR images/Brush_Block.webp">
              </div>
            </div>
            <div class="admin-form-row">
              <div class="admin-form-group">
                <label class="admin-form-label">Special Image</label>
                <div style="margin-bottom: 0.5rem;">
                  <span class="admin-text-small admin-text-muted">URL or images/filename.webp</span>
                </div>
                <input type="text" name="special_image" class="admin-form-input" value="${escapeHtml(product.special_image || '')}" placeholder="https://... OR images/...">
              </div>
              <div class="admin-form-group">
                <label class="admin-form-label">Special Image 2</label>
                <div style="margin-bottom: 0.5rem;">
                  <span class="admin-text-small admin-text-muted">URL or images/filename.webp</span>
                </div>
                <input type="text" name="special_image_2" class="admin-form-input" value="${escapeHtml(product.special_image_2 || '')}" placeholder="https://... OR images/...">
              </div>
            </div>
            <div class="admin-form-row">
              <div class="admin-form-group">
                <label class="admin-form-label">Hover Image</label>
                <div style="margin-bottom: 0.5rem;">
                  <span class="admin-text-small admin-text-muted">URL or images/filename.webp</span>
                </div>
                <input type="text" name="hover_image" class="admin-form-input" value="${escapeHtml(product.hover_image || '')}" placeholder="https://... OR images/...">
              </div>
              <div class="admin-form-group">
                <label class="admin-form-label">Hover Installation Image</label>
                <div style="margin-bottom: 0.5rem;">
                  <span class="admin-text-small admin-text-muted">URL or images/filename.webp</span>
                </div>
                <input type="text" name="hover_image_installation" class="admin-form-input" value="${escapeHtml(product.hover_image_installation || '')}" placeholder="https://... OR images/...">
              </div>
            </div>
            <div class="admin-form-group admin-form-group-full">
              <label class="admin-form-label">Selection Slider Image</label>
              <div style="margin-bottom: 0.5rem;">
                <span class="admin-text-small admin-text-muted">URL or images/filename.webp</span>
              </div>
              <input type="text" name="selection_slider_image" class="admin-form-input" value="${escapeHtml(product.selection_slider_image || '')}" placeholder="https://... OR images/...">
            </div>

            <!-- Image Gallery -->
            <div class="admin-form-group admin-form-group-full">
              <label class="admin-form-label">Image Gallery</label>
              <input type="hidden" name="images" value='${JSON.stringify(product.images || []).replace(/'/g, "&#39;")}'>
              <div id="imageGalleryList" class="admin-image-list">
                ${renderImageGallery(product.images || [])}
              </div>
              <button type="button" class="admin-btn-secondary admin-mt-2" onclick="AdminPanel.addImageToGallery()">➕ Add Image</button>
            </div>
          </div>
          
          <!-- Technical Specifications -->
          <div class="admin-form-section">
            <h3 class="admin-form-section-title">⚙️ Technical Specifications</h3>
          <div class="admin-form-row">
            <div class="admin-form-group">
              <label class="admin-form-label">Dimensions</label>
              <input type="text" name="dimensions" class="admin-form-input" value="${escapeHtml(product.dimensions || '')}">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Size</label>
              <input type="text" name="size" class="admin-form-input" value="${escapeHtml(product.size || '')}">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Area</label>
              <input type="text" name="area" class="admin-form-input" value="${escapeHtml(product.area || '')}">
            </div>
          </div>
          <div class="admin-form-row">
            <div class="admin-form-group">
              <label class="admin-form-label">Width (cm)</label>
              <input type="number" name="width" class="admin-form-input" value="${product.width || ''}">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Height (cm)</label>
              <input type="number" name="height" class="admin-form-input" value="${product.height || ''}">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Length (cm)</label>
              <input type="number" name="length" class="admin-form-input" value="${product.length || ''}">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Weight (g)</label>
              <input type="number" name="weight" class="admin-form-input" value="${product.weight || ''}">
            </div>
          </div>
          <div class="admin-form-row">
            <div class="admin-form-group">
              <label class="admin-form-label">Delivery Time</label>
              <input type="text" name="deliveryTime" class="admin-form-input" value="${escapeHtml(product.deliveryTime || '')}">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Requires Shipping</label>
              <select name="requiresShipping" class="admin-form-select">
                <option value="true" ${product.requiresShipping ? 'selected' : ''}>Yes</option>
                <option value="false" ${!product.requiresShipping ? 'selected' : ''}>No</option>
              </select>
            </div>
          </div>

          <!-- Marketing Content -->
          <div class="admin-form-section">
            <h3 class="admin-form-section-title">📢 Marketing Content</h3>
            <div class="admin-form-row">
              <div class="admin-form-group">
                <label class="admin-form-label">Slogan</label>
                <input type="text" name="special_field_slogan" class="admin-form-input" value="${escapeHtml(product.special_field_slogan || '')}">
              </div>
              <div class="admin-form-group">
                <label class="admin-form-label">Button Text</label>
                <input type="text" name="special_field_button" class="admin-form-input" value="${escapeHtml(product.special_field_button || '')}">
              </div>
            </div>
            <div class="admin-form-group admin-form-group-full">
              <label class="admin-form-label">Special Text</label>
              <textarea name="special_field_text" class="admin-form-textarea" rows="2">${escapeHtml(product.special_field_text || '')}</textarea>
            </div>
          </div>

          <!-- Colors -->
          <div class="admin-form-section">
            <h3 class="admin-form-section-title">🎨 Colors</h3>
            <div class="admin-form-row">
              <div class="admin-form-group">
                <label class="admin-form-label">Color (HSL)</label>
                <input type="text" name="color" class="admin-form-input" value="${escapeHtml(product.color || '')}" placeholder="hsla(36, 23%, 63%, 0.30)">
              </div>
              <div class="admin-form-group">
                <label class="admin-form-label">Button Header Color</label>
                <input type="text" name="button_header_color" class="admin-form-input" value="${escapeHtml(product.button_header_color || '')}" placeholder="hsla(36, 23%, 63%, 1.00)">
              </div>
            </div>
          </div>

          <!-- Metadata -->
          <div class="admin-form-section">
            <h3 class="admin-form-section-title">📝 Metadata</h3>
          <div class="admin-form-row">
            <div class="admin-form-group">
              <label class="admin-form-label">Item Style</label>
              <select name="item_style" class="admin-form-select">
                <option value="Tall" ${product.item_style === 'Tall' ? 'selected' : ''}>Tall</option>
                <option value="Wide" ${product.item_style === 'Wide' ? 'selected' : ''}>Wide</option>
              </select>
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Sorting Order</label>
              <input type="number" name="sorting" class="admin-form-input" value="${product.sorting || 999}">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Product ID</label>
              <input type="text" name="productId" class="admin-form-input" value="${escapeHtml(product.productId || '')}">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Variant ID</label>
              <input type="text" name="variantId" class="admin-form-input" value="${escapeHtml(product.variantId || '')}">
            </div>
          </div>
        </form>
      </div>
      <div class="admin-modal-footer">
        <button type="button" class="admin-btn-secondary" onclick="AdminPanel.closeModal()">❌ Cancel</button>
        <button type="button" class="admin-btn" onclick="AdminPanel.saveProduct()">💾 Save Product</button>
      </div>
    `;

    modal.classList.add('show');
  }

  /**
   * Render image gallery in form
   */
  function renderImageGallery(images) {
    if (!images || images.length === 0) {
      return '<div class="admin-text-muted admin-text-center admin-mt-2">No images added yet</div>';
    }

    return images.map((img, index) => `
      <div class="admin-image-item" data-index="${index}">
        <img src="${img.url || ''}" alt="${img.type || ''}" class="admin-image-preview" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22150%22 height=%22150%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22150%22 height=%22150%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22%3ENo Image%3C/text%3E%3C/svg%3E'">
        <div class="admin-image-info">
          <div><strong>Type:</strong> ${img.type || 'N/A'}</div>
          <div><strong>Order:</strong> ${img.sort_order || 0}</div>
        </div>
        <button type="button" class="admin-image-remove" onclick="AdminPanel.removeImageFromGallery(${index})">&times;</button>
      </div>
    `).join('');
  }

  /**
   * Add image to gallery
   */
  AdminPanel.addImageToGallery = function() {
    const url = prompt('Enter image URL or local path (e.g., https://... OR images/filename.webp):');
    if (!url) return;
    
    // Normalize the path
    const normalizedUrl = normalizeImagePath(url);

    const type = prompt('Enter image type (panel, installation, stone, closeup):', 'panel');
    const sortOrderInput = prompt('Enter sort order:', '1');
    const sortOrder = parseInt(sortOrderInput) || 1;

    const form = document.getElementById('productForm');
    if (!form) return;

    // Get current images from hidden input
    let images = [];
    const imagesInput = form.querySelector('[name="images"]');
    if (imagesInput && imagesInput.value) {
      try {
        images = JSON.parse(imagesInput.value);
      } catch (e) {
        console.error('Error parsing images:', e);
        images = [];
      }
    }

    // Add new image with normalized path
    images.push({
      url: normalizeImagePath(url.trim()),
      type: (type || 'panel').trim(),
      sort_order: sortOrder
    });

    // Sort by sort_order
    images.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

    // Update hidden input
    if (imagesInput) {
      imagesInput.value = JSON.stringify(images);
    }

    // Update gallery display
    const galleryList = document.getElementById('imageGalleryList');
    if (galleryList) {
      galleryList.innerHTML = renderImageGallery(images);
    }
  };

  /**
   * Remove image from gallery
   */
  AdminPanel.removeImageFromGallery = function(index) {
    const form = document.getElementById('productForm');
    if (!form) return;

    const imagesInput = form.querySelector('[name="images"]');
    if (!imagesInput) return;

    let images = [];
    if (imagesInput.value) {
      try {
        images = JSON.parse(imagesInput.value);
      } catch (e) {
        console.error('Error parsing images:', e);
        images = [];
      }
    }

    // Remove image at index
    images.splice(index, 1);

    // Update hidden input
    imagesInput.value = JSON.stringify(images);

    // Update gallery display
    const galleryList = document.getElementById('imageGalleryList');
    if (galleryList) {
      galleryList.innerHTML = renderImageGallery(images);
    }
  };

  /**
   * Save product
   */
  AdminPanel.saveProduct = function() {
    const form = document.getElementById('productForm');
    if (!form) return;

    // Validate form
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Collect form data
    const formData = new FormData(form);
    const productData = {};

    // Get all form fields
    for (const [key, value] of formData.entries()) {
      if (key === 'images') {
        try {
          productData.images = JSON.parse(value);
        } catch (e) {
          productData.images = [];
        }
      } else if (key === 'priceValue' || key === 'sorting' || key === 'width' || key === 'height' || key === 'length' || key === 'weight') {
        productData[key] = value ? parseFloat(value) : null;
      } else if (key === 'requiresShipping') {
        productData[key] = value === 'true';
      } else if (key === 'mainImage' || key === 'special_image' || key === 'special_image_2' || 
                 key === 'hover_image' || key === 'hover_image_installation' || key === 'selection_slider_image') {
        // Normalize image paths
        productData[key] = normalizeImagePath(value);
      } else {
        productData[key] = value;
      }
    }

    // Get images from gallery if not in form data
    if (!productData.images || productData.images.length === 0) {
      const imagesInput = form.querySelector('[name="images"]');
      if (imagesInput && imagesInput.value) {
        try {
          productData.images = JSON.parse(imagesInput.value);
        } catch (e) {
          productData.images = [];
        }
      } else if (AdminPanel.currentEditingProduct && AdminPanel.currentEditingProduct.images) {
        productData.images = AdminPanel.currentEditingProduct.images;
      } else {
        productData.images = [];
      }
    }
    
    // Normalize image URLs in images array
    if (productData.images && Array.isArray(productData.images)) {
      productData.images = productData.images.map(img => ({
        ...img,
        url: normalizeImagePath(img.url || '')
      }));
    }

    // Preserve IDs and timestamps
    if (AdminPanel.currentEditingProduct) {
      productData.id = AdminPanel.currentEditingProduct.id;
      productData.createdOn = AdminPanel.currentEditingProduct.createdOn || new Date().toISOString();
    } else {
      // New product - generate ID from slug
      productData.id = productData.slug || `product-${Date.now()}`;
      productData.createdOn = new Date().toISOString();
    }

    productData.updatedOn = new Date().toISOString();
    productData.publishedOn = productData.publishedOn || new Date().toISOString();

    // Ensure handle matches slug if not set
    if (!productData.handle) {
      productData.handle = productData.slug;
    }

    // Save to CMS data
    if (!AdminPanel.cmsData.products) {
      AdminPanel.cmsData.products = [];
    }

    if (AdminPanel.currentEditingProduct) {
      // Update existing
      const index = AdminPanel.cmsData.products.findIndex(p => p.id === AdminPanel.currentEditingProduct.id);
      if (index >= 0) {
        AdminPanel.cmsData.products[index] = { ...AdminPanel.cmsData.products[index], ...productData };
      }
    } else {
      // Add new
      AdminPanel.cmsData.products.push(productData);
    }

    // Save to localStorage
    if (window.AdminDataManager.saveCMSData(AdminPanel.cmsData)) {
      showNotification('Product saved successfully', 'success');
      AdminPanel.closeModal();
      renderProductsList();
      updateDashboardStats();
    } else {
      showNotification('Failed to save product', 'error');
    }
  };

  /**
   * Delete product
   */
  AdminPanel.deleteProduct = function(productId) {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    AdminPanel.cmsData.products = AdminPanel.cmsData.products.filter(p => p.id !== productId);
    
    if (window.AdminDataManager.saveCMSData(AdminPanel.cmsData)) {
      showNotification('Product deleted successfully', 'success');
      renderProductsList();
      updateDashboardStats();
    } else {
      showNotification('Failed to delete product', 'error');
    }
  };

  /**
   * Show accessory form (similar to product form but simpler)
   */
  AdminPanel.editAccessory = function(accessoryId) {
    const accessory = AdminPanel.cmsData.accessories.find(a => a.id === accessoryId);
    if (!accessory) {
      showNotification('Accessory not found', 'error');
      return;
    }

    AdminPanel.currentEditingAccessory = accessory;
    showAccessoryForm(accessory);
  };

  AdminPanel.addAccessory = function() {
    const newAccessory = {
      id: '',
      productId: '',
      variantId: '',
      name: '',
      slug: '',
      handle: '',
      type: 'Physical',
      description: '',
      category: 'AKUROCK Zubehör',
      price: '',
      priceValue: 0,
      currency: 'EUR',
      mainImage: '',
      selection_slider_image: '',
      requiresShipping: true,
      sorting: 999
    };

    AdminPanel.currentEditingAccessory = null;
    showAccessoryForm(newAccessory, true);
  };

  function showAccessoryForm(accessory, isNew = false) {
    const modal = document.getElementById('modalOverlay');
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = `
      <div class="admin-modal-header">
        <h2 class="admin-modal-title">${isNew ? '➕ Add New Accessory' : '✏️ Edit Accessory'}</h2>
        <button class="admin-modal-close" onclick="AdminPanel.closeModal()">&times;</button>
      </div>
      <div class="admin-modal-body">
        <form id="accessoryForm" class="admin-form">
          <div class="admin-form-row">
            <div class="admin-form-group">
              <label class="admin-form-label">Name *</label>
              <input type="text" name="name" class="admin-form-input" value="${escapeHtml(accessory.name || '')}" required>
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Slug *</label>
              <input type="text" name="slug" class="admin-form-input" value="${escapeHtml(accessory.slug || '')}" required>
            </div>
          </div>
          <div class="admin-form-row">
            <div class="admin-form-group">
              <label class="admin-form-label">Category</label>
              <select name="category" class="admin-form-select">
                <option value="AKUROCK Zubehör" ${accessory.category === 'AKUROCK Zubehör' ? 'selected' : ''}>AKUROCK Zubehör</option>
              </select>
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Type</label>
              <select name="type" class="admin-form-select">
                <option value="Physical" ${accessory.type === 'Physical' ? 'selected' : ''}>Physical</option>
                <option value="Service" ${accessory.type === 'Service' ? 'selected' : ''}>Service</option>
              </select>
            </div>
          </div>
          <div class="admin-form-group admin-form-group-full">
            <label class="admin-form-label">Description</label>
            <textarea name="description" class="admin-form-textarea" rows="3">${escapeHtml(accessory.description || '')}</textarea>
          </div>
          <div class="admin-form-row">
            <div class="admin-form-group">
              <label class="admin-form-label">Price Display</label>
              <input type="text" name="price" class="admin-form-input" value="${escapeHtml(accessory.price || '')}">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Price Value</label>
              <input type="number" name="priceValue" class="admin-form-input" step="0.01" value="${accessory.priceValue || 0}">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Currency</label>
              <select name="currency" class="admin-form-select">
                <option value="EUR" ${accessory.currency === 'EUR' ? 'selected' : ''}>EUR</option>
                <option value="USD" ${accessory.currency === 'USD' ? 'selected' : ''}>USD</option>
              </select>
            </div>
          </div>
          <div class="admin-form-row">
            <div class="admin-form-group admin-form-group-full">
              <label class="admin-form-label">Main Image URL</label>
              <input type="url" name="mainImage" class="admin-form-input" value="${escapeHtml(accessory.mainImage || '')}">
            </div>
          </div>
          <div class="admin-form-row">
            <div class="admin-form-group">
              <label class="admin-form-label">Product ID</label>
              <input type="text" name="productId" class="admin-form-input" value="${escapeHtml(accessory.productId || '')}">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Variant ID</label>
              <input type="text" name="variantId" class="admin-form-input" value="${escapeHtml(accessory.variantId || '')}">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Sorting Order</label>
              <input type="number" name="sorting" class="admin-form-input" value="${accessory.sorting || 999}">
            </div>
          </div>
        </form>
      </div>
      <div class="admin-modal-footer">
        <button type="button" class="admin-btn-secondary" onclick="AdminPanel.closeModal()">❌ Cancel</button>
        <button type="button" class="admin-btn" onclick="AdminPanel.saveAccessory()">💾 Save Accessory</button>
      </div>
    `;

    modal.classList.add('show');
  }

  AdminPanel.saveAccessory = function() {
    const form = document.getElementById('accessoryForm');
    if (!form) return;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const accessoryData = {};

    for (const [key, value] of formData.entries()) {
      if (key === 'priceValue' || key === 'sorting') {
        accessoryData[key] = value ? parseFloat(value) : null;
      } else if (key === 'requiresShipping') {
        accessoryData[key] = value === 'true';
      } else {
        accessoryData[key] = value;
      }
    }

    if (AdminPanel.currentEditingAccessory) {
      accessoryData.id = AdminPanel.currentEditingAccessory.id;
    } else {
      accessoryData.id = accessoryData.slug || `accessory-${Date.now()}`;
    }

    if (!accessoryData.handle) {
      accessoryData.handle = accessoryData.slug;
    }

    if (!AdminPanel.cmsData.accessories) {
      AdminPanel.cmsData.accessories = [];
    }

    if (AdminPanel.currentEditingAccessory) {
      const index = AdminPanel.cmsData.accessories.findIndex(a => a.id === AdminPanel.currentEditingAccessory.id);
      if (index >= 0) {
        AdminPanel.cmsData.accessories[index] = { ...AdminPanel.cmsData.accessories[index], ...accessoryData };
      }
    } else {
      AdminPanel.cmsData.accessories.push(accessoryData);
    }

    if (window.AdminDataManager.saveCMSData(AdminPanel.cmsData)) {
      showNotification('Accessory saved successfully', 'success');
      AdminPanel.closeModal();
      renderAccessoriesList();
      updateDashboardStats();
    } else {
      showNotification('Failed to save accessory', 'error');
    }
  };

  AdminPanel.deleteAccessory = function(accessoryId) {
    if (!confirm('Are you sure you want to delete this accessory? This action cannot be undone.')) {
      return;
    }

    AdminPanel.cmsData.accessories = AdminPanel.cmsData.accessories.filter(a => a.id !== accessoryId);
    
    if (window.AdminDataManager.saveCMSData(AdminPanel.cmsData)) {
      showNotification('Accessory deleted successfully', 'success');
      renderAccessoriesList();
      updateDashboardStats();
    } else {
      showNotification('Failed to delete accessory', 'error');
    }
  };

  /**
   * Render sample boxes list
   */
  function renderSampleBoxesList() {
    const container = document.getElementById('sampleBoxesList');
    if (!container || !AdminPanel.cmsData) return;

    // Combine products and samples arrays (matching frontend logic)
    const allProducts = [
      ...(AdminPanel.cmsData.products || []),
      ...(AdminPanel.cmsData.samples || []) // Include samples array if it exists
    ];

    // Filter products that are sample boxes (matching frontend filter exactly)
    const sampleBoxes = allProducts.filter(p => {
      if (!p) return false;
      const isSample = p.category === 'AKUROCK Muster' || 
                      (p.id && p.id.includes('-sample')) || 
                      (p.name && p.name.toLowerCase().includes('sample'));
      return isSample;
    }).sort((a, b) => (a.sorting || 999) - (b.sorting || 999));

    if (sampleBoxes.length === 0) {
      container.innerHTML = `
        <div class="admin-empty-state">
          <div class="admin-empty-state-icon">📦</div>
          <h3 class="admin-empty-state-title">No Sample Boxes Yet</h3>
          <p class="admin-empty-state-text">Add sample boxes to help customers explore your products.</p>
          <button class="admin-btn" onclick="AdminPanel.addSampleBox()" style="margin-top: 1rem;">➕ Add Your First Sample Box</button>
        </div>
      `;
      return;
    }

    const html = `
      <div class="admin-table">
        <div class="admin-table-header">
          <div>Sample Box</div>
          <div>Price</div>
          <div>Category</div>
          <div>Actions</div>
        </div>
        ${sampleBoxes.map(box => {
          const displayName = (box.name || '').replace(/-Sample$/i, '').trim() || box.special_field_slogan || 'Unnamed Sample Box';
          const displayImage = box.mainImage || box.selection_slider_image || '';
          return `
          <div class="admin-table-row">
            <div class="admin-table-cell">
              ${displayImage ? `<img src="${displayImage}" alt="${displayName}" class="admin-table-image" onerror="this.style.display='none';">` : '<div class="admin-table-image" style="background: var(--admin-gray-200); display: flex; align-items: center; justify-content: center; color: var(--admin-gray-400); font-size: 0.75rem;">No Image</div>'}
              <div>
                <div class="admin-table-name">${displayName}</div>
                <div class="admin-text-small admin-text-muted">${box.slug || box.id || ''} • ${box.stone || box.description || 'No description'}</div>
              </div>
            </div>
            <div class="admin-table-price">${box.price || '€5.00'}</div>
            <div class="admin-table-category">${box.category || 'AKUROCK Muster'}</div>
            <div class="admin-table-actions">
              <button class="admin-btn-small admin-btn-edit" onclick="AdminPanel.editSampleBox('${box.id}')" title="Edit sample box">✏️ Edit</button>
              <button class="admin-btn-small admin-btn-delete" onclick="AdminPanel.deleteSampleBox('${box.id}')" title="Delete sample box">🗑️ Delete</button>
            </div>
          </div>
        `;
        }).join('')}
      </div>
    `;

    container.innerHTML = html;
  }

  /**
   * Show sample box edit form (simplified version of product form)
   */
  AdminPanel.editSampleBox = function(boxId) {
    // Search in both products and samples arrays
    const allProducts = [
      ...(AdminPanel.cmsData.products || []),
      ...(AdminPanel.cmsData.samples || [])
    ];
    const box = allProducts.find(p => p.id === boxId);
    if (!box) {
      showNotification('Sample box not found', 'error');
      return;
    }

    AdminPanel.currentEditingSampleBox = box;
    showSampleBoxForm(box);
  };

  AdminPanel.addSampleBox = function() {
    const newBox = {
      id: '',
      productId: '',
      variantId: '',
      name: '',
      slug: '',
      handle: '',
      description: '',
      stone: '',
      special_field_slogan: '',
      category: 'AKUROCK Muster',
      price: '€5.00',
      priceValue: 5.00,
      currency: 'EUR',
      mainImage: '',
      selection_slider_image: '',
      hover_image: '',
      color: '',
      button_header_color: '',
      sorting: 999,
      createdOn: new Date().toISOString(),
      updatedOn: new Date().toISOString(),
      publishedOn: new Date().toISOString()
    };

    AdminPanel.currentEditingSampleBox = null;
    showSampleBoxForm(newBox, true);
  };

  function showSampleBoxForm(box, isNew = false) {
    const modal = document.getElementById('modalOverlay');
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = `
      <div class="admin-modal-header">
        <h2 class="admin-modal-title">${isNew ? '➕ Add New Sample Box' : '✏️ Edit Sample Box'}</h2>
        <button class="admin-modal-close" onclick="AdminPanel.closeModal()">&times;</button>
      </div>
      <div class="admin-modal-body">
        <form id="sampleBoxForm" class="admin-form">
          <!-- Basic Information -->
          <div class="admin-form-section">
            <h3 class="admin-form-section-title">📋 Basic Information</h3>
            <div class="admin-form-row">
              <div class="admin-form-group">
                <label class="admin-form-label">Name *</label>
                <input type="text" name="name" class="admin-form-input" value="${escapeHtml(box.name || '')}" required>
              </div>
              <div class="admin-form-group">
                <label class="admin-form-label">Slug *</label>
                <input type="text" name="slug" class="admin-form-input" value="${escapeHtml(box.slug || '')}" required>
              </div>
            </div>
            <div class="admin-form-row">
              <div class="admin-form-group">
                <label class="admin-form-label">Display Name / Slogan</label>
                <input type="text" name="special_field_slogan" class="admin-form-input" value="${escapeHtml(box.special_field_slogan || '')}" placeholder="e.g., Brush">
                <div class="admin-text-small admin-text-muted" style="margin-top: 0.25rem;">
                  Short name shown on sample box card (falls back to cleaned name if empty)
                </div>
              </div>
              <div class="admin-form-group">
                <label class="admin-form-label">Stone Type</label>
                <input type="text" name="stone" class="admin-form-input" value="${escapeHtml(box.stone || '')}">
              </div>
            </div>
            <div class="admin-form-row">
              <div class="admin-form-group">
                <label class="admin-form-label">Category</label>
                <select name="category" class="admin-form-select">
                  <option value="AKUROCK Muster" ${box.category === 'AKUROCK Muster' ? 'selected' : ''}>AKUROCK Muster (Sample Boxes - €5.00)</option>
                  <option value="AKUROCK Akustikpaneele" ${box.category === 'AKUROCK Akustikpaneele' ? 'selected' : ''}>AKUROCK Akustikpaneele (Full Products)</option>
                </select>
              </div>
            </div>
            <div class="admin-form-group admin-form-group-full">
              <label class="admin-form-label">Description</label>
              <textarea name="description" class="admin-form-textarea" rows="2">${escapeHtml(box.description || '')}</textarea>
            </div>
          </div>

          <!-- Pricing -->
          <div class="admin-form-section">
            <h3 class="admin-form-section-title">💰 Pricing</h3>
            <div class="admin-form-row">
              <div class="admin-form-group">
                <label class="admin-form-label">Price Display (e.g., €5.00 for samples)</label>
                <input type="text" name="price" class="admin-form-input" value="${escapeHtml(box.price || '€5.00')}" placeholder="€5.00">
              </div>
              <div class="admin-form-group">
                <label class="admin-form-label">Price Value (numeric)</label>
                <input type="number" name="priceValue" class="admin-form-input" step="0.01" value="${box.priceValue || 0}">
              </div>
              <div class="admin-form-group">
                <label class="admin-form-label">Currency</label>
                <select name="currency" class="admin-form-select">
                  <option value="EUR" ${box.currency === 'EUR' ? 'selected' : ''}>EUR</option>
                  <option value="USD" ${box.currency === 'USD' ? 'selected' : ''}>USD</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Images -->
          <div class="admin-form-section">
            <h3 class="admin-form-section-title">🖼️ Images</h3>
            <div class="admin-form-row">
              <div class="admin-form-group admin-form-group-full">
                <label class="admin-form-label">Main Image *</label>
                <div style="margin-bottom: 0.5rem;">
                  <span class="admin-text-small admin-text-muted">
                    💡 Enter either: <strong>URL</strong> (https://...) or <strong>Local Path</strong> (images/filename.webp)
                  </span>
                </div>
                <input type="text" name="mainImage" id="sampleBoxMainImage" class="admin-form-input" value="${escapeHtml(box.mainImage || '')}" placeholder="https://cdn... OR images/Brush_Block.webp" required 
                       onchange="const img = this.nextElementSibling?.querySelector('img'); if (img && this.value) { const imgSrc = this.value.startsWith('http') ? this.value : (this.value.startsWith('images/') ? this.value : 'images/' + this.value); img.src = imgSrc; img.parentElement.style.display = 'block'; }">
                <div id="mainImagePreview" style="margin-top: 0.5rem; ${box.mainImage ? '' : 'display: none;'}">
                  ${box.mainImage ? `<img src="${escapeHtml(getPreviewImageSrc(box.mainImage))}" alt="Preview" style="max-width: 200px; max-height: 200px; border-radius: 8px; border: 2px solid var(--admin-gray-200); object-fit: cover;" onerror="this.parentElement.style.display='none';">` : '<img src="" alt="Preview" style="max-width: 200px; max-height: 200px; border-radius: 8px; border: 2px solid var(--admin-gray-200); object-fit: cover;">'}
                </div>
              </div>
            </div>
            <div class="admin-form-row">
              <div class="admin-form-group admin-form-group-full">
                <label class="admin-form-label">Selection Slider Image</label>
                <div style="margin-bottom: 0.5rem;">
                  <span class="admin-text-small admin-text-muted">
                    💡 Enter either: <strong>URL</strong> (https://...) or <strong>Local Path</strong> (images/filename.webp)
                  </span>
                </div>
                <input type="text" name="selection_slider_image" id="sampleBoxSliderImage" class="admin-form-input" value="${escapeHtml(box.selection_slider_image || '')}" placeholder="https://cdn... OR images/Sample-0123421_12.webp"
                       onchange="const preview = this.nextElementSibling; const img = preview?.querySelector('img'); if (img && this.value) { const imgSrc = this.value.startsWith('http') ? this.value : (this.value.startsWith('images/') ? this.value : 'images/' + this.value); img.src = imgSrc; preview.style.display = 'block'; img.onerror = function() { this.parentElement.style.display = 'none'; }; }">
                <div id="sliderImagePreview" style="margin-top: 0.5rem; ${box.selection_slider_image ? '' : 'display: none;'}">
                  ${box.selection_slider_image ? `<img src="${escapeHtml(getPreviewImageSrc(box.selection_slider_image))}" alt="Preview" style="max-width: 200px; max-height: 200px; border-radius: 8px; border: 2px solid var(--admin-gray-200); object-fit: cover; display: block;" onerror="this.parentElement.style.display='none';">` : '<img src="" alt="Preview" style="max-width: 200px; max-height: 200px; border-radius: 8px; border: 2px solid var(--admin-gray-200); object-fit: cover; display: block;">'}
                </div>
                <div class="admin-text-small admin-text-muted" style="margin-top: 0.25rem;">
                  Used in product selector sliders (optional, falls back to main image)
                </div>
              </div>
            </div>
            <div class="admin-form-row">
              <div class="admin-form-group admin-form-group-full">
                <label class="admin-form-label">Hover Image</label>
                <div style="margin-bottom: 0.5rem;">
                  <span class="admin-text-small admin-text-muted">
                    💡 Enter either: <strong>URL</strong> (https://...) or <strong>Local Path</strong> (images/filename.webp)
                  </span>
                </div>
                <input type="text" name="hover_image" id="sampleBoxHoverImage" class="admin-form-input" value="${escapeHtml(box.hover_image || '')}" placeholder="https://... OR images/filename.webp"
                       onchange="const img = this.nextElementSibling?.querySelector('img'); if (img && this.value) { const imgSrc = this.value.startsWith('http') ? this.value : (this.value.startsWith('images/') ? this.value : 'images/' + this.value); img.src = imgSrc; img.parentElement.style.display = 'block'; }">
                <div id="hoverImagePreview" style="margin-top: 0.5rem; ${box.hover_image ? '' : 'display: none;'}">
                  ${box.hover_image ? `<img src="${escapeHtml(getPreviewImageSrc(box.hover_image))}" alt="Preview" style="max-width: 200px; max-height: 200px; border-radius: 8px; border: 2px solid var(--admin-gray-200); object-fit: cover;" onerror="this.parentElement.style.display='none';">` : '<img src="" alt="Preview" style="max-width: 200px; max-height: 200px; border-radius: 8px; border: 2px solid var(--admin-gray-200); object-fit: cover;">'}
                </div>
              </div>
            </div>
          </div>

          <!-- Colors -->
          <div class="admin-form-section">
            <h3 class="admin-form-section-title">🎨 Colors</h3>
            <div class="admin-form-row">
              <div class="admin-form-group">
                <label class="admin-form-label">Card Background Color (HSL)</label>
                <input type="text" name="color" class="admin-form-input" value="${escapeHtml(box.color || '')}" placeholder="hsla(36, 23%, 63%, 0.30)">
                ${box.color ? `<div style="margin-top: 0.5rem; width: 50px; height: 50px; border-radius: 8px; border: 2px solid var(--admin-gray-200); background-color: ${escapeHtml(box.color)};"></div>` : ''}
              </div>
              <div class="admin-form-group">
                <label class="admin-form-label">Text/Button Color</label>
                <input type="text" name="button_header_color" class="admin-form-input" value="${escapeHtml(box.button_header_color || '')}" placeholder="hsla(36, 23%, 63%, 1.00)">
                ${box.button_header_color ? `<div style="margin-top: 0.5rem; width: 50px; height: 50px; border-radius: 8px; border: 2px solid var(--admin-gray-200); background-color: ${escapeHtml(box.button_header_color)};"></div>` : ''}
              </div>
            </div>
          </div>

          <!-- Metadata -->
          <div class="admin-form-section">
            <h3 class="admin-form-section-title">📝 Metadata</h3>
          <div class="admin-form-row">
            <div class="admin-form-group">
              <label class="admin-form-label">Sorting Order</label>
              <input type="number" name="sorting" class="admin-form-input" value="${box.sorting || 999}">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Product ID</label>
              <input type="text" name="productId" class="admin-form-input" value="${escapeHtml(box.productId || '')}">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Variant ID</label>
              <input type="text" name="variantId" class="admin-form-input" value="${escapeHtml(box.variantId || '')}">
            </div>
          </div>
        </form>
      </div>
      <div class="admin-modal-footer">
        <button type="button" class="admin-btn-secondary" onclick="AdminPanel.closeModal()">❌ Cancel</button>
        <button type="button" class="admin-btn" onclick="AdminPanel.saveSampleBox()">💾 Save Sample Box</button>
      </div>
    `;

    modal.classList.add('show');
  }

  AdminPanel.saveSampleBox = function() {
    const form = document.getElementById('sampleBoxForm');
    if (!form) return;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const boxData = {};

    for (const [key, value] of formData.entries()) {
      if (key === 'priceValue' || key === 'sorting') {
        boxData[key] = value ? parseFloat(value) : null;
      } else if (key === 'mainImage' || key === 'selection_slider_image' || key === 'hover_image') {
        // Normalize image paths
        boxData[key] = normalizeImagePath(value);
      } else {
        boxData[key] = value;
      }
    }

    if (AdminPanel.currentEditingSampleBox) {
      boxData.id = AdminPanel.currentEditingSampleBox.id;
      boxData.createdOn = AdminPanel.currentEditingSampleBox.createdOn || new Date().toISOString();
    } else {
      boxData.id = boxData.slug || `sample-box-${Date.now()}`;
      boxData.createdOn = new Date().toISOString();
    }

    boxData.updatedOn = new Date().toISOString();
    boxData.publishedOn = boxData.publishedOn || new Date().toISOString();
    boxData.handle = boxData.handle || boxData.slug;
    boxData.type = 'Physical';

    if (!AdminPanel.cmsData.products) {
      AdminPanel.cmsData.products = [];
    }

    if (AdminPanel.currentEditingSampleBox) {
      const index = AdminPanel.cmsData.products.findIndex(p => p.id === AdminPanel.currentEditingSampleBox.id);
      if (index >= 0) {
        AdminPanel.cmsData.products[index] = { ...AdminPanel.cmsData.products[index], ...boxData };
      }
    } else {
      AdminPanel.cmsData.products.push(boxData);
    }

    if (window.AdminDataManager.saveCMSData(AdminPanel.cmsData)) {
      showNotification('Sample box saved successfully', 'success');
      AdminPanel.closeModal();
      renderSampleBoxesList();
      updateDashboardStats();
    } else {
      showNotification('Failed to save sample box', 'error');
    }
  };

  AdminPanel.deleteSampleBox = function(boxId) {
    if (!confirm('Are you sure you want to delete this sample box? This action cannot be undone.')) {
      return;
    }

    // Remove from products array
    if (AdminPanel.cmsData.products) {
      AdminPanel.cmsData.products = AdminPanel.cmsData.products.filter(p => p.id !== boxId);
    }
    
    // Also remove from samples array if it exists
    if (AdminPanel.cmsData.samples) {
      AdminPanel.cmsData.samples = AdminPanel.cmsData.samples.filter(s => s.id !== boxId);
    }
    
    if (window.AdminDataManager.saveCMSData(AdminPanel.cmsData)) {
      showNotification('Sample box deleted successfully', 'success');
      renderSampleBoxesList();
      updateDashboardStats();
    } else {
      showNotification('Failed to delete sample box', 'error');
    }
  };

  /**
   * Close modal
   */
  AdminPanel.closeModal = function() {
    const modal = document.getElementById('modalOverlay');
    if (modal) {
      modal.classList.remove('show');
    }
    AdminPanel.currentEditingProduct = null;
    AdminPanel.currentEditingAccessory = null;
    AdminPanel.currentEditingSampleBox = null;
  };

  /**
   * Show notification
   */
  function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    if (!notification) return;

    notification.textContent = message;
    notification.className = `admin-notification ${type} show`;
    
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }

  /**
   * Escape HTML to prevent XSS
   */
  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Attach event listeners
   */
  function attachEventListeners() {
    // Navigation tabs
    document.querySelectorAll('.admin-nav-item').forEach(item => {
      item.addEventListener('click', () => {
        AdminPanel.showSection(item.dataset.section);
      });
    });

    // Add product button
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
      addProductBtn.addEventListener('click', () => AdminPanel.addProduct());
    }

    // Add accessory button
    const addAccessoryBtn = document.getElementById('addAccessoryBtn');
    if (addAccessoryBtn) {
      addAccessoryBtn.addEventListener('click', () => AdminPanel.addAccessory());
    }

    // Add sample box button
    const addSampleBoxBtn = document.getElementById('addSampleBoxBtn');
    if (addSampleBoxBtn) {
      addSampleBoxBtn.addEventListener('click', () => AdminPanel.addSampleBox());
    }

    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        if (window.AdminDataManager.exportJSON()) {
          showNotification('JSON exported successfully', 'success');
        } else {
          showNotification('Failed to export JSON', 'error');
        }
      });
    }

    // Import button
    const importBtn = document.getElementById('importBtn');
    if (importBtn) {
      importBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e) => {
          const file = e.target.files[0];
          if (file) {
            try {
              await window.AdminDataManager.importJSON(file);
              showNotification('JSON imported successfully', 'success');
              // Reload data and refresh UI
              AdminPanel.cmsData = await window.AdminDataManager.loadCMSData();
              renderProductsList();
              renderAccessoriesList();
              renderSampleBoxesList();
              updateDashboardStats();
            } catch (error) {
              showNotification('Failed to import JSON: ' + error.message, 'error');
            }
          }
        };
        input.click();
      });
    }

    // Reset button
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to reset all data to default? This will overwrite all current changes.')) {
          if (await window.AdminDataManager.resetToDefault()) {
            showNotification('Data reset to default', 'success');
            AdminPanel.cmsData = await window.AdminDataManager.loadCMSData();
            renderProductsList();
            renderAccessoriesList();
            renderSampleBoxesList();
            updateDashboardStats();
          } else {
            showNotification('Failed to reset data', 'error');
          }
        }
      });
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('admin_logged_in');
        location.reload();
      });
    }

    // Close modal on overlay click
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
          AdminPanel.closeModal();
        }
      });
    }
  }

  // Expose globally
  window.AdminPanel = AdminPanel;

  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
