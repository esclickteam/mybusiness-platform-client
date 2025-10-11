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
   🧭 טאבים ראשיים
   ============================ */
const tabs = [
  { path: "dashboard", label: "Dashboard" },
  { path: "build", label: "Edit Business Page" },
  { path: "messages", label: "Customer Messages" },
  { path: "collab", label: "Collaborations" },
  { path: "crm", label: "CRM System" },
  { path: "BizUply", label: "BizUply Advisor" },
  { path: "help-center", label: "Help Center" },
];

/* ============================
   🔌 Socket.io
   ============================ */
const SOCKET_URL = "https://api.bizuply.com";
const socket = io(SOCKET_URL, { autoConnect: false });

export default function BusinessDashboardLayout({ children }) {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const { businessId } = useParams();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { unreadCount: messagesCount } = useNotifications();

  const isDashboardPath = location.pathname.includes("/dashboard");

  /* ============================
     Socket.io
     ============================ */
  useEffect(() => {
    if (!user?.businessId) return;
    if (!socket.connected) socket.connect();
    socket.emit("joinBusinessRoom", user.businessId);
    return () => socket.emit("leaveRoom", `business-${user.businessId}`);
  }, [user?.businessId]);

  /* ============================
     Prefetch נתונים
     ============================ */
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
  }, [user?.businessId, queryClient]);

  /* ============================
     הרשאות
     ============================ */
  useEffect(() => {
    if (!loading && user?.role !== "business") {
      navigate("/", { replace: true });
      return;
    }
  }, [user, loading, navigate]);

  /* ============================
     מובייל / דסקטופ
     ============================ */
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setShowSidebar(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ============================
     מקשי ניווט (Tab / ESC)
     ============================ */
  useEffect(() => {
    if (!isMobile || !showSidebar) return;
    const selectable =
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const elements = sidebarRef.current.querySelectorAll(selectable);
    if (!elements.length) return;
    const first = elements[0];
    const last = elements[elements.length - 1];

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

  if (loading) return <p className="loading">Loading...</p>;

  /* ============================
     🎨 Layout מלא
     ============================ */
  return (
    <BusinessServicesProvider>
      <AiProvider>
        <div className={`ltr-wrapper ${showSidebar ? "sidebar-open" : ""}`}>
          <div className="business-dashboard-layout">
            {/* 📂 Sidebar */}
            {(!isMobile || showSidebar) && (
              <aside
                className={`sidebar ${isMobile ? "mobile open" : ""}`}
                ref={sidebarRef}
                aria-modal={isMobile && showSidebar ? "true" : undefined}
                role={isMobile && showSidebar ? "dialog" : undefined}
              >
                <div className="sidebar-header">
                  <div className="sidebar-logo">
                    <img
                      src="/bizuply logo.png"
                      alt="BizUply"
                      className="sidebar-logo-img"
                    />
                    {isMobile && (
                      <button
                        className="sidebar-close-btn"
                        onClick={() => setShowSidebar(false)}
                        aria-label="Close"
                      >
                        <FaTimes size={18} />
                      </button>
                    )}
                  </div>

                  {/* 🔔 התראות */}
                  <div className="sidebar-notifications">
                    <FacebookStyleNotifications />
                  </div>

                  {/* 👋 שלום + כפתורי חשבון */}
                  {user && (
                    <div className="sidebar-user">
                      <p className="sidebar-hello">
                        Hello, <strong>{user.fullName || "Business Owner"}</strong>
                      </p>
                      <button
                        className="sidebar-account-btn"
                        onClick={() => navigate("/account")}
                      >
                        My Account
                      </button>
                      <button
                        className="sidebar-logout-btn"
                        onClick={logout}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>

                <h2>Business Management</h2>

                <nav>
                  <NavLink
                    to={`/business/${businessId}`}
                    end
                    className={({ isActive }) => (isActive ? "active" : undefined)}
                  >
                    View Public Profile
                  </NavLink>

                  {tabs.map(({ path, label }) => (
                    <NavLink
                      key={path}
                      to={`/business/${businessId}/dashboard/${path}`}
                      end={
                        location.pathname ===
                        `/business/${businessId}/dashboard/${path}`
                      }
                      className={({ isActive }) => (isActive ? "active" : undefined)}
                    >
                      {label}
                      {path === "messages" && messagesCount > 0 && (
                        <span className="badge">{messagesCount}</span>
                      )}
                    </NavLink>
                  ))}
                </nav>
              </aside>
            )}

            {/* 🔹 Overlay כהה במובייל */}
            {isMobile && showSidebar && (
              <div
                className="sidebar-overlay"
                onClick={() => setShowSidebar(false)}
                aria-label="Close"
              />
            )}

            {/* ☰ כפתור פתיחה */}
            {isMobile && !showSidebar && (
              <button
                className="sidebar-open-btn"
                onClick={() => setShowSidebar(true)}
                aria-label="Open Menu"
              >
                <FaBars size={20} />
              </button>
            )}

            {/* 💬 תוכן */}
            <main className="dashboard-content" tabIndex={-1}>
              {children ?? <Outlet />}
            </main>
          </div>
        </div>
      </AiProvider>
    </BusinessServicesProvider>
  );
}
