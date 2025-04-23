import React, { Suspense, lazy, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

// אימפורט דפים ב-lazy
const HomePage                = lazy(() => import("./pages/Home"));
const About                   = lazy(() => import("./pages/About"));
const HowItWorks              = lazy(() => import("./pages/HowItWorks"));
const FAQ                     = lazy(() => import("./pages/FAQ"));
const Terms                   = lazy(() => import("./pages/Terms"));
const Contact                 = lazy(() => import("./pages/Contact"));
const Business                = lazy(() => import("./pages/business/Business"));
const Plans                   = lazy(() => import("./pages/business/Plans"));
const Checkout                = lazy(() => import("./pages/Checkout"));
const Login                   = lazy(() => import("./pages/Login"));
const Register                = lazy(() => import("./pages/Register"));
const QuickJobsBoard          = lazy(() => import("./pages/QuickJobsBoard"));
const QuickJobForm            = lazy(() => import("./pages/QuickJobForm"));
const ForgotPassword          = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword           = lazy(() => import("./pages/ResetPassword"));
const ChangePassword          = lazy(() => import("./pages/ChangePassword"));
const BusinessPage            = lazy(() => import("./components/BusinessPage"));
const BusinessDashboardRoutes = lazy(() => import("./pages/business/BusinessDashboardRoutes"));
const ClientDashboard         = lazy(() => import("./pages/client/ClientDashboard"));
const StaffDashboard          = lazy(() => import("./pages/staff/StaffDashboard"));
const WorkSession             = lazy(() => import("./pages/staff/WorkSession"));
const PhoneProfile            = lazy(() => import("./pages/staff/PhoneProfile"));
const MyTasks                 = lazy(() => import("./pages/staff/MyTasks"));
const MySales                 = lazy(() => import("./pages/staff/MySales"));
const ManagerDashboard        = lazy(() => import("./pages/manager/ManagerDashboard"));
const AdminDashboard          = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminLogs               = lazy(() => import("./pages/admin/AdminLogs"));
const AdminPlans              = lazy(() => import("./pages/admin/AdminPlans"));
const AdminSettings           = lazy(() => import("./pages/admin/AdminSettings"));
const AdminUsers              = lazy(() => import("./pages/admin/AdminUsers"));
const EditSiteContent         = lazy(() => import("./pages/admin/EditSiteContent"));
const ManageRoles             = lazy(() => import("./pages/admin/ManageRoles"));
const AdminPayoutPage         = lazy(() => import("./pages/admin/AdminPayoutPage"));
const ChatTestPage            = lazy(() => import("./pages/business/dashboardPages/buildTabs/ChatTestPage"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

// אנכי שמנתב אוטומטית למי שכבר מחובר
function HomeRedirect() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/", { replace: true });
      } else {
        switch (user.role) {
          case "business":
            navigate("/dashboard", { replace: true });
            break;
          case "customer":
            navigate("/client", { replace: true });
            break;
          case "worker":
            navigate("/staff/dashboard", { replace: true });
            break;
          case "manager":
            navigate("/manager/dashboard", { replace: true });
            break;
          case "admin":
            navigate("/admin/dashboard", { replace: true });
            break;
          default:
            navigate("/", { replace: true });
        }
      }
    }
  }, [user, loading, navigate]);
  return <div>🔄 טוען…</div>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <ScrollToTop />
        <Suspense fallback={<div>🔄 טוען את הדף…</div>}>
          <Routes>
            {/* נחיתה */}
            <Route path="/" element={<HomeRedirect />} />

            {/* Public */}
            <Route path="/home" element={<HomePage />} />
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
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/change-password" element={<ChangePassword />} />

            {/* Public business profile */}
            <Route path="/business/:businessId" element={<BusinessPage />} />

            {/* Customer Dashboard */}
            <Route
              path="/client"
              element={
                <ProtectedRoute role="customer">
                  <ClientDashboard />
                </ProtectedRoute>
              }
            />

            {/* Staff (Worker) */}
            <Route
              path="/staff/dashboard"
              element={
                <ProtectedRoute role="worker">
                  <StaffDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/session"
              element={
                <ProtectedRoute role="worker">
                  <WorkSession />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/profile"
              element={
                <ProtectedRoute role="worker">
                  <PhoneProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/tasks"
              element={
                <ProtectedRoute role="worker">
                  <MyTasks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/sales"
              element={
                <ProtectedRoute role="worker">
                  <MySales />
                </ProtectedRoute>
              }
            />

            {/* Manager */}
            <Route
              path="/manager/dashboard"
              element={
                <ProtectedRoute role="manager">
                  <ManagerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/logs"
              element={
                <ProtectedRoute role="admin">
                  <AdminLogs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/plans"
              element={
                <ProtectedRoute role="admin">
                  <AdminPlans />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute role="admin">
                  <AdminSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute role="admin">
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/site-edit"
              element={
                <ProtectedRoute role="admin">
                  <EditSiteContent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/roles"
              element={
                <ProtectedRoute role="admin">
                  <ManageRoles />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/affiliate-payouts"
              element={
                <ProtectedRoute role="admin">
                  <AdminPayoutPage />
                </ProtectedRoute>
              }
            />

            {/* Business Dashboard */}
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute role="business">
                  <BusinessDashboardRoutes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/calendar"
              element={<Navigate to="/dashboard" replace />}
            />

            {/* Chat Test */}
            <Route path="/chat-test-direct" element={<ChatTestPage />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
