import React, { useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatTestPage from './pages/business/dashboardPages/buildTabs/ChatTestPage';
import QuickJobsBoard from "./pages/QuickJobsBoard";
import QuickJobForm from "./pages/QuickJobForm";
import ClientDashboard from "./pages/client/ClientDashboard";

// טעינה עצלה של דפים עיקריים
const HomePage = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Terms = lazy(() => import("./pages/Terms"));
const Contact = lazy(() => import("./pages/Contact"));
const Business = lazy(() => import("./pages/business/Business"));
const Plans = lazy(() => import("./pages/business/Plans"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const BusinessPage = lazy(() => import("./components/BusinessPage"));

// ✅ שינוי שם הקומפוננטה שתואם לשם הקובץ: BusinessDashboardRoutes.jsx
const BusinessDashboardRoutes = lazy(() => import("./pages/business/BusinessDashboardRoutes"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <Header />
      <ScrollToTop />
      <Suspense fallback={<p>🔄 טוען את הדף...</p>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/business" element={<Business />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/quick-jobs" element={<QuickJobsBoard />} />
          <Route path="/quick-jobs/new" element={<QuickJobForm />} />
          <Route path="/client" element={<ClientDashboard />} />

          {/* עמוד פרטי עסק לצפייה (ללקוחות) */}
          <Route
            path="/business/:businessId"
            element={
              <ProtectedRoute requiredPackage="free">
                <BusinessPage />
              </ProtectedRoute>
            }
          />

          {/* דשבורד לבעלי עסקים */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <BusinessDashboardRoutes />
              </ProtectedRoute>
            }
          />

          {/* הפניה אם ניגשים ל-calendar */}
          <Route path="/dashboard/calendar" element={<Navigate to="/dashboard" />} />

          {/* ✅ נתיב לבדיקה ישירה של הצ'אט */}
          <Route path="/chat-test-direct" element={<ChatTestPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
