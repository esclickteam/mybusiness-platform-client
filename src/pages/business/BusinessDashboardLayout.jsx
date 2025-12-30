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

  const handleLogout = async () => {
    try {
      socket.disconnect();
      await logout?.();
      navigate("/", { replace: true });
    } catch {
      navigate("/", { replace: true });
    }
  };

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
                      onClick={() => setShowSidebar(false)}
                      aria-label="Close menu"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>

                {/* Navigation */}
                <nav>
                  <NavLink to={`/business/${businessId}`} end>
                    View Public Profile
                  </NavLink>

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

                {/* Mobile Footer */}
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

            {/* ================= Dashboard Layout Header (Desktop) ================= */}
           {/* ================= Dashboard Layout Header (Desktop Only) ================= */}
{!isMobile && (
  <header className="dashboard-layout-header">
    {/* Left – Hello + Business Name */}
    <div className="dashboard-layout-header-left">
      Hello, {user?.businessName || user?.name}
    </div>

    {/* Right – Notifications + Logout */}
    <div className="dashboard-layout-header-right">
      <button
        className="header-action-btn"
        aria-label="Notifications"
      >
        <FacebookStyleNotifications />
      </button>

      <button
        className="header-action-btn logout"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  </header>
)}


            {/* ================= Mobile Open Button ================= */}
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
