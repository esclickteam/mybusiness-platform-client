import React, { useEffect, useState, useRef } from "react";
import {
  NavLink,
  Outlet,
  useNavigate,
  useParams,
  useLocation,
  Link,
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
import logo from "../../images/logo_final.svg";

/* ============================
   🧭 רשימת טאבים
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

const SOCKET_URL = "https://api.bizuply.com";
const socket = io(SOCKET_URL, { autoConnect: false });

export default function BusinessDashboardLayout({ children }) {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const { businessId } = useParams();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { unreadCount: messagesCount } = useNotifications();

  /* ============================
     🧠 Socket
     ============================ */
  useEffect(() => {
    if (!user?.businessId) return;
    if (!socket.connected) socket.connect();
    socket.emit("joinBusinessRoom", user.businessId);
    return () => socket.emit("leaveRoom", `business-${user.businessId}`);
  }, [user?.businessId]);

  /* ============================
     🚀 Prefetch
     ============================ */
  useEffect(() => {
    if (!user?.businessId) return;

    queryClient.prefetchQuery(
      ["business-profile", user.businessId],
      () => API.get(`/business/${user.businessId}`).then((r) => r.data)
    );

    queryClient.prefetchQuery(
      ["unread-messages", user.businessId],
      () =>
        API.get(`/messages/unread-count?businessId=${user.businessId}`).then(
          (r) => r.data
        )
    );
  }, [user?.businessId, queryClient]);

  /* ============================
     🔐 הרשאות
     ============================ */
  useEffect(() => {
    if (!loading && user?.role !== "business") {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  /* ============================
     📱 מובייל ודסקטופ
     ============================ */
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setShowSidebar(true);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("❌ Logout failed:", err);
    }
  };

  if (loading) return <p className="loading">Loading information…</p>;

  /* ============================
     🎨 Layout
     ============================ */
  return (
    <BusinessServicesProvider>
      <AiProvider>
        <div className={`ltr-wrapper ${showSidebar ? "sidebar-open" : ""}`}>
          <div className="business-dashboard-layout">
            {/* ✅ Header למובייל בלבד */}
            {isMobile && (
              <nav className="dashboard-header">
                <div className="header-left">
                  {user?.businessId && <FacebookStyleNotifications />}
                </div>
                <div className="header-center">
                  <img src={logo} alt="BizUply" className="dashboard-logo" />
                </div>
                <div className="header-right">
                  <button
                    className="menu-button"
                    onClick={() => setShowSidebar(true)}
                  >
                    <FaBars size={22} />
                  </button>
                </div>
              </nav>
            )}

            {/* ✅ Sidebar */}
            {(!isMobile || showSidebar) && (
              <>
                {isMobile && (
                  <div
                    className="sidebar-overlay"
                    onClick={() => setShowSidebar(false)}
                  />
                )}
                <aside
                  className={`sidebar ${isMobile ? "mobile open" : ""}`}
                  ref={sidebarRef}
                  style={{
                    right: isMobile ? 0 : "auto",
                    left: isMobile ? "auto" : 0,
                  }}
                >
                  <div className="sidebar-logo">
                    <img
                      src={logo}
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
                    <NavLink
                      to={`/business/${businessId}`}
                      end
                      className={({ isActive }) =>
                        isActive ? "active" : undefined
                      }
                    >
                      View Public Profile
                    </NavLink>

                    {tabs.map(({ path, label }) => (
                      <NavLink
                        key={path}
                        to={`/business/${businessId}/dashboard/${path}`}
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

                  <div className="sidebar-divider" />

                  {/* ✅ אזור אישי */}
                  <div className="sidebar-account">
                    <span className="hello-user">
                      Hello, {user?.name || "Guest"}
                    </span>
                    <Link
                      to="/dashboard"
                      className="auth-link full-width"
                      onClick={() => setShowSidebar(false)}
                    >
                      My Account
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="logout-btn full-width"
                    >
                      Logout
                    </button>
                  </div>
                </aside>
              </>
            )}

            {/* ✅ תוכן */}
            <main className="dashboard-content">
              {children ?? <Outlet />}
            </main>
          </div>
        </div>
      </AiProvider>
    </BusinessServicesProvider>
  );
}
