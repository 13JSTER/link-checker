/**
 * Enhanced Result Display Module
 * Provides detailed, configurable output for URL scan results
 */

class ResultDisplay {
  constructor(configManager) {
    this.configManager = configManager;
    this.config = configManager ? configManager.getConfig() : this.getDefaultDisplayConfig();
  }

  getDefaultDisplayConfig() {
    return {
      display: {
        detailed: true,
        showTimestamps: true,
        showBreakdown: true,
        showPerformance: true,
        showBadges: true,
        verbose: false
      },
      safety: {
        ranges: {
          verySafe: { min: 90, max: 100, label: 'Very Safe', color: '#4caf50', icon: '🛡️' },
          safe: { min: 80, max: 89, label: 'Safe', color: '#8bc34a', icon: '✅' },
          caution: { min: 60, max: 79, label: 'Caution', color: '#ff9800', icon: '⚠️' },
          unsafe: { min: 40, max: 59, label: 'Unsafe', color: '#ff5722', icon: '❌' },
          veryUnsafe: { min: 0, max: 39, label: 'Very Unsafe', color: '#f44336', icon: '⛔' }
        }
      }
    };
  }

  /**
   * Get safety level based on score
   */
  getSafetyLevel(score) {
    const ranges = this.config.safety.ranges;
    for (const [key, range] of Object.entries(ranges)) {
      if (score >= range.min && score <= range.max) {
        return {
          level: key,
          ...range,
          score: score
        };
      }
    }
    return ranges.veryUnsafe;
  }

  /**
   * Create enhanced result card
   */
  createEnhancedResult(scanResult) {
    const wrapper = document.createElement('div');
    wrapper.className = 'scanner-result scanner-result--enhanced';
    
    const safetyLevel = this.getSafetyLevel(scanResult.safetyRating || 50);
    wrapper.style.borderLeftColor = safetyLevel.color;
    
    // Create header section
    const header = this.createResultHeader(scanResult, safetyLevel);
    wrapper.appendChild(header);
    
    // Create safety score visualization
    if (this.config.display.detailed) {
      const scoreViz = this.createScoreVisualization(scanResult, safetyLevel);
      wrapper.appendChild(scoreViz);
    }
    
    // Create detailed analysis section
    if (this.config.display.showBreakdown && scanResult.localScan) {
      const analysis = this.createDetailedAnalysis(scanResult);
      wrapper.appendChild(analysis);
    }
    
    // Create badges section
    if (this.config.display.showBadges) {
      const badges = this.createBadgesSection(scanResult);
      if (badges.hasChildNodes()) {
        wrapper.appendChild(badges);
      }
    }
    
    // Create recommendations section
    const recommendations = this.createRecommendations(scanResult, safetyLevel);
    if (recommendations) {
      wrapper.appendChild(recommendations);
    }
    
    // Create performance metrics
    if (this.config.display.showPerformance && scanResult.scanDuration) {
      const performance = this.createPerformanceMetrics(scanResult);
      wrapper.appendChild(performance);
    }
    
    // Create timestamp
    if (this.config.display.showTimestamps) {
      const timestamp = document.createElement('div');
      timestamp.className = 'result-timestamp';
      timestamp.textContent = `Scanned: ${scanResult.scannedAt || new Date().toLocaleString()}`;
      wrapper.appendChild(timestamp);
    }
    
    return wrapper;
  }

