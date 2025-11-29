/**
 * Configuration Manager
 * Handles loading, saving, and updating scanner configuration
 */

class ConfigManager {
  constructor() {
    this.config = null;
    this.defaultConfig = null;
    this.storageKey = 'urlScanner_config_v2';
    this.listeners = [];
    
    // Listen for storage changes from other tabs/components
    this.setupStorageListener();
  }

  /**
   * Setup listener for localStorage changes (syncs across tabs and React components)
   */
  setupStorageListener() {
    window.addEventListener('storage', (e) => {
      if (e.key === this.storageKey && e.newValue) {
        try {
          const newConfig = JSON.parse(e.newValue);
          this.config = this.mergeConfigs(this.defaultConfig || this.getDefaultConfig(), newConfig);
          console.log('🔄 Config synced from external change');
          this.notifyListeners();
        } catch (error) {
          console.error('Failed to sync config from storage event:', error);
        }
      }
    });
    
    // Also check for changes periodically (for same-tab React updates)
    setInterval(() => {
      const savedConfig = this.loadFromStorage();
      if (savedConfig && JSON.stringify(savedConfig) !== JSON.stringify(this.config)) {
        this.config = this.mergeConfigs(this.defaultConfig || this.getDefaultConfig(), savedConfig);
        console.log('🔄 Config synced from localStorage');
        this.notifyListeners();
      }
    }, 1000); // Check every second
  }

  /**
   * Initialize configuration manager
   */
  async init() {
    try {
      console.log('🔧 Initializing Configuration Manager...');
      
      // Load default configuration
      this.defaultConfig = this.loadDefaultConfig();
      
      // Load user customizations from localStorage
      const savedConfig = this.loadFromStorage();
      
      // Merge configurations
      this.config = this.mergeConfigs(this.defaultConfig, savedConfig);
      
      // Validate configuration
      const validation = this.validate();
      if (!validation.valid) {
        console.warn('⚠️ Configuration validation warnings:', validation.errors);
      }
      
      console.log('✅ Configuration Manager initialized');
      console.log('📊 Active configuration loaded');
      
      return this.config;
    } catch (error) {
      console.error('❌ Failed to initialize config manager:', error);
      // Fallback to default config
      this.config = window.scannerConfig || this.getDefaultConfig();
      return this.config;
    }
  }

  /**
   * Load default configuration
   */
  loadDefaultConfig() {
    if (window.scannerConfig) {
      return JSON.parse(JSON.stringify(window.scannerConfig));
    }
    return this.getDefaultConfig();
  }

  /**
   * Get default configuration (fallback)
   */
  getDefaultConfig() {
    return {
      api: {
        endpoint: 'http://localhost:5050/api/scan',
        timeout: 30000,
        retryAttempts: 2,
        googleSafeBrowsing: {
          enabled: true,
          apiKey: 'AIzaSyAJ0JtLP72UKtUUXbpTAVtg9Lqq3PtIsJE'
        }
      },
      scanning: {
        maxBatchSize: 10,
        maxConcurrentRequests: 3,
        enableDNSLookup: true,
        enableSSLCheck: true,
        enableContentAnalysis: true,
        followRedirects: true,
        maxRedirects: 5
      },
      heuristics: {
        enabled: true,
        weights: {
          // MUST MATCH scan-server.js heuristics function (lines 341-357)
          httpNotEncrypted: 100,
          ipAddress: 30,
          punycode: 15,
          tldRisk: 10,
          manySubdomains: 10,
          manyHyphens: 8,
          longHostname: 8,
          longPath: 6,
          longQuery: 6,
          highHostEntropy: 10,
          highPathEntropy: 6,
          atInPath: 8,
          manyEncodedChars: 6,
          linkShortener: 6,
          phishingKeywords: 10,
          suspiciousPatterns: 12,
          typosquat: 14
        },
        thresholds: { safe: 30, caution: 70, unsafe: 100 }
      },
      safetyScore: {
        weights: {
          heuristics: 0.40,
          gsb: 0.30,
          blocklist: 0.20,
          ssl: 0.10
        },
        thresholds: {
          verySafe: 90,
          safe: 70,
          caution: 50,
          unsafe: 30,
          veryUnsafe: 0
        }
      },
      display: {
        showDetailedAnalysis: true,
        showTimestamps: true,
        showScoreBreakdown: true,
        showRecommendations: true,
        showPerformanceMetrics: false,
        animateResults: true,
        colorScheme: 'auto',
        showBadges: true
      },
      performance: {
        enableCaching: true,
        cacheExpiry: 3600000,
        maxCacheSize: 1000,
        preloadCommonUrls: false,
        enableServiceWorker: false
      },
      advanced: {
        enableLogging: true,
        logLevel: 'info',
        collectAnonymousStats: false,
        enableExperimentalFeatures: false,
        customBlocklist: [],
        customWhitelist: []
      }
    };
  }

