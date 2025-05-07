import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import ChatComponent from './components/ChatComponent';  // עדכון לנתיב הנכון


// ScrollToTop component to scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

import "./styles/index.css";
import ProtectedRoute from "./components/ProtectedRoute";
import BusinessDashboardRoutes from "./pages/business/BusinessDashboardRoutes";
import ChatTestPage from "./pages/business/dashboardPages/buildTabs/ChatTestPage";

// Lazy-loaded public pages
const HomePage = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const SearchBusinesses = lazy(() => import("./pages/SearchBusinesses"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));

// Business pages
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const Plans = lazy(() => import("./pages/business/Plans"));
const Checkout = lazy(() => import("./pages/Checkout"));

// Support pages
const FAQ = lazy(() => import("./pages/FAQ"));
const Accessibility = lazy(() => import("./pages/Accessibility"));
const Terms = lazy(() => import("./pages/Terms"));
const Contact = lazy(() => import("./pages/Contact"));

// New Business Support page
const BusinessSupport = lazy(() => import("./pages/BusinessSupport"));

// Business view and list
const BusinessOverview = lazy(() => import("./pages/business/Business"));
const BusinessesList = lazy(() => import("./pages/BusinessesList"));

// Quick Jobs
const QuickJobsBoard = lazy(() => import("./pages/QuickJobsBoard"));
const QuickJobForm = lazy(() => import("./pages/QuickJobForm"));

// Authentication
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ChangePassword = lazy(() => import("./pages/ChangePassword"));

// Staff Login page
const StaffLogin = lazy(() => import("./pages/StaffLogin"));

// Public business profile
const BusinessProfileView = lazy(() => import("./components/shared/BusinessProfileView"));

// Dashboards
const ClientDashboard = lazy(() => import("./pages/client/ClientDashboard"));
const StaffDashboard = lazy(() => import("./pages/staff/StaffDashboard"));
const WorkSession = lazy(() => import("./pages/staff/WorkSession"));
const PhoneProfile = lazy(() => import("./pages/staff/PhoneProfile"));
const MyTasks = lazy(() => import("./pages/staff/MyTasks"));
const MySales = lazy(() => import("./pages/staff/MySales"));
const ManagerDashboard = lazy(() => import("./pages/manager/ManagerDashboard"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminLogs = lazy(() => import("./pages/admin/AdminLogs"));
const AdminPlans = lazy(() => import("./pages/admin/AdminPlans"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const EditSiteContent = lazy(() => import("./pages/admin/EditSiteContent"));
const ManageRoles = lazy(() => import("./pages/admin/ManageRoles"));
const AdminPayoutPage = lazy(() => import("./pages/admin/AdminPayoutPage"));

// Lazy-load BusinessMessagesPage
const BusinessMessagesPage = lazy(() => import("./pages/business/dashboardPages/BusinessMessagesPage"));

export default function App() {
  return (
    <>
      <Header />

      {/* Scroll to top on route change */}
      <ScrollToTop />

      <Suspense fallback={<div>🔄 טוען את הדף…</div>}>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/search" element={<SearchBusinesses />} />

          {/* Business information */}
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* Support / information pages */}
          <Route path="/faq" element={<FAQ />} />
          <Route path="/accessibility" element={<Accessibility />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />

          {/* Business support page */}
          <Route path="/business-support" element={<BusinessSupport />} />

          {/* Business and Job pages */}
          <Route path="/business" element={<BusinessOverview />} />
          <Route path="/businesses" element={<BusinessesList />} />
          <Route path="/quick-jobs" element={<QuickJobsBoard />} />
          <Route path="/quick-jobs/new" element={<QuickJobForm />} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />

          {/* Staff login page */}
          <Route path="/staff-login" element={<StaffLogin />} />

          {/* Public business profile */}
          <Route path="/business/:businessId" element={<BusinessProfileView />} />

          {/* Business Messages Page */}
          <Route path="/business/:businessId/chat" element={<ChatComponent />} />

          {/* Business dashboard (protected) */}
          <Route
            path="/business/:businessId/dashboard/*"
            element={
              <ProtectedRoute roles={["business"]}>
                <BusinessDashboardRoutes />
              </ProtectedRoute>
            }
          />

          {/* Client dashboard */}
          <Route
            path="/client/dashboard"
            element={
              <ProtectedRoute roles={["customer"]}>
                <ClientDashboard />
              </ProtectedRoute>
            }
          />

          {/* Staff dashboards */}
          <Route
            path="/staff/dashboard"
            element={
              <ProtectedRoute roles={["worker"]}>
                <StaffDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/session"
            element={
              <ProtectedRoute roles={["worker"]}>
                <WorkSession />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/profile"
            element={
              <ProtectedRoute roles={["worker"]}>
                <PhoneProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/tasks"
            element={
              <ProtectedRoute roles={["worker"]}>
                <MyTasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/sales"
            element={
              <ProtectedRoute roles={["worker"]}>
                <MySales />
              </ProtectedRoute>
            }
          />

          {/* Manager dashboard */}
          <Route
            path="/manager/dashboard"
            element={
              <ProtectedRoute roles={["manager"]}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin dashboard */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/logs"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminLogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/plans"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminPlans />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/site-edit"
            element={
              <ProtectedRoute roles={["admin"]}>
                <EditSiteContent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/roles"
            element={
              <ProtectedRoute roles={["admin"]}>
                <ManageRoles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/affiliate-payouts"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminPayoutPage />
              </ProtectedRoute>
            }
          />

          {/* Additional routes */}
          <Route path="/chat-test-direct" element={<ChatTestPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}
