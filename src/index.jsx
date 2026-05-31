// src/main.jsx או src/index.jsx
import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";

/* i18n */
import "./i18n/i18n";

/* Contexts */
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NotificationsProvider } from "./context/NotificationsContext";
import useIdleLogout from "./hooks/useIdleLogout";
import "./styles/index.css";

// Polyfill ל-Buffer (חלק מהספריות דורשות)
import { Buffer } from "buffer";
if (!window.Buffer) window.Buffer = Buffer;

/* ==========================================================
   🎨 טעינת Theme מוקדמת לפני כל דבר אחר
   ========================================================== */
const savedTheme = localStorage.getItem("theme");
const defaultTheme = savedTheme || "light";

// רקע בסיסי לפי theme האחרון
if (defaultTheme === "business" || defaultTheme === "dark") {
  document.body.style.background = "#f6f7fb";
  document.documentElement.style.background = "#f6f7fb";
} else {
  document.body.style.background = "#ffffff";
  document.documentElement.style.background = "#ffffff";
}

// הוספת מאפיין data-theme לשימוש ב-CSS
document.body.setAttribute("data-theme", defaultTheme);

/* ==========================================================
   🔁 React Query + Suspense
   ========================================================== */
const queryClient = new QueryClient();
const App = lazy(() => import("./App"));

/* ==========================================================
   ⏳ עטיפת App עם Idle Logout
   ========================================================== */
function AppWithIdleLogout() {
  const { logout } = useAuth();
  useIdleLogout(logout, 10 * 60 * 1000);
  return <App />;
}

/* ==========================================================
   🚀 Render Root
   ========================================================== */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
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
    </HelmetProvider>
  </React.StrictMode>
);