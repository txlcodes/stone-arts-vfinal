/**
 * Admin Data Manager
 * 
 * Handles all data persistence operations for the admin panel:
 * - Loading CMS data from localStorage or JSON file fallback
 * - Saving CMS data to localStorage
 * - Exporting data as JSON file
 * - Importing JSON files
 * - Resetting to default data
 * 
 * This is a standalone module that can be used by both admin panel and main website
 */

(function() {
  'use strict';

  // Storage key for localStorage
  const STORAGE_KEY = 'stonearts_cms_data';
  const STORAGE_META_KEY = 'stonearts_cms_meta';

  /**
   * AdminDataManager - Main data management object
   */
  const AdminDataManager = {
    
    /**
     * Load CMS data from localStorage or fallback to JSON file
     * @returns {Promise<Object>} CMS data object
     */
    loadCMSData: async function() {
      try {
        // First, try to load from localStorage
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const data = JSON.parse(stored);
          console.log('AdminDataManager: Loaded data from localStorage');
          return data;
        }
        
        // Fallback to JSON file - try API route first, then static file
        console.log('AdminDataManager: localStorage empty, loading from JSON file');
        let response;
        try {
          // Try API route first (works better on serverless platforms)
          response = await fetch('/api/data/mock-cms-data');
          if (!response.ok) {
            throw new Error(`API route failed: ${response.statusText}`);
          }
        } catch (apiError) {
          console.warn('AdminDataManager: API route failed, trying static file:', apiError);
          // Fallback to static file
          response = await fetch('/data/mock-cms-data.json');
          if (!response.ok) {
            throw new Error(`Failed to fetch JSON: ${response.statusText}`);
          }
        }
        const data = await response.json();
        
        // Save to localStorage for next time
        this.saveCMSData(data);
        
        return data;
      } catch (error) {
        console.error('AdminDataManager: Error loading CMS data:', error);
        throw error;
      }
    },

    /**
     * Save CMS data to localStorage
     * @param {Object} data - CMS data object to save
     * @returns {boolean} Success status
     */
    saveCMSData: function(data) {
      try {
        // Validate data structure
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid data: must be an object');
        }
        
        // Save data to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        
        // Save metadata (timestamp)
        const meta = {
          lastUpdated: new Date().toISOString(),
          version: '1.0'
        };
        localStorage.setItem(STORAGE_META_KEY, JSON.stringify(meta));
        
        // Dispatch custom event for other scripts to listen
        window.dispatchEvent(new CustomEvent('cmsDataUpdated', { detail: data }));
        
        console.log('AdminDataManager: Data saved to localStorage');
        return true;
      } catch (error) {
        console.error('AdminDataManager: Error saving CMS data:', error);
        return false;
      }
    },

    /**
     * Get metadata about stored data
     * @returns {Object|null} Metadata object or null
     */
    getMetadata: function() {
      try {
        const meta = localStorage.getItem(STORAGE_META_KEY);
        return meta ? JSON.parse(meta) : null;
      } catch (error) {
        console.error('AdminDataManager: Error getting metadata:', error);
        return null;
      }
    },

    /**
     * Export current CMS data as JSON file download
     * @param {string} filename - Optional filename (default: cms-data-export.json)
     */
    exportJSON: function(filename) {
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
          throw new Error('No data to export');
        }
        
        // Parse and format JSON
        const jsonData = JSON.parse(data);
        const jsonString = JSON.stringify(jsonData, null, 2);
        
        // Create blob and download
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || `cms-data-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        console.log('AdminDataManager: JSON exported successfully');
        return true;
      } catch (error) {
        console.error('AdminDataManager: Error exporting JSON:', error);
        return false;
      }
    },

    /**
     * Import JSON file and save to localStorage
     * @param {File} file - JSON file to import
     * @returns {Promise<boolean>} Success status
     */
    importJSON: function(file) {
      const self = this; // Store reference to AdminDataManager
      return new Promise((resolve, reject) => {
        try {
          const reader = new FileReader();
          
          reader.onload = (e) => {
            try {
              const jsonString = e.target.result;
              const data = JSON.parse(jsonString);
              
              // Validate data structure
              if (!data || typeof data !== 'object') {
                throw new Error('Invalid JSON structure');
              }
              
              // Save to localStorage
              if (self.saveCMSData(data)) {
                console.log('AdminDataManager: JSON imported successfully');
                resolve(true);
              } else {
                reject(new Error('Failed to save imported data'));
              }
            } catch (error) {
              console.error('AdminDataManager: Error parsing imported JSON:', error);
              reject(error);
            }
          };
          
          reader.onerror = () => {
            reject(new Error('Failed to read file'));
          };
          
          reader.readAsText(file);
        } catch (error) {
          console.error('AdminDataManager: Error importing JSON:', error);
          reject(error);
        }
      });
    },

    /**
     * Reset to default data from JSON file
     * @returns {Promise<boolean>} Success status
     */
    resetToDefault: async function() {
      try {
        // Load from JSON file - try API route first, then static file
        let response;
        try {
          response = await fetch('/api/data/mock-cms-data');
          if (!response.ok) {
            throw new Error(`API route failed: ${response.statusText}`);
          }
        } catch (apiError) {
          console.warn('AdminDataManager: API route failed, trying static file:', apiError);
          response = await fetch('/data/mock-cms-data.json');
          if (!response.ok) {
            throw new Error(`Failed to fetch default data: ${response.statusText}`);
          }
        }
        const data = await response.json();
        
        // Save to localStorage
        if (this.saveCMSData(data)) {
          console.log('AdminDataManager: Reset to default data');
          return true;
        } else {
          throw new Error('Failed to save default data');
        }
      } catch (error) {
        console.error('AdminDataManager: Error resetting to default:', error);
        return false;
      }
    },

    /**
     * Clear all stored data from localStorage
     */
    clearData: function() {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_META_KEY);
      console.log('AdminDataManager: Data cleared from localStorage');
    },

    /**
     * Sync products to server (database) - Optional, fails gracefully if database unavailable
     * @param {Object} data - CMS data object with products array
     * @returns {Promise<Object>} Sync result with created/updated counts, or null if database unavailable
     */
    syncToServer: async function(data) {
      try {
        if (!data || !data.products || !Array.isArray(data.products)) {
          console.warn('AdminDataManager: Invalid data for sync - skipping database sync');
          return null;
        }

        const response = await fetch('/api/admin/sync-products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ products: data.products }),
        });

        if (!response.ok) {
          // Check if it's a database connection error (500) or not found (404)
          if (response.status === 500 || response.status === 404) {
            console.warn('AdminDataManager: Database unavailable - continuing without sync. Products saved to localStorage only.');
            return null;
          }
          
          const errorData = await response.json().catch(() => ({}));
          console.warn('AdminDataManager: Sync failed -', errorData.message || response.statusText, '- Products saved to localStorage only.');
          return null;
        }

        const result = await response.json();
        console.log('AdminDataManager: Products synced to server', result);
        
        // Dispatch custom event for UI updates
        window.dispatchEvent(new CustomEvent('productsSynced', { detail: result }));
        
        return result;
      } catch (error) {
        // Network errors or other issues - fail gracefully
        console.warn('AdminDataManager: Database sync unavailable -', error.message, '- Products saved to localStorage only.');
        return null;
      }
    },

    /**
     * Save CMS data and optionally sync to server
     * @param {Object} data - CMS data object to save
     * @param {boolean} syncToServer - Whether to sync to server after saving locally
     * @returns {Promise<boolean>} Success status (always true if localStorage save succeeds, even if sync fails)
     */
    saveCMSDataAndSync: async function(data, syncToServer = false) {
      try {
        // Save to localStorage first (this is the primary storage)
        const saved = this.saveCMSData(data);
        if (!saved) {
          throw new Error('Failed to save to localStorage');
        }

        // Optionally sync to server (non-blocking, fails gracefully)
        if (syncToServer) {
          try {
            const syncResult = await this.syncToServer(data);
            if (syncResult === null) {
              // Database unavailable - this is OK, localStorage is the source of truth
              console.log('AdminDataManager: Data saved to localStorage. Database sync skipped (database unavailable).');
            }
          } catch (syncError) {
            // Sync failed but localStorage save succeeded - this is acceptable
            console.warn('AdminDataManager: Data saved to localStorage. Database sync failed (non-critical):', syncError.message);
          }
        }

        return true;
      } catch (error) {
        console.error('AdminDataManager: Error saving data:', error);
        throw error;
      }
    }
  };

  // Expose globally
  window.AdminDataManager = AdminDataManager;
  
  console.log('AdminDataManager: Initialized');
})();
