import React, { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { FaBars, FaTimes } from "react-icons/fa";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useAuth } from "../../context/AuthContext";
import { getTextDirection, isHebrewLanguage } from "../../i18n/localeUtils";
import { BusinessServicesProvider } from "@context/BusinessServicesContext";
import { AiProvider } from "../../context/AiContext";
import API from "../../api";
import {
  clearLastDashboardRoute,
  saveLastDashboardRoute,
} from "../../utils/dashboardRoutePersistence";
import {
  normalizeBusinessId,
  rewriteDashboardTargetForBusiness,
} from "../../utils/notificationNavigation";
import { useDashboardBusinessId } from "../../hooks/useDashboardBusinessId";
import {
  clearAdminActiveBusinessId,
  setAdminActiveBusinessId,
} from "../../utils/adminTenant";
import { ensurePushSubscription } from "../../utils/push";

import FacebookStyleNotifications from "../../components/FacebookStyleNotifications";
import BusinessWorkspaceNav from "../../components/BusinessWorkspaceNav";
import BizuplyLoader from "../../components/ui/BizuplyLoader";

/* ============================
   Types
============================ */

type AuthUser = {
  userId?: string;
  name?: string;
  email?: string;
  role?: string;

  businessId?: string;
  businessName?: string;

  hasPaid?: boolean;
  paymentStatus?: string;
  subscriptionPlan?: "trial" | "monthly" | "yearly" | string;

  trialStartedAt?: string | Date | null;
  trialEndsAt?: string | Date | null;
  trialDaysLeft?: number;
  isTrialEndingToday?: boolean;

  isSubscriptionValid?: boolean;

  isEarlyBirdActive?: boolean;
  earlyBirdUsed?: boolean;
  earlyBirdModalSeenAt?: string | null;
  earlyBirdExpiresAt?: string | Date | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  logout?: () => Promise<void> | void;
  isImpersonating?: boolean;
  loginWithToken?: (
    userFromServer: unknown,
    accessToken: string,
    options?: { skipRedirect?: boolean }
  ) => void;
};

type UnreadCountResponse = {
  count?: number;
};

type UnreadCountUpdatePayload = {
  count?: number;
};

/* ============================
   Socket
============================ */

const SOCKET_URL = "https://api.bizuply.com";
const socket = io(SOCKET_URL, { autoConnect: false });

const SIDEBAR_WIDTH_EXPANDED = 260;
const SIDEBAR_WIDTH_COLLAPSED = 72;
const SIDEBAR_COLLAPSED_STORAGE_KEY = "bizuply-sidebar-collapsed";
const MOBILE_BREAKPOINT = 768;

function isBrowser() {
  return typeof window !== "undefined";
}

function getIsMobile() {
  if (!isBrowser()) return false;
  return window.innerWidth <= MOBILE_BREAKPOINT;
}

function getInitialSidebarCollapsed() {
  if (!isBrowser()) return false;
  return localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) === "true";
}

/* ============================
   Website / Template Fullscreen
============================ */

