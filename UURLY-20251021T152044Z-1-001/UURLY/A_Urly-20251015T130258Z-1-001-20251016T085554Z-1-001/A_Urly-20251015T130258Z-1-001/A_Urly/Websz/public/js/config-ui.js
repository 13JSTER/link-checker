/**
 * Configuration UI Panel
 * Provides a user interface for adjusting scanner configuration
 */

class ConfigUI {
  constructor(configManager) {
    this.configManager = configManager;
    this.panel = null;
    this.isOpen = false;
  }

  /**
   * Initialize configuration UI
   */
  init() {
    console.log('🔧 ConfigUI.init() called');
    console.log('ConfigManager instance:', this.configManager);
    
    try {
      console.log('Creating panel...');
      this.createPanel();
      console.log('Panel created:', this.panel);
      
      console.log('Creating toggle button...');
      this.createToggleButton();
      console.log('Toggle button created');
      
      console.log('Attaching event listeners...');
      this.attachEventListeners();
      
      console.log('✅ Configuration UI initialized successfully!');
      console.log('👉 Look for ⚙️ button in bottom-right corner of the page');
    } catch (error) {
      console.error('❌ Error during ConfigUI initialization:', error);
      console.error('Stack trace:', error.stack);
    }
  }

  /**
   * Create configuration panel
   */
  createPanel() {
    const panel = document.createElement('div');
    panel.id = 'config-panel';
    panel.className = 'config-panel';
    panel.style.cssText = `
      position: fixed;
      top: 0;
      right: -400px;
      width: 400px;
      height: 100vh;
      background: white;
      box-shadow: -2px 0 10px rgba(0,0,0,0.1);
      z-index: 10000;
      transition: right 0.3s ease;
      overflow-y: auto;
      padding: 20px;
    `;
    
    // Create panel content
    panel.innerHTML = `
      <div class="config-panel-header" style="margin-bottom: 20px; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
        <h2 style="margin: 0; color: #007bff;">⚙️ Scanner Configuration</h2>
        <button id="config-close" style="position: absolute; top: 20px; right: 20px; border: none; background: none; font-size: 24px; cursor: pointer;">×</button>
      </div>
      
      <div class="config-section">
        <h3 style="color: #333; margin-top: 0;">🔍 Scanning Mode</h3>
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px;">
            <input type="radio" name="scanMode" value="standard" checked> Standard Scan
          </label>
          <label style="display: block; margin-bottom: 5px;">
            <input type="radio" name="scanMode" value="fast"> Fast Scan (Quick checks)
          </label>
          <label style="display: block; margin-bottom: 5px;">
            <input type="radio" name="scanMode" value="deep"> Deep Scan (Comprehensive)
          </label>
        </div>
      </div>
      
      <div class="config-section">
        <h3 style="color: #333;">📊 Detection Features</h3>
        <label style="display: flex; align-items: center; margin-bottom: 10px;">
          <input type="checkbox" id="config-heuristics" checked style="margin-right: 10px;">
          Heuristic Analysis
        </label>
        <label style="display: flex; align-items: center; margin-bottom: 10px;">
          <input type="checkbox" id="config-gsb" checked style="margin-right: 10px;">
          Google Safe Browsing
        </label>
      </div>
      
      <div class="config-section">
        <h3 style="color: #333;">🎯 Sensitivity</h3>
        <label style="display: block; margin-bottom: 5px;">Risk Threshold:</label>
        <input type="range" id="config-sensitivity" min="20" max="80" value="30" step="10" style="width: 100%;">
        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: #666;">
          <span>Strict</span>
          <span id="sensitivity-value">Medium</span>
          <span>Lenient</span>
        </div>
      </div>
      
      <div class="config-section">
        <h3 style="color: #333;">⚡ Performance</h3>
        <label style="display: flex; align-items: center; margin-bottom: 10px;">
          <input type="checkbox" id="config-cache" checked style="margin-right: 10px;">
          Enable Caching
        </label>
        <label style="display: block; margin-bottom: 5px;">Max Concurrent Scans:</label>
        <input type="number" id="config-concurrent" min="1" max="10" value="3" style="width: 100%; padding: 5px;">
      </div>
      
      <div class="config-section">
        <h3 style="color: #333;">📋 Display Options</h3>
        <label style="display: flex; align-items: center; margin-bottom: 10px;">
          <input type="checkbox" id="config-detailed" checked style="margin-right: 10px;">
          Show Detailed Results
        </label>
        <label style="display: flex; align-items: center; margin-bottom: 10px;">
          <input type="checkbox" id="config-breakdown" checked style="margin-right: 10px;">
          Show Risk Breakdown
        </label>
        <label style="display: flex; align-items: center; margin-bottom: 10px;">
          <input type="checkbox" id="config-performance" checked style="margin-right: 10px;">
          Show Performance Metrics
        </label>
      </div>
      
      <div class="config-actions" style="margin-top: 30px; display: flex; gap: 10px;">
        <button id="config-save" style="flex: 1; padding: 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
          💾 Save Changes
        </button>
        <button id="config-reset" style="flex: 1; padding: 10px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">
          🔄 Reset to Default
        </button>
      </div>
      
      <div class="config-footer" style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 0.85rem; color: #666;">
        <div style="margin-bottom: 10px;">
          <button id="config-export" style="width: 100%; padding: 8px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; margin-bottom: 5px;">
            📥 Export Configuration
          </button>
          <button id="config-import" style="width: 100%; padding: 8px; background: #17a2b8; color: white; border: none; border-radius: 4px; cursor: pointer;">
            📤 Import Configuration
          </button>
        </div>
        <div style="text-align: center;">
          Configuration v1.0.0
        </div>
      </div>
    `;
    
    document.body.appendChild(panel);
    this.panel = panel;
    
    // Load current configuration
    this.loadCurrentConfig();
  }

