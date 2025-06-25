import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/socketContext";
import { UnreadMessagesProvider } from "./context/UnreadMessagesContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ייבוא CSS ראשי — הכרחי לאנימציית spin
import "./styles/index.css";

// Polyfill ל-Buffer בדפדפן
import { Buffer } from "buffer";
window.Buffer = window.Buffer || Buffer;

// יצירת QueryClient חדש
const queryClient = new QueryClient();

// טעינת קומפוננטה App בצורה דינמית
const App = lazy(() => import("./App"));

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SocketProvider>
            <UnreadMessagesProvider>
              <Suspense fallback={<div className="spinner"></div>}>
                <App />
              </Suspense>
            </UnreadMessagesProvider>
          </SocketProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
