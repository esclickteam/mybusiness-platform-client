// src/App.jsx
import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import BusinessDashboardRoutes from "./pages/business/BusinessDashboardRoutes";
import ChatTestPage from "./pages/business/dashboardPages/buildTabs/ChatTestPage";

// Lazy-loaded public pages
const HomePage         = lazy(() => import("./pages/Home"));
const About            = lazy(() => import("./pages/About"));
const SearchBusinesses = lazy(() => import("./pages/SearchBusinesses"));
const HowItWorks       = lazy(() => import("./pages/HowItWorks"));
const FAQ              = lazy(() => import("./pages/FAQ"));
const Terms            = lazy(() => import("./pages/Terms"));
const Contact          = lazy(() => import("./pages/Contact"));
const BusinessOverview = lazy(() => import("./pages/business/Business"));
const Plans            = lazy(() => import("./pages/business/Plans"));
const Checkout         = lazy(() => import("./pages/Checkout"));
const Login            = lazy(() => import("./pages/Login"));
const Register         = lazy(() => import("./pages/Register"));
const QuickJobsBoard   = lazy(() => import("./pages/QuickJobsBoard"));
const QuickJobForm     = lazy(() => import("./pages/QuickJobForm"));
const ResetPassword    = lazy(() => import("./pages/ResetPassword"));
const ChangePassword   = lazy(() => import("./pages/ChangePassword"));
const BusinessesList   = lazy(() => import("./pages/BusinessesList"));

// Public business profile (clean)
const BusinessProfileView = lazy(() =>
  import("./components/shared/BusinessProfileView")
);

// Lazy-loaded protected dashboards
const ClientDashboard     = lazy(() => import("./pages/client/ClientDashboard"));
const StaffDashboard      = lazy(() => import("./pages/staff/StaffDashboard"));
const WorkSession         = lazy(() => import("./pages/staff/WorkSession"));
const PhoneProfile        = lazy(() => import("./pages/staff/PhoneProfile"));
const MyTasks             = lazy(() => import("./pages/staff/MyTasks"));
const MySales             = lazy(() => import("./pages/staff/MySales"));
const ManagerDashboard    = lazy(() => import("./pages/manager/ManagerDashboard"));
const AdminDashboard      = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminLogs           = lazy(() => import("./pages/admin/AdminLogs"));
const AdminPlans          = lazy(() => import("./pages/admin/AdminPlans"));
const AdminSettings       = lazy(() => import("./pages/admin/AdminSettings"));
const AdminUsers          = lazy(() => import("./pages/admin/AdminUsers"));
const EditSiteContent     = lazy(() => import("./pages/admin/EditSiteContent"));
const ManageRoles         = lazy(() => import("./pages/admin/ManageRoles"));
const AdminPayoutPage     = lazy(() => import("./pages/admin/AdminPayoutPage"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <Header />
      <ScrollToTop />

      <Suspense fallback={<div>🔄 טוען את הדף…</div>}>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />

          {/* עמוד החיפוש – חייב קודם */}
          <Route path="/search" element={<SearchBusinesses />} />

          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/business" element={<BusinessOverview />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/quick-jobs" element={<QuickJobsBoard />} />
          <Route path="/quick-jobs/new" element={<QuickJobForm />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/businesses" element={<BusinessesList />} />

          {/* Public business profile */}
          <Route
            path="/business/:businessId"
            element={<BusinessProfileView />}
          />

          {/* Protected business dashboard */}
          <Route
            path="/business/:businessId/dashboard/*"
            element={
              <ProtectedRoute roles={["business"]}>
                <BusinessDashboardRoutes />
              </ProtectedRoute>
            }
          />

          {/* Protected client dashboard */}
          <Route
            path="/client/dashboard"
            element={
              <ProtectedRoute roles={["customer"]}>
                <ClientDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected staff dashboards */}
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

          {/* Protected manager dashboard */}
          <Route
            path="/manager/dashboard"
            element={
              <ProtectedRoute roles={["manager"]}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected admin dashboards */}
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
