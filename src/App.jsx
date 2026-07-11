import React, { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import PreLoginBot from "./components/PreLoginBot";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import BusinessDashboardRoutes from "./pages/business/BusinessDashboardRoutes";
import BusinessChatPage from "./components/BusinessChatPage";
import PublicVisualSiteRenderer from "./components/site-builder/public/PublicVisualSiteRenderer";

import { useAuth } from "./context/AuthContext";
import { useOnceLogger } from "./utils/useOnceLogger";
import { LoginSkeleton } from "./components/LoginSkeleton";
import AdminWithdrawalsPage from "./pages/admin/AdminWithdrawalsPage";

import { AiProvider } from "./context/AiContext";
import AiModal from "./components/AiModal";
import { NotificationsProvider } from "./context/NotificationsContext";
import { preloadDashboardComponents } from "./pages/business/dashboardPages/DashboardPage";

import AffiliateAutoLogin from "./components/AffiliateAutoLogin";
import AffiliateDashboardPage from "./pages/business/dashboardPages/AffiliateDashboardPage";
import Unsubscribe from "./pages/Unsubscribe";
import EarlyBirdRedirect from "./components/EarlyBirdRedirect";

const StoreProductsPage = lazy(() =>
  import("./components/store/StoreProductsPage")
);

/* Public Pages */
const HomePage = lazy(() => import("./pages/Home"));
const BizuplyEarlyAccessLanding = lazy(() =>
  import("./pages/BizuplyEarlyAccessLanding")
);
const About = lazy(() => import("./pages/About"));
const SearchBusinesses = lazy(() => import("./pages/SearchBusinesses"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const Pricing = lazy(() => import("./pages/business/Pricing"));
const Checkout = lazy(() => import("./pages/Checkout"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Accessibility = lazy(() => import("./pages/Accessibility"));
const Terms = lazy(() => import("./pages/Terms"));
const Contact = lazy(() => import("./pages/Contact"));
const BusinessSupport = lazy(() => import("./pages/BusinessSupport"));
const BusinessOverview = lazy(() => import("./pages/business/Business"));
const BusinessesList = lazy(() => import("./pages/BusinessesList"));
const QuickJobsBoard = lazy(() => import("./pages/QuickJobsBoard"));
const QuickJobForm = lazy(() => import("./pages/QuickJobForm"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ChangePassword = lazy(() => import("./pages/ChangePassword"));
const StaffLogin = lazy(() => import("./pages/StaffLogin"));

const BusinessProfileView = lazy(() =>
  import("./components/shared/BusinessProfileView")
);

const BookingPage = lazy(() => import("./pages/BookingPage"));
const ClientDashboard = lazy(() => import("./pages/client/ClientDashboard"));
const OrdersPage = lazy(() => import("./pages/client/OrdersPage"));

const StaffDashboard = lazy(() => import("./pages/staff/StaffDashboard"));
const WorkSession = lazy(() => import("./pages/staff/WorkSession"));
const PhoneProfile = lazy(() => import("./pages/staff/PhoneProfile"));
const MyTasks = lazy(() => import("./pages/staff/MyTasks"));
const MySales = lazy(() => import("./pages/staff/MySales"));

const ManagerDashboard = lazy(() => import("./pages/manager/ManagerDashboard"));

/* Admin Pages */
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminEarlyAccess = lazy(() => import("./pages/admin/AdminEarlyAccess"));
const AdminLogs = lazy(() => import("./pages/admin/AdminLogs"));
const AdminPlans = lazy(() => import("./pages/admin/AdminPlans"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const EditSiteContent = lazy(() => import("./pages/admin/EditSiteContent"));
const ManageRoles = lazy(() => import("./pages/admin/ManageRoles"));
const AdminPayoutPage = lazy(() => import("./pages/admin/AdminPayoutPage"));
const AdminAffiliates = lazy(() => import("./pages/admin/AdminAffiliates"));

const AffiliatePage = lazy(() =>
  import("./pages/business/dashboardPages/AffiliatePage")
);

const BusinessProfilePage = lazy(() => import("./pages/BusinessProfilePage"));
const Collab = lazy(() => import("./pages/business/dashboardPages/Collab"));
const Features = lazy(() => import("./pages/Features"));
const Solutions = lazy(() => import("./pages/Solutions"));
const Support = lazy(() => import("./pages/Support"));
const TrialEnded = lazy(() => import("./pages/TrialEnded"));
const MetaCallbackPage = lazy(() =>
  import("./pages/integrations/MetaCallbackPage")
);

const noopResetSearchFilters = () => {};

const PUBLIC_SITE_DOMAIN =
  import.meta.env.VITE_BIZUPLY_PUBLIC_SITE_DOMAIN || "sites.bizuply.com";

const RAW_API_BASE_URL = String(
  import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_BACKEND_URL ||
    ""
).replace(/\/+$/, "");

const API_SITE_BUILDER_BASE_URL = RAW_API_BASE_URL.endsWith("/api")
  ? `${RAW_API_BASE_URL}/site-builder`
  : `${RAW_API_BASE_URL}/api/site-builder`;

function getCurrentHostname() {
  if (typeof window === "undefined") return "";

  return String(window.location.hostname || "")
    .toLowerCase()
    .trim();
}

function isPublicMiniSiteHost() {
  const hostname = getCurrentHostname();

  return (
    hostname.endsWith(`.${PUBLIC_SITE_DOMAIN}`) &&
    hostname !== PUBLIC_SITE_DOMAIN
  );
}

function getMiniSiteSlugFromHost() {
  const hostname = getCurrentHostname();
  const suffix = `.${PUBLIC_SITE_DOMAIN}`;

  if (!hostname.endsWith(suffix)) return "";

  return hostname.replace(suffix, "");
}

function PublicMiniSitePage() {
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [site, setSite] = useState(null);
  const [error, setError] = useState("");

  const loadSite = React.useCallback(async (pathnameOverride) => {
    setLoading(true);
    setError("");

    try {
      const host = window.location.host;
      const pathname = pathnameOverride || window.location.pathname || "/";

      const url = `${API_SITE_BUILDER_BASE_URL}/public/by-host?host=${encodeURIComponent(
        host
      )}&path=${encodeURIComponent(pathname)}`;

      console.log("BIZUPLY PUBLIC MINI SITE API URL:", url, {
        host,
        pathname,
      });

      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json().catch(() => null);

      console.log("BIZUPLY PUBLIC MINI SITE API RESPONSE:", {
        ok: res.ok,
        success: data?.success,
        requestedPath: data?.requestedPath,
        matchedByPath: data?.matchedByPath,
        activePageId: data?.site?.activePage?.id,
        activePageSlug: data?.site?.activePage?.slug,
        activePageTitle: data?.site?.activePage?.title,
      });

      if (!res.ok || !data?.success || !data?.site) {
        throw new Error(data?.error || "האתר לא נמצא או עדיין לא פורסם");
      }

      setSite(data.site);
    } catch (err) {
      console.error("BIZUPLY PUBLIC MINI SITE LOAD ERROR:", err);
      setError(err?.message || "שגיאה בטעינת האתר");
      setSite(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSite(window.location.pathname || "/");
  }, [location.pathname, loadSite]);

  useEffect(() => {
    const handlePublicSiteClick = (event) => {
      const target = event.target;

      if (!target) return;

      const link = target.closest(
        "a[href], button[data-visual-link-href], [data-link-url], [data-href], [data-visual-link-href]"
      );

      if (!link) return;

      const rawHref =
        link.getAttribute("href") ||
        link.getAttribute("data-visual-link-href") ||
        link.getAttribute("data-link-url") ||
        link.getAttribute("data-href") ||
        "";

      const href = String(rawHref || "").trim();

      if (!href) return;

      if (
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("sms:")
      ) {
        return;
      }

      if (href.startsWith("#")) {
        event.preventDefault();

        const section = document.querySelector(href);

        if (section) {
          section.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }

        return;
      }

      let nextUrl;

      try {
        nextUrl = new URL(href, window.location.origin);
      } catch {
        return;
      }

      if (nextUrl.origin !== window.location.origin) {
        return;
      }

      event.preventDefault();

      const nextPath = nextUrl.pathname || "/";
      const nextPathWithSearch = `${nextPath}${nextUrl.search || ""}`;
      const currentPathWithSearch = `${window.location.pathname}${window.location.search}`;

      if (nextPathWithSearch === currentPathWithSearch) {
        return;
      }

      window.history.pushState({}, "", nextPathWithSearch);
      void loadSite(nextPath);
    };

    document.addEventListener("click", handlePublicSiteClick);

    return () => {
      document.removeEventListener("click", handlePublicSiteClick);
    };
  }, [loadSite]);

  useEffect(() => {
    const handlePopState = () => {
      void loadSite(window.location.pathname || "/");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [loadSite]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-violet-600" />
          <p className="text-sm font-bold text-slate-500">Loading site...</p>
        </div>
      </div>
    );
  }

  if (error || !site) {
    const slug = getMiniSiteSlugFromHost();

    return (
      <div
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[#f8fafc] p-6"
      >
        <div className="w-full max-w-xl rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-black text-violet-700">
            Bizuply Website
          </p>

          <h1 className="mt-3 text-3xl font-black text-slate-950">
            האתר עדיין לא זמין
          </h1>

          <p className="mt-3 text-sm font-bold leading-7 text-slate-500">
            לא מצאנו אתר מפורסם עבור הסאב־דומיין:
          </p>

          <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-black text-slate-700">
            {slug || window.location.hostname}
          </div>

          {error && (
            <p className="mt-4 text-xs font-bold text-rose-500">{error}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <PublicVisualSiteRenderer
      site={site}
      pathname={
        typeof window !== "undefined"
          ? window.location.pathname
          : location.pathname
      }
    />
  );

}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const scroller = document.querySelector(".app-scroll-area");

    if (scroller) {
      scroller.scrollTop = 0;
    }
  }, [pathname]);

  return null;
}

function PageLoader() {
  return (
    <motion.div
      key="page-loader"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="pointer-events-none fixed inset-0 z-[9999] h-screen overflow-hidden bg-gradient-to-b from-[#f6f7fb] to-[#e8ebf8]"
    />
  );
}

export default function App() {
  const { user, loading } = useAuth();
  const location = useLocation();

  const isMiniSiteHost = isPublicMiniSiteHost();
  const isEarlyAccessLanding = location.pathname === "/early-access";

  const isBusinessChatRoute =
    location.pathname.includes("/business/") &&
    location.pathname.includes("/chat");

  const isDashboardRoute =
    location.pathname.includes("/dashboard") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/staff") ||
    location.pathname.startsWith("/client") ||
    location.pathname.includes("/messages");

  const isPublicBusinessProfile = /^\/business\/[^/]+$/.test(
    location.pathname
  );

  useOnceLogger("App render - user", user);
  useOnceLogger("App render - loading", loading);

  useEffect(() => {
    preloadDashboardComponents();
  }, []);

  if (isMiniSiteHost) {
    return <PublicMiniSitePage />;
  }

  if (loading) return <LoginSkeleton />;

  return (
    <NotificationsProvider>
      <div className="app-layout" dir="ltr">
        {!isBusinessChatRoute && !isEarlyAccessLanding && <Header />}

        <ScrollToTop />

        <main className="app-main">
          {isBusinessChatRoute ? (
            <div className="business-chat-fullscreen">
              <Routes location={location} key={location.pathname}>
                <Route
                  path="/business/:businessId/chat/*"
                  element={
                    <ProtectedRoute roles={["business", "admin"]}>
                      <BusinessChatPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          ) : (
            <div className="app-scroll-area">
              <AiProvider>
                <AnimatePresence mode="wait">
                  <Suspense fallback={<PageLoader />}>
                    <motion.div
                      key={location.pathname}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{
                        duration: 0.35,
                        ease: "easeInOut",
                      }}
                    >
                      <Routes location={location} key={location.pathname}>
                        <Route
                          path="/"
                          element={
                            user ? (
                              user.role === "business" && user.businessId ? (
                                <Navigate
                                  to={`/business/${user.businessId}/dashboard`}
                                  replace
                                />
                              ) : user.role === "admin" ? (
                                <Navigate to="/admin/dashboard" replace />
                              ) : (
                                <HomePage />
                              )
                            ) : (
                              <HomePage />
                            )
                          }
                        />

                        <Route
                          path="/early-access"
                          element={<BizuplyEarlyAccessLanding />}
                        />

                        <Route path="/about" element={<About />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

                        <Route
                          path="/search"
                          element={
                            <SearchBusinesses
                              resetSearchFilters={noopResetSearchFilters}
                            />
                          }
                        />

                        <Route path="/how-it-works" element={<HowItWorks />} />
                        <Route path="/pricing" element={<Pricing />} />
                        <Route path="/Pricing" element={<Pricing />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/faq" element={<FAQ />} />
                        <Route path="/accessibility" element={<Accessibility />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/contact" element={<Contact />} />

                        <Route
                          path="/business-support"
                          element={<BusinessSupport />}
                        />

                        <Route path="/business" element={<BusinessOverview />} />
                        <Route path="/businesses" element={<BusinessesList />} />

                        <Route path="/quick-jobs" element={<QuickJobsBoard />} />
                        <Route path="/quick-jobs/new" element={<QuickJobForm />} />

                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/change-password" element={<ChangePassword />} />
                        <Route path="/staff-login" element={<StaffLogin />} />

                        <Route
                          path="/business/:businessId"
                          element={<BusinessProfileView />}
                        />

                        <Route
                          path="/book/:businessId"
                          element={<BookingPage />}
                        />

                        <Route
                          path="/affiliate/:publicToken"
                          element={<AffiliateAutoLogin />}
                        />

                        <Route path="/support" element={<Support />} />
                        <Route path="/features" element={<Features />} />
                        <Route path="/solutions" element={<Solutions />} />
                        <Route path="/trial-ended" element={<TrialEnded />} />
                        <Route path="/unsubscribe" element={<Unsubscribe />} />

                        <Route
                          path="/integrations/meta/callback"
                          element={<MetaCallbackPage />}
                        />

                        <Route
                          path="/business/collaborations/:tab?"
                          element={
                            <ProtectedRoute roles={["business", "admin"]}>
                              <Collab />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/business-profile/:businessId"
                          element={
                            <ProtectedRoute
                              roles={[
                                "business",
                                "customer",
                                "worker",
                                "manager",
                                "admin",
                              ]}
                            >
                              <BusinessProfilePage />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/business/:businessId/dashboard/upgrade-offer"
                          element={
                            <ProtectedRoute roles={["business", "admin"]}>
                              <EarlyBirdRedirect />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/store/products"
                          element={
                            <ProtectedRoute roles={["business", "admin"]}>
                              <StoreProductsPage />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/business/:businessId/store/products"
                          element={
                            <ProtectedRoute roles={["business", "admin"]}>
                              <StoreProductsPage />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/business/:businessId/dashboard/*"
                          element={
                            <ProtectedRoute roles={["business", "admin"]}>
                              <BusinessDashboardRoutes />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/client/dashboard/*"
                          element={
                            <ProtectedRoute roles={["customer"]}>
                              <ClientDashboard />
                            </ProtectedRoute>
                          }
                        >
                          <Route index element={<Navigate to="search" replace />} />
                          <Route path="orders" element={<OrdersPage />} />
                          <Route
                            path="search"
                            element={
                              <SearchBusinesses
                                resetSearchFilters={noopResetSearchFilters}
                              />
                            }
                          />
                        </Route>

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
                          path="/admin"
                          element={
                            <ProtectedRoute roles={["admin"]}>
                              <Navigate to="/admin/dashboard" replace />
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
                          path="/admin/early-access"
                          element={
                            <ProtectedRoute roles={["admin"]}>
                              <AdminEarlyAccess />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/admin/withdrawals"
                          element={
                            <ProtectedRoute roles={["admin"]}>
                              <AdminWithdrawalsPage />
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
                          path="/admin/affiliates"
                          element={
                            <ProtectedRoute roles={["admin"]}>
                              <AdminAffiliates />
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

                        <Route
                          path="/affiliate/:affiliateId"
                          element={<AffiliatePage />}
                        />

                        <Route
                          path="/affiliate/dashboard/*"
                          element={
                            <ProtectedRoute roles={["affiliate"]}>
                              <AffiliateDashboardPage />
                            </ProtectedRoute>
                          }
                        />

                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>

                      <AiModal />
                    </motion.div>
                  </Suspense>
                </AnimatePresence>
              </AiProvider>
            </div>
          )}
        </main>

        {!isDashboardRoute && !isPublicBusinessProfile && !isEarlyAccessLanding && (
          <Footer />
        )}
      </div>

      {!user && !isEarlyAccessLanding && <PreLoginBot />}
    </NotificationsProvider>
  );
}




