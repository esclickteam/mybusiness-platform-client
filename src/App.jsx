// src/App.jsx
import React, { useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatTestPage from "./pages/business/dashboardPages/buildTabs/ChatTestPage";
import QuickJobsBoard from "./pages/QuickJobsBoard";
import QuickJobForm from "./pages/QuickJobForm";
import ClientDashboard from "./pages/client/ClientDashboard";
import StaffDashboard from "./pages/staff/StaffDashboard";
import WorkSession from "./pages/staff/WorkSession";
import PhoneProfile from "./pages/staff/PhoneProfile";
import MyTasks from "./pages/staff/MyTasks";
import MySales from "./pages/staff/MySales";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogs from "./pages/admin/AdminLogs";
import AdminPlans from "./pages/admin/AdminPlans";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminUsers from "./pages/admin/AdminUsers";
import EditSiteContent from "./pages/admin/EditSiteContent";
import ManageRoles from "./pages/admin/ManageRoles";
import ChangePassword from "./pages/ChangePassword";

// Lazy pages
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
const BusinessDashboardRoutes = lazy(() => import("./pages/business/BusinessDashboardRoutes"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <ScrollToTop />
        <Suspense fallback={<p>🔄 טוען את הדף…</p>}>
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
            <Route path="/staff/dashboard" element={<StaffDashboard />} />
            <Route path="/staff/session" element={<WorkSession />} />
            <Route path="/staff/profile" element={<PhoneProfile />} />
            <Route path="/staff/tasks" element={<MyTasks />} />
            <Route path="/staff/sales" element={<MySales />} />
            <Route path="/manager/dashboard" element={<ManagerDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/logs" element={<AdminLogs />} />
            <Route path="/admin/plans" element={<AdminPlans />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/site-edit" element={<EditSiteContent />} />
            <Route path="/admin/roles" element={<ManageRoles />} />
            <Route path="/change-password" element={<ChangePassword />} />

            <Route
              path="/business/:businessId"
              element={
                <ProtectedRoute requiredPackage="free">
                  <BusinessPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <BusinessDashboardRoutes />
                </ProtectedRoute>
              }
            />

            <Route path="/dashboard/calendar" element={<Navigate to="/dashboard" />} />
            <Route path="/chat-test-direct" element={<ChatTestPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
