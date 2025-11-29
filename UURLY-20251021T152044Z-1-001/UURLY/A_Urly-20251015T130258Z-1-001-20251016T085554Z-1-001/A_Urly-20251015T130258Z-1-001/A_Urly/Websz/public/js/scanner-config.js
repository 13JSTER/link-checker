/**
 * Scanner Configuration
 * Centralized configuration for URL scanning, heuristics, and metrics
 * All values can be adjusted here without modifying the core scanning logic
 */

const scannerConfig = {
  // ==================== API Configuration ====================
  api: {
    // Scanner API endpoint
    endpoint: 'http://localhost:5050/api/scan',
    
    // Request timeout in milliseconds
    timeout: 30000,
    
    // Retry configuration
    maxRetries: 3,
    retryDelay: 1000,
    
    // Google Safe Browsing API
    gsb: {
      enabled: true,
      cacheDuration: 86400000 // 24 hours in milliseconds
    }
  },

  // ==================== Scanning Behavior ====================
  scanning: {
    // Maximum number of URLs to scan at once
    maxBatchSize: 10,
    
    // Maximum concurrent scans
    maxConcurrent: 3,
    
    // Delay between individual URL scans (ms)
    scanDelay: 500,
    
    // Enable/disable deep scanning
    deepScan: true,
    
    // Fast mode (exit early on obvious threats)
    fastMode: false,
    
    // Timeout for individual checks (ms)
    checkTimeout: 2000,
    
    // Enable parallel checking
    parallelChecks: true
  },

  // ==================== Heuristic Scoring ====================
  heuristics: {
    // Enable/disable heuristic analysis
    enabled: true,
    
    // Weight configuration for different factors (total should be 100)
    weights: {
      tldRisk: 20,          // TLD reputation weight
      lengthRisk: 10,       // URL length weight
      specialChars: 15,     // Special character weight
      ipAddress: 25,        // IP address in URL weight
      subdomains: 12,       // Subdomain count weight
      phishingKeywords: 30, // Phishing keyword weight
      typosquatting: 25,    // Typosquatting weight
      suspiciousPatterns: 20 // Suspicious pattern weight
    },
    
    // Risk thresholds (0-100 scale)
    thresholds: {
      safe: 30,        // 0-30 = safe
      caution: 70,     // 31-70 = caution
      unsafe: 100      // 71-100 = unsafe
    },
    
    // Suspicious TLDs (assign risk scores)
    suspiciousTlds: {
      'tk': 50, 'ml': 50, 'ga': 50, 'cf': 50, 'gq': 50,
      'xyz': 30, 'top': 30, 'work': 30, 'click': 40,
      'link': 30, 'bid': 40, 'loan': 40, 'win': 40,
      'download': 35, 'review': 30, 'country': 30,
      'stream': 30, 'gdn': 35, 'science': 35,
      'ru': 25, 'cn': 20, 'br': 15
    },
    
    // Trusted TLDs (lower risk)
    trustedTlds: [
      'com', 'org', 'net', 'edu', 'gov', 'mil',
      'int', 'co.uk', 'ac.uk', 'gov.uk', 'co', 'io'
    ],
    
    // Phishing keywords
    phishingKeywords: [
      'verify', 'account', 'suspended', 'confirm', 'update',
      'security', 'banking', 'password', 'signin', 'login',
      'secure', 'webscr', 'ebayisapi', 'paypal', 'wallet',
      'alert', 'notification', 'action-required', 'urgent',
      'expire', 'locked', 'unusual-activity', 'limited-time'
    ],
    
    // Brand names for typosquatting detection
    protectedBrands: [
      'google', 'facebook', 'amazon', 'microsoft', 'apple',
      'paypal', 'ebay', 'netflix', 'instagram', 'twitter',
      'linkedin', 'github', 'dropbox', 'adobe', 'yahoo',
      'chase', 'wellsfargo', 'bankofamerica', 'citibank'
    ],
    
    // Suspicious URL patterns (will be converted to RegExp)
    suspiciousPatterns: [
      '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}', // IP address
      '@',                                           // @ symbol
      '[а-яА-Я]',                                   // Cyrillic characters
      'xn--',                                        // Punycode
      '\\-{3,}',                                     // Multiple dashes
      '_{3,}',                                       // Multiple underscores
      '\\.{2,}',                                     // Multiple dots
      '%[0-9a-f]{2}'                                // URL encoding
    ],
    
    // URL length thresholds
    urlLength: {
      normal: 75,       // Normal URL length
      suspicious: 150,  // Suspicious if longer
      veryLong: 250     // Very suspicious
    },
    
    // Subdomain thresholds
    subdomainCount: {
      normal: 2,        // Normal subdomain count
      suspicious: 4,    // Suspicious if more
      excessive: 6      // Very suspicious
    }
  },

  // ==================== Safety Scoring ====================
  safety: {
    // Overall safety score calculation weights (must sum to 1.0)
    weights: {
      heuristics: 0.40,     // 40% from heuristic analysis
      gsb: 0.30,            // 30% from Google Safe Browsing
      blocklist: 0.20,      // 20% from blocklists
      dns: 0.05,            // 5% from DNS checks
      availability: 0.05    // 5% from availability
    },
    
    // Safety score ranges (0-100)
    ranges: {
      verySafe: { min: 90, max: 100, label: 'Very Safe', color: '#4caf50', icon: '🛡️' },
      safe: { min: 80, max: 89, label: 'Safe', color: '#8bc34a', icon: '✅' },
      caution: { min: 60, max: 79, label: 'Caution', color: '#ff9800', icon: '⚠️' },
      unsafe: { min: 40, max: 59, label: 'Unsafe', color: '#ff5722', icon: '❌' },
      veryUnsafe: { min: 0, max: 39, label: 'Very Unsafe', color: '#f44336', icon: '⛔' }
    }
  },

  // ==================== Results & Display ====================
  display: {
    // Show detailed results
    detailed: true,
    
    // Show timestamps
    showTimestamps: true,
    
    // Show risk breakdown
    showBreakdown: true,
    
    // Show performance metrics
    showPerformance: true,
    
    // Animation duration (ms)
    animationDuration: 300,
    
    // Auto-clear results after (ms, 0 = never)
    autoClearResults: 0,
    
    // Maximum history items
    maxHistoryItems: 100,
    
    // Group similar results
    groupSimilar: false,
    
    // Show badges
    showBadges: true,
    
    // Verbose mode
    verbose: false
  },

  // ==================== Notifications ====================
  notifications: {
    // Enable browser notifications
    enabled: false,
    
    // Notify on unsafe URLs
    notifyUnsafe: true,
    
    // Notify on scan complete
    notifyComplete: false,
    
    // Sound effects
    soundEffects: false
  },

  // ==================== Performance ====================
  performance: {
    // Enable caching
    enableCache: true,
    
    // Cache duration (ms)
    cacheDuration: 3600000, // 1 hour
    
    // Maximum cache size (items)
    maxCacheSize: 500,
    
    // Enable request batching
    enableBatching: true,
    
    // Batch size
    batchSize: 10,
    
    // Enable compression
    enableCompression: false
  },

  // ==================== Advanced Options ====================
  advanced: {
    // Debug mode
    debug: false,
    
    // Verbose logging
    verbose: false,
    
    // Log to console
    logToConsole: true,
    
    // Log to file
    logToFile: false,
    
    // Enable experimental features
    experimental: false
  }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
  module.exports = scannerConfig;
}

// Make available globally in browser
if (typeof window !== 'undefined') {
  window.scannerConfig = scannerConfig;
}
