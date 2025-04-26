// src/App.jsx
import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

// Layout for business dashboard
import BusinessDashboardLayout from "./pages/business/BusinessDashboardLayout";

// Non-lazy pages
import BusinessMessagesPage from "./pages/business/dashboardPages/BusinessMessagesPage";
import ChatTestPage from "./pages/business/dashboardPages/buildTabs/ChatTestPage";
import QuickJobsBoard from "./pages/QuickJobsBoard";
import QuickJobForm from "./pages/QuickJobForm";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";
import BusinessesList from "./pages/BusinessesList";

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

// Lazy-loaded public profile tabs
const BusinessProfilePage = lazy(() => import("./pages/BusinessProfilePage"));
const GalleryTab          = lazy(() => import("./pages/business/dashboardPages/buildTabs/GalleryTab"));
const ReviewsModule       = lazy(() => import("./pages/business/dashboardPages/buildTabs/ReviewsModule"));
const FaqTab              = lazy(() => import("./pages/business/dashboardPages/buildTabs/FaqTab"));
const ChatTab             = lazy(() => import("./pages/business/dashboardPages/buildTabs/ChatTab"));
const ShopAndCalendar     = lazy(() => import("./pages/business/dashboardPages/buildTabs/shopAndCalendar/ShopAndCalendar"));

// Lazy-loaded dashboard sub-pages
const DashboardPage     = lazy(() => import("./pages/business/dashboardPages/DashboardPage"));
const BuildBusinessPage = lazy(() => import("./pages/business/dashboardPages/Build"));
const Collab            = lazy(() => import("./pages/business/dashboardPages/Collab"));
const CRMMain           = lazy(() => import("./pages/business/dashboardPages/crmpages/CRMMain"));
const GoalsPage         = lazy(() => import("./pages/business/dashboardPages/GoalsPage"));
const EsclickAdvisor    = lazy(() => import("./pages/business/dashboardPages/EsclickAdvisor"));
const AffiliatePage     = lazy(() => import("./pages/business/dashboardPages/AffiliatePage"));
const UpgradePage       = lazy(() => import("./pages/business/dashboardPages/Upgrade"));

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
          <Route path="/"        element={<HomePage />} />
          <Route path="/about"   element={<About />} />
          <Route path="/search"  element={<SearchBusinesses />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/faq"     element={<FAQ />} />
          <Route path="/terms"   element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/business" element={<BusinessOverview />} />
          <Route path="/plans"   element={<Plans />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/quick-jobs"     element={<QuickJobsBoard />} />
          <Route path="/quick-jobs/new" element={<QuickJobForm />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/businesses"      element={<BusinessesList />} />

          {/* 🔹 דף פרופיל ציבורי של עסק עם nested tabs */}
          <Route path="/business/:businessId" element={<BusinessProfilePage />}>
            <Route index           element={null} />
            <Route path="gallery"  element={<GalleryTab />} />
            <Route path="reviews"  element={<ReviewsModule />} />
            <Route path="faq"      element={<FaqTab />} />
            <Route path="chat"     element={<ChatTab />} />
            <Route path="shop"     element={<ShopAndCalendar />} />
          </Route>

          {/* 🔹 דשבורד עסקים עם סיידבר + nested routes */}
          <Route
            path="/business/:businessId/dashboard/*"
            element={
              <ProtectedRoute roles={["business"]}>
                <BusinessDashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* ברירת מחדל מפנה ל־dashboard */}
            <Route index                  element={<Navigate to="dashboard" replace />} />
            {/* כל ה־tabs בתוך ה־layout */}
            <Route path="dashboard"       element={<DashboardPage />} />
            <Route path="build"           element={<BuildBusinessPage />} />
            <Route path="messages"        element={<BusinessMessagesPage />} />
            <Route path="collab"          element={<Collab />} />
            <Route path="crm"             element={<CRMMain />} />
            <Route path="goals"           element={<GoalsPage />} />
            <Route path="esclick"         element={<EsclickAdvisor />} />
            <Route path="affiliate"       element={<AffiliatePage />} />
            <Route path="upgrade"         element={<UpgradePage />} />
          </Route>

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
          <Route path="/chat-test-direct"      element={<ChatTestPage />} />

          {/* 🔹 ברירת מחדל לכל השאר */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}
