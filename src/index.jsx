// ⚡ Apply saved theme before React renders anything
const savedTheme = localStorage.getItem("theme") || "light"; // ✅ השתמש ב-light כברירת מחדל כדי למנוע מצב כהה מיותר
document.body.setAttribute("data-theme", savedTheme);

// 🩶 וודא שגם ה-root מקבל רקע לפני שריאקט מתחיל לטעון
document.documentElement.style.backgroundColor =
  savedTheme === "dark" ? "#0f172a" : "#f6f7fb";
document.body.style.backgroundColor =
  savedTheme === "dark" ? "#0f172a" : "#f6f7fb";
document.getElementById("root")?.style?.setProperty(
  "background-color",
  savedTheme === "dark" ? "#0f172a" : "#f6f7fb"
);

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
