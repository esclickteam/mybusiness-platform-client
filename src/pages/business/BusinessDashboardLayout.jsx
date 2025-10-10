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

const tabs = [
  { path: "dashboard", label: "📊 Dashboard" },
  { path: "build", label: "🧱 Edit Business Page" },
  { path: "messages", label: "💬 Customer Messages" },
  { path: "collab", label: "🤝 Collaborations" },
  { path: "crm", label: "📇 CRM System" },
  { path: "BizUply", label: "🧠 BizUply Advisor" },
  { path: "affiliate", label: "👥 Affiliate Program" },
  { path: "help-center", label: "❓ Help Center" },
];

// Replace here with your server address
const SOCKET_URL = "https://api.bizuply.com";

// Create socket connection outside the component
const socket = io(SOCKET_URL, { autoConnect: false });

export default function BusinessDashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { businessId } = useParams();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { unreadMessagesCount: unreadFromContext } = useNotifications();

  const [messagesCount, setMessagesCount] = useState(unreadFromContext || 0);

  useEffect(() => {
    setMessagesCount(unreadFromContext || 0);
  }, [unreadFromContext]);

  const updateMessagesCount = (newCount) => {
    setMessagesCount(newCount);
  };

  useEffect(() => {
    if (!user?.businessId) return;

    if (!socket.connected) {
      socket.connect();
    }

    const roomName = "businessbusiness-" + user.businessId;

    socket.emit("joinRoom", roomName);

    const handleNewMessage = (message) => {
      console.log("New message received:", message);

      if (message.toId === user.businessId) {
        setMessagesCount((count) => count + 1);
        alert(`New message from ${message.fromId}`);
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.emit("leaveRoom", roomName);
      socket.off("newMessage", handleNewMessage);
    };
  }, [user?.businessId]);

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

  const isMobileInit = window.innerWidth <= 768;
  const [isMobile, setIsMobile] = useState(isMobileInit);
  const [showSidebar, setShowSidebar] = useState(!isMobileInit);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setShowSidebar(!mobile);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!isMobile || !showSidebar) return;
    const sel =
      'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const els = sidebarRef.current.querySelectorAll(sel);
    if (!els.length) return;
    const first = els[0],
      last = els[els.length - 1];
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

  if (loading) {
    return <p className="loading">Loading information…</p>;
  }

  return (
    <BusinessServicesProvider>
      <AiProvider>
        <div className={`rtl-wrapper ${showSidebar ? "sidebar-open" : ""}`}>
          <div className="business-dashboard-layout">
            {(!isMobile || showSidebar) && (
              <aside
                className={`sidebar ${isMobile ? "mobile open" : ""}`}
                ref={sidebarRef}
                aria-modal={isMobile && showSidebar ? "true" : undefined}
                role={isMobile && showSidebar ? "dialog" : undefined}
                id="sidebar"
              >
                <h2>Business Management</h2>
                <nav>
                  {user?.role === "business" && (
                    <NavLink
                      to={`/business/${businessId}`}
                      end
                      className={({ isActive }) =>
                        isActive ? "active" : undefined
                      }
                    >
                      👀 View Public Profile
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

            {isMobile && showSidebar && (
              <div
                className="sidebar-overlay"
                onClick={() => setShowSidebar(false)}
                aria-label="Close menu"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setShowSidebar(false);
                }}
              />
            )}

            {/* Professional mobile nav button removed from layout — add in Header */}

            <main
              className="dashboard-content"
              tabIndex={-1}
              aria-live="polite"
              aria-atomic="true"
            >
              {children ?? (
                <Outlet
                  context={{
                    unreadCount: messagesCount,
                    updateMessagesCount,
                  }}
                />
              )}
            </main>
          </div>
        </div>
      </AiProvider>
    </BusinessServicesProvider>
  );
}
