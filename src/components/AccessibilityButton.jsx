// src/components/AccessibilityButton.jsx
import React from 'react';

const AccessibilityButton = () => {
  return (
    <button 
      style={{
        position: 'fixed', 
        bottom: '20px', 
        right: '20px', 
        background: '#005b96', 
        color: 'white', 
        border: 'none', 
        padding: '.75rem', 
        borderRadius: '50%', 
        fontSize: '1.5rem', 
        cursor: 'pointer', 
        zIndex: '999999999'
      }}
    >
      נגישות
    </button>
  );
}

export default AccessibilityButton;
