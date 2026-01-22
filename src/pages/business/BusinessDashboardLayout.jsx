import React, { useEffect, useState, useRef } from "react";
import {
  NavLink,
  Outlet,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BusinessServicesProvider } from "@context/BusinessServicesContext";
import { AiProvider } from "../../context/AiContext";
import API from "../../api";
import "../../styles/BusinessDashboardLayout.css";
import { io } from "socket.io-client";
import { FaTimes, FaBars } from "react-icons/fa";
import FacebookStyleNotifications from "../../components/FacebookStyleNotifications";
import BusinessWorkspaceNav from "../../components/BusinessWorkspaceNav";



/* ============================
   🔌 Socket
============================ */
const SOCKET_URL = "https://api.bizuply.com";
const socket = io(SOCKET_URL, { autoConnect: false });

export default function BusinessDashboardLayout() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const { businessId } = useParams();

  /* ============================
     📩 Unread Messages
  ============================ */
  const [messagesCount, setMessagesCount] = useState(0);

  useEffect(() => {
    if (!user?.businessId) return;

    API.get("/chat/unread-count")
      .then((res) => setMessagesCount(res.data?.count || 0))
      .catch(() => setMessagesCount(0));

    if (!socket.connected) socket.connect();
    socket.emit("joinRoom", `business-${user.businessId}`);

    socket.on("unreadCountUpdate", (data) => {
      setMessagesCount(data.count || 0);
    });

    return () => {
      socket.off("unreadCountUpdate");
      socket.emit("leaveRoom", `business-${user.businessId}`);
    };
  }, [user?.businessId]);

  /* ============================
     📱 Sidebar State
  ============================ */
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  const sidebarRef = useRef(null);

  /* ============================
     🎁 Early Bird UI State
  ============================ */
  const [timeLeft, setTimeLeft] = useState("");

  /* ⏰ Early Bird Countdown */
  useEffect(() => {
    if (!user?.isEarlyBirdActive || !user?.earlyBirdExpiresAt) return;

    const updateTimer = () => {
      const now = Date.now();
      const end = new Date(user.earlyBirdExpiresAt).getTime();
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
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [user?.isEarlyBirdActive, user?.earlyBirdExpiresAt]);

  /* 🎁 Upgrade → Stripe */
  

const handleUpgrade = async () => {
  if (!user?.userId) return;

  try {
    const res = await API.post("/stripe/create-checkout-session", {
      userId: user.userId,
      plan: "monthly",
      forceRegularPrice: true,
    });

    if (res.data?.url) {
      window.location.href = res.data.url;
    }
  } catch (err) {
    console.error("Checkout error:", err);
  }
};

const handleEarlyBirdUpgrade = async () => {
  if (!user?.userId) return;
  if (user?.earlyBirdUsed || user?.hasPaid) return;

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
     🔓 Logout
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

  /* ============================
     📐 Resize Handler
  ============================ */
  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setShowSidebar(true);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

    /* ============================
     ⏳ Trial Day Calculation
  ============================ */
  const DAY = 1000 * 60 * 60 * 24;

  const daysSinceTrialStart = user?.trialStartedAt
    ? Math.floor(
        (Date.now() - new Date(user.trialStartedAt).getTime()) / DAY
      )
    : 0;

  const isAfterDay4 = daysSinceTrialStart >= 4;

  /* ============================
   🎯 Upgrade / Early Bird Guards
============================ */
const earlyBirdUsed = Boolean(user?.earlyBirdUsed);
const hasPaid = Boolean(user?.hasPaid);

const isTrialActive =
  user?.subscriptionPlan === "trial" &&
  user?.trialEndsAt &&
  new Date(user.trialEndsAt) > new Date();

const canUpgrade =
  isTrialActive &&
  !hasPaid &&
  !earlyBirdUsed;



 

  if (loading) return null;

  /* ============================
     🎨 Layout
  ============================ */
  return (
    <BusinessServicesProvider>
      <AiProvider>
        <div className={`ltr-wrapper ${showSidebar ? "sidebar-open" : ""}`}>
          <div className="business-dashboard-layout">

            {/* ================= Sidebar ================= */}
            {(!isMobile || showSidebar) && (
              <aside
                className={`dashboard-layout-sidebar ${isMobile ? "open" : ""}`}
                ref={sidebarRef}
              >
                <div className="sidebar-logo">
                  <img
                    src="/bizuply logo.png"
                    alt="BizUply Logo"
                    className="sidebar-logo-img"
                  />

                  {isMobile && (
                    <button
                      className="sidebar-close-btn"
                      onClick={() => setShowSidebar(false)}
                      aria-label="Close menu"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>

               <BusinessWorkspaceNav
  messagesCount={messagesCount}
  onNavigate={() => isMobile && setShowSidebar(false)}
/>


                {isMobile && (
                  <div className="sidebar-footer">
                    <span className="user-name">
                      {user?.businessName || user?.name}
                    </span>
                    <button className="logout-btn" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </aside>
            )}

            {/* ================= Header ================= */}
            {!isMobile && (
              <header className="dashboard-layout-header">

                <div className="dashboard-layout-header-left">
                  <div>Hello, {user?.businessName || user?.name}</div>

                  {isTrialActive && (

  <div className="trial-status">
    ⏳{" "}
    {user.isTrialEndingToday ? (
      <strong>Trial ends today</strong>
    ) : (
      <>
        Trial ends in <strong>{user.trialDaysLeft} days</strong>
      </>
    )}

    {canUpgrade && !canShowEarlyBird && (
  <button
    className="trial-upgrade-pill"
    onClick={handleUpgrade}
  >
    Upgrade
  </button>
)}
  </div>
)}


                </div>
{canShowEarlyBird && (


                  <div className="dashboard-layout-header-center">
                    <div className="earlybird-header-banner">

                      {timeLeft && (
                        <div className="earlybird-timer">
                          ⏳ Ending in <strong>{timeLeft}</strong>
                        </div>
                      )}

                      <div className="earlybird-text">
                        <span className="earlybird-badge">🎁 Early Bird</span>
                        <span className="earlybird-main">
                          Save <strong>$20</strong> today — first month only
                          <span className="price"> $99</span>
                          <span className="old-price"> $119</span>
                        </span>
                      </div>

                      <button
                        className="earlybird-upgrade-btn"
                        onClick={handleEarlyBirdUpgrade}
                      >
                        Upgrade
                      </button>

                    </div>
                  </div>
                )}

                <div className="dashboard-layout-header-right">
                  <div className="fb-notif-wrapper">
                    <FacebookStyleNotifications />
                  </div>

                  <button
                    className="header-action-btn"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </header>
            )}

            {/* ================= Mobile Button ================= */}
            {isMobile && !showSidebar && (
              <button
                className="sidebar-open-btn"
                aria-label="Open menu"
                onClick={() => setShowSidebar(true)}
              >
                <FaBars />
              </button>
            )}

            {/* ================= Content ================= */}
            <main className="dashboard-content">
              <Outlet />
            </main>

          </div>
        </div>
      </AiProvider>
    </BusinessServicesProvider>
  );
}
