-- URLY Scanner Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor to set up the database

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: scans
-- Stores all URL scan results
CREATE TABLE IF NOT EXISTS scans (
  id BIGSERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  normalized_url TEXT,
  protocol VARCHAR(10),
  hostname VARCHAR(255),
  
  -- Scan Results
  risk_score INTEGER,
  safety_score INTEGER,
  status VARCHAR(20) DEFAULT 'safe' CHECK (status IN ('safe', 'caution', 'unsafe')),
  rating VARCHAR(50),
  
  -- Heuristics
  heuristic_score INTEGER DEFAULT 0,
  heuristic_flags JSONB DEFAULT '[]'::jsonb,
  
  -- External Checks
  gsb_verdict VARCHAR(20),
  gsb_threats JSONB DEFAULT '[]'::jsonb,
  blocklist_match BOOLEAN DEFAULT FALSE,
  blocklist_type VARCHAR(50),
  
  -- Technical Details
  dns_resolved BOOLEAN,
  ssl_valid BOOLEAN,
  ssl_expires_days INTEGER,
  http_status INTEGER,
  redirects INTEGER DEFAULT 0,
  
  -- Metadata
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address VARCHAR(45),
  user_agent TEXT
);

-- Indexes for scans table
CREATE INDEX IF NOT EXISTS idx_scans_url ON scans USING btree (url);
CREATE INDEX IF NOT EXISTS idx_scans_hostname ON scans USING btree (hostname);
CREATE INDEX IF NOT EXISTS idx_scans_status ON scans USING btree (status);
CREATE INDEX IF NOT EXISTS idx_scans_scanned_at ON scans USING btree (scanned_at DESC);

-- Table: scan_recommendations
-- Stores recommendations for each scan
CREATE TABLE IF NOT EXISTS scan_recommendations (
  id BIGSERIAL PRIMARY KEY,
  scan_id BIGINT NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
  rating VARCHAR(50),
  message TEXT,
  action TEXT,
  context TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for scan_recommendations
CREATE INDEX IF NOT EXISTS idx_scan_recommendations_scan_id ON scan_recommendations USING btree (scan_id);

-- Table: scan_statistics
-- Stores daily/weekly statistics
CREATE TABLE IF NOT EXISTS scan_statistics (
  id BIGSERIAL PRIMARY KEY,
  stat_date DATE NOT NULL UNIQUE,
  total_scans INTEGER DEFAULT 0,
  safe_count INTEGER DEFAULT 0,
  caution_count INTEGER DEFAULT 0,
  unsafe_count INTEGER DEFAULT 0,
  avg_risk_score DECIMAL(5,2),
  gsb_threats_found INTEGER DEFAULT 0,
  blocklist_matches INTEGER DEFAULT 0
);

-- Index for scan_statistics
CREATE INDEX IF NOT EXISTS idx_scan_statistics_date ON scan_statistics USING btree (stat_date DESC);

-- Table: blocklist
-- Custom blocklist for URLs and hostnames
CREATE TABLE IF NOT EXISTS blocklist (
  id BIGSERIAL PRIMARY KEY,
  entry_type VARCHAR(20) NOT NULL CHECK (entry_type IN ('url', 'hostname', 'pattern')),
  value TEXT NOT NULL UNIQUE,
  reason TEXT,
  added_by VARCHAR(100),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Indexes for blocklist
CREATE INDEX IF NOT EXISTS idx_blocklist_type ON blocklist USING btree (entry_type);
CREATE INDEX IF NOT EXISTS idx_blocklist_active ON blocklist USING btree (is_active);
CREATE INDEX IF NOT EXISTS idx_blocklist_value ON blocklist USING btree (value);

-- Table: configuration
-- Stores system configuration and settings
CREATE TABLE IF NOT EXISTS configuration (
  id BIGSERIAL PRIMARY KEY,
  config_key VARCHAR(100) NOT NULL UNIQUE,
  config_value TEXT,
  config_type VARCHAR(20) DEFAULT 'string',
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for configuration
CREATE INDEX IF NOT EXISTS idx_configuration_key ON configuration USING btree (config_key);

-- Insert default configuration values
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
ON CONFLICT (config_key) DO NOTHING;

-- Optional: Create a function to get status breakdown (for better performance)
CREATE OR REPLACE FUNCTION get_status_breakdown()
RETURNS TABLE (status VARCHAR(20), count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT s.status, COUNT(*)::BIGINT as count
  FROM scans s
  GROUP BY s.status;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (RLS) - Optional but recommended
-- Uncomment these if you want to use RLS for security

-- ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE scan_recommendations ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE scan_statistics ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE blocklist ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE configuration ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (modify as needed)
-- Example: Allow all operations for service role
-- CREATE POLICY "Enable all for service role" ON scans FOR ALL USING (auth.role() = 'service_role');
-- CREATE POLICY "Enable all for service role" ON scan_recommendations FOR ALL USING (auth.role() = 'service_role');
-- CREATE POLICY "Enable all for service role" ON scan_statistics FOR ALL USING (auth.role() = 'service_role');
-- CREATE POLICY "Enable all for service role" ON blocklist FOR ALL USING (auth.role() = 'service_role');
-- CREATE POLICY "Enable all for service role" ON configuration FOR ALL USING (auth.role() = 'service_role');

-- Or allow public access for read (if your app needs it)
-- CREATE POLICY "Enable read for all" ON scans FOR SELECT USING (true);
-- CREATE POLICY "Enable read for all" ON scan_statistics FOR SELECT USING (true);
-- CREATE POLICY "Enable read for all" ON blocklist FOR SELECT USING (true);
-- CREATE POLICY "Enable read for all" ON configuration FOR SELECT USING (true);

COMMENT ON TABLE scans IS 'Stores all URL scan results with risk scores and technical details';
COMMENT ON TABLE scan_recommendations IS 'Stores safety recommendations for each scan';
COMMENT ON TABLE scan_statistics IS 'Aggregated daily statistics for monitoring';
COMMENT ON TABLE blocklist IS 'Custom blocklist for malicious URLs and domains';
COMMENT ON TABLE configuration IS 'System configuration and feature toggles';
