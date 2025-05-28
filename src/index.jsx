import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { SSEProvider } from './context/SSEContext';
import { SocketProvider } from './context/socketContext';

// Polyfill ל-Buffer בדפדפן:
import { Buffer } from 'buffer';
window.Buffer = window.Buffer || Buffer;

// עטוף את App ב-SSEProvider **בתוך App.jsx עצמו**
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
