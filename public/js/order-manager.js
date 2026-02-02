/**
 * Order Manager
 * Handles order storage, retrieval, and management using localStorage
 * Provides order management functionality for admin panel
 */

(function() {
  'use strict';

  const STORAGE_KEY = 'stonearts_orders';

  // Order Manager Object
  const OrderManager = {
    /**
     * Check if localStorage is available
     * @returns {boolean}
     */
    isStorageAvailable: function() {
      try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
      } catch (e) {
        return false;
      }
    },

    /**
     * Get all orders from localStorage
     * @returns {Array} Array of order objects
     */
    getOrders: function() {
      if (!this.isStorageAvailable()) {
        console.warn('OrderManager: localStorage not available');
        return [];
      }

      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
          return [];
        }
        const orders = JSON.parse(stored);
        return Array.isArray(orders) ? orders : [];
      } catch (error) {
        console.error('OrderManager: Error reading orders from localStorage:', error);
        return [];
      }
    },

    /**
     * Save orders array to localStorage
     * @param {Array} orders - Array of order objects
     * @returns {boolean} Success status
     */
    saveOrders: function(orders) {
      if (!this.isStorageAvailable()) {
        console.warn('OrderManager: localStorage not available, cannot save orders');
        return false;
      }

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
        return true;
      } catch (error) {
        console.error('OrderManager: Error saving orders to localStorage:', error);
        return false;
      }
    },

    /**
     * Calculate cart total from cart items
     * @returns {number} Total amount
     */
    calculateCartTotal: function() {
      try {
        const cartJson = localStorage.getItem('stonearts-cart');
        if (!cartJson) {
          return 0;
        }
        const cart = JSON.parse(cartJson);
        if (!cart.items || !Array.isArray(cart.items)) {
          return 0;
        }
        return cart.items.reduce((sum, item) => {
          const price = parseFloat(item.price) || 0;
          const quantity = parseInt(item.quantity) || 0;
          return sum + (price * quantity);
        }, 0);
      } catch (error) {
        console.error('OrderManager: Error calculating cart total:', error);
        return 0;
      }
    },

    /**
     * Get current cart from localStorage
     * @returns {Object} Cart object with items array
     */
    getCurrentCart: function() {
      try {
        const cartJson = localStorage.getItem('stonearts-cart');
        if (!cartJson) {
          return { items: [] };
        }
        return JSON.parse(cartJson);
      } catch (error) {
        console.error('OrderManager: Error reading cart:', error);
        return { items: [] };
      }
    },

    /**
     * Save order to localStorage
     * @param {Object} customerInfo - Customer information object
     * @returns {Object|null} Saved order object or null if failed
     */
    saveOrder: function(customerInfo) {
      if (!this.isStorageAvailable()) {
        console.warn('OrderManager: localStorage not available, cannot save order');
        return null;
      }

      try {
        // Get current cart
        const cart = this.getCurrentCart();
        
        // Get customer type
        const customerType = localStorage.getItem('customerType') || 'individual';
        
        // Calculate total
        const total = this.calculateCartTotal();
        
        // Create order object
        const order = {
          id: 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          customerType: customerType,
          cart: {
            items: cart.items || [],
            itemCount: cart.items ? cart.items.length : 0
          },
          customerInfo: {
            email: customerInfo.email || '',
            phone: customerInfo.phone || '',
            name: customerInfo.name || '',
            address: customerInfo.address || {},
            company: customerInfo.company || '',
            gst_vat: customerInfo.gst_vat || ''
          },
          status: 'pending',
          total: total,
          currency: 'EUR'
        };

        // Get existing orders
        const orders = this.getOrders();
        
        // Add new order
        orders.push(order);
        
        // Save back to localStorage
        if (this.saveOrders(orders)) {
          console.log('OrderManager: Order saved successfully', order.id);
          return order;
        } else {
          console.error('OrderManager: Failed to save order');
          return null;
        }
      } catch (error) {
        console.error('OrderManager: Error saving order:', error);
        return null;
      }
    },

    /**
     * Get order by ID
     * @param {string} orderId - Order ID
     * @returns {Object|null} Order object or null if not found
     */
    getOrderById: function(orderId) {
      const orders = this.getOrders();
      return orders.find(order => order.id === orderId) || null;
    },

    /**
     * Update order status
     * @param {string} orderId - Order ID
     * @param {string} status - New status ('pending', 'completed', 'cancelled')
     * @returns {boolean} Success status
     */
    updateOrderStatus: function(orderId, status) {
      if (!this.isStorageAvailable()) {
        return false;
      }

      try {
        const orders = this.getOrders();
        const orderIndex = orders.findIndex(order => order.id === orderId);
        
        if (orderIndex === -1) {
          console.warn('OrderManager: Order not found', orderId);
          return false;
        }

        orders[orderIndex].status = status;
        orders[orderIndex].updatedAt = new Date().toISOString();
        
        return this.saveOrders(orders);
      } catch (error) {
        console.error('OrderManager: Error updating order status:', error);
        return false;
      }
    },

    /**
     * Delete order
     * @param {string} orderId - Order ID
     * @returns {boolean} Success status
     */
    deleteOrder: function(orderId) {
      if (!this.isStorageAvailable()) {
        return false;
      }

      try {
        const orders = this.getOrders();
        const filteredOrders = orders.filter(order => order.id !== orderId);
        
        if (filteredOrders.length === orders.length) {
          console.warn('OrderManager: Order not found', orderId);
          return false;
        }

        return this.saveOrders(filteredOrders);
      } catch (error) {
        console.error('OrderManager: Error deleting order:', error);
        return false;
      }
    },

    /**
     * Get order statistics
     * @returns {Object} Statistics object
     */
    getStatistics: function() {
      const orders = this.getOrders();
      
      return {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        completed: orders.filter(o => o.status === 'completed').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
        totalRevenue: orders
          .filter(o => o.status === 'completed')
          .reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0)
      };
    },

    /**
     * Export orders as JSON
     * @returns {string} JSON string
     */
    exportOrdersJSON: function() {
      const orders = this.getOrders();
      return JSON.stringify(orders, null, 2);
    },

    /**
     * Clear all orders (use with caution)
     * @returns {boolean} Success status
     */
    clearAllOrders: function() {
      if (!this.isStorageAvailable()) {
        return false;
      }

      try {
        localStorage.removeItem(STORAGE_KEY);
        return true;
      } catch (error) {
        console.error('OrderManager: Error clearing orders:', error);
        return false;
      }
    }
  };

  // Expose globally
  window.OrderManager = OrderManager;
  
  console.log('OrderManager: Initialized');
})();
