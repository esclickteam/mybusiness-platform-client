import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/* === Contexts === */
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NotificationsProvider } from "./context/NotificationsContext";
import useIdleLogout from "./hooks/useIdleLogout";
import "./styles/index.css";

/* === Polyfill for Buffer (some libraries need it) === */
import { Buffer } from "buffer";
if (!window.Buffer) window.Buffer = Buffer;

/* === React Query Config === */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // avoids unwanted refetches
      retry: 2, // retry twice before failing
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

/* === Lazy load main App === */
const App = lazy(() => import("./App"));

/* === Idle logout wrapper === */
function AppWithIdleLogout() {
  const { logout } = useAuth();

  // Logout after 10 minutes of inactivity
  useIdleLogout(logout, 10 * 60 * 1000);

  return <App />;
}

/* === Render Application === */
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("❌ Root element not found — check index.html!");
} else {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <NotificationsProvider>
              <Suspense fallback={<div className="spinner" />}>
                <AppWithIdleLogout />
              </Suspense>
            </NotificationsProvider>
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}
