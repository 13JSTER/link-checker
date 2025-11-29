-- URLY Scanner Database Schema
-- Database: urly

-- Table: scans
-- Stores all URL scan results
CREATE TABLE IF NOT EXISTS scans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  url VARCHAR(2048) NOT NULL,
  normalized_url VARCHAR(2048),
  protocol VARCHAR(10),
  hostname VARCHAR(255),
  
  -- Scan Results
  risk_score INT,
  safety_score INT,
  status ENUM('safe', 'caution', 'unsafe') DEFAULT 'safe',
  rating VARCHAR(50),
  
  -- Heuristics
  heuristic_score INT DEFAULT 0,
  heuristic_flags JSON,
  
  -- External Checks
  gsb_verdict VARCHAR(20),
  gsb_threats JSON,
  blocklist_match BOOLEAN DEFAULT FALSE,
  blocklist_type VARCHAR(50),
  
  -- Technical Details
  dns_resolved BOOLEAN,
  ssl_valid BOOLEAN,
  ssl_expires_days INT,
  http_status INT,
  redirects INT DEFAULT 0,
  
  -- Metadata
  scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  user_agent TEXT,
  
  INDEX idx_url (url(255)),
  INDEX idx_hostname (hostname),
  INDEX idx_status (status),
  INDEX idx_scanned_at (scanned_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: scan_recommendations
-- Stores recommendations for each scan
CREATE TABLE IF NOT EXISTS scan_recommendations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  scan_id INT NOT NULL,
  rating VARCHAR(50),
  message TEXT,
  action TEXT,
  context TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (scan_id) REFERENCES scans(id) ON DELETE CASCADE,
  INDEX idx_scan_id (scan_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: scan_statistics
-- Stores daily/weekly statistics
CREATE TABLE IF NOT EXISTS scan_statistics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  stat_date DATE NOT NULL UNIQUE,
  total_scans INT DEFAULT 0,
  safe_count INT DEFAULT 0,
  caution_count INT DEFAULT 0,
  unsafe_count INT DEFAULT 0,
  avg_risk_score DECIMAL(5,2),
  gsb_threats_found INT DEFAULT 0,
  blocklist_matches INT DEFAULT 0,
  
  INDEX idx_date (stat_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: blocklist
-- Custom blocklist for URLs and hostnames
CREATE TABLE IF NOT EXISTS blocklist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  entry_type ENUM('url', 'hostname', 'pattern') NOT NULL,
  value VARCHAR(2048) NOT NULL,
  reason TEXT,
  added_by VARCHAR(100),
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  
  UNIQUE KEY unique_value (value(255)),
  INDEX idx_type (entry_type),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: configuration
-- Stores system configuration and settings
CREATE TABLE IF NOT EXISTS configuration (
  id INT AUTO_INCREMENT PRIMARY KEY,
  config_key VARCHAR(100) NOT NULL UNIQUE,
  config_value TEXT,
  config_type VARCHAR(20) DEFAULT 'string',
  description TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_key (config_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default configuration
INSERT INTO configuration (config_key, config_value, config_type, description) VALUES
('gsb_enabled', 'true', 'boolean', 'Enable Google Safe Browsing checks'),
('heuristics_enabled', 'true', 'boolean', 'Enable heuristic analysis'),
('dns_enabled', 'true', 'boolean', 'Enable DNS lookup'),
('ssl_enabled', 'false', 'boolean', 'Enable SSL/TLS verification'),
('follow_redirects', 'true', 'boolean', 'Follow URL redirects during scanning'),
('max_redirects', '5', 'number', 'Maximum number of redirects to follow'),
('max_batch_size', '10', 'number', 'Maximum URLs to scan in one batch'),
('max_concurrent_requests', '5', 'number', 'Maximum concurrent scan requests'),
('max_scan_history', '1000', 'number', 'Maximum number of scans to keep in history'),
('auto_cleanup_days', '30', 'number', 'Auto-delete scans older than X days')
ON DUPLICATE KEY UPDATE config_value=config_value;