  /**
   * Create result header
   */
  createResultHeader(result, safetyLevel) {
    const header = document.createElement('div');
    header.className = 'result-header';
    
    const iconSpan = document.createElement('span');
    iconSpan.className = 'result-icon';
    iconSpan.textContent = safetyLevel.icon;
    iconSpan.style.fontSize = '2rem';
    
    const titleDiv = document.createElement('div');
    titleDiv.className = 'result-title';
    
    const urlDiv = document.createElement('div');
    urlDiv.className = 'result-url';
    urlDiv.textContent = result.url;
    urlDiv.style.fontWeight = 'bold';
    urlDiv.style.marginBottom = '0.5rem';
    
    const statusDiv = document.createElement('div');
    statusDiv.className = 'result-status';
    statusDiv.textContent = safetyLevel.label.toUpperCase();
    statusDiv.style.color = safetyLevel.color;
    statusDiv.style.fontWeight = 'bold';
    statusDiv.style.fontSize = '1.2rem';
    
    titleDiv.appendChild(urlDiv);
    titleDiv.appendChild(statusDiv);
    
    header.appendChild(iconSpan);
    header.appendChild(titleDiv);
    
    return header;
  }

  /**
   * Create score visualization
   */
  createScoreVisualization(result, safetyLevel) {
    const viz = document.createElement('div');
    viz.className = 'score-visualization';
    
    const scoreLabel = document.createElement('div');
    scoreLabel.className = 'score-label';
    scoreLabel.textContent = `Safety Score: ${result.safetyRating}/100`;
    scoreLabel.style.marginBottom = '0.5rem';
    scoreLabel.style.fontWeight = '600';
    
    const progressBar = document.createElement('div');
    progressBar.className = 'score-progress-bar';
    progressBar.style.width = '100%';
    progressBar.style.height = '30px';
    progressBar.style.backgroundColor = '#e0e0e0';
    progressBar.style.borderRadius = '15px';
    progressBar.style.overflow = 'hidden';
    progressBar.style.position = 'relative';
    
    const progressFill = document.createElement('div');
    progressFill.className = 'score-progress-fill';
    progressFill.style.width = `${result.safetyRating}%`;
    progressFill.style.height = '100%';
    progressFill.style.background = `linear-gradient(90deg, ${safetyLevel.color}, ${this.lightenColor(safetyLevel.color, 20)})`;
    progressFill.style.transition = 'width 1s ease-out';
    progressFill.style.display = 'flex';
    progressFill.style.alignItems = 'center';
    progressFill.style.justifyContent = 'center';
    progressFill.style.color = '#fff';
    progressFill.style.fontWeight = 'bold';
    progressFill.textContent = `${result.safetyRating}%`;
    
    progressBar.appendChild(progressFill);
    viz.appendChild(scoreLabel);
    viz.appendChild(progressBar);
    
    return viz;
  }

  /**
   * Create detailed analysis section
   */
  createDetailedAnalysis(result) {
    const analysis = document.createElement('div');
    analysis.className = 'detailed-analysis';
    
    const title = document.createElement('h4');
    title.textContent = '📋 Detailed Analysis';
    title.style.marginTop = '1rem';
    title.style.marginBottom = '0.5rem';
    analysis.appendChild(title);
    
    const details = document.createElement('div');
    details.className = 'analysis-details';
    
    // Heuristic breakdown
    if (result.localScan && result.localScan.heuristics) {
      const heuristics = this.createHeuristicBreakdown(result.localScan.heuristics);
      details.appendChild(heuristics);
    }
    
    // GSB results
    if (result.localScan && result.localScan.gsb && result.localScan.gsb.enabled) {
      const gsb = this.createGSBDisplay(result.localScan.gsb);
      details.appendChild(gsb);
    }
    
    // Blocklist results
    if (result.localScan && result.localScan.blocklist) {
      const blocklist = this.createBlocklistDisplay(result.localScan.blocklist);
      details.appendChild(blocklist);
    }
    
    // DNS/HTTP info
    if (result.localScan && (result.localScan.dns || result.localScan.http)) {
      const network = this.createNetworkInfo(result.localScan);
      details.appendChild(network);
    }
    
    analysis.appendChild(details);
    return analysis;
  }