function isWebsiteFullScreenRoute(pathname: string, search: string) {
  const path = String(pathname || "").toLowerCase();
  const query = String(search || "").toLowerCase();
  const full = `${path}${query}`;

  const params = new URLSearchParams(search || "");

  const template =
    params.get("template") ||
    params.get("templateId") ||
    params.get("templateid");

  /*
    תופס נתיבים כמו:
    /business/:businessId/dashboard/website?template=velmora
    /business/:businessId/dashboard/website?templateId=velmora
  */
  const isWebsiteTemplateEditor =
    path.includes("/dashboard/website") && Boolean(template);

  const isWebsiteSitesEditor =
    path.includes("/dashboard/website/sites/") && path.includes("/edit");

  /*
    תופס Preview/View/Edit של כל תבנית:
    /business/:businessId/dashboard/website/templates/velmora/preview
    /business/:businessId/dashboard/website/templates/xxx/preview
    /business/:businessId/dashboard/website/templates/xxx/view
    /business/:businessId/dashboard/website/templates/xxx/edit
    /business/:businessId/dashboard/website/templates/xxx/editor
  */
  const isAnyTemplatePreview =
    path.includes("/dashboard/website/templates/") &&
    (path.includes("/preview") ||
      path.includes("/view") ||
      path.includes("/edit") ||
      path.includes("/editor"));

  /*
    תופס כל עורך/סטודיו/בילדר עתידי
  */
  const isAnyStudioEditor =
    path.includes("/dashboard/website") &&
    (query.includes("template=") ||
      query.includes("templateid=") ||
      query.includes("mode=edit") ||
      query.includes("editor=true") ||
      full.includes("website-studio") ||
      full.includes("site-builder") ||
      full.includes("visual-editor") ||
      full.includes("build-website") ||
      full.includes("buildwebsite") ||
      full.includes("/studio"));

  return Boolean(
    isWebsiteTemplateEditor ||
      isAnyTemplatePreview ||
      isAnyStudioEditor ||
      isWebsiteSitesEditor
  );
}