  /**
   * Create toggle button
   */
  createToggleButton() {
    console.log('🎨 Creating toggle button...');
    
    const button = document.createElement('button');
    button.id = 'config-toggle';
    button.className = 'config-toggle-button';
    button.innerHTML = '⚙️';
    button.title = 'Open Configuration Panel';
    button.setAttribute('aria-label', 'Open Configuration Settings');
    
    console.log('Button element created:', button);
    
    button.style.cssText = `
      position: fixed !important;
      bottom: 20px !important;
      right: 20px !important;
      width: 60px !important;
      height: 60px !important;
      border-radius: 50% !important;
      background: linear-gradient(135deg, #007bff, #0056b3) !important;
      color: white !important;
      border: none !important;
      font-size: 24px !important;
      cursor: pointer !important;
      box-shadow: 0 4px 12px rgba(0,123,255,0.4) !important;
      z-index: 9999 !important;
      transition: all 0.3s ease !important;
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
    `;
    
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.1) rotate(90deg)';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1) rotate(0deg)';
    });
    
    console.log('Appending button to document.body...');
    console.log('Body element:', document.body);
    document.body.appendChild(button);
    console.log('Button appended. Button in DOM:', document.body.contains(button));
    console.log('Button computed style:', window.getComputedStyle(button).position);
    
    this.toggleButton = button;
    
    console.log('✅ Toggle button created and added to DOM');
    console.log('Button ID:', button.id);
    console.log('Button innerHTML:', button.innerHTML);
    console.log('Button position in body:', Array.from(document.body.children).indexOf(button));
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Toggle panel
    this.toggleButton.addEventListener('click', () => this.togglePanel());
    document.getElementById('config-close').addEventListener('click', () => this.closePanel());
    
    // Save configuration
    document.getElementById('config-save').addEventListener('click', () => this.saveConfiguration());
    
    // Reset configuration
    document.getElementById('config-reset').addEventListener('click', () => this.resetConfiguration());
    
    // Export/Import
    document.getElementById('config-export').addEventListener('click', () => this.exportConfiguration());
    document.getElementById('config-import').addEventListener('click', () => this.importConfiguration());
    
    // Sensitivity slider
    const sensitivitySlider = document.getElementById('config-sensitivity');
    const sensitivityValue = document.getElementById('sensitivity-value');
    sensitivitySlider.addEventListener('input', (e) => {
      const value = parseInt(e.target.value);
      sensitivityValue.textContent = value <= 30 ? 'Strict' : value <= 50 ? 'Medium' : 'Lenient';
    });
  }

  /**
   * Load current configuration into UI
   */
  loadCurrentConfig() {
    const config = this.configManager.getConfig();
    
    // Scan mode
    const fastMode = config.scanning.fastMode;
    const deepScan = config.scanning.deepScan;
    const mode = fastMode ? 'fast' : deepScan ? 'deep' : 'standard';
    document.querySelector(`input[name="scanMode"][value="${mode}"]`).checked = true;
    
    // Features
    document.getElementById('config-heuristics').checked = config.heuristics.enabled;
    document.getElementById('config-gsb').checked = config.api.gsb.enabled;
    
    // Sensitivity
    document.getElementById('config-sensitivity').value = config.heuristics.thresholds.safe;
    
    // Performance
    document.getElementById('config-cache').checked = config.performance.enableCache;
    document.getElementById('config-concurrent').value = config.scanning.maxConcurrent;
    
    // Display
    document.getElementById('config-detailed').checked = config.display.detailed;
    document.getElementById('config-breakdown').checked = config.display.showBreakdown;
    document.getElementById('config-performance').checked = config.display.showPerformance;
  }

  /**
   * Save configuration
   */
  saveConfiguration() {
    // Get scan mode
    const scanMode = document.querySelector('input[name="scanMode"]:checked').value;
    this.configManager.set('scanning.fastMode', scanMode === 'fast');
    this.configManager.set('scanning.deepScan', scanMode === 'deep');
    
    // Get features
    this.configManager.set('heuristics.enabled', document.getElementById('config-heuristics').checked);
    this.configManager.set('api.gsb.enabled', document.getElementById('config-gsb').checked);
    
    // Get sensitivity
    const sensitivity = parseInt(document.getElementById('config-sensitivity').value);
    this.configManager.set('heuristics.thresholds.safe', sensitivity);
    
    // Get performance
    this.configManager.set('performance.enableCache', document.getElementById('config-cache').checked);
    this.configManager.set('scanning.maxConcurrent', parseInt(document.getElementById('config-concurrent').value));
    
    // Get display options
    this.configManager.set('display.detailed', document.getElementById('config-detailed').checked);
    this.configManager.set('display.showBreakdown', document.getElementById('config-breakdown').checked);
    this.configManager.set('display.showPerformance', document.getElementById('config-performance').checked);
    
    // Show success message
    this.showNotification('✅ Configuration saved successfully!', 'success');
    
    console.log('💾 Configuration saved:', this.configManager.getSummary());
  }

  /**
   * Reset configuration
   */
  resetConfiguration() {
    if (confirm('Reset configuration to default values?')) {
      this.configManager.reset();
      this.loadCurrentConfig();
      this.showNotification('🔄 Configuration reset to defaults', 'info');
    }
  }

  /**
   * Export configuration
   */
  exportConfiguration() {
    const config = this.configManager.export();
    const blob = new Blob([config], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scanner-config-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.showNotification('📥 Configuration exported', 'success');
  }

  /**
   * Import configuration
   */
  importConfiguration() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const success = this.configManager.import(event.target.result);
          if (success) {
            this.loadCurrentConfig();
            this.showNotification('📤 Configuration imported successfully!', 'success');
          } else {
            this.showNotification('❌ Failed to import configuration', 'error');
          }
        } catch (error) {
          this.showNotification('❌ Invalid configuration file', 'error');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  /**
   * Toggle panel
   */
  togglePanel() {
    if (this.isOpen) {
      this.closePanel();
    } else {
      this.openPanel();
    }
  }

  /**
   * Open panel
   */
  openPanel() {
    this.panel.style.right = '0';
    this.isOpen = true;
  }

  /**
   * Close panel
   */
  closePanel() {
    this.panel.style.right = '-400px';
    this.isOpen = false;
  }

  /**
   * Show notification
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'config-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
      color: white;
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10001;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
  
  .config-panel::-webkit-scrollbar {
    width: 8px;
  }
  
  .config-panel::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  .config-panel::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
  
  .config-panel::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  
  .config-section {
    margin-bottom: 25px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
  }
`;
document.head.appendChild(style);

// Make available globally
if (typeof window !== 'undefined') {
  window.ConfigUI = ConfigUI;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ConfigUI;
}
