// Demo Version Configuration
// This limits features for the public demo version

export const DEMO_CONFIG = {
  // Demo mode enabled
  isDemoVersion: true,
  
  // Limitations
  limitations: {
    maxScansPerSession: 3,
    maxScansPerDay: 10,
    enableAPI: false,
    enableAdvancedFeatures: false,
    enableDatabaseExport: false,
    enableCustomFeeds: false,
    enableEmailAlerts: false,
    enableHistoricalData: false,
    enableSSLAnalysis: false,
    enablePriorityProcessing: false
  },

  // Demo watermark
  watermark: {
    enabled: true,
    text: 'DEMO VERSION - Limited Features',
    upgradeLink: 'https://yourwebsite.com/purchase'
  },

  // Feature gates
  features: {
    basicScanning: true,
    googleSafeBrowsing: true,
    simpleRecommendations: true,
    basicUI: true,
    
    // Locked features (require full version)
    unlimitedScans: false,
    apiAccess: false,
    analytics: false,
    customFeeds: false,
    emailAlerts: false,
    sslAnalysis: false,
    databaseBackup: false,
    advancedConfig: false
  },

  // Upgrade prompts
  upgradePrompt: {
    showAfterScans: 3,
    message: '🔒 You\'ve reached the demo limit. Upgrade to unlock unlimited scans and premium features!',
    ctaText: 'Upgrade Now - $49',
    ctaLink: 'https://yourwebsite.com/purchase'
  },

  // Demo session tracking
  session: {
    trackScans: true,
    resetOnReload: true,
    storageKey: 'urly_demo_scans'
  }
};

// Check if feature is available
export function isFeatureAvailable(featureName) {
  if (!DEMO_CONFIG.isDemoVersion) {
    return true; // Full version - all features available
  }
  return DEMO_CONFIG.features[featureName] || false;
}

// Check scan limit
export function canPerformScan() {
  if (!DEMO_CONFIG.isDemoVersion) {
    return { allowed: true };
  }

  const sessionScans = parseInt(localStorage.getItem(DEMO_CONFIG.session.storageKey) || '0');
  
  if (sessionScans >= DEMO_CONFIG.limitations.maxScansPerSession) {
    return {
      allowed: false,
      message: DEMO_CONFIG.upgradePrompt.message,
      scansUsed: sessionScans,
      scansLimit: DEMO_CONFIG.limitations.maxScansPerSession
    };
  }

  return {
    allowed: true,
    scansUsed: sessionScans,
    scansRemaining: DEMO_CONFIG.limitations.maxScansPerSession - sessionScans
  };
}

// Increment scan counter
export function incrementScanCount() {
  if (!DEMO_CONFIG.isDemoVersion) return;
  
  const currentCount = parseInt(localStorage.getItem(DEMO_CONFIG.session.storageKey) || '0');
  localStorage.setItem(DEMO_CONFIG.session.storageKey, (currentCount + 1).toString());
}

// Reset scan counter (for testing)
export function resetScanCount() {
  localStorage.setItem(DEMO_CONFIG.session.storageKey, '0');
}

// Get upgrade message
export function getUpgradeMessage() {
  return {
    title: '🔓 Unlock Full Version',
    features: [
      '✅ Unlimited scans',
      '✅ Full API access',
      '✅ Advanced analytics',
      '✅ Custom threat feeds',
      '✅ Email alerts',
      '✅ SSL certificate analysis',
      '✅ Historical data tracking',
      '✅ Priority support'
    ],
    price: '$49 one-time payment',
    cta: 'Upgrade Now',
    link: DEMO_CONFIG.upgradePrompt.ctaLink
  };
}
