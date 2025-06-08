import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/socketContext';
import { UnreadMessagesProvider } from './context/UnreadMessagesContext'; 

// Polyfill ל-Buffer בדפדפן:
import { Buffer } from 'buffer';
window.Buffer = window.Buffer || Buffer;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <UnreadMessagesProvider>  {/* הוסף עטיפה כאן */}
            <App />
          </UnreadMessagesProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
