import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { SSEProvider } from './context/SSEContext';  // ← ייבוא ה‐Provider החדש

import './styles/AccessibilityWidget.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        {/* עטיפה ב־SSEProvider כדי שה‐EventSource יפעל לכל אורך האפליקציה */}
        <SSEProvider>
          <App />
        </SSEProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