  /**
   * Create heuristic breakdown
   */
  createHeuristicBreakdown(heuristics) {
    const section = document.createElement('div');
    section.className = 'heuristic-breakdown';
    section.style.marginTop = '1rem';
    
    const title = document.createElement('div');
    title.textContent = `🧠 Heuristic Analysis: ${heuristics.score || 0}/100`;
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '0.5rem';
    section.appendChild(title);
    
    if (heuristics.flags && heuristics.flags.length > 0) {
      const flags = document.createElement('ul');
      flags.style.listStyle = 'none';
      flags.style.padding = '0';
      flags.style.marginLeft = '1rem';
      
      heuristics.flags.forEach(flag => {
        const li = document.createElement('li');
        li.textContent = `• ${flag}`;
        li.style.fontSize = '0.9rem';
        li.style.color = '#666';
        li.style.marginBottom = '0.25rem';
        flags.appendChild(li);
      });
      
      section.appendChild(flags);
    }
    
    return section;
  }

  /**
   * Create GSB display
   */
  createGSBDisplay(gsb) {
    const section = document.createElement('div');
    section.className = 'gsb-display';
    section.style.marginTop = '1rem';
    
    const title = document.createElement('div');
    title.textContent = `🛡️ Google Safe Browsing: ${gsb.verdict.toUpperCase()}`;
    title.style.fontWeight = 'bold';
    title.style.color = gsb.verdict === 'safe' ? '#4caf50' : gsb.verdict === 'unsafe' ? '#f44336' : '#ff9800';
    section.appendChild(title);
    
    if (gsb.matches && gsb.matches.length > 0) {
      const matches = document.createElement('div');
      matches.style.fontSize = '0.9rem';
      matches.style.marginLeft = '1rem';
      matches.style.marginTop = '0.25rem';
      matches.textContent = `Threat Types: ${gsb.matches.map(m => m.threatType).join(', ')}`;
      section.appendChild(matches);
    }
    
    return section;
  }

  /**
   * Create blocklist display
   */
  createBlocklistDisplay(blocklist) {
    const section = document.createElement('div');
    section.className = 'blocklist-display';
    section.style.marginTop = '1rem';
    
    const title = document.createElement('div');
    title.textContent = `📜 Blocklist: ${blocklist.match ? 'MATCHED' : 'Not Found'}`;
    title.style.fontWeight = 'bold';
    title.style.color = blocklist.match ? '#f44336' : '#4caf50';
    section.appendChild(title);
    
    if (blocklist.matchType) {
      const matchType = document.createElement('div');
      matchType.style.fontSize = '0.9rem';
      matchType.style.marginLeft = '1rem';
      matchType.style.marginTop = '0.25rem';
      matchType.textContent = `Match Type: ${blocklist.matchType}`;
      section.appendChild(matchType);
    }
    
    return section;
  }

  /**
   * Create network info display
   */
  createNetworkInfo(localScan) {
    const section = document.createElement('div');
    section.className = 'network-info';
    section.style.marginTop = '1rem';
    
    if (localScan.dns) {
      const dns = document.createElement('div');
      dns.textContent = `🌐 DNS: ${localScan.dns.ok ? 'Resolved' : 'Failed'}`;
      dns.style.fontSize = '0.9rem';
      dns.style.marginBottom = '0.25rem';
      section.appendChild(dns);
    }
    
    if (localScan.http) {
      const http = document.createElement('div');
      http.textContent = `📡 HTTP: ${localScan.http.status || 'N/A'}`;
      http.style.fontSize = '0.9rem';
      section.appendChild(http);
    }
    
    return section;
  }

