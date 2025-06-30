import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NotificationsProvider } from "./context/NotificationsContext"; // <-- ייבוא ה־Provider החדש
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

// הנחת ה־user (מומלץ לשלוף מ־AuthContext או מפענוח הטוקן)
const user = {
  businessId: localStorage.getItem("businessId"),
  token: localStorage.getItem("token"),
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {/* עטיפה ב־NotificationsProvider */}
          <NotificationsProvider user={user}>
            <Suspense fallback={<div className="spinner"></div>}>
              <App />
            </Suspense>
          </NotificationsProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