  /**
   * Load saved configuration from localStorage
   */
  loadFromStorage() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        console.log('📥 Loaded user configuration from localStorage');
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load config from storage:', error);
    }
    return {};
  }

  /**
   * Save configuration to localStorage
   */
  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.config));
      console.log('💾 Configuration saved to localStorage');
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('❌ Failed to save config to storage:', error);
      return false;
    }
  }

  /**
   * Deep merge two configuration objects
   */
  mergeConfigs(defaultConfig, userConfig) {
    const merged = JSON.parse(JSON.stringify(defaultConfig));
    
    const merge = (target, source) => {
      for (const key in source) {
        if (source.hasOwnProperty(key)) {
          if (typeof source[key] === 'object' && !Array.isArray(source[key]) && source[key] !== null) {
            if (!target[key]) target[key] = {};
            merge(target[key], source[key]);
          } else {
            target[key] = source[key];
          }
        }
      }
    };
    
    merge(merged, userConfig);
    return merged;
  }

  /**
   * Get configuration value by path
   * @param {string} path - Dot-notation path (e.g., 'heuristics.thresholds.safe')
   */
  get(path) {
    const keys = path.split('.');
    let value = this.config;
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return undefined;
      }
    }
    
    return value;
  }

  /**
   * Set configuration value by path
   * @param {string} path - Dot-notation path
   * @param {*} value - Value to set
   */
  set(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let obj = this.config;
    
    for (const key of keys) {
      if (!obj[key] || typeof obj[key] !== 'object') {
        obj[key] = {};
      }
      obj = obj[key];
    }
    
    obj[lastKey] = value;
    this.saveToStorage();
    this.notifyListeners();
    console.log(`⚙️ Updated config: ${path} = ${JSON.stringify(value)}`);
  }

  /**
   * Reset configuration to defaults
   */
  reset() {
    this.config = JSON.parse(JSON.stringify(this.defaultConfig));
    localStorage.removeItem(this.storageKey);
    this.notifyListeners();
    console.log('🔄 Configuration reset to defaults');
  }

  /**
   * Export configuration as JSON
   */
  export() {
    return JSON.stringify(this.config, null, 2);
  }

  /**
   * Import configuration from JSON
   */
  import(jsonString) {
    try {
      const imported = JSON.parse(jsonString);
      this.config = this.mergeConfigs(this.defaultConfig, imported);
      this.saveToStorage();
      this.notifyListeners();
      console.log('✅ Configuration imported successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to import configuration:', error);
      return false;
    }
  }

  /**
   * Validate configuration
   */
  validate() {
    const errors = [];
    
    // Validate API endpoint
    if (!this.get('api.endpoint')) {
      errors.push('API endpoint is required');
    }
    
    // Validate thresholds
    const safe = this.get('heuristics.thresholds.safe');
    const caution = this.get('heuristics.thresholds.caution');
    const unsafe = this.get('heuristics.thresholds.unsafe');
    
    if (safe >= caution || caution >= unsafe) {
      errors.push('Risk thresholds must be: safe < caution < unsafe');
    }
    
    // Validate safety weights sum
    const safetyWeights = this.get('safety.weights');
    if (safetyWeights) {
      const sum = Object.values(safetyWeights).reduce((a, b) => a + b, 0);
      if (Math.abs(sum - 1.0) > 0.01) {
        errors.push(`Safety weights must sum to 1.0 (current: ${sum.toFixed(2)})`);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get current configuration
   */
  getConfig() {
    return this.config;
  }

  /**
   * Get all configuration (alias for getConfig)
   */
  getAll() {
    return { ...this.config };
  }

  /**
   * Add configuration change listener
   */
  addListener(callback) {
    this.listeners.push(callback);
  }

  /**
   * Event-driven API: Add listener (alias for addListener)
   */
  on(event, callback) {
    if (event === 'change') {
      this.addListener(callback);
    }
  }

  /**
   * Event-driven API: Remove listener (alias for removeListener)
   */
  off(event, callback) {
    if (event === 'change') {
      this.removeListener(callback);
    }
  }

  /**
   * Remove configuration change listener
   */
  removeListener(callback) {
    this.listeners = this.listeners.filter(cb => cb !== callback);
  }

  /**
   * Notify all listeners of configuration change
   */
  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.config);
      } catch (error) {
        console.error('Error in config listener:', error);
      }
    });
  }

  /**
   * Get configuration summary
   */
  getSummary() {
    return {
      scanning: {
        maxBatchSize: this.get('scanning.maxBatchSize'),
        maxConcurrent: this.get('scanning.maxConcurrent'),
        deepScan: this.get('scanning.deepScan'),
        fastMode: this.get('scanning.fastMode')
      },
      heuristics: {
        enabled: this.get('heuristics.enabled'),
        thresholds: this.get('heuristics.thresholds')
      },
      gsb: {
        enabled: this.get('api.gsb.enabled')
      },
      performance: {
        cache: this.get('performance.enableCache'),
        batching: this.get('performance.enableBatching')
      }
    };
  }
}

// Create global instance
const configManager = new ConfigManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ConfigManager;
}

// Make available globally
if (typeof window !== 'undefined') {
  window.ConfigManager = ConfigManager;
  window.configManager = configManager;
}
