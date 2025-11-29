import React from 'react';
import { DEMO_CONFIG } from '../config/demoConfig';

const DemoWatermark = () => {
  if (!DEMO_CONFIG.watermark.enabled) return null;

  return (
    <div className="demo-watermark">
      <div className="watermark-content">
        <span className="watermark-text">🎯 {DEMO_CONFIG.watermark.text}</span>
        <a 
          href={DEMO_CONFIG.watermark.upgradeLink} 
          className="watermark-upgrade-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Upgrade to Full Version →
        </a>
      </div>

      <style jsx>{`
        .demo-watermark {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%);
          padding: 12px 20px;
          z-index: 9998;
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
        }

        .watermark-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .watermark-text {
          color: white;
          font-weight: 600;
          font-size: 14px;
        }

        .watermark-upgrade-link {
          color: white;
          text-decoration: none;
          background: rgba(255, 255, 255, 0.2);
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.3s;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .watermark-upgrade-link:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .watermark-content {
            justify-content: center;
            text-align: center;
          }

          .watermark-text {
            font-size: 12px;
          }

          .watermark-upgrade-link {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default DemoWatermark;
