/**
 * Scanner Configuration Module
 * Contains all configurable settings for URL scanning
 */

export const defaultConfig = {
  // API Configuration
  api: {
    endpoint: 'http://localhost:5050/api/scan',
    timeout: 30000,
    retryAttempts: 2,
    googleSafeBrowsing: {
      enabled: true,
      apiKey: 'AIzaSyAJ0JtLP72UKtUUXbpTAVtg9Lqq3PtIsJE',
      threatTypes: [
        'MALWARE',
        'SOCIAL_ENGINEERING',
        'UNWANTED_SOFTWARE',
        'POTENTIALLY_HARMFUL_APPLICATION'
      ]
    }
  },

  // Scanning Behavior
  scanning: {
    maxBatchSize: 10,
    maxConcurrentRequests: 3,
    enableDNSLookup: true,
    enableSSLCheck: true,
    enableContentAnalysis: true,
    followRedirects: true,
    maxRedirects: 5
  },

  // Heuristics Configuration
  heuristics: {
    enabled: true,
    weights: {
      // MUST MATCH scan-server.js heuristics function weights (lines 341-357)
      httpNotEncrypted: 100,     // No HTTPS encryption
      ipAddress: 30,             // Using IP instead of domain  
      punycode: 15,              // Internationalized domain (xn--)
      tldRisk: 10,               // High-risk TLDs (.tk, .ml, etc.)
      manySubdomains: 10,        // More than 2 subdomains
      manyHyphens: 8,            // More than 3 hyphens in domain
      longHostname: 8,           // Hostname longer than 45 chars
      longPath: 6,               // Path longer than 60 chars
      longQuery: 6,              // Query string longer than 80 chars
      highHostEntropy: 10,       // High randomness in hostname
      highPathEntropy: 6,        // High randomness in path
      atInPath: 8,               // @ symbol in path (phishing)
      manyEncodedChars: 6,       // More than 5 encoded chars (%XX)
      linkShortener: 6,          // Known URL shortener
      phishingKeywords: 10,      // Suspicious keywords in URL
      suspiciousPatterns: 12,    // .help TLD with reward patterns
      typosquat: 14              // Leetspeak brand typosquatting
    },
    suspiciousKeywords: [
      'login', 'verify', 'account', 'secure', 'banking',
      'paypal', 'ebay', 'amazon', 'update', 'confirm',
      'suspended', 'locked', 'unusual', 'activity'
    ],
    highRiskTLDs: [
      '.tk', '.ml', '.ga', '.cf', '.gq',
      '.xyz', '.top', '.club', '.work', '.click'
    ]
  },

  // Safety Score Calculation
  safetyScore: {
    weights: {
      heuristics: 0.40,    // 40% from heuristic analysis
      gsb: 0.30,          // 30% from Google Safe Browsing
      blocklist: 0.20,    // 20% from local blocklists
      ssl: 0.10           // 10% from SSL/TLS check
    },
    thresholds: {
      verySafe: 90,      // 90-100: Very Safe
      safe: 70,          // 70-89: Safe
      caution: 50,       // 50-69: Use Caution
      unsafe: 30,        // 30-49: Unsafe
      veryUnsafe: 0      // 0-29: Very Unsafe
    }
  },

  // Display Options
  display: {
    showDetailedAnalysis: true,
    showTimestamps: true,
    showScoreBreakdown: true,
    showRecommendations: true,
    showPerformanceMetrics: false,
    animateResults: true,
    colorScheme: 'auto' // 'light', 'dark', or 'auto'
  },

  // Performance Settings
  performance: {
    enableCaching: true,
    cacheExpiry: 3600000,      // 1 hour in ms
    maxCacheSize: 1000,
    preloadCommonUrls: false,
    enableServiceWorker: false
  },

  // Advanced Options
  advanced: {
    enableLogging: true,
    logLevel: 'info',          // 'debug', 'info', 'warn', 'error'
    collectAnonymousStats: false,
    enableExperimentalFeatures: false,
    customBlocklist: [],
    customWhitelist: []
  }
};

// Configuration validation rules
export const configValidation = {
  'api.timeout': { min: 5000, max: 60000, type: 'number' },
  'api.retryAttempts': { min: 0, max: 5, type: 'number' },
  'scanning.maxBatchSize': { min: 1, max: 50, type: 'number' },
  'scanning.maxConcurrentRequests': { min: 1, max: 10, type: 'number' },
  'scanning.maxRedirects': { min: 0, max: 10, type: 'number' },
  'performance.cacheExpiry': { min: 60000, max: 86400000, type: 'number' },
  'performance.maxCacheSize': { min: 100, max: 10000, type: 'number' }
};

export default defaultConfig;
