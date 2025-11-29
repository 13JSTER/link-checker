/**
 * Scanner API Module
 * Handles URL scanning with configurable settings
 */

import { configManagerInstance } from '../config/useConfig';

/**
 * Scan a single URL using configured settings
 */
export async function scanUrl(url) {
  const config = configManagerInstance.getAll();
  
  try {
    const apiEndpoint = config.api.endpoint;
    const timeout = config.api.timeout;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        url,
        options: {
          enableDNS: config.scanning.enableDNSLookup,
          enableSSL: config.scanning.enableSSLCheck,
          enableContent: config.scanning.enableContentAnalysis,
          followRedirects: config.scanning.followRedirects,
          maxRedirects: config.scanning.maxRedirects,
          enableGSB: config.api.googleSafeBrowsing.enabled,
          enableHeuristics: config.heuristics.enabled,
          heuristicWeights: config.heuristics.weights,
          safetyWeights: config.safetyScore.weights
        }
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Scan failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // Cache the result if caching is enabled
    if (config.performance.enableCaching) {
      cacheResult(url, result, config.performance.cacheExpiry);
    }
    
    return result;
    
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Scan timeout - URL took too long to analyze');
    }
    throw error;
  }
}

/**
 * Scan multiple URLs in batch
 */
export async function scanBatch(urls) {
  const config = configManagerInstance.getAll();
  const batchSize = config.scanning.maxBatchSize;
  const maxConcurrent = config.scanning.maxConcurrentRequests;
  
  const results = [];
  const batches = [];
  
  // Split URLs into batches
  for (let i = 0; i < urls.length; i += batchSize) {
    batches.push(urls.slice(i, i + batchSize));
  }
  
  // Process batches with concurrency control
  for (const batch of batches) {
    const batchPromises = [];
    
    for (let i = 0; i < batch.length; i += maxConcurrent) {
      const concurrent = batch.slice(i, i + maxConcurrent);
      const promises = concurrent.map(url => 
        scanUrl(url).catch(error => ({ url, error: error.message }))
      );
      batchPromises.push(...promises);
    }
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }
  
  return results;
}

/**
 * Check cache for existing scan result
 */
export function getCachedResult(url) {
  const config = configManagerInstance.getAll();
  
  if (!config.performance.enableCaching) {
    return null;
  }
  
  try {
    const cacheKey = `scan_cache_${url}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) return null;
    
    const { result, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;
    
    if (age > config.performance.cacheExpiry) {
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    return result;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
}

/**
 * Cache a scan result
 */
function cacheResult(url, result, expiry) {
  try {
    const cacheKey = `scan_cache_${url}`;
    const cacheData = {
      result,
      timestamp: Date.now()
    };
    
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    
    // Clean old cache entries
    cleanCache();
  } catch (error) {
    console.error('Cache write error:', error);
  }
}

/**
 * Clean expired cache entries
 */
function cleanCache() {
  const config = configManagerInstance.getAll();
  const maxSize = config.performance.maxCacheSize;
  const expiry = config.performance.cacheExpiry;
  
  try {
    const cacheKeys = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('scan_cache_')) {
        cacheKeys.push(key);
      }
    }
    
    // Remove expired entries
    const now = Date.now();
    cacheKeys.forEach(key => {
      try {
        const cached = JSON.parse(localStorage.getItem(key));
        if (now - cached.timestamp > expiry) {
          localStorage.removeItem(key);
        }
      } catch (e) {
        localStorage.removeItem(key);
      }
    });
    
    // Limit cache size
    const remaining = cacheKeys.filter(key => localStorage.getItem(key));
    if (remaining.length > maxSize) {
      const toRemove = remaining.slice(0, remaining.length - maxSize);
      toRemove.forEach(key => localStorage.removeItem(key));
    }
  } catch (error) {
    console.error('Cache cleanup error:', error);
  }
}

/**
 * Clear all cached results
 */
export function clearCache() {
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('scan_cache_')) {
        keys.push(key);
      }
    }
    keys.forEach(key => localStorage.removeItem(key));
    return true;
  } catch (error) {
    console.error('Cache clear error:', error);
    return false;
  }
}

/**
 * Get scan statistics
 */
export function getScanStats() {
  try {
    const cacheKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('scan_cache_')) {
        cacheKeys.push(key);
      }
    }
    
    return {
      cachedScans: cacheKeys.length,
      cacheSize: new Blob([JSON.stringify(cacheKeys)]).size,
      oldestScan: cacheKeys.length > 0 ? Math.min(...cacheKeys.map(key => {
        try {
          const cached = JSON.parse(localStorage.getItem(key));
          return cached.timestamp;
        } catch (e) {
          return Date.now();
        }
      })) : null
    };
  } catch (error) {
    console.error('Stats error:', error);
    return { cachedScans: 0, cacheSize: 0, oldestScan: null };
  }
}

export default { scanUrl, scanBatch, getCachedResult, clearCache, getScanStats };