export default function BusinessDashboardLayout() {
  const { user, loading, logout, isImpersonating, loginWithToken } =
    useAuth() as AuthContextValue;
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const businessId = useDashboardBusinessId();
  const isAdmin = user?.role === "admin";
  const layoutDir = getTextDirection(i18n.language);
  const isRtl = isHebrewLanguage(i18n.language);

  const sidebarRef = useRef<HTMLElement | null>(null);

  const [messagesCount, setMessagesCount] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(() => getIsMobile());
  const [showSidebar, setShowSidebar] = useState<boolean>(() => !getIsMobile());
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() =>
    getInitialSidebarCollapsed()
  );
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [exitingImpersonation, setExitingImpersonation] = useState(false);

  const sidebarWidth =
    !isMobile && sidebarCollapsed
      ? SIDEBAR_WIDTH_COLLAPSED
      : SIDEBAR_WIDTH_EXPANDED;

  const isWebsiteFullScreen = useMemo(() => {
    return isWebsiteFullScreenRoute(location.pathname, location.search);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (isAdmin && businessId) {
      setAdminActiveBusinessId(businessId);
    }
  }, [isAdmin, businessId]);

  // Re-bind Web Push to the active business when permission is already granted.
  useEffect(() => {
    if (!businessId) return;
    void ensurePushSubscription();
  }, [businessId]);

  /* ============================
     Persist current dashboard route (survives refresh)
  ============================ */

  useEffect(() => {
    if (!businessId) return;
    if (isWebsiteFullScreen) return;

    saveLastDashboardRoute(businessId, location.pathname, location.search);
  }, [businessId, location.pathname, location.search, isWebsiteFullScreen]);

  useEffect(() => {
    const handleNotificationNavigate = (event: Event) => {
      const url = (event as CustomEvent<{ url?: string }>).detail?.url;
      const currentBusinessId = normalizeBusinessId(businessId);

      if (!url || !currentBusinessId) return;

      navigate(
        rewriteDashboardTargetForBusiness(url, currentBusinessId),
        { replace: false }
      );
    };

    window.addEventListener(
      "bizuply:notification-navigate",
      handleNotificationNavigate
    );

    return () => {
      window.removeEventListener(
        "bizuply:notification-navigate",
        handleNotificationNavigate
      );
    };
  }, [navigate, businessId]);

  const DAY = 1000 * 60 * 60 * 24;

  const daysSinceTrialStart = user?.trialStartedAt
    ? Math.floor(
        (Date.now() - new Date(user.trialStartedAt).getTime()) / DAY
      )
    : 0;

  const isAfterDay4 = daysSinceTrialStart >= 4;
  const earlyBirdUsed = Boolean(user?.earlyBirdUsed);

  const hasActiveSubscription =
    user?.subscriptionPlan === "monthly" ||
    user?.subscriptionPlan === "yearly";

  const hasPaid =
    user?.hasPaid === true ||
    user?.paymentStatus === "paid" ||
    user?.paymentStatus === "active" ||
    hasActiveSubscription;

  const isTrialActive = Boolean(
    user?.subscriptionPlan === "trial" &&
      user?.trialEndsAt &&
      new Date(user.trialEndsAt).getTime() > Date.now()
  );

  const canUpgrade = Boolean(isTrialActive && !hasPaid && !earlyBirdUsed);

  const canShowEarlyBird = Boolean(
    canUpgrade && user?.isEarlyBirdActive && isAfterDay4
  );

  /* ============================
     Unread Messages
  ============================ */

  useEffect(() => {
    if (!businessId) return;

    API.get<UnreadCountResponse>("/chat/unread-count")
      .then((res) => {
        setMessagesCount(res.data?.count || 0);
      })
      .catch(() => {
        setMessagesCount(0);
      });

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("joinRoom", `business-${businessId}`);
    socket.emit("joinBusinessRoom", businessId);

    const handleUnreadCountUpdate = (data: UnreadCountUpdatePayload) => {
      setMessagesCount(data?.count || 0);
    };

    socket.on("unreadCountUpdate", handleUnreadCountUpdate);

    return () => {
      socket.off("unreadCountUpdate", handleUnreadCountUpdate);
      socket.emit("leaveRoom", `business-${businessId}`);
    };
  }, [businessId]);

  /* ============================
     Resize Handler
  ============================ */

  useEffect(() => {
    const onResize = () => {
      const mobile = getIsMobile();

      setIsMobile(mobile);

      if (
        isWebsiteFullScreenRoute(
          window.location.pathname,
          window.location.search
        )
      ) {
        setShowSidebar(false);
        return;
      }

      setShowSidebar(!mobile);
    };

    window.addEventListener("resize", onResize);
    onResize();

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    if (isWebsiteFullScreen) {
      setShowSidebar(false);
      return;
    }

    setShowSidebar(!isMobile);
  }, [isWebsiteFullScreen, isMobile]);

  /*
    כשהעורך/preview פתוח במסך מלא,
    מונע גלילה של הדשבורד מאחורה.
  */
  useEffect(() => {
    if (!isWebsiteFullScreen) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isWebsiteFullScreen]);

  /* ============================
     Early Bird Countdown
  ============================ */

  useEffect(() => {
    if (!user?.isEarlyBirdActive || !user?.earlyBirdExpiresAt) return;

    const updateTimer = () => {
      const now = Date.now();
      const end = new Date(user.earlyBirdExpiresAt as string | Date).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      setTimeLeft(`${hours} hours ${minutes} minutes`);
    };

    updateTimer();

    const interval = window.setInterval(updateTimer, 60000);

    return () => {
      window.clearInterval(interval);
    };
  }, [user?.isEarlyBirdActive, user?.earlyBirdExpiresAt]);

  /* ============================
     Upgrade
  ============================ */

  const handleEarlyBirdUpgrade = async () => {
    if (!user?.userId) return;
    if (earlyBirdUsed || hasPaid) return;

    try {
      const res = await API.post("/stripe/create-checkout-session", {
        userId: user.userId,
        plan: "monthly",
      });

      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      console.error("Early Bird checkout error:", err);
    }
  };

  /* ============================
     Logout
  ============================ */

  const handleLogout = async () => {
    try {
      if (businessId) {
        clearLastDashboardRoute(businessId);
      } else {
        clearLastDashboardRoute();
      }

      clearAdminActiveBusinessId();
      socket.disconnect();
      // logout() clears auth and navigates to /login; next login → main dashboard
      await logout?.();
    } catch {
      navigate("/login", { replace: true });
    }
  };

  const handleBackToAdmin = () => {
    clearAdminActiveBusinessId();
    navigate("/admin/users", { replace: false });
  };

  const toggleSidebarCollapsed = () => {
    setSidebarCollapsed((value) => {
      const next = !value;
      if (isBrowser()) {
        localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(next));
      }
      return next;
    });
  };

  const handleExitImpersonation = async () => {
    if (exitingImpersonation) return;
    setExitingImpersonation(true);

    try {
      const { data } = await API.post("/admin/exit-impersonation");
      loginWithToken?.(data.user, data.token, { skipRedirect: true });
      localStorage.removeItem("impersonatedBy");
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      console.error("Exit impersonation failed:", err);
      alert(t("layout.exitImpersonationError"));
    } finally {
      setExitingImpersonation(false);
    }
  };

  if (loading) {
    return <BizuplyLoader fullScreen />;
  }

  return (
    <BusinessServicesProvider>
      <AiProvider>
        <div
          dir={layoutDir}
          className="min-h-screen w-full bg-[#f5f6fb] text-slate-800"
        >
          {isImpersonating ? (
            <div className="fixed inset-x-0 top-0 z-[60] flex flex-wrap items-center justify-between gap-3 border-b border-amber-300 bg-amber-50 px-4 py-3 text-amber-950 md:px-6">
              <div className="text-start">
                <strong className="block text-sm font-black">
                  {t("layout.adminImpersonationTitle")}
                </strong>
                <span className="block text-xs font-bold text-amber-900/70">
                  {t("layout.adminImpersonationText", {
                    name: user?.businessName || user?.name || "",
                  })}
                </span>
              </div>

              <button
                type="button"
                disabled={exitingImpersonation}
                onClick={handleExitImpersonation}
                className="rounded-md border border-amber-200/80 bg-gradient-to-l from-amber-100 via-orange-50 to-white px-4 py-2.5 text-xs font-black text-black transition hover:from-amber-200/80 hover:via-orange-50 hover:to-white disabled:opacity-60"
              >
                {exitingImpersonation
                  ? t("layout.returning")
                  : t("layout.backToAdmin")}
              </button>
            </div>
          ) : null}
          {!isWebsiteFullScreen && isMobile && showSidebar && (
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setShowSidebar(false)}
              className="fixed inset-0 z-40 border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800/35 backdrop-blur-sm"
            />
          )}

          {!isWebsiteFullScreen && (!isMobile || showSidebar) && (
            <aside
              ref={sidebarRef}
              className={`
                fixed z-50 flex flex-col overflow-hidden
                bg-gradient-to-b from-[#faf7ff] via-[#f3f8ff] to-[#eefcff]
                shadow-[4px_0_28px_rgba(99,102,241,0.07)]
                transition-[width,transform] duration-300 ease-in-out
                ${isRtl ? "right-0 border-l border-violet-100/80" : "left-0 border-r border-violet-100/80"}
                ${
                  isMobile
                    ? showSidebar
                      ? "translate-x-0"
                      : isRtl
                        ? "translate-x-full"
                        : "-translate-x-full"
                    : "translate-x-0"
                }
              `}
              style={{
                top: isImpersonating ? 56 : 0,
                height: isImpersonating ? "calc(100vh - 56px)" : "100vh",
                width: isMobile ? SIDEBAR_WIDTH_EXPANDED : sidebarWidth,
              }}
            >
              <div
                className={`
                  relative flex shrink-0 items-center border-b border-violet-100/70
                  bg-white/35 backdrop-blur-sm
                  ${
                    sidebarCollapsed && !isMobile
                      ? "h-[76px] flex-col justify-center gap-1.5 px-2"
                      : "h-[80px] justify-between gap-2 px-3"
                  }
                `}
              >
                <div
                  className={`
                    flex items-center justify-center overflow-hidden
                    ${sidebarCollapsed && !isMobile ? "h-10 w-10" : "h-full min-w-0 flex-1"}
                  `}
                >
                  <img
                    src="/bizuply logo.png"
                    alt="BizUply Logo"
                    className={`
                      object-contain transition-transform duration-300
                      ${
                        sidebarCollapsed && !isMobile
                          ? "h-10 w-10"
                          : "h-10 w-auto max-w-full origin-center scale-[2]"
                      }
                    `}
                  />
                </div>

                {!isMobile && (
                  <button
                    type="button"
                    onClick={toggleSidebarCollapsed}
                    aria-label={
                      sidebarCollapsed
                        ? t("businessNav.expandSidebar", "Expand sidebar")
                        : t("businessNav.collapseSidebar", "Collapse sidebar")
                    }
                    className="
                      flex h-7 w-7 shrink-0 items-center justify-center rounded-md
                      border border-violet-200/70 bg-white/75 text-slate-500
                      shadow-[0_2px_8px_rgba(99,102,241,0.06)]
                      transition hover:border-sky-200 hover:bg-white
                      hover:text-sky-600
                    "
                  >
                    {sidebarCollapsed ? (
                      isRtl ? (
                        <ChevronLeft size={16} strokeWidth={2.5} />
                      ) : (
                        <ChevronRight size={16} strokeWidth={2.5} />
                      )
                    ) : isRtl ? (
                      <ChevronRight size={16} strokeWidth={2.5} />
                    ) : (
                      <ChevronLeft size={16} strokeWidth={2.5} />
                    )}
                  </button>
                )}
              </div>

              <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-2 py-3">
                <BusinessWorkspaceNav
                  collapsed={!isMobile && sidebarCollapsed}
                  onNavigate={() => {
                    if (isMobile) {
                      setShowSidebar(false);
                    }
                  }}
                />
              </div>

              {isMobile && (
                <div className="border-t border-violet-100/70 bg-white/30 p-4 backdrop-blur-sm">
                  <div className="mb-3 truncate text-sm font-semibold text-slate-800">
                    {user?.businessName || user?.name}
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      w-full rounded-md border border-violet-200/70 bg-white/80
                      px-4 py-3 text-sm font-semibold text-slate-700
                      transition hover:border-sky-200 hover:bg-white
                    "
                  >
                    {t("common.logOut")}
                  </button>
                </div>
              )}
            </aside>
          )}

          {!isWebsiteFullScreen && isAdmin && (
            <div
              className="
                fixed top-0 z-[35] flex h-10 items-center justify-between
                gap-3 border border-violet-200/80 bg-gradient-to-l from-violet-50 via-sky-50 to-cyan-50 px-4 text-sm text-white
              "
              style={{
                left: isMobile ? 0 : isRtl ? 0 : sidebarWidth,
                right: isMobile ? 0 : isRtl ? sidebarWidth : 0,
              }}
            >
              <span className="truncate font-semibold">
                {t("layout.adminBarTitle")}
              </span>
              <button
                type="button"
                onClick={handleBackToAdmin}
                className="
                  shrink-0 rounded-lg bg-white/15 px-3 py-1 text-xs font-bold
                  transition hover:bg-white/25
                "
              >
                {t("layout.backToAdmin")}
              </button>
            </div>
          )}

          {!isWebsiteFullScreen && (
            <header
              className="
                fixed z-30 flex h-16 items-center justify-between
                border-b border-slate-200 bg-white/95 px-4 shadow-sm
                backdrop-blur-xl transition-all duration-300 lg:px-6
              "
              style={{
                top: isImpersonating ? 56 : isAdmin ? 40 : 0,
                left: isMobile ? 0 : isRtl ? 0 : sidebarWidth,
                right: isMobile ? 0 : isRtl ? sidebarWidth : 0,
              }}
            >
              <div className="flex min-w-0 items-center gap-3">
                {isMobile && (
                  <button
                    type="button"
                    aria-label="Open menu"
                    onClick={() => setShowSidebar((value) => !value)}
                    className="
                      flex h-10 w-10 items-center justify-center rounded-2xl
                      border border-slate-200 bg-white text-slate-700
                      shadow-sm transition hover:bg-slate-50
                    "
                  >
                    {showSidebar ? <FaTimes /> : <FaBars />}
                  </button>
                )}

                <div className="hidden min-w-0 text-sm font-semibold text-slate-700 sm:block">
                  <span className="font-black text-slate-800">
                    {t("common.hello", {
                      name: user?.businessName || user?.name || "",
                    })}
                  </span>
                  {isAdmin && (
                    <span className="ms-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
                      Admin
                    </span>
                  )}
                </div>

                {!isMobile && isTrialActive && !hasPaid && (
                  <div
                    className="
                      flex items-center gap-2 rounded-full border
                      border-violet-100 bg-violet-50 px-3 py-1.5
                      text-sm font-semibold text-violet-700
                    "
                  >
                    <span>⏳</span>

                    {user?.isTrialEndingToday ? (
                      <strong>Trial ends today</strong>
                    ) : (
                      <span>
                        Trial ends in{" "}
                        <strong>{user?.trialDaysLeft || 0} days</strong>
                      </span>
                    )}

                    {canUpgrade && !canShowEarlyBird && (
                      <button
                        type="button"
                        onClick={() => navigate("/pricing")}
                        className="
                          ml-2 rounded-full bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70 px-4 py-1.5
                          text-xs font-black text-black shadow-sm transition
                          hover:from-violet-200/80 hover:via-sky-100 hover:to-cyan-100
                        "
                      >
                        Upgrade
                      </button>
                    )}
                  </div>
                )}
              </div>

              {!isMobile && canShowEarlyBird && (
                <div className="mx-4 hidden min-w-0 flex-1 justify-center xl:flex">
                  <div
                    className="
                      flex max-w-3xl items-center gap-3 rounded-full border
                      border-violet-100 bg-gradient-to-r from-violet-50
                      via-white to-fuchsia-50 px-4 py-2 text-sm
                      shadow-[0_10px_30px_rgba(109,40,217,0.10)]
                    "
                  >
                    {timeLeft && (
                      <div className="shrink-0 text-xs font-bold text-slate-600">
                        ⏳ Ends in{" "}
                        <strong className="text-violet-700">{timeLeft}</strong>
                      </div>
                    )}

                    <div className="min-w-0 truncate text-slate-700">
                      <span className="ml-2 rounded-full bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70 px-2.5 py-1 text-xs font-black text-black">
                        🎁 Early Bird
                      </span>

                      <span>
                        Save <strong>$30</strong> today — first month only{" "}
                        <span className="font-black text-violet-700">
                          $119
                        </span>{" "}
                        <span className="text-slate-400 line-through">
                          $149
                        </span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleEarlyBirdUpgrade}
                      className="
                        shrink-0 rounded-full bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70 px-4 py-2
                        text-xs font-black text-black shadow-sm
                        transition hover:from-violet-200/80 hover:via-sky-100 hover:to-cyan-100
                      "
                    >
                      Upgrade
                    </button>
                  </div>
                </div>
              )}

              <div className="flex shrink-0 items-center gap-3">
                <div className="relative">
                  <FacebookStyleNotifications />
                </div>

                {!isMobile && (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      rounded-2xl border border-slate-200 bg-white px-4 py-2.5
                      text-sm font-bold text-slate-700 shadow-sm transition
                      hover:bg-slate-50
                    "
                  >
                    {t("common.logOut")}
                  </button>
                )}
              </div>
            </header>
          )}

          <main
            className={[
              "min-h-screen w-full max-w-none overflow-x-hidden bg-[#f5f6fb] transition-[padding] duration-300",
              isWebsiteFullScreen
                ? isImpersonating
                  ? "pt-14"
                  : "pt-0"
                : isAdmin
                  ? "pt-[104px]"
                  : isImpersonating
                    ? "pt-[120px]"
                    : "pt-16",
            ].join(" ")}
            style={
              isWebsiteFullScreen || isMobile
                ? undefined
                : isRtl
                  ? { paddingRight: sidebarWidth }
                  : { paddingLeft: sidebarWidth }
            }
          >
            <div
              className={
                isWebsiteFullScreen
                  ? "min-h-screen w-full max-w-none"
                  : "min-h-[calc(100vh-64px)] w-full max-w-none"
              }
            >
              <Outlet />
            </div>
          </main>
        </div>
      </AiProvider>
    </BusinessServicesProvider>
  );
}