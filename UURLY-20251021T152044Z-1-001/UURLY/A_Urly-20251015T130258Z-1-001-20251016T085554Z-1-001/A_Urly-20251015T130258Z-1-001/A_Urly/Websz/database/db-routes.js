// Database API Routes for URLY Scanner
// Add these routes to your scan-server.js

import * as dbManager from './db-manager.js';

// ==================== SCAN HISTORY ENDPOINTS ====================

/**
 * GET /api/scans/recent
 * Get recent scans
 */
export async function getRecentScansRoute(req, res) {
  const limit = parseInt(req.query.limit) || 100;
  const result = await dbManager.getScans({ limit });
  if (!result || result.success === false) return res.status(500).json({ success: false, error: result.error || 'Failed to load scans' });
  const scans = result.data || [];
  res.json({ success: true, count: scans.length, scans });
}

/**
 * GET /api/scans/:id
 * Get scan by ID with recommendations
 */
export async function getScanByIdRoute(req, res) {
  const { id } = req.params;
  const result = await dbManager.getScanById(parseInt(id));
  if (!result || result.success === false || !result.data) {
    return res.status(404).json({ success: false, error: 'Scan not found' });
  }
  res.json({ success: true, scan: result.data });
}

/**
 * GET /api/scans/search
 * Search scans by URL or hostname
 */
export async function searchScansRoute(req, res) {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({ success: false, error: 'Query parameter required' });
  }
  // dbManager does not provide a dedicated search; fetch recent scans and filter
  const result = await dbManager.getScans({ limit: 500 });
  if (!result || result.success === false) return res.status(500).json({ success: false, error: result.error || 'Failed to load scans' });
  const scans = (result.data || []).filter(s => {
    const url = (s.url || '').toLowerCase();
    const host = (s.hostname || '').toLowerCase();
    return url.includes(q.toLowerCase()) || host.includes(q.toLowerCase());
  });
  res.json({ success: true, count: scans.length, scans });
}

// ==================== STATISTICS ENDPOINTS ====================

/**
 * GET /api/stats/today
 * Get today's statistics
 */
export async function getTodayStatsRoute(req, res) {
  // dbManager exposes getStatistics(days): use 1 day for today's stats
  if (typeof dbManager.getStatistics !== 'function') {
    return res.status(501).json({ success: false, error: 'Statistics endpoint not implemented in dbManager' });
  }
  const result = await dbManager.getStatistics(1);
  if (!result || result.success === false) return res.status(500).json({ success: false, error: result.error || 'Failed to load statistics' });
  res.json({ success: true, stats: result.data || [] });
}

/**
 * GET /api/stats/summary
 * Get summary statistics
 */
export async function getSummaryStatsRoute(req, res) {
  // Provide 30-day summary using dbManager.getStatistics
  if (typeof dbManager.getStatistics !== 'function') {
    return res.status(501).json({ success: false, error: 'Statistics endpoint not implemented in dbManager' });
  }
  const result = await dbManager.getStatistics(30);
  if (!result || result.success === false) return res.status(500).json({ success: false, error: result.error || 'Failed to load statistics' });
  res.json({ success: true, stats: result.data || [], totals: result.totals || {} });
}

/**
 * GET /api/stats/range
 * Get statistics for date range
 */
export async function getStatsRangeRoute(req, res) {
  const { start, end } = req.query;
  
  if (!start || !end) {
    return res.status(400).json({ 
      success: false, 
      error: 'Start and end date required (YYYY-MM-DD)' 
    });
  }
  
  // Convert start/end dates to number of days and call getStatistics(days)
  if (typeof dbManager.getStatistics !== 'function') {
    return res.status(501).json({ success: false, error: 'Statistics endpoint not implemented in dbManager' });
  }
  const s = new Date(start);
  const e = new Date(end);
  const days = Math.max(1, Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1);
  const result = await dbManager.getStatistics(days);
  if (!result || result.success === false) return res.status(500).json({ success: false, error: result.error || 'Failed to load statistics' });
  res.json({ success: true, count: (result.data || []).length, stats: result.data || [] });
}

// ==================== BLOCKLIST ENDPOINTS ====================

/**
 * GET /api/blocklist
 * Get all blocklist entries
 */
export async function getBlocklistRoute(req, res) {
  const result = await dbManager.getBlocklist();
  if (!result || result.success === false) return res.status(500).json({ success: false, error: result.error || 'Failed to load blocklist' });
  res.json({ success: true, count: (result.data || []).length, entries: result.data || [] });
}

/**
 * POST /api/blocklist
 * Add entry to blocklist
 */
