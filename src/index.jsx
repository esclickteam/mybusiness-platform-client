import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/* Contexts */
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NotificationsProvider } from "./context/NotificationsContext";
import useIdleLogout from "./hooks/useIdleLogout";  
import "./styles/index.css";

// Polyfill for Buffer (required by some libraries)
import { Buffer } from "buffer";
if (!window.Buffer) window.Buffer = Buffer;

const queryClient = new QueryClient();
const App = lazy(() => import("./App"));

// Component wrapping App with idle logout
function AppWithIdleLogout() {
  const { logout } = useAuth();
  useIdleLogout(logout, 10 * 60 * 1000); // Logout after 10 minutes of inactivity
  return <App />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
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
