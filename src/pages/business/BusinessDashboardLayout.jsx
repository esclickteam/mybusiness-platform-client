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
import { useNotifications } from "../../context/NotificationsContext";
import { useQueryClient } from "@tanstack/react-query";
import API from "../../api";
import "../../styles/BusinessDashboardLayout.css";
import { AiProvider } from "../../context/AiContext";
import { io } from "socket.io-client";
import { FaTimes, FaBars } from "react-icons/fa";
import FacebookStyleNotifications from "../../components/FacebookStyleNotifications";

/* ============================
   🧭 רשימת טאבים
   ============================ */
const tabs = [
  { path: "dashboard", label: "Dashboard" },
  { path: "build", label: "Edit Business Page" },
  { path: "messages", label: "Customer Messages" },
  { path: "collab", label: "Collaborations" },
  { path: "crm", label: "CRM System" },
  { path: "billing", label: "Billing & Subscription" }, // 💳 חדש
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
  const { unreadCount: messagesCount } = useNotifications();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  const sidebarRef = useRef(null);

  /* 🚪 יציאה */
  const handleLogout = async () => {
    try {
      if (socket?.connected) socket.disconnect();
      if (typeof logout === "function") await logout();
      else localStorage.clear();
      setShowSidebar(false);
      navigate("/", { replace: true });
    } catch (e) {
      console.error("Logout failed:", e);
      navigate("/", { replace: true });
    }
  };

  /* 🧠 חיבור Socket לעסק */
  useEffect(() => {
    if (!user?.businessId) return;
    if (!socket.connected) socket.connect();
    socket.emit("joinBusinessRoom", user.businessId);
    return () => {
      socket.emit("leaveRoom", `business-${user.businessId}`);
    };
  }, [user?.businessId]);

  /* 🚀 Prefetch נתונים חשובים */
  useEffect(() => {
    if (!user?.businessId) return;

    queryClient.prefetchQuery(
      ["business-profile", user.businessId],
      () => API.get(`/business/${user.businessId}`).then((res) => res.data)
    );

    queryClient.prefetchQuery(
      ["unread-messages", user.businessId],
      () =>
        API.get(`/messages/unread-count?businessId=${user.businessId}`).then(
          (res) => res.data
        )
    );

    queryClient.prefetchQuery(
      ["crm-appointments", user.businessId],
      () =>
        API.get(
          `/appointments/all-with-services?businessId=${user.businessId}`
        ).then((res) => res.data)
    );
  }, [user?.businessId, queryClient]);

  /* 🔐 הרשאות */
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

  /* 📱 Resize */
  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setShowSidebar(true);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ⌨️ Focus trap במובייל */
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

  /* 🎨 Layout */
  return (
    <BusinessServicesProvider>
      <AiProvider>
        <div className={`ltr-wrapper ${showSidebar ? "sidebar-open" : ""}`}>
          <div className="business-dashboard-layout">
            {/* 🔹 Sidebar */}
            {(!isMobile || showSidebar) && (
              <aside
                className={`sidebar ${isMobile ? "mobile open" : ""}`}
                ref={sidebarRef}
                aria-modal={isMobile && showSidebar ? "true" : undefined}
                role={isMobile && showSidebar ? "dialog" : undefined}
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
                      aria-label="Close menu"
                      onClick={() => setShowSidebar(false)}
                    >
                      <FaTimes size={18} />
                    </button>
                  )}
                </div>

                <h2>Business Management</h2>

                <nav>
                  {user?.role === "business" && (
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
                  )}
                  {tabs.map(({ path, label }) => (
                    <NavLink
                      key={path}
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
                      {label}
                      {path === "messages" && messagesCount > 0 && (
                        <span className="badge">{messagesCount}</span>
                      )}
                    </NavLink>
                  ))}
                </nav>

                {/* 👤 אזור משתמש במובייל */}
                {isMobile && (
                  <div className="sidebar-footer">
                    <span className="user-name">Hello, {user?.name}</span>
                    <button className="logout-btn" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </aside>
            )}

            {/* 🧭 Header לדסקטופ */}
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

            {/* ☰ פתיחת תפריט במובייל */}
            {isMobile && !showSidebar && (
              <button
                className="sidebar-open-btn"
                aria-label="Open menu"
                onClick={() => setShowSidebar(true)}
              >
                <FaBars size={20} />
              </button>
            )}

            {/* 🔔 פעמון למובייל */}
            {isMobile && (
              <div className="dashboard-bell">
                <FacebookStyleNotifications />
              </div>
            )}

            {/* 🧩 תוכן דינמי */}
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
