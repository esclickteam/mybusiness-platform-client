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

/* ============================
   🧭 Tabs
============================ */
const tabs = [
  { path: "dashboard", label: "Dashboard" },
  { path: "build", label: "Edit Business Page" },
  { path: "messages", label: "Customer Messages" },
  { path: "collab", label: "Collaborations" },
  { path: "crm", label: "CRM System" },
  { path: "billing", label: "Billing & Subscription" },
  { path: "BizUply", label: "BizUply Advisor" },
  { path: "help-center", label: "Help Center" },
];

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
     🎁 Early Bird Logic
  ============================ */
  const [hideEarlyBirdBanner, setHideEarlyBirdBanner] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  const showEarlyBird =
  user?.subscriptionPlan === "trial" &&
  !user?.hasPaid &&
  !user?.earlyBirdUsed &&            // ⬅️ זה הקריטי
  user?.earlyBirdExpiresAt &&
  new Date(user.earlyBirdExpiresAt) > new Date();

    /* ============================
   ⏳ Trial Days Left
============================ */
const [trialDaysLeft, setTrialDaysLeft] = useState(null);

useEffect(() => {
  if (
    user?.subscriptionPlan !== "trial" ||
    user?.hasPaid ||
    !user?.trialEndsAt
  )
    return;

  const now = new Date();
  const end = new Date(user.trialEndsAt);

  const diff = Math.ceil(
    (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  setTrialDaysLeft(diff > 0 ? diff : 0);
}, [user?.subscriptionPlan, user?.hasPaid, user?.trialEndsAt]);



  /* ⏰ Countdown */
  useEffect(() => {
    if (!user?.earlyBirdExpiresAt) return;

    const updateTimer = () => {
      const now = new Date().getTime();
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
  }, [user?.earlyBirdExpiresAt]);

  /* 🎁 Early Bird → Stripe Checkout */
  const handleEarlyBirdUpgrade = async () => {
    if (!user?.userId) return;

    setHideEarlyBirdBanner(true);


    try {
      const res = await API.post("/stripe/create-checkout-session", {
        userId: user.userId,
        plan: "monthly",
      });

      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        alert("Checkout unavailable");
      }
    } catch (err) {
      console.error("Early Bird checkout error:", err);
      alert("Something went wrong");
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

                <nav>
                  <a
                    href={`/business/${businessId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Public Profile
                  </a>

                  {tabs.map(({ path, label }) => (
                    <NavLink
                      key={path}
                      to={`/business/${businessId}/dashboard/${path}`}
                      className={({ isActive }) =>
                        isActive ? "active" : undefined
                      }
                      onClick={() => isMobile && setShowSidebar(false)}
                    >
                      <span>{label}</span>
                      {path === "messages" && messagesCount > 0 && (
                        <span className="badge">{messagesCount}</span>
                      )}
                    </NavLink>
                  ))}
                </nav>

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

  {!showEarlyBird && trialDaysLeft !== null && trialDaysLeft > 0 && (
  <div className="trial-status">
    ⏳ Trial ends in <strong>{trialDaysLeft} days</strong>
    <button
      className="trial-upgrade-link"
      onClick={handleEarlyBirdUpgrade}
    >
      Upgrade
    </button>
  </div>
)}

</div>

                {showEarlyBird && !hideEarlyBirdBanner && (
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
