// src/App.jsx
import React, { Suspense, lazy } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import BusinessDashboardRoutes from "./pages/business/BusinessDashboardRoutes";
import ClientChatSection from "./components/ClientChatSection";
import BusinessChatPage from "./components/BusinessChatPage";
import { useAuth } from "./context/AuthContext";

import "./styles/index.css";

// Lazy-loaded public pages
const HomePage            = lazy(() => import("./pages/Home"));
const About               = lazy(() => import("./pages/About"));
const SearchBusinesses    = lazy(() => import("./pages/SearchBusinesses"));
const PrivacyPolicy       = lazy(() => import("./pages/PrivacyPolicy"));
const HowItWorks          = lazy(() => import("./pages/HowItWorks"));
const Plans               = lazy(() => import("./pages/business/Plans"));
const Checkout            = lazy(() => import("./pages/Checkout"));
const FAQ                 = lazy(() => import("./pages/FAQ"));
const Accessibility       = lazy(() => import("./pages/Accessibility"));
const Terms               = lazy(() => import("./pages/Terms"));
const Contact             = lazy(() => import("./pages/Contact"));
const BusinessSupport     = lazy(() => import("./pages/BusinessSupport"));
const BusinessOverview    = lazy(() => import("./pages/business/Business"));
const BusinessesList      = lazy(() => import("./pages/BusinessesList"));
const QuickJobsBoard      = lazy(() => import("./pages/QuickJobsBoard"));
const QuickJobForm        = lazy(() => import("./pages/QuickJobForm"));
const Login               = lazy(() => import("./pages/Login"));
const Register            = lazy(() => import("./pages/Register"));
const ResetPassword       = lazy(() => import("./pages/ResetPassword"));
const ChangePassword      = lazy(() => import("./pages/ChangePassword"));
const StaffLogin          = lazy(() => import("./pages/StaffLogin"));
const BusinessProfileView = lazy(() => import("./components/shared/BusinessProfileView"));
const BookingPage         = lazy(() => import("./pages/BookingPage"));
const ClientDashboard     = lazy(() => import("./pages/client/ClientDashboard"));
const MessagesPage        = lazy(() => import("./pages/client/MessagesPage"));
const OrdersPage          = lazy(() => import("./pages/client/OrdersPage"));
const FavoritesPage       = lazy(() => import("./pages/client/FavoritesPage"));
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
  React.useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

export default function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Header />
      <ScrollToTop />
      <Suspense fallback={<div>🔄 טוען…</div>}>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/search" element={<SearchBusinesses />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/accessibility" element={<Accessibility />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/business-support" element={<BusinessSupport />} />
          <Route path="/business" element={<BusinessOverview />} />
          <Route path="/businesses" element={<BusinessesList />} />
          <Route path="/quick-jobs" element={<QuickJobsBoard />} />
          <Route path="/quick-jobs/new" element={<QuickJobForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/staff-login" element={<StaffLogin />} />
          <Route path="/business/:businessId" element={<BusinessProfileView />} />
          <Route path="/book/:businessId" element={<BookingPage />} />

          {/* Client chat outside dashboard */}
          <Route
            path="/business/:businessId/messages"
            element={
              <ProtectedRoute roles={["customer"]}>
                <ClientChatSection />
              </ProtectedRoute>
            }
          />

          {/* Business dashboard */}
          <Route
            path="/business/:businessId/dashboard/*"
            element={
              <ProtectedRoute roles={["business"]}>
                <BusinessDashboardRoutes />
              </ProtectedRoute>
            }
          />

          {/* Business chat (list + detail) */}
          <Route
            path="/business/:businessId/chat/*"
            element={
              <ProtectedRoute roles={["business"]}>
                <BusinessChatPage />
              </ProtectedRoute>
            }
          />

          {/* Client dashboard */}
          <Route
            path="/client/dashboard/*"
            element={
              <ProtectedRoute roles={["customer"]}>
                <ClientDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="search" replace />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="favorites" element={<FavoritesPage />} />
          </Route>

          {/* Staff & Admin */}
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
          <Route
            path="/manager/dashboard"
            element={
              <ProtectedRoute roles={["manager"]}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
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

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

// Wrapper for business showing list of conversations
function BusinessChatListWrapper() {
  const { businessId } = useParams();
  const [convos, setConvos] = useState([]);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const selectedClientId = pathname.includes("/chat/")
    ? pathname.split("/").pop()
    : null;

  useEffect(() => {
    API.get("/messages/conversations", { withCredentials: true })
      .then(res => setConvos(res.data))
      .catch(console.error);
  }, [businessId]);

  const handleSelect = conv => {
    navigate(
      `/business/${businessId}/chat/${conv.customer._id}`,
      { state: { conversationId: conv.conversationId } }
    );
  };

  return (
    <ConversationsList
      conversations={convos}
      selectedId={selectedClientId}
      onSelect={handleSelect}
      isBusiness={true}
    />
  );
}

// Wrapper for a specific business-client chat
function BusinessChatWrapper() {
  const { businessId, clientId } = useParams();
  const { state } = useLocation();
  const { user, loading } = useAuth();

  if (loading) return <div>טוען...</div>;
  if (!user || user.role !== "business") {
    return <Navigate to="/login" replace />;
  }
  if (!state?.conversationId) {
    return <div>שגיאה: חסר conversationId</div>;
  }

  return (
    <ChatPage
      isBusiness={true}
      userId={businessId}
      partnerId={clientId}
      conversationId={state.conversationId}
      businessName={user.businessName}
      businessProfilePic={user.profilePic || "/default-business.png"}
      clientName="לקוח"
      clientProfilePic="/default-client.png"
    />
  );
}
