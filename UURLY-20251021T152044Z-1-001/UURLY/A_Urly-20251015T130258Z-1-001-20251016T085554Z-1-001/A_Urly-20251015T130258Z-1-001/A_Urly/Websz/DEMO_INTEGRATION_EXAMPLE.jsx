// Example: How to integrate demo limitations into your scanner

import React, { useState } from 'react';
import { canPerformScan, incrementScanCount, DEMO_CONFIG } from './config/demoConfig';
import UpgradePrompt from './components/UpgradePrompt';
import DemoWatermark from './components/DemoWatermark';

const ScannerWithDemo = () => {
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const handleScan = async (url) => {
    // Check if scan is allowed in demo version
    const scanCheck = canPerformScan();
    
    if (!scanCheck.allowed) {
      // Show upgrade prompt when limit reached
      setShowUpgradePrompt(true);
      alert(scanCheck.message);
      return;
    }

    // Show remaining scans in demo
    if (DEMO_CONFIG.isDemoVersion && scanCheck.scansRemaining !== undefined) {
      console.log(`Demo: ${scanCheck.scansRemaining} scans remaining`);
    }

    // Perform the scan
    try {
      const response = await fetch('http://localhost:3000/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      const result = await response.json();
      setScanResult(result);

      // Increment scan counter for demo version
      incrementScanCount();

      // Show upgrade prompt after reaching limit
      const updatedCheck = canPerformScan();
      if (!updatedCheck.allowed) {
        setTimeout(() => setShowUpgradePrompt(true), 1000);
      }

    } catch (error) {
      console.error('Scan error:', error);
    }
  };

  return (
    <div className="scanner-container">
      {/* Demo watermark at bottom */}
      <DemoWatermark />

      {/* Your scanner UI */}
      <div className="scanner-content">
        <h1>URLY Scanner</h1>
        
        {/* Demo badge */}
        {DEMO_CONFIG.isDemoVersion && (
          <div className="demo-badge">
            🎯 Demo Version - {canPerformScan().scansRemaining || 0} scans remaining
          </div>
        )}

        <input 
          type="url" 
          placeholder="Enter URL to scan..."
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleScan(e.target.value);
            }
          }}
        />

        <button onClick={(e) => {
          const input = e.target.previousSibling;
          handleScan(input.value);
        }}>
          Scan URL
        </button>

        {scanResult && (
          <div className="scan-result">
            {/* Display scan results */}
            <pre>{JSON.stringify(scanResult, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* Upgrade prompt modal */}
      {showUpgradePrompt && (
        <UpgradePrompt onClose={() => setShowUpgradePrompt(false)} />
      )}

      <style jsx>{`
        .scanner-container {
          padding-bottom: 60px; /* Space for watermark */
        }

        .demo-badge {
          background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          display: inline-block;
          margin: 10px 0;
          font-size: 14px;
          font-weight: 600;
        }

        .scanner-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        input[type="url"] {
          width: 100%;
          padding: 15px;
          font-size: 16px;
          border: 2px solid #ddd;
          border-radius: 8px;
          margin: 10px 0;
        }

        button {
          padding: 15px 30px;
          font-size: 16px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
        }

        button:hover {
          background: #5568d3;
          transform: translateY(-2px);
        }

        .scan-result {
          margin-top: 20px;
          padding: 20px;
          background: #f5f5f5;
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }
      `}</style>
    </div>
  );
};

export default ScannerWithDemo;
