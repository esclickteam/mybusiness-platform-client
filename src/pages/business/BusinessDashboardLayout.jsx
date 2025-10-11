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
   🧭 טאבים
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

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  const sidebarRef = useRef(null);

  /* 🔌 Socket.io */
  useEffect(() => {
    if (!user?.businessId) return;
    if (!socket.connected) socket.connect();
    socket.emit("joinBusinessRoom", user.businessId);
    return () => socket.emit("leaveRoom", `business-${user.businessId}`);
  }, [user?.businessId]);

  /* 📦 Prefetch */
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

  /* 📱 מובייל / ריסייז */
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setShowSidebar(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <BusinessServicesProvider>
      <AiProvider>
        <div className="business-dashboard-wrapper">
          {/* 🔹 HEADER עליון – רק במובייל */}
          {isMobile && (
            <header className="dashboard-topbar">
              {/* שמאל – התראות */}
              <div className="topbar-left">
                <FacebookStyleNotifications />
              </div>

              {/* מרכז – לוגו */}
              <div className="topbar-center">
                <img
                  src="/bizuply logo.png"
                  alt="BizUply Logo"
                  className="topbar-logo"
                />
              </div>

              {/* ימין – המבורגר */}
              <div className="topbar-right">
                <button
                  className="sidebar-open-btn"
                  onClick={() => setShowSidebar(true)}
                  aria-label="Open Menu"
                >
                  <FaBars size={20} />
                </button>
              </div>
            </header>
          )}

          {/* 📂 Sidebar */}
          {(!isMobile || showSidebar) && (
            <aside
              className={`sidebar ${isMobile ? "mobile open" : ""}`}
              ref={sidebarRef}
            >
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
                    className={({ isActive }) =>
                      isActive ? "active" : undefined
                    }
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
            />
          )}

          {/* 💬 תוכן */}
          <main className="dashboard-content" tabIndex={-1}>
            {children ?? <Outlet />}
          </main>
        </div>
      </AiProvider>
    </BusinessServicesProvider>
  );
}
