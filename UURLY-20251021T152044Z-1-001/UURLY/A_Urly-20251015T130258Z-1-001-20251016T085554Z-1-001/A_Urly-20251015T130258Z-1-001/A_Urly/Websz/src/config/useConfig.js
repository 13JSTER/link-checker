/**
 * Configuration Manager Hook
 * React hook for managing scanner configuration
 */

import { useState, useEffect } from 'react';
import { defaultConfig, configValidation } from './scannerConfig';

const STORAGE_KEY = 'urlScanner_config_v2';

class ConfigManager {
  constructor() {
    this.config = { ...defaultConfig };
    this.listeners = [];
  }

  /**
   * Initialize configuration from localStorage
   */
  init() {
    const savedConfig = this.loadFromStorage();
    if (savedConfig) {
      this.config = this.mergeConfig(defaultConfig, savedConfig);
    }
    return this.config;
  }

  /**
   * Get configuration value by path
   */
  get(path) {
    const keys = path.split('.');
    let value = this.config;
    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) break;
    }
    return value;
  }

  /**
   * Set configuration value by path
   */
  set(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let target = this.config;
    
    for (const key of keys) {
      if (!target[key]) target[key] = {};
      target = target[key];
    }
    
    target[lastKey] = value;
    this.saveToStorage();
    this.notifyListeners();
    return true;
  }

  /**
   * Reset configuration to defaults
   */
  reset() {
    this.config = { ...defaultConfig };
    this.saveToStorage();
    this.notifyListeners();
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
      this.config = this.mergeConfig(defaultConfig, imported);
      this.saveToStorage();
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Failed to import configuration:', error);
      return false;
    }
  }

  /**
   * Validate configuration
   */
  validate() {
    const errors = [];
    
    for (const [path, rules] of Object.entries(configValidation)) {
      const value = this.get(path);
      
      if (rules.type && typeof value !== rules.type) {
        errors.push(`${path}: Expected ${rules.type}, got ${typeof value}`);
      }
      
      if (rules.min !== undefined && value < rules.min) {
        errors.push(`${path}: Value ${value} is below minimum ${rules.min}`);
      }
      
      if (rules.max !== undefined && value > rules.max) {
        errors.push(`${path}: Value ${value} exceeds maximum ${rules.max}`);
      }
    }
    
    return { valid: errors.length === 0, errors };
  }

  /**
   * Save configuration to localStorage
   */
  saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
      return true;
    } catch (error) {
      console.error('Failed to save configuration:', error);
      return false;
    }
  }

  /**
   * Load configuration from localStorage
   */
  loadFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Failed to load configuration:', error);
      return null;
    }
  }

  /**
   * Merge configurations
   */
  mergeConfig(base, override) {
    const result = { ...base };
    
    for (const [key, value] of Object.entries(override)) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        result[key] = this.mergeConfig(base[key] || {}, value);
      } else {
        result[key] = value;
      }
    }
    
    return result;
  }

  /**
   * Subscribe to configuration changes
   */
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Notify all listeners of configuration change
   */
  notifyListeners() {
    this.listeners.forEach(listener => listener(this.config));
  }

  /**
   * Get entire configuration
   */
  getAll() {
    return { ...this.config };
  }
}

// Singleton instance
const configManagerInstance = new ConfigManager();
configManagerInstance.init();

// React hook for using configuration
export function useConfig() {
  const [config, setConfig] = useState(configManagerInstance.getAll());

  useEffect(() => {
    const unsubscribe = configManagerInstance.subscribe((newConfig) => {
      setConfig({ ...newConfig });
    });
    return unsubscribe;
  }, []);

  const updateConfig = (path, value) => {
    configManagerInstance.set(path, value);
  };

  const resetConfig = () => {
    configManagerInstance.reset();
  };

  const exportConfig = () => {
    return configManagerInstance.export();
  };

  const importConfig = (jsonString) => {
    return configManagerInstance.import(jsonString);
  };

  const validateConfig = () => {
    return configManagerInstance.validate();
  };

  return {
    config,
    updateConfig,
    resetConfig,
    exportConfig,
    importConfig,
    validateConfig,
    getConfig: (path) => configManagerInstance.get(path)
  };
}

export { configManagerInstance };
export default ConfigManager;