export async function addToBlocklistRoute(req, res) {
  const { type, value, reason } = req.body;
  if (!value) return res.status(400).json({ success: false, error: 'Value required' });
  const result = await dbManager.addToBlocklist(value, reason || null);
  if (!result || result.success === false) return res.status(500).json({ success: false, error: result.error || 'Failed to add to blocklist' });
  res.json({ success: true, message: 'Added to blocklist', entry: result.data || null });
}

/**
 * DELETE /api/blocklist/:value
 * Remove entry from blocklist
 */
export async function removeFromBlocklistRoute(req, res) {
  const { value } = req.params;
  const raw = decodeURIComponent(value);
  let id = parseInt(raw);
  if (isNaN(id)) {
    // try to find by value
    const list = await dbManager.getBlocklist();
    if (!list || list.success === false) return res.status(500).json({ success: false, error: list.error || 'Failed to access blocklist' });
    const found = (list.data || []).find(x => x.value === raw || x.entry_type === raw);
    if (!found) return res.status(404).json({ success: false, error: 'Entry not found' });
    id = found.id;
  }
  const result = await dbManager.removeFromBlocklist(id);
  if (!result || result.success === false) return res.status(500).json({ success: false, error: result.error || 'Failed to remove' });
  res.json({ success: true, message: 'Removed from blocklist' });
}

/**
 * GET /api/blocklist/check/:value
 * Check if entry is in blocklist
 */
export async function checkBlocklistRoute(req, res) {
  const { value } = req.params;
  const result = await dbManager.checkBlocklist(decodeURIComponent(value));
  if (!result || result.success === false) return res.status(500).json({ success: false, error: result.error || 'Failed to check blocklist' });
  res.json({ success: true, inBlocklist: result.isBlocked, data: result.data || null });
}

// ==================== CONFIGURATION ENDPOINTS ====================

/**
 * GET /api/config
 * Get all configuration
 */
export async function getAllConfigRoute(req, res) {
  const result = await dbManager.getAllConfig();
  if (!result || result.success === false) return res.status(500).json({ success: false, error: result.error || 'Failed to load config' });
  res.json({ success: true, config: result.data || [] });
}

/**
 * GET /api/config/:key
 * Get specific configuration value
 */
export async function getConfigRoute(req, res) {
  const { key } = req.params;
  const result = await dbManager.getConfig(key);
  if (!result || result.success === false || !result.data) return res.status(404).json({ success: false, error: 'Config key not found' });
  res.json({ success: true, key, value: result.data });
}

/**
 * POST /api/config
 * Set configuration value
 */
export async function setConfigRoute(req, res) {
  const { key, value, type, description } = req.body;
  
  if (!key || value === undefined) {
    return res.status(400).json({ 
      success: false, 
      error: 'Key and value required' 
    });
  }
  
  const result = await dbManager.updateConfig(key, value);
  if (!result || result.success === false) return res.status(500).json({ success: false, error: result.error || 'Failed to update config' });
  res.json({ success: true, message: 'Config updated', config: result.data || null });
}

// ==================== CLEANUP ENDPOINTS ====================

/**
 * POST /api/cleanup/old-scans
 * Manually trigger cleanup of old scans
 */
export async function cleanupOldScansRoute(req, res) {
  if (typeof dbManager.cleanupOldScans === 'function') {
    const deleted = await dbManager.cleanupOldScans();
    return res.json({ success: true, deleted, message: `Deleted ${deleted} old scan(s)` });
  }
  res.status(501).json({ success: false, error: 'cleanupOldScans not implemented in dbManager' });
}

/**
 * POST /api/cleanup/enforce-limit
 * Manually enforce max history limit
 */
export async function enforceMaxHistoryRoute(req, res) {
  if (typeof dbManager.enforceMaxHistory === 'function') {
    const deleted = await dbManager.enforceMaxHistory();
    return res.json({ success: true, deleted, message: `Deleted ${deleted} scan(s)` });
  }
  res.status(501).json({ success: false, error: 'enforceMaxHistory not implemented in dbManager' });
}

// Export all routes
export default {
  // Scans
  getRecentScansRoute,
  getScanByIdRoute,
  searchScansRoute,
  
  // Statistics
  getTodayStatsRoute,
  getSummaryStatsRoute,
  getStatsRangeRoute,
  
  // Blocklist
  getBlocklistRoute,
  addToBlocklistRoute,
  removeFromBlocklistRoute,
  checkBlocklistRoute,
  
  // Configuration
  getAllConfigRoute,
  getConfigRoute,
  setConfigRoute,
  
  // Cleanup
  cleanupOldScansRoute,
  enforceMaxHistoryRoute
};
// Backwards-compatible alias for the blocklist route name used elsewhere
export const getAllBlocklistRoute = getBlocklistRoute;
