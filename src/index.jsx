import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NotificationsProvider } from "./context/NotificationsContext";
import { UnreadMessagesProvider } from "./context/UnreadMessagesContext";
import { SocketProvider } from "./context/socketContext"; // 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./styles/index.css";

// Polyfill ל-Buffer בדפדפן (נדרש בחלק מהספריות)
import { Buffer } from "buffer";
window.Buffer = window.Buffer || Buffer;

const queryClient = new QueryClient();
const App = lazy(() => import("./App"));

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SocketProvider> {/* ⭐️ עטיפת האפליקציה בסוקט קונטקסט */}
            <NotificationsProvider>
              <UnreadMessagesProvider>
                <Suspense fallback={<div className="spinner"></div>}>
                  <App />
                </Suspense>
              </UnreadMessagesProvider>
            </NotificationsProvider>
          </SocketProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
