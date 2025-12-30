import React, { useEffect, useState, useRef } from "react";
import {
  NavLink,
  Outlet,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BusinessServicesProvider } from "@context/BusinessServicesContext";
import { useQueryClient } from "@tanstack/react-query";
import API from "../../api";
import "../../styles/BusinessDashboardLayout.css";
import { AiProvider } from "../../context/AiContext";
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
   🔌 Socket.io
============================ */
const SOCKET_URL = "https://api.bizuply.com";
const socket = io(SOCKET_URL, { autoConnect: false });

export default function BusinessDashboardLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const { businessId } = useParams();
  const location = useLocation();
  const queryClient = useQueryClient();

  /* ============================
     📩 LIVE UNREAD CHAT COUNT
  ============================ */
  const [messagesCount, setMessagesCount] = useState(0);

  useEffect(() => {
    if (!user?.businessId) return;

    // טעינה ראשונית מהשרת
    API.get(`/chat/unread-count`)
      .then((res) => {
        console.log("Unread count from API:", res.data?.count); // לוג של נתוני ה־API
        setMessagesCount(res.data?.count || 0);
      })
      .catch((error) => {
        console.error("Error fetching unread count:", error); // לוג של שגיאה אם יש
        setMessagesCount(0);
      });

    // התחברות לסוקט
    if (!socket.connected) {
      socket.connect();
      console.log("Socket connected successfully"); // לוג של התחברות מוצלחת
    }

    socket.emit("joinRoom", `business-${user.businessId}`);
    console.log(`Socket joined room: business-${user.businessId}`); // לוג של התחברות לחדר

    // האזנה לעדכוני badge בזמן אמת
    socket.on("unreadCountUpdate", (data) => {
      console.log("📨 Live unread count received via socket:", data.count); // לוג של עדכון בזמן אמת
      setMessagesCount(data.count || 0);
      console.log("Updated unread count state:", messagesCount); // לוג של העדכון ב־state
    });

    // טיפול בסגירת הסוקט
    return () => {
      socket.off("unreadCountUpdate");
      socket.emit("leaveRoom", `business-${user.businessId}`);
      console.log(`Socket left room: business-${user.businessId}`); // לוג של יציאה מהחדר
    };
  }, [user?.businessId]);

  /* ============================
     📱 Sidebar
  ============================ */
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  const sidebarRef = useRef(null);

  /* 🚪 Logout */
  const handleLogout = async () => {
    try {
      if (socket?.connected) socket.disconnect();
      console.log("Socket disconnected"); // לוג של ניתוק הסוקט
      if (typeof logout === "function") await logout();
      else localStorage.clear();

      setShowSidebar(false);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout Error:", error); // לוג של שגיאה בעת התנתקות
      navigate("/", { replace: true });
    }
  };

  /* 🚀 Prefetch Data */
  useEffect(() => {
    if (!user?.businessId) return;

    queryClient.prefetchQuery({
      queryKey: ["business-profile", user.businessId],
      queryFn: () =>
        API.get(`/business/${user.businessId}`).then((res) => res.data),
    });

    queryClient.prefetchQuery({
      queryKey: ["crm-appointments", user.businessId],
      queryFn: () =>
        API.get(
          `/appointments/all-with-services?businessId=${user.businessId}`
        ).then((res) => res.data),
    });
  }, [user?.businessId, queryClient]);

  /* 🔐 Permissions */
  useEffect(() => {
    if (!loading && user?.role !== "business") {
      navigate("/", { replace: true });
      return;
    }

    const params = new URLSearchParams(location.search);
    const tabQ = params.get("tab");
    const tabS = location.state?.activeTab;

    if (tabQ && tabs.some((t) => t.path === tabQ)) {
      navigate(`./${tabQ}`, { replace: true });
    } else if (tabS && tabs.some((t) => t.path === tabS)) {
      navigate(`./${tabS}`, { replace: true });
    }
  }, [user, loading, location.search, location.state, navigate]);

  /* 📱 Window Resize */
  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setShowSidebar(true);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ♿ Focus Trap (for mobile) */
  useEffect(() => {
    if (!isMobile || !showSidebar) return;

    const sel =
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const els = sidebarRef.current?.querySelectorAll(sel) ?? [];
    if (!els.length) return;

    const first = els[0];
    const last = els[els.length - 1];

    const onKey = (e) => {
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
      if (e.key === "Escape") setShowSidebar(false);
    };

    document.addEventListener("keydown", onKey);
    first.focus();

    return () => document.removeEventListener("keydown", onKey);
  }, [isMobile, showSidebar]);

  if (loading) return <p className="loading">Loading information…</p>;

  /* ============================
     🎨 Layout
  ============================ */
  return (
    <BusinessServicesProvider>
      <AiProvider>
        <div className={`ltr-wrapper ${showSidebar ? "sidebar-open" : ""}`}>
          <div className="business-dashboard-layout">
            {/* 🔹 Sidebar */}
{(!isMobile || showSidebar) && (
  <aside
    className={`dashboard-layout-sidebar ${isMobile ? "mobile open" : ""}`}
    ref={sidebarRef}
    aria-modal={isMobile && showSidebar ? "true" : undefined}
    role={isMobile && showSidebar ? "dialog" : undefined}
  >
    {/* Logo */}
    <div className="sidebar-logo">
      <img
        src="/bizuply logo.png"
        alt="BizUply Logo"
        className="sidebar-logo-img"
      />
      {isMobile && (
        <button
          className="sidebar-close-btn"
          aria-label="Close menu"
          onClick={() => setShowSidebar(false)}
        >
          <FaTimes size={18} />
        </button>
      )}
    </div>

    {/* Section title */}
    <div className="sidebar-section-title">
      Business Management
    </div>

    {/* Divider */}
    <div className="sidebar-divider" />

    {/* Navigation */}
    <nav className="sidebar-nav">
      {user?.role === "business" && (
        <>
          <NavLink
            to={`/business/${businessId}`}
            end
            className={({ isActive }) =>
              isActive ? "active" : undefined
            }
            onClick={() => isMobile && setShowSidebar(false)}
          >
            View Public Profile
          </NavLink>

          {/* Divider between profile and dashboard tabs */}
          <div className="sidebar-divider subtle" />
        </>
      )}

      {tabs.map(({ path, label }, index) => (
        <React.Fragment key={path}>
          <NavLink
            to={`/business/${businessId}/dashboard/${path}`}
            end={
              location.pathname ===
              `/business/${businessId}/dashboard/${path}`
            }
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

          {/* Divider between items (not after last) */}
          {index < tabs.length - 1 && (
            <div className="sidebar-divider subtle" />
          )}
        </React.Fragment>
      ))}
    </nav>

    {/* Mobile footer */}
    {isMobile && (
      <>
        <div className="sidebar-divider" />

        <div className="sidebar-footer">
          <span className="user-name">
            Hello, {user?.name}
          </span>
          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </>
    )}
  </aside>
)}


            {!isMobile && (
              <header className="dashboard-header">
                <div className="dashboard-header-left">
                  <FacebookStyleNotifications />
                </div>

                <div className="dashboard-header-right">
                  <span className="user-name">Hello, {user?.name}</span>
                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </header>
            )}

            {/* ☰ Mobile Menu */}
            {isMobile && !showSidebar && (
              <button
                className="sidebar-open-btn"
                aria-label="Open menu"
                onClick={() => setShowSidebar(true)}
              >
                <FaBars size={20} />
              </button>
            )}

             {/* 🔔 Bell on mobilee */}
            {isMobile && (
              <div className="dashboard-bell">
                <FacebookStyleNotifications />
              </div>
            )}

            <main
              className="dashboard-content"
              tabIndex={-1}
              aria-live="polite"
              aria-atomic="true"
            >
              {children ?? <Outlet />}
            </main>
          </div>
        </div>
      </AiProvider>
      </BusinessServicesProvider>
  );
}
