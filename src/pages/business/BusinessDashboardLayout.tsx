import React, { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { FaBars, FaTimes } from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import { BusinessServicesProvider } from "@context/BusinessServicesContext";
import { AiProvider } from "../../context/AiContext";
import API from "../../api";

import FacebookStyleNotifications from "../../components/FacebookStyleNotifications";
import BusinessWorkspaceNav from "../../components/BusinessWorkspaceNav";

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

const SIDEBAR_WIDTH = 250;
const MOBILE_BREAKPOINT = 768;

function isBrowser() {
  return typeof window !== "undefined";
}

function getIsMobile() {
  if (!isBrowser()) return false;
  return window.innerWidth <= MOBILE_BREAKPOINT;
}

export default function BusinessDashboardLayout() {
  const { user, loading, logout } = useAuth() as AuthContextValue;
  const navigate = useNavigate();

  const sidebarRef = useRef<HTMLElement | null>(null);

  const [messagesCount, setMessagesCount] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(() => getIsMobile());
  const [showSidebar, setShowSidebar] = useState<boolean>(() => !getIsMobile());
  const [timeLeft, setTimeLeft] = useState<string>("");

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
    if (!user?.businessId) return;

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

    socket.emit("joinRoom", `business-${user.businessId}`);

    const handleUnreadCountUpdate = (data: UnreadCountUpdatePayload) => {
      setMessagesCount(data?.count || 0);
    };

    socket.on("unreadCountUpdate", handleUnreadCountUpdate);

    return () => {
      socket.off("unreadCountUpdate", handleUnreadCountUpdate);
      socket.emit("leaveRoom", `business-${user.businessId}`);
    };
  }, [user?.businessId]);

  /* ============================
     Resize Handler
  ============================ */

  useEffect(() => {
    const onResize = () => {
      const mobile = getIsMobile();

      setIsMobile(mobile);
      setShowSidebar(!mobile);
    };

    window.addEventListener("resize", onResize);
    onResize();

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

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

      setTimeLeft(`${hours}h ${minutes}m`);
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
      socket.disconnect();
      await logout?.();
      navigate("/", { replace: true });
    } catch {
      navigate("/", { replace: true });
    }
  };

  if (loading) return null;

  return (
    <BusinessServicesProvider>
      <AiProvider>
        <div className="min-h-screen w-full bg-[#f5f6fb] text-slate-950">
          {/* Mobile Overlay */}
          {isMobile && showSidebar && (
            <button
              type="button"
              aria-label="Close sidebar"
              onClick={() => setShowSidebar(false)}
              className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-sm"
            />
          )}

          {/* Sidebar */}
          {(!isMobile || showSidebar) && (
            <aside
              ref={sidebarRef}
              className={`
                fixed left-0 top-0 z-50 flex h-screen w-[250px]
                flex-col border-r border-slate-200 bg-white
                shadow-[0_20px_60px_rgba(15,23,42,0.10)]
                transition-transform duration-300
                ${
                  isMobile
                    ? showSidebar
                      ? "translate-x-0"
                      : "-translate-x-full"
                    : "translate-x-0"
                }
              `}
            >
              <div className="flex h-16 shrink-0 items-center border-b border-slate-100 px-6">
                <img
                  src="/bizuply logo.png"
                  alt="BizUply Logo"
                  className="h-9 w-auto object-contain"
                />
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
                <BusinessWorkspaceNav
  messagesCount={messagesCount}
  workspaceName={user?.businessName || user?.name}
  onNavigate={() => {
    if (isMobile) {
      setShowSidebar(false);
    }
  }}
/>
              </div>

              {isMobile && (
                <div className="border-t border-slate-100 p-4">
                  <div className="mb-3 truncate text-sm font-bold text-slate-900">
                    {user?.businessName || user?.name}
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      w-full rounded-2xl border border-slate-200 bg-white
                      px-4 py-3 text-sm font-bold text-slate-700
                      transition hover:bg-slate-50
                    "
                  >
                    Logout
                  </button>
                </div>
              )}
            </aside>
          )}

          {/* Header */}
          <header
            className="
              fixed right-0 top-0 z-30 flex h-16 items-center justify-between
              border-b border-slate-200 bg-white/95 px-4 shadow-sm
              backdrop-blur-xl transition-all duration-300 lg:px-6
            "
            style={{
              left: isMobile ? 0 : SIDEBAR_WIDTH,
            }}
          >
            <div className="flex min-w-0 items-center gap-3">
              {isMobile && (
                <button
                  type="button"
                  aria-label="Toggle sidebar"
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
                Hello,{" "}
                <span className="font-black text-slate-950">
                  {user?.businessName || user?.name}
                </span>
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
                        ml-2 rounded-full bg-violet-600 px-4 py-1.5
                        text-xs font-black text-white shadow-sm transition
                        hover:bg-violet-700
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
                      ⏳ Ending in{" "}
                      <strong className="text-violet-700">{timeLeft}</strong>
                    </div>
                  )}

                  <div className="min-w-0 truncate text-slate-700">
                    <span className="mr-2 rounded-full bg-violet-600 px-2.5 py-1 text-xs font-black text-white">
                      🎁 Early Bird
                    </span>

                    <span>
                      Save <strong>$30</strong> today — first month only{" "}
                      <span className="font-black text-violet-700">$119</span>{" "}
                      <span className="text-slate-400 line-through">$149</span>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleEarlyBirdUpgrade}
                    className="
                      shrink-0 rounded-full bg-violet-600 px-4 py-2
                      text-xs font-black text-white shadow-sm
                      transition hover:bg-violet-700
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
                  Logout
                </button>
              )}
            </div>
          </header>

          {/* Content */}
          <main
            className="
              min-h-screen w-full max-w-none overflow-x-hidden
              bg-[#f5f6fb] pt-16 lg:pl-[250px]
            "
          >
            <div className="min-h-[calc(100vh-64px)] w-full max-w-none">
              <Outlet />
            </div>
          </main>
        </div>
      </AiProvider>
    </BusinessServicesProvider>
  );
}