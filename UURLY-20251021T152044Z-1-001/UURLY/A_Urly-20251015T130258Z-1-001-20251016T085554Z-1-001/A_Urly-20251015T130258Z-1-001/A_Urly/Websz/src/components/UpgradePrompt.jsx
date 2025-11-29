import React from 'react';
import { getUpgradeMessage } from '../config/demoConfig';

const UpgradePrompt = ({ onClose }) => {
  const upgradeInfo = getUpgradeMessage();

  return (
    <div className="upgrade-prompt-overlay">
      <div className="upgrade-prompt-modal">
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="upgrade-header">
          <h2>{upgradeInfo.title}</h2>
          <p className="demo-badge">You're using the Demo Version</p>
        </div>

        <div className="upgrade-content">
          <div className="features-list">
            <h3>Unlock Premium Features:</h3>
            <ul>
              {upgradeInfo.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="pricing">
            <div className="price-tag">
              <span className="currency">$</span>
              <span className="amount">49</span>
              <span className="period">one-time</span>
            </div>
            <p className="price-description">Lifetime access • All updates included</p>
          </div>

          <a 
            href={upgradeInfo.link} 
            className="upgrade-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            {upgradeInfo.cta} 🚀
          </a>

          <div className="guarantee">
            <p>✅ 30-day money-back guarantee</p>
            <p>✅ Instant access after purchase</p>
            <p>✅ Priority email support</p>
          </div>
        </div>

        <div className="upgrade-footer">
          <p>Questions? Email: <a href="mailto:jester.penaloza@example.com">jester.penaloza@example.com</a></p>
        </div>
      </div>

      <style jsx>{`
        .upgrade-prompt-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.3s;
        }

        .upgrade-prompt-modal {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          padding: 40px;
          max-width: 600px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          color: white;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.4s;
        }

        .close-button {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          font-size: 30px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s;
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }

        .upgrade-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .upgrade-header h2 {
          font-size: 32px;
          margin-bottom: 10px;
        }

        .demo-badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.2);
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 14px;
        }

        .features-list {
          background: rgba(255, 255, 255, 0.1);
          padding: 25px;
          border-radius: 15px;
          margin-bottom: 25px;
        }

        .features-list h3 {
          margin-bottom: 15px;
          font-size: 20px;
        }

        .features-list ul {
          list-style: none;
          padding: 0;
        }

        .features-list li {
          padding: 8px 0;
          font-size: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .features-list li:last-child {
          border-bottom: none;
        }

        .pricing {
          text-align: center;
          margin: 30px 0;
        }

        .price-tag {
          font-size: 24px;
          margin-bottom: 10px;
        }

        .price-tag .amount {
          font-size: 60px;
          font-weight: bold;
          margin: 0 5px;
        }

        .price-description {
          opacity: 0.9;
          font-size: 14px;
        }

        .upgrade-button {
          display: block;
          width: 100%;
          padding: 18px;
          background: white;
          color: #667eea;
          text-align: center;
          border-radius: 10px;
          font-size: 20px;
          font-weight: bold;
          text-decoration: none;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .upgrade-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        .guarantee {
          margin-top: 25px;
          text-align: center;
          font-size: 14px;
          opacity: 0.9;
        }

        .guarantee p {
          margin: 5px 0;
        }

        .upgrade-footer {
          text-align: center;
          margin-top: 25px;
          padding-top: 25px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          font-size: 14px;
          opacity: 0.8;
        }

        .upgrade-footer a {
          color: white;
          text-decoration: underline;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default UpgradePrompt;
