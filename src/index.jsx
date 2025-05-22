import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SSEProvider } from './context/SSEContext';

// Polyfill ל-Buffer בדפדפן:
import { Buffer } from 'buffer';
window.Buffer = window.Buffer || Buffer;

// קומפוננטת Wrapper ששלפה את ה-businessId מה-AuthContext ומעבירה ל-SSEProvider
function SSEWrapper({ children }) {
  const { user } = useAuth();
  return (
    <SSEProvider businessId={user?.businessId}>
      {children}
    </SSEProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SSEWrapper>
          <App />
        </SSEWrapper>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
