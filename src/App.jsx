// src/App.jsx
import React, { Suspense, lazy, useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useParams,
  useNavigate,
} from "react-router-dom";
import Header from "./components/Header";
import ChatPage from "./components/ChatPage";
import ProtectedRoute from "./components/ProtectedRoute";
import BusinessDashboardRoutes from "./pages/business/BusinessDashboardRoutes";
import ChatTestPage from "./pages/business/dashboardPages/buildTabs/ChatTestPage";
import { useAuth } from "./context/AuthContext";
import API from "./api";
import ConversationsList from "./components/ConversationsList";

import "./styles/index.css";

// Lazy-loaded public pages
const HomePage           = lazy(() => import("./pages/Home"));
const About              = lazy(() => import("./pages/About"));
const SearchBusinesses   = lazy(() => import("./pages/SearchBusinesses"));
const PrivacyPolicy      = lazy(() => import("./pages/PrivacyPolicy"));
const HowItWorks         = lazy(() => import("./pages/HowItWorks"));
const Plans              = lazy(() => import("./pages/business/Plans"));
const Checkout           = lazy(() => import("./pages/Checkout"));
const FAQ                = lazy(() => import("./pages/FAQ"));
const Accessibility      = lazy(() => import("./pages/Accessibility"));
const Terms              = lazy(() => import("./pages/Terms"));
const Contact            = lazy(() => import("./pages/Contact"));
const BusinessSupport    = lazy(() => import("./pages/BusinessSupport"));
const BusinessOverview   = lazy(() => import("./pages/business/Business"));
const BusinessesList     = lazy(() => import("./pages/BusinessesList"));
const QuickJobsBoard     = lazy(() => import("./pages/QuickJobsBoard"));
const QuickJobForm       = lazy(() => import("./pages/QuickJobForm"));
const Login              = lazy(() => import("./pages/Login"));
const Register           = lazy(() => import("./pages/Register"));
const ResetPassword      = lazy(() => import("./pages/ResetPassword"));
const ChangePassword     = lazy(() => import("./pages/ChangePassword"));
const StaffLogin         = lazy(() => import("./pages/StaffLogin"));
const BusinessProfileView= lazy(() => import("./components/shared/BusinessProfileView"));
const ClientDashboard    = lazy(() => import("./pages/client/ClientDashboard"));
const StaffDashboard     = lazy(() => import("./pages/staff/StaffDashboard"));
const WorkSession        = lazy(() => import("./pages/staff/WorkSession"));
const PhoneProfile       = lazy(() => import("./pages/staff/PhoneProfile"));
const MyTasks            = lazy(() => import("./pages/staff/MyTasks"));
const MySales            = lazy(() => import("./pages/staff/MySales"));
const ManagerDashboard   = lazy(() => import("./pages/manager/ManagerDashboard"));
const AdminDashboard     = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminLogs          = lazy(() => import("./pages/admin/AdminLogs"));
const AdminPlans         = lazy(() => import("./pages/admin/AdminPlans"));
const AdminSettings      = lazy(() => import("./pages/admin/AdminSettings"));
const AdminUsers         = lazy(() => import("./pages/admin/AdminUsers"));
const EditSiteContent    = lazy(() => import("./pages/admin/EditSiteContent"));
const ManageRoles        = lazy(() => import("./pages/admin/ManageRoles"));
const AdminPayoutPage    = lazy(() => import("./pages/admin/AdminPayoutPage"));

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
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/search" element={<SearchBusinesses />} />

          {/* Business info */}
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* Support */}
          <Route path="/faq" element={<FAQ />} />
          <Route path="/accessibility" element={<Accessibility />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/business-support" element={<BusinessSupport />} />

          {/* Business & jobs */}
          <Route path="/business" element={<BusinessOverview />} />
          <Route path="/businesses" element={<BusinessesList />} />
          <Route path="/quick-jobs" element={<QuickJobsBoard />} />
          <Route path="/quick-jobs/new" element={<QuickJobForm />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/staff-login" element={<StaffLogin />} />

          {/* Public business profile */}
          <Route path="/business/:businessId" element={<BusinessProfileView />} />

          {/* Business Chat list */}
          <Route
            path="/business/:businessId/chat"
            element={<BusinessChatListWrapper />}
          />
          {/* Business Chat detail */}
          <Route
            path="/business/:businessId/chat/:clientId"
            element={<BusinessChatWrapper />}
          />

          {/* Client Chat */}
          <Route
            path="/client/chat/:businessId"
            element={<ClientChatWrapper />}
          />

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

          {/* Chat test page */}
          <Route path="/chat-test-direct" element={<ChatTestPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

// Wrapper for business showing list of conversations
function BusinessChatListWrapper() {
  const { businessId } = useParams();
  const [convos, setConvos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/messages', { withCredentials: true })
      .then(res => setConvos(res.data))
      .catch(console.error);
  }, []);

  const handleSelect = convo => {
    const clientId = convo.participants.find(id => id !== businessId);
    navigate(`/business/${businessId}/chat/${clientId}`);
  };

  return (
    <ConversationsList
      conversations={convos}
      isBusiness={true}
      onSelect={handleSelect}
    />
  );
}

// Wrapper for a specific business-client chat
function BusinessChatWrapper() {
  const { businessId, clientId } = useParams();
  const clientProfilePic   = "/default-client.png";
  const businessProfilePic = "/default-business.png";

  return (
    <ChatPage
      isBusiness={true}
      userId={businessId}
      clientProfilePic={clientProfilePic}
      businessProfilePic={businessProfilePic}
      initialPartnerId={clientId}
    />
  );
}

// Wrapper for client chatting with a business
function ClientChatWrapper() {
  const { businessId } = useParams();
  const { user }       = useAuth();
  const clientProfilePic   = "/default-client.png";
  const businessProfilePic = "/default-business.png";

  return (
    <ChatPage
      isBusiness={false}
      userId={user.id}
      clientProfilePic={clientProfilePic}
      businessProfilePic={businessProfilePic}
      initialPartnerId={businessId}
    />
  );
}
