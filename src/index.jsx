import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NotificationsProvider } from "./context/NotificationsContext";
import { UnreadMessagesProvider } from "./context/UnreadMessagesContext"; // ✅ חדש
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./styles/index.css";

// Polyfill ל-Buffer בדפדפן
import { Buffer } from "buffer";
window.Buffer = window.Buffer || Buffer;

const queryClient = new QueryClient();
const App = lazy(() => import("./App"));

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NotificationsProvider>
            <UnreadMessagesProvider> {/* ✅ עטיפה של אפליקציית ההודעות */}
              <Suspense fallback={<div className="spinner"></div>}>
                <App />
              </Suspense>
            </UnreadMessagesProvider>
          </NotificationsProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
