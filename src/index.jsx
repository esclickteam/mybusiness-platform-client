// src/main.jsx (entrypoint)
import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/* Contexts */
import { AuthProvider } from "./context/AuthContext";
import { NotificationsProvider } from "./context/NotificationsContext";
import "./styles/index.css";

// Polyfill ל‑Buffer (חלק מהספריות דורשות)
import { Buffer } from "buffer";
if (!window.Buffer) window.Buffer = Buffer;

const queryClient = new QueryClient();
const App = lazy(() => import("./App"));

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NotificationsProvider>
            <Suspense fallback={<div className="spinner" />}>
              <App />
            </Suspense>
          </NotificationsProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
