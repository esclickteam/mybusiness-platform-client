import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";

import { Buffer } from "buffer";

/* i18n */
import "./i18n/i18n";

/* Contexts */
import { AuthProvider } from "./context/AuthContext";
import { NotificationsProvider } from "./context/NotificationsContext";

/* Styles */
import "./styles/index.css";
import { registerServiceWorkerNotificationBridge } from "./utils/notificationNavigation";

/* ==========================================================
   Types
========================================================== */

declare global {
  interface Window {
    Buffer?: typeof Buffer;
  }
}

/* ==========================================================
   Buffer Polyfill
========================================================== */

if (!window.Buffer) {
  window.Buffer = Buffer;
}

/* ==========================================================
   Theme bootstrap before app render
========================================================== */

const savedTheme = localStorage.getItem("theme");
const defaultTheme = savedTheme || "light";

const isBusinessTheme = defaultTheme === "business" || defaultTheme === "dark";

document.body.style.background = isBusinessTheme ? "#f6f7fb" : "#ffffff";
document.documentElement.style.background = isBusinessTheme
  ? "#f6f7fb"
  : "#ffffff";

document.body.setAttribute("data-theme", defaultTheme);

/* ==========================================================
   React Query
========================================================== */

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 60 * 1000,
    },
  },
});

/* ==========================================================
   Lazy App
========================================================== */

const App = lazy(() => import("./App.jsx"));

/* ==========================================================
   Fallback
========================================================== */

function AppLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-violet-600" />

        <p className="text-sm font-bold text-slate-500">
          Loading Bizuply...
        </p>
      </div>
    </div>
  );
}

/* ==========================================================
   Render Root
========================================================== */

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element with id 'root' was not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <NotificationsProvider>
              <Suspense fallback={<AppLoader />}>
                <App />
              </Suspense>
            </NotificationsProvider>
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

/* ==========================================================
   PWA service worker (push notifications)
========================================================== */

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .catch((err) => console.error("Service worker registration failed:", err));
  });
}

registerServiceWorkerNotificationBridge();