// src/App.jsx
import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatTestPage from "./pages/business/dashboardPages/buildTabs/ChatTestPage";
import QuickJobsBoard from "./pages/QuickJobsBoard";
import QuickJobForm from "./pages/QuickJobForm";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";
import BusinessesList from "./pages/BusinessesList";

// Lazy-loaded public pages
const HomePage           = lazy(() => import("./pages/Home"));
const About              = lazy(() => import("./pages/About"));
const SearchBusinesses   = lazy(() => import("./pages/SearchBusinesses"));
const HowItWorks         = lazy(() => import("./pages/HowItWorks"));
const FAQ                = lazy(() => import("./pages/FAQ"));
const Terms              = lazy(() => import("./pages/Terms"));
const Contact            = lazy(() => import("./pages/Contact"));
const BusinessOverview   = lazy(() => import("./pages/business/Business"));
const Plans              = lazy(() => import("./pages/business/Plans"));
const Checkout           = lazy(() => import("./pages/Checkout"));
const Login              = lazy(() => import("./pages/Login"));
const Register           = lazy(() => import("./pages/Register"));

// Lazy-loaded public profile with nested tabs
const BusinessProfilePage = lazy(() => import("./pages/BusinessProfilePage"));

// Lazy-loaded public tab content
const GalleryTab          = lazy(() => import("./pages/business/dashboardPages/buildTabs/GalleryTab"));
const ReviewsModule       = lazy(() => import("./pages/business/dashboardPages/buildTabs/ReviewsModule"));
const FaqTab              = lazy(() => import("./pages/business/dashboardPages/buildTabs/FaqTab"));
const ChatTab             = lazy(() => import("./pages/business/dashboardPages/buildTabs/ChatTab"));
const ShopAndCalendar     = lazy(() => import("./pages/business/dashboardPages/buildTabs/shopAndCalendar/ShopAndCalendar"));

// Lazy-loaded edit & dashboard routes
const BuildBusinessPage       = lazy(() => import("./pages/business/dashboardPages/Build"));
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
          {/* 🔹 עמודים ציבוריים */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
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

          {/* 🔹 דף פרופיל ציבורי של עסק עם nested tabs */}
          <Route path="/business/:businessId" element={<BusinessProfilePage />}>
            <Route index element={null} />
            <Route path="gallery" element={<GalleryTab />} />
            <Route path="reviews" element={<ReviewsModule />} />
            <Route path="faq" element={<FaqTab />} />
            <Route path="chat" element={<ChatTab />} />
            <Route path="shop" element={<ShopAndCalendar />} />
          </Route>

          {/* 🔹 דשבורד עסקים עם סיידבר + טאבים */}
<Route
  path="/business/:businessId/dashboard/*"
  element={
    <ProtectedRoute roles={["business"]}>
      <BusinessDashboardRoutes />
    </ProtectedRoute>
  }
/>


          {/* 🔹 דשבורד לקוח */}
          <Route
            path="/client/dashboard"
            element={
              <ProtectedRoute roles={["customer"]}>
                <ClientDashboard />
              </ProtectedRoute>
            }
          />

          {/* 🔹 דשבורד עובדים */}
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

          {/* 🔹 דשבורד מנהל */}
          <Route
            path="/manager/dashboard"
            element={
              <ProtectedRoute roles={["manager"]}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />

          {/* 🔹 דשבורד אדמין */}
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

          {/* 🔹 ברירות מחדל נוספות */}
          <Route path="/dashboard/calendar" element={<Navigate to="/business/dashboard" />} />
          <Route path="/chat-test-direct" element={<ChatTestPage />} />

          {/* 🔹 ברירת מחדל לכל שאר הכתובות */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}
