/**
 * Configuration Toggle Button Component
 * Floating button to open configuration panel
 */

import React from 'react';

export default function ConfigButton({ onClick }) {
  return (
    <button
      className="config-toggle-button"
      onClick={onClick}
      title="Open Configuration Panel"
      aria-label="Open Configuration Settings"
    >
      ⚙️
    </button>
  );
}
