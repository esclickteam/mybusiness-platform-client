import React, { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "./i18n/localeUtils";

import PreLoginBot from "./components/PreLoginBot";
import SupportChatWidget from "./components/SupportChatWidget";
import AccessibilityWidget from "./components/site-plugins/accessibility/AccessibilityWidget";
import AdminSoftphoneHost from "./components/AdminSoftphoneHost";
import AdminPushPermissionBanner from "./components/AdminPushPermissionBanner";
import StaffSoftphoneHost from "./components/staff/StaffSoftphoneHost";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
const BusinessDashboardRoutes = lazyWithRetry(() =>
  import("./pages/business/BusinessDashboardRoutes")
);
const BusinessChatPage = lazy(() => import("./components/BusinessChatPage"));
const PublicVisualSiteRenderer = lazyWithPreload(() =>
  import("./components/site-builder/public/PublicVisualSiteRenderer")
);

import { useAuth } from "./context/AuthContext";
import {
  ensurePushSubscription,
  listenForPushSubscriptionChange,
  registerServiceWorker,
} from "./utils/push";
import { LoginSkeleton } from "./components/LoginSkeleton";
import { LoginFormSkeleton } from "./components/auth/LoginFormSkeleton";
const AdminWithdrawalsPage = lazy(() =>
  import("./pages/admin/AdminWithdrawalsPage")
);

import { AiProvider } from "./context/AiContext";
import AiModal from "./components/AiModal";
import { NotificationsProvider } from "./context/NotificationsContext";
import { preloadDashboardComponents } from "./pages/business/dashboardPages/DashboardPage";

import AffiliateAutoLogin from "./components/AffiliateAutoLogin";
const AffiliateDashboardPage = lazy(() =>
  import("./pages/business/dashboardPages/AffiliateDashboardPage")
);
import Unsubscribe from "./pages/Unsubscribe";
import EarlyBirdRedirect from "./components/EarlyBirdRedirect";
import { resolveBusinessDashboardPath } from "./utils/dashboardRoutePersistence";
import { lazyWithPreload } from "./utils/lazyWithPreload";
import { clearChunkReloadFlag, lazyWithRetry } from "./utils/lazyWithRetry";
import {
  getPublicSiteDomain,
  isPublicCustomerSiteHost,
} from "./utils/publicSiteHost";
import {
  findStoredPortalTokenHint,
  getSitePortalToken,
} from "./utils/sitePortalSession";
import BizuplyLoader from "./components/ui/BizuplyLoader";
import PublicSiteLoader from "./components/ui/PublicSiteLoader";
import LazyRouteBoundary from "./components/LazyRouteBoundary";
import GuidedDemoHost from "./guidedDemo/GuidedDemoHost";
const SitePortalGate = lazy(() =>
  import("./components/site-builder/public/SitePortalGate")
);

const StoreProductsPage = lazy(() =>
  import("./components/store/StoreProductsPage")
);

/* Standalone, isolated site preview embedded via <iframe> on My Sites cards */
const EmbedSitePreviewPage = lazy(() =>
  import("./pages/EmbedSitePreviewPage")
);
const EmbedTemplatePreviewPage = lazy(() =>
  import("./pages/EmbedTemplatePreviewPage")
);

/* Public Pages */
const HomePage = lazy(() => import("./pages/Home"));
const BizuplyEarlyAccessLanding = lazy(() =>
  import("./pages/BizuplyEarlyAccessLanding")
);
const About = lazy(() => import("./pages/About"));
const CrmProductPage = lazy(() => import("./pages/product/CrmProductPage"));
const CollaborationsProductPage = lazy(() =>
  import("./pages/product/CollaborationsProductPage")
);
const WebsiteProductPage = lazy(() =>
  import("./pages/product/WebsiteProductPage")
);
const AppointmentsProductPage = lazy(() =>
  import("./pages/product/AppointmentsProductPage")
);
const AutomationsProductPage = lazy(() =>
  import("./pages/product/AutomationsProductPage")
);
const AgentsProductPage = lazy(() =>
  import("./pages/product/AgentsProductPage")
);
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
const AiAutomationTemplatesVisualPage = import.meta.env.DEV
  ? lazy(() => import("./pages/dev/AiAutomationTemplatesVisualPage"))
  : null;
const WebsiteInviteAcceptPage = lazy(() =>
  import("./pages/WebsiteInviteAcceptPage")
);
const GuidedDemoRedeemPage = lazy(() => import("./pages/GuidedDemoRedeemPage"));
const PublicSalesProposalPage = lazy(() => import("./pages/PublicSalesProposalPage"));
const Register = lazy(() => import("./pages/Register"));
const CrmOfferPage = lazy(() => import("./pages/offer/CrmOfferPage"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ChangePassword = lazy(() => import("./pages/ChangePassword"));
const StaffLogin = lazy(() => import("./pages/StaffLogin"));

const BusinessProfileView = lazy(() =>
  import("./components/shared/BusinessProfileView")
);

const ClientDashboard = lazy(() => import("./pages/client/ClientDashboard"));
const OrdersPage = lazy(() => import("./pages/client/OrdersPage"));

const StaffDashboard = lazy(() => import("./pages/staff/StaffDashboard"));
const StaffCreateUser = lazy(() => import("./pages/staff/StaffCreateUser"));
const WorkSession = lazy(() => import("./pages/staff/WorkSession"));
const PhoneProfile = lazy(() => import("./pages/staff/PhoneProfile"));
const MyTasks = lazy(() => import("./pages/staff/MyTasks"));
const MySales = lazy(() => import("./pages/staff/MySales"));

const ManagerDashboard = lazy(() => import("./pages/manager/ManagerDashboard"));

/* Admin Pages */
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminEarlyAccess = lazy(() => import("./pages/admin/AdminEarlyAccess"));
const AdminManagedWhatsApp = lazy(
  () => import("./pages/admin/AdminManagedWhatsApp")
);
const AdminLogs = lazy(() => import("./pages/admin/AdminLogs"));
const AdminPlans = lazy(() => import("./pages/admin/AdminPlans"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminCreateUser = lazy(() => import("./pages/admin/AdminCreateUser"));
const AdminBusinesses = lazy(() => import("./pages/admin/AdminBusinesses"));
const AdminCustomers = lazy(() => import("./pages/admin/AdminCustomers"));
const AdminCrmLayout = lazy(() => import("./pages/admin/crm/AdminCrmLayout"));
const AdminCrmOverview = lazy(() => import("./pages/admin/crm/AdminCrmOverview"));
const AdminCrmCustomers = lazy(() => import("./pages/admin/crm/AdminCrmCustomers"));
const AdminCrmCustomer360 = lazy(() => import("./pages/admin/crm/AdminCrmCustomer360"));
const AdminCrmPipeline = lazy(() => import("./pages/admin/crm/AdminCrmPipeline"));
const AdminCrmTasks = lazy(() => import("./pages/admin/crm/AdminCrmTasks"));
const AdminCrmActivities = lazy(() => import("./pages/admin/crm/AdminCrmActivities"));
const AdminCrmWhatsAppInbox = lazy(() => import("./pages/admin/crm/AdminCrmWhatsAppInbox"));
const AdminCrmFollowUps = lazy(() => import("./pages/admin/crm/AdminCrmFollowUps"));
const AdminCrmGuidedDemo = lazy(() => import("./pages/admin/crm/AdminCrmGuidedDemo"));
const AdminBizuplyCalendar = lazy(() => import("./pages/admin/AdminBizuplyCalendar"));
const AdminAutomations = lazy(() => import("./pages/admin/AdminAutomations"));
const AdminSystemHub = lazy(() => import("./pages/admin/AdminSystemHub"));
const BookRouteDispatch = lazy(() => import("./pages/BookRouteDispatch"));
const PublicIntroBookingPage = lazy(() => import("./pages/PublicIntroBookingPage"));
const AdminGuidedDemos = lazy(() => import("./pages/admin/AdminGuidedDemos"));
const AdminGuidedDemoDetail = lazy(
  () => import("./pages/admin/AdminGuidedDemoDetail")
);
const EditSiteContent = lazy(() => import("./pages/admin/EditSiteContent"));
const ManageRoles = lazy(() => import("./pages/admin/ManageRoles"));
const AdminPayoutPage = lazy(() => import("./pages/admin/AdminPayoutPage"));
const AdminAffiliates = lazy(() => import("./pages/admin/AdminAffiliates"));
const AdminMarketers = lazy(() => import("./pages/admin/AdminMarketers"));
const AdminPartners = lazy(() => import("./pages/admin/AdminPartners"));
const AdminPartnerDossier = lazy(() => import("./pages/admin/AdminPartnerDossier"));
const AdminSupportChat = lazy(() => import("./pages/admin/AdminSupportChat"));
const MarketerDashboardPage = lazy(() =>
  import("./pages/marketer/MarketerDashboardPage")
);
const PartnerLayout = lazy(() => import("./pages/partner/PartnerLayout"));
const PartnerDashboard = lazy(() => import("./pages/partner/PartnerDashboard"));
const PartnerClients = lazy(() => import("./pages/partner/PartnerClients"));
const PartnerClientDossier = lazy(() => import("./pages/partner/PartnerClientDossier"));
const PartnerClientWizard = lazy(() => import("./pages/partner/PartnerClientWizard"));
const PartnerPricing = lazy(() => import("./pages/partner/PartnerPricing"));
const PartnerStorefrontSettings = lazy(() => import("./pages/partner/PartnerStorefrontSettings"));
const PartnerRevenue = lazy(() => import("./pages/partner/PartnerRevenue"));
const PartnerTransactions = lazy(() => import("./pages/partner/PartnerTransactions"));
const PartnerTeam = lazy(() => import("./pages/partner/PartnerTeam"));
const PartnerSettings = lazy(() => import("./pages/partner/PartnerSettings"));
const PartnerWithdrawals = lazy(() => import("./pages/partner/PartnerWithdrawals"));
const PartnerWorkboard = lazy(() => import("./pages/partner/PartnerWorkboard"));
const PartnerDealDetail = lazy(() => import("./pages/partner/PartnerDealDetail"));
const PartnerPublicDeal = lazy(() => import("./pages/partner/PartnerPublicDeal"));
const PartnerRegister = lazy(() => import("./pages/partner/PartnerRegister"));
const PartnerStorefront = lazy(() => import("./pages/public/PartnerStorefront"));
const PartnerPublicPlans = lazy(() => import("./pages/public/PartnerPublicPlans"));
const PartnerHostHome = lazy(() => import("./pages/public/PartnerHostHome"));
const PartnerCheckoutSuccess = lazy(() => import("./pages/public/PartnerCheckoutSuccess"));
const PartnerMyPage = lazy(() => import("./pages/partner/PartnerMyPage"));
const PartnerReferrals = lazy(() => import("./pages/partner/PartnerReferrals"));
const AdminPartnerReferrals = lazy(() => import("./pages/admin/AdminPartnerReferrals"));
const AdminPartnerAttentionDeals = lazy(() => import("./pages/admin/AdminPartnerAttentionDeals"));

const AffiliatePage = lazy(() =>
  import("./pages/business/dashboardPages/AffiliatePage")
);

const BusinessProfilePage = lazy(() => import("./pages/BusinessProfilePage"));
const Collab = lazy(() => import("./pages/business/dashboardPages/Collab"));
const CollabLegacyRedirect = lazy(
  () => import("./pages/business/dashboardPages/collabtabs/CollabLegacyRedirect")
);
const Features = lazy(() => import("./pages/Features"));
const Solutions = lazy(() => import("./pages/Solutions"));
const Support = lazy(() => import("./pages/Support"));
const TrialEnded = lazy(() => import("./pages/TrialEnded"));
const MetaCallbackPage = lazy(() =>
  import("./pages/integrations/MetaCallbackPage")
);

const noopResetSearchFilters = () => {};

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
  // Include custom/external domains — not only *.sites.bizuply.com.
  return isPublicCustomerSiteHost(getCurrentHostname());
}

function getMiniSiteSlugFromHost() {
  const hostname = getCurrentHostname();
  const domains = Array.from(
    new Set([getPublicSiteDomain(), "sites-staging.bizuply.com", "sites.bizuply.com"])
  );
  for (const domain of domains) {
    const suffix = `.${domain}`;
    if (hostname.endsWith(suffix)) return hostname.replace(suffix, "");
  }
  return "";
}

/** App/dashboard paths that must never appear on a public customer site URL. */
function isInternalAppPath(pathname) {
  const path = String(pathname || "").toLowerCase();
  return (
    path.startsWith("/business/") ||
    path.startsWith("/admin") ||
    path.startsWith("/staff") ||
    path.startsWith("/client") ||
    path.startsWith("/dashboard") ||
    path.includes("/dashboard/")
  );
}

function PublicMiniSitePage() {
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [site, setSite] = useState(null);
  const [error, setError] = useState("");
  const [seoDocument, setSeoDocument] = useState(null);
  const siteRef = React.useRef(null);
  const requestRef = React.useRef({
    sequence: 0,
    controller: null,
  });
  const foregroundRequestRef = React.useRef(false);

  // Start downloading the renderer chunk while the site JSON loads.
  useEffect(() => {
    PublicVisualSiteRenderer.preload?.().catch(() => {});
  }, []);

  const loadSite = React.useCallback(async (pathnameOverride, options = {}) => {
    const silent = options?.silent === true;

    // A focus/pageshow refresh must never cancel an active route load.
    if (silent && foregroundRequestRef.current) return;

    const hadSiteAtStart = Boolean(siteRef.current);
    const sequence = requestRef.current.sequence + 1;

    requestRef.current.sequence = sequence;
    requestRef.current.controller?.abort();

    const controller = new AbortController();
    requestRef.current.controller = controller;

    if (!silent) {
      foregroundRequestRef.current = true;
      setLoading(true);
      setError("");
    }

    try {
      const host = window.location.host;
      let pathname = pathnameOverride || window.location.pathname || "/";

      // Keep public site URLs clean (never /business/.../dashboard).
      if (isInternalAppPath(pathname)) {
        if (window.location.pathname !== "/") {
          window.history.replaceState({}, "", "/");
        }
        pathname = "/";
      }

      if (pathname === "/sitemap.xml" || pathname === "/robots.txt") {
        const seoPath =
          pathname === "/sitemap.xml"
            ? "public/by-host/sitemap.xml"
            : "public/by-host/robots.txt";
        const seoUrl = `${API_SITE_BUILDER_BASE_URL}/${seoPath}?host=${encodeURIComponent(
          host
        )}`;

        const seoRes = await fetch(seoUrl, {
          method: "GET",
          credentials: "omit",
          cache: "default",
          signal: controller.signal,
        });

        const seoContent = await seoRes.text();

        if (sequence !== requestRef.current.sequence) return;

        setSeoDocument({
          type: pathname === "/sitemap.xml" ? "xml" : "text",
          content: seoContent,
        });
        setSite(null);
        siteRef.current = null;
        setError("");
        return;
      }

      const googleHtmlMatch = pathname.match(/^\/(google[a-z0-9]+)(\.html)?$/i);
      if (googleHtmlMatch) {
        const file = `${googleHtmlMatch[1].toLowerCase()}.html`;
        const seoUrl = `${API_SITE_BUILDER_BASE_URL}/public/by-host/google-html?host=${encodeURIComponent(
          host
        )}&file=${encodeURIComponent(file)}`;

        const seoRes = await fetch(seoUrl, {
          method: "GET",
          credentials: "omit",
          cache: "default",
          signal: controller.signal,
        });
        const seoContent = await seoRes.text();

        if (sequence !== requestRef.current.sequence) return;

        setSeoDocument({
          type: "text",
          content: seoContent,
        });
        setSite(null);
        siteRef.current = null;
        setError("");
        return;
      }

      setSeoDocument(null);

      // Portal routes need site metadata (name/id) but not a specific page.
      const requestPath = pathname.startsWith("/portal/") ? "/" : pathname;

      const url = `${API_SITE_BUILDER_BASE_URL}/public/by-host?host=${encodeURIComponent(
        host
      )}&path=${encodeURIComponent(requestPath)}`;

      console.log("BIZUPLY PUBLIC MINI SITE API URL:", url, {
        host,
        pathname,
        requestPath,
      });

      const knownSiteId = String(siteRef.current?._id || siteRef.current?.id || "");
      const portalToken =
        (knownSiteId && getSitePortalToken(knownSiteId)) ||
        findStoredPortalTokenHint()?.token ||
        "";

      const res = await fetch(url, {
        method: "GET",
        credentials: "omit",
        cache: portalToken ? "no-store" : "default",
        signal: controller.signal,
        headers: portalToken
          ? {
              Authorization: `Bearer ${portalToken}`,
              "X-Site-Portal-Token": portalToken,
            }
          : undefined,
      });

      const data = await res.json().catch(() => null);

      if (sequence !== requestRef.current.sequence) return;

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

      const freshSite = {
        ...data.site,
        __publicFetchedAt: new Date().toISOString(),
      };

      siteRef.current = freshSite;
      setSite(freshSite);
      setError("");
    } catch (err) {
      if (err?.name === "AbortError") return;
      if (sequence !== requestRef.current.sequence) return;

      console.error("BIZUPLY PUBLIC MINI SITE LOAD ERROR:", err);

      if (!silent || !siteRef.current) {
        setError(err?.message || "שגיאה בטעינת האתר");
        siteRef.current = null;
        setSite(null);
      }
    } finally {
      if (
        sequence === requestRef.current.sequence &&
        (!silent || !hadSiteAtStart)
      ) {
        setLoading(false);
      }

      if (sequence === requestRef.current.sequence && !silent) {
        foregroundRequestRef.current = false;
      }
    }
  }, []);

  useEffect(() => {
    void loadSite(window.location.pathname || "/");
  }, [location.pathname, loadSite]);

  useEffect(() => {
    const refreshLatestSite = () => {
      void loadSite(window.location.pathname || "/", {
        silent: true,
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshLatestSite();
      }
    };

    window.addEventListener("focus", refreshLatestSite);
    window.addEventListener("pageshow", refreshLatestSite);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", refreshLatestSite);
      window.removeEventListener("pageshow", refreshLatestSite);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loadSite]);

  useEffect(() => {
    return () => {
      requestRef.current.controller?.abort();
    };
  }, []);

  useEffect(() => {
    const isPortalMountShell = (node) => {
      if (!(node instanceof Element)) return false;
      return (
        node.getAttribute("data-bizuply-portal-mount") === "true" ||
        String(node.getAttribute("data-bizuply-widget") || "").startsWith(
          "portal-",
        )
      );
    };

    const handlePublicSiteClick = (event) => {
      // Template SPA handlers (Justora etc.) already handled this click.
      if (event.defaultPrevented) return;

      const target = event.target;

      if (!(target instanceof Element)) return;

      /*
        Portal login/register forms used to inherit a saved button href on the
        whole shell. Inside those widgets only a real inner <a> may navigate.
      */
      const portalShell = target.closest(
        '[data-bizuply-portal-mount="true"], [data-bizuply-widget^="portal-"]',
      );
      if (portalShell) {
        const tag = String(target.tagName || "").toLowerCase();
        if (["input", "textarea", "select", "button", "label"].includes(tag)) {
          return;
        }
        const portalAnchor = target.closest("a[href]");
        if (
          !portalAnchor ||
          !portalShell.contains(portalAnchor) ||
          isPortalMountShell(portalAnchor)
        ) {
          return;
        }
      }

      const link = target.closest(
        "a[href], button[data-visual-link-href], [data-link-url], [data-href], [data-visual-link-href], [data-bizuply-public-href]"
      );

      if (!link) return;

      // Never navigate from the portal form shell itself.
      if (isPortalMountShell(link)) return;

      /*
        Template SPA nav owns its own page state. Let the
        React onClick run instead of remounting the public site via loadSite.
      */
      if (
        link.getAttribute("data-bizuply-spa-nav") === "true" ||
        link.closest('[data-bizuply-spa-nav="true"]')
      ) {
        return;
      }

      const rawHref =
        link.getAttribute("href") ||
        link.getAttribute("data-visual-link-href") ||
        link.getAttribute("data-bizuply-public-href") ||
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
        event.stopPropagation();
        if (typeof event.stopImmediatePropagation === "function") {
          event.stopImmediatePropagation();
        }

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

      /*
        Capture phase + stopImmediatePropagation so template SPA handlers
        (button onClick → goTo("pricing")) cannot override a saved page link.
      */
      event.preventDefault();
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === "function") {
        event.stopImmediatePropagation();
      }

      const nextPath = nextUrl.pathname || "/";
      // Ignore internal BizUply app links that leaked into public site HTML.
      if (isInternalAppPath(nextPath)) {
        return;
      }
      const nextPathWithSearch = `${nextPath}${nextUrl.search || ""}`;
      const currentPathWithSearch = `${window.location.pathname}${window.location.search}`;

      if (nextPathWithSearch === currentPathWithSearch) {
        return;
      }

      window.history.pushState({}, "", nextPathWithSearch);
      void loadSite(nextPath);
    };

    document.addEventListener("click", handlePublicSiteClick, true);

    return () => {
      document.removeEventListener("click", handlePublicSiteClick, true);
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

  if (seoDocument?.content) {
    return (
      <pre
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          margin: 0,
          padding: 16,
          fontFamily: "monospace",
          fontSize: 13,
        }}
      >
        {seoDocument.content}
      </pre>
    );
  }

  if (loading) {
    return <PublicSiteLoader fullScreen label="Loading" />;
  }

  if (error || !site) {
    const slug = getMiniSiteSlugFromHost();

    return (
      <div
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-white p-6"
      >
        <div className="w-full max-w-xl rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-3xl font-black text-slate-800">
            האתר עדיין לא זמין
          </h1>

          <p className="mt-3 text-sm font-bold leading-7 text-slate-500">
            לא מצאנו אתר מפורסם עבור הדומיין:
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
    <PublicMiniSiteContent
      site={site}
      location={location}
      onPortalAuthChange={() => {
        void loadSite(window.location.pathname || "/", { silent: false });
      }}
    />
  );

}

function PublicMiniSiteContent({ site, location, onPortalAuthChange }) {
  const routerPath = location?.pathname;
  const [pathname, setPathname] = React.useState(
    () =>
      (typeof window !== "undefined" ? window.location.pathname : "") ||
      routerPath ||
      "/",
  );

  React.useEffect(() => {
    const sync = () => {
      setPathname(window.location.pathname || "/");
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, [routerPath]);

  return (
    <Suspense fallback={<PublicSiteLoader fullScreen label="Loading" />}>
      <SitePortalGate
        site={site}
        pathname={pathname}
        onPortalAuthChange={onPortalAuthChange}
      >
        <PublicVisualSiteRenderer site={site} pathname={pathname} />
      </SitePortalGate>
    </Suspense>
  );
}

function ScrollToTop() {
  const { pathname, search, hash, key } = useLocation();

  useEffect(() => {
    // Footer / nav links should always open at the top of the destination page.
    if (hash) return;

    const scrollAllToTop = () => {
      const scroller = document.querySelector(".app-scroll-area");
      if (scroller) scroller.scrollTop = 0;
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    scrollAllToTop();
    const raf = window.requestAnimationFrame(scrollAllToTop);
    const t1 = window.setTimeout(scrollAllToTop, 0);
    const t2 = window.setTimeout(scrollAllToTop, 50);
    const t3 = window.setTimeout(scrollAllToTop, 200);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [pathname, search, hash, key]);

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
      className="fixed inset-0 z-[9999]"
    >
      <BizuplyLoader fullScreen />
    </motion.div>
  );
}

export default function App() {
  const { user, loading, initialized } = useAuth();
  const location = useLocation();
  const { i18n } = useTranslation();
  const appDir = getTextDirection(i18n.language);

  const isMiniSiteHost = isPublicMiniSiteHost();
  const isEarlyAccessLanding = location.pathname === "/early-access";
  // Hidden private offers (e.g. /offer/crm) are clean landing pages: no
  // Header, no Footer, no public chrome — reachable only via a direct link.
  const isHiddenOffer = location.pathname.startsWith("/offer/");
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isStaffRoute = location.pathname.startsWith("/staff");
  const isGuidedDemoRoute = location.pathname.startsWith("/demo/");
  const isPublicProposalRoute = location.pathname.startsWith("/proposal/");
  const bizuplyBookingToken = (() => {
    const parts = location.pathname.split("/").filter(Boolean);
    if (parts[0] === "book" && parts[1] === "bizuply" && parts[2]) return parts[2];
    if (parts[0] === "bizuply" && parts[1] === "book" && parts[2]) return parts[2];
    if (parts[0] === "book" && parts[1] && !/^[a-fA-F0-9]{24}$/.test(parts[1])) return parts[1];
    return "";
  })();
  const isBizuplyPublicBookingRoute = Boolean(bizuplyBookingToken);

  const isBusinessChatRoute =
    location.pathname.includes("/business/") &&
    location.pathname.includes("/chat");

  const isPublicPartnerDeal = location.pathname.startsWith("/partner/deals/");
  const isPublicPartnerSales =
    location.pathname.startsWith("/p/") ||
    location.pathname === "/plans" ||
    location.pathname.startsWith("/plans/");
  const isDashboardRoute =
    location.pathname.includes("/dashboard") ||
    isAdminRoute ||
    isStaffRoute ||
    location.pathname.startsWith("/client") ||
    (location.pathname.startsWith("/partner") && !isPublicPartnerDeal) ||
    location.pathname.startsWith("/p/") ||
    location.pathname === "/plans" ||
    location.pathname.includes("/messages");

  const isPublicBusinessProfile = /^\/business\/[^/]+$/.test(
    location.pathname
  );

  useEffect(() => {
    clearChunkReloadFlag();
  }, []);

  useEffect(() => {
    if (isMiniSiteHost) return;
    void registerServiceWorker();
  }, [isMiniSiteHost]);

  useEffect(() => {
    if (isMiniSiteHost) return undefined;
    return listenForPushSubscriptionChange();
  }, [isMiniSiteHost]);

  useEffect(() => {
    if (isMiniSiteHost || !user) return;
    void ensurePushSubscription();
  }, [isMiniSiteHost, user]);

  useEffect(() => {
    if (isMiniSiteHost) return;
    preloadDashboardComponents();
  }, [isMiniSiteHost]);

  if (isMiniSiteHost) {
    return <PublicMiniSitePage />;
  }

  if (location.pathname.startsWith("/embed/")) {
    return (
      <Suspense
        fallback={<BizuplyLoader fullScreen />}
      >
        <Routes location={location}>
          <Route
            path="/embed/site/:siteId"
            element={<EmbedSitePreviewPage />}
          />
          <Route
            path="/embed/template/:templateKey"
            element={<EmbedTemplatePreviewPage />}
          />
        </Routes>
      </Suspense>
    );
  }

  // Only block the tree during the initial auth boot. Login/staffLogin also
  // flip `loading`, and unmounting /login mid-submit drops the form error
  // state and makes it look like "nothing happened".
  if (loading && !initialized) {
    // The /login route has its own layout-matched skeleton to avoid a large
    // layout shift when this app-level auth check resolves and the real
    // page mounts. Every other route keeps the original full-screen loader.
    return location.pathname === "/login" ? (
      <LoginFormSkeleton />
    ) : (
      <LoginSkeleton />
    );
  }

  return (
    <NotificationsProvider>
      <div className="app-layout" dir={appDir} lang={i18n.language?.split("-")?.[0] || "he"}>
        {!isBusinessChatRoute &&
          !isEarlyAccessLanding &&
          !isHiddenOffer &&
          !isAdminRoute &&
          !isStaffRoute &&
          !isPublicPartnerDeal &&
          !isPublicPartnerSales &&
          !isGuidedDemoRoute &&
          !isPublicProposalRoute &&
          !isBizuplyPublicBookingRoute && <Header />}

        {/* Staff: top header + softphone (same behavior as admin) */}
        {isStaffRoute ? <StaffSoftphoneHost /> : null}

        <ScrollToTop />

        <main className="app-main">
          {isBusinessChatRoute ? (
            <div className="business-chat-fullscreen">
              <Suspense fallback={<BizuplyLoader fullScreen />}>
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
              </Suspense>
            </div>
          ) : (
            <div
              className={
                isPublicBusinessProfile
                  ? "app-scroll-area app-scroll-area--profile"
                  : "app-scroll-area"
              }
            >
              <AiProvider>
                <AnimatePresence mode="wait">
                  <LazyRouteBoundary>
                  <Suspense
                    fallback={
                      // /login gets a layout-matched skeleton instead of the
                      // generic full-screen loader to avoid a large CLS hit
                      // once its lazy chunk finishes loading. All other
                      // routes keep the original PageLoader unchanged.
                      location.pathname === "/login" ? (
                        <LoginFormSkeleton />
                      ) : (
                        <PageLoader />
                      )
                    }
                  >
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
                                user.hasAccess ? (
                                  <Navigate
                                    to={resolveBusinessDashboardPath(
                                      user.businessId
                                    )}
                                    replace
                                  />
                                ) : (
                                  <Navigate to="/pricing" replace />
                                )
                              ) : user.role === "admin" ? (
                                <Navigate to="/admin/dashboard" replace />
                              ) : user.role === "partner" ? (
                                <Navigate to="/partner/dashboard" replace />
                              ) : (
                                <HomePage />
                              )
                            ) : (
                              <PartnerHostHome />
                            )
                          }
                        />

                        <Route
                          path="/early-access"
                          element={<BizuplyEarlyAccessLanding />}
                        />

                        <Route path="/about" element={<About />} />
                        <Route path="/crm" element={<CrmProductPage />} />
                        <Route
                          path="/collaborations"
                          element={<CollaborationsProductPage />}
                        />
                        <Route
                          path="/website-builder"
                          element={<WebsiteProductPage />}
                        />
                        <Route
                          path="/appointments"
                          element={<AppointmentsProductPage />}
                        />
                        <Route
                          path="/automations"
                          element={<AutomationsProductPage />}
                        />
                        <Route path="/agents" element={<AgentsProductPage />} />
                        <Route path="/privacy" element={<PrivacyPolicy />} />
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
                        <Route path="/p/:slug" element={<PartnerStorefront />} />
                        <Route path="/p/:slug/plans" element={<PartnerPublicPlans />} />
                        <Route path="/p/:slug/checkout/success" element={<PartnerCheckoutSuccess />} />
                        <Route path="/plans" element={<PartnerPublicPlans />} />
                        <Route path="/partner/register" element={<PartnerRegister />} />
                        <Route path="/partner/deals/:dealId" element={<PartnerPublicDeal />} />
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
                        {import.meta.env.DEV && AiAutomationTemplatesVisualPage ? (
                          <Route
                            path="/dev/ai-automation-templates-visual"
                            element={<AiAutomationTemplatesVisualPage />}
                          />
                        ) : null}
                        <Route
                          path="/website-invite/:token"
                          element={<WebsiteInviteAcceptPage />}
                        />
                        <Route path="/guided-demo/:token" element={<AdminCrmGuidedDemo />} />
                        <Route
                          path="/demo/:token"
                          element={<GuidedDemoRedeemPage />}
                        />
                        <Route
                          path="/proposal/:token"
                          element={<PublicSalesProposalPage />}
                        />
                        <Route
                          path="/book/bizuply/:token"
                          element={<PublicIntroBookingPage />}
                        />
                        <Route
                          path="/bizuply/book/:token"
                          element={<PublicIntroBookingPage />}
                        />
                        <Route
                          path="/book/:businessId"
                          element={<BookRouteDispatch />}
                        />
                        <Route path="/register" element={<Register />} />
                        {/* Hidden private offer — reachable only via direct URL.
                            NOT linked from nav/footer/pricing/sitemap. */}
                        <Route path="/offer/crm" element={<CrmOfferPage />} />
                        <Route
                          path="/forgot-password"
                          element={<ForgotPassword />}
                        />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route
                          path="/change-password"
                          element={
                            <ProtectedRoute>
                              <ChangePassword />
                            </ProtectedRoute>
                          }
                        />
                        <Route path="/staff-login" element={<StaffLogin />} />

                        <Route
                          path="/business/:businessId"
                          element={<BusinessProfileView />}
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
                              <CollabLegacyRedirect />
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
                          path="/staff/create-user"
                          element={
                            <ProtectedRoute roles={["worker"]}>
                              <StaffCreateUser />
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
                          path="/admin/managed-whatsapp"
                          element={
                            <ProtectedRoute roles={["admin"]}>
                              <AdminManagedWhatsApp />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/admin/calendar"
                          element={
                            <ProtectedRoute roles={["admin"]}>
                              <AdminBizuplyCalendar />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/admin/automations"
                          element={
                            <ProtectedRoute roles={["admin"]}>
                              <AdminAutomations />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/admin/system"
                          element={
                            <ProtectedRoute roles={["admin"]}>
                              <AdminSystemHub />
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
                          path="/admin/create-user"
                          element={
                            <ProtectedRoute roles={["admin"]}>
                              <AdminCreateUser />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/admin/businesses"
                          element={
                            <ProtectedRoute roles={["admin"]}>
                              <AdminBusinesses />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/admin/customers"
                          element={
                            <ProtectedRoute roles={["admin"]}>
                              <AdminCustomers />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/admin/crm"
                          element={
                            <ProtectedRoute roles={["admin"]}>
                              <AdminCrmLayout />
                            </ProtectedRoute>
                          }
                        >
                          <Route index element={<AdminCrmOverview />} />
                          <Route path="customers" element={<AdminCrmCustomers />} />
                          <Route path="customers/:id" element={<AdminCrmCustomer360 />} />
                          <Route path="pipeline" element={<AdminCrmPipeline />} />
                          <Route path="tasks" element={<AdminCrmTasks />} />
                          <Route path="follow-ups" element={<AdminCrmFollowUps />} />
                          <Route path="activities" element={<AdminCrmActivities />} />
                          <Route path="whatsapp" element={<AdminCrmWhatsAppInbox />} />
                        </Route>

                        <Route
                          path="/admin/guided-demos"
                          element={
                            <ProtectedRoute roles={["admin"]}>
                              <AdminGuidedDemos />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/admin/guided-demos/:id"
                          element={
                            <ProtectedRoute roles={["admin"]}>
                              <AdminGuidedDemoDetail />
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
                          path="/admin/marketers"
                          element={
                            <ProtectedRoute roles={["admin"]}>
                              <AdminMarketers />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/admin/partners"
                          element={
                            <ProtectedRoute roles={["admin"]}>
                              <AdminPartners />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/admin/partners/referrals"
                          element={
                            <ProtectedRoute roles={["admin"]}>
                              <AdminPartnerReferrals />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/admin/partners/attention"
                          element={
                            <ProtectedRoute roles={["admin"]}>
                              <AdminPartnerAttentionDeals />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/admin/partners/:partnerId"
                          element={
                            <ProtectedRoute roles={["admin"]}>
                              <AdminPartnerDossier />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/admin/support-chat"
                          element={
                            <ProtectedRoute roles={["admin"]}>
                              <AdminSupportChat />
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

                        <Route
                          path="/marketer/dashboard/*"
                          element={
                            <ProtectedRoute roles={["marketer"]}>
                              <MarketerDashboardPage />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/partner/dashboard"
                          element={
                            <ProtectedRoute roles={["partner"]}>
                              <PartnerLayout />
                            </ProtectedRoute>
                          }
                        >
                          <Route index element={<PartnerDashboard />} />
                          <Route path="crm" element={<PartnerClients />} />
                          <Route path="crm/:clientId" element={<PartnerClientDossier />} />
                          <Route path="clients/new" element={<PartnerClientWizard />} />
                          <Route path="tasks" element={<PartnerWorkboard />} />
                          <Route path="reminders" element={<PartnerWorkboard />} />
                          <Route path="pricing" element={<PartnerPricing />} />
                          <Route path="storefront" element={<PartnerStorefrontSettings />} />
                          <Route path="page" element={<PartnerMyPage />} />
                          <Route path="referrals" element={<PartnerReferrals />} />
                          <Route path="transactions" element={<PartnerTransactions />} />
                          <Route path="withdrawals" element={<PartnerWithdrawals />} />
                          <Route path="deals/:dealId" element={<PartnerDealDetail />} />
                          <Route path="revenue" element={<PartnerRevenue />} />
                          <Route path="team" element={<PartnerTeam />} />
                          <Route path="settings" element={<PartnerSettings />} />
                        </Route>

                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>

                      <AiModal />
                    </motion.div>
                  </Suspense>
                  </LazyRouteBoundary>
                </AnimatePresence>
              </AiProvider>
            </div>
          )}
        </main>

        {!isDashboardRoute &&
          !isPublicBusinessProfile &&
          !isEarlyAccessLanding &&
          !isHiddenOffer &&
          !isGuidedDemoRoute &&
          !isPublicProposalRoute &&
          !isPublicPartnerDeal &&
          !isPublicPartnerSales &&
          !isBizuplyPublicBookingRoute && <Footer />}
      </div>

      <GuidedDemoHost />

      {!user && !isEarlyAccessLanding && !isHiddenOffer && !isBizuplyPublicBookingRoute && !isPublicProposalRoute && !isPublicPartnerDeal && !isPublicPartnerSales && (
        <PreLoginBot />
      )}

      {/* Admin softphone — survives page changes + business impersonation */}
      <AdminSoftphoneHost />

      {user?.role === "admin" && isAdminRoute && <AdminPushPermissionBanner />}

      {/* Site-wide support bot — keep visible on public + app pages */}
      {!isEarlyAccessLanding &&
        !isBusinessChatRoute &&
        !isHiddenOffer &&
        !isAdminRoute &&
        !isStaffRoute &&
        !isGuidedDemoRoute &&
        !isPublicProposalRoute &&
        !isPublicPartnerDeal &&
        !isPublicPartnerSales &&
        !isBizuplyPublicBookingRoute &&
        !location.pathname.startsWith("/embed/") &&
        !isMiniSiteHost && (
          <SupportChatWidget />
        )}

      {/* Platform accessibility only — never dashboards, never customer public sites */}
      {!isDashboardRoute &&
        !isBusinessChatRoute &&
        !isEarlyAccessLanding &&
        !isMiniSiteHost &&
        !isPublicProposalRoute &&
        !isPublicPartnerDeal &&
        !isPublicPartnerSales &&
        !isBizuplyPublicBookingRoute && (
          <AccessibilityWidget siteKey="bizuply-platform" mode="live" />
        )}
    </NotificationsProvider>
  );
}