  /**
   * Create badges section
   */
  createBadgesSection(result) {
    const badges = document.createElement('div');
    badges.className = 'scanner-badges';
    badges.style.marginTop = '1rem';
    badges.style.display = 'flex';
    badges.style.flexWrap = 'wrap';
    badges.style.gap = '0.5rem';
    
    // Add safety badge
    if (result.status) {
      const statusBadge = this.createBadge(result.status.toUpperCase(), `badge--${result.status}`);
      badges.appendChild(statusBadge);
    }
    
    // Add HTTPS badge
    if (result.isHttps) {
      const httpsBadge = this.createBadge('HTTPS', 'badge--ok');
      badges.appendChild(httpsBadge);
    } else if (result.isHttps === false) {
      const httpBadge = this.createBadge('HTTP', 'badge--warn');
      badges.appendChild(httpBadge);
    }
    
    // Add misspelling badges
    if (result.misspellings && result.misspellings.length > 0) {
      result.misspellings.forEach(word => {
        const badge = this.createBadge(`Typo: ${word}`, 'badge--suspicious');
        badges.appendChild(badge);
      });
    }
    
    return badges;
  }

  /**
   * Create a badge element
   */
  createBadge(text, className) {
    const badge = document.createElement('span');
    badge.className = `status-badge ${className}`;
    badge.textContent = text;
    badge.style.padding = '0.25rem 0.75rem';
    badge.style.borderRadius = '12px';
    badge.style.fontSize = '0.85rem';
    badge.style.fontWeight = '600';
    return badge;
  }

  /**
   * Create recommendations
   */
  createRecommendations(result, safetyLevel) {
    if (safetyLevel.level === 'verySafe' || safetyLevel.level === 'safe') {
      return null; // No recommendations for safe sites
    }
    
    const section = document.createElement('div');
    section.className = 'recommendations';
    section.style.marginTop = '1rem';
    section.style.padding = '1rem';
    section.style.backgroundColor = '#fff3cd';
    section.style.borderLeft = '4px solid #ffc107';
    section.style.borderRadius = '4px';
    
    const title = document.createElement('div');
    title.textContent = '💡 Recommendations';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '0.5rem';
    section.appendChild(title);
    
    const list = document.createElement('ul');
    list.style.margin = '0';
    list.style.paddingLeft = '1.5rem';
    
    const recommendations = this.getRecommendationsForLevel(safetyLevel.level);
    recommendations.forEach(rec => {
      const li = document.createElement('li');
      li.textContent = rec;
      li.style.fontSize = '0.9rem';
      li.style.marginBottom = '0.25rem';
      list.appendChild(li);
    });
    
    section.appendChild(list);
    return section;
  }

  /**
   * Get recommendations based on safety level
   */
  getRecommendationsForLevel(level) {
    const recommendations = {
      veryUnsafe: [
        '⛔ DO NOT visit this website',
        '⛔ DO NOT enter any personal information',
        '✅ Report this URL to authorities',
        '✅ Clear browser cache if already visited'
      ],
      unsafe: [
        '⚠️ Exercise extreme caution',
        '⚠️ Verify the URL is correct',
        '⚠️ Do not enter sensitive information',
        '✅ Check for HTTPS connection'
      ],
      caution: [
        '⚠️ Proceed with caution',
        '✅ Verify the website legitimacy',
        '✅ Check for spelling errors in URL',
        '✅ Look for trust indicators'
      ]
    };
    
    return recommendations[level] || [];
  }

  /**
   * Create performance metrics
   */
  createPerformanceMetrics(result) {
    const section = document.createElement('div');
    section.className = 'performance-metrics';
    section.style.marginTop = '1rem';
    section.style.padding = '0.75rem';
    section.style.backgroundColor = '#f5f5f5';
    section.style.borderRadius = '4px';
    section.style.fontSize = '0.85rem';
    
    const title = document.createElement('div');
    title.textContent = '📈 Performance Metrics';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '0.5rem';
    section.appendChild(title);
    
    const duration = document.createElement('div');
    duration.textContent = `Scan Duration: ${result.scanDuration}ms`;
    section.appendChild(duration);
    
    return section;
  }

  /**
   * Lighten a hex color
   */
  lightenColor(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16).slice(1);
  }
}

// Make available globally
if (typeof window !== 'undefined') {
  window.ResultDisplay = ResultDisplay;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ResultDisplay;
}
