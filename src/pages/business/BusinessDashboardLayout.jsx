import React, { useEffect, useState, useRef } from "react";
import { NavLink, Outlet, useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BusinessServicesProvider } from "@context/BusinessServicesContext";
import { useSocket } from "../../context/socketContext";
import { useUnreadMessages } from "../../context/UnreadMessagesContext";
import { useQueryClient } from '@tanstack/react-query';
import API from "../../api";
import "../../styles/BusinessDashboardLayout.css";

// הוספת ייבוא useAi ו-AiModal
import { useAi } from "../../contexts/AiContext";
import AiModal from "../../components/AiModal";

const tabs = [
  { path: "dashboard", label: "📊 דשבורד" },
  { path: "build", label: "🧱 עריכת עמוד עסקי" },
  { path: "messages", label: "💬 הודעות מלקוחות" },
  { path: "collab", label: "🤝 שיתופי פעולה" },
  { path: "crm", label: "📇 מערכת CRM" },
  { path: "esclick", label: "🧠 יועץ עסקליק" },
  { path: "affiliate", label: "👥 תכנית שותפים" },
];

export default function BusinessDashboardLayout() {
  const { user, loading } = useAuth();
  const socket = useSocket();
  const navigate = useNavigate();
  const { businessId } = useParams();
  const location = useLocation();

  const { unreadCountsByConversation, updateMessagesCount, incrementMessagesCount } = useUnreadMessages();
  const queryClient = useQueryClient();

  // לקבלת הנתונים של מודאל AI
  const { activeSuggestion, approveSuggestion, rejectSuggestion, closeModal, loading: aiLoading } = useAi();

  // Prefetch חשוב של נתונים מרכזיים
  useEffect(() => {
    if (!user?.businessId) return;

    queryClient.prefetchQuery(['business-profile', user.businessId], () =>
      API.get(`/business/${user.businessId}`).then(res => res.data)
    );

    queryClient.prefetchQuery(['unread-messages', user.businessId], () =>
      API.get(`/messages/unread-count?businessId=${user.businessId}`).then(res => res.data)
    );

    queryClient.prefetchQuery(['crm-appointments', user.businessId], () =>
      API.get(`/appointments/all-with-services?businessId=${user.businessId}`).then(res => res.data)
    );
  }, [user?.businessId, queryClient]);

  const unreadCount = Object.values(unreadCountsByConversation).reduce((a, b) => a + b, 0);

  const isMobileInit = window.innerWidth <= 768;
  const [isMobile, setIsMobile] = useState(isMobileInit);
  const [showSidebar, setShowSidebar] = useState(!isMobileInit);
  const sidebarRef = useRef(null);
  const hasResetUnreadCount = useRef(false);

  useEffect(() => {
    if (!socket) return;

    const handleNewClientMessage = (data) => {
      if (data?.conversationId) {
        incrementMessagesCount(data.conversationId);
      }
    };

    socket.on("newClientMessageNotification", handleNewClientMessage);
    return () => {
      socket.off("newClientMessageNotification", handleNewClientMessage);
    };
  }, [socket, incrementMessagesCount]);

  useEffect(() => {
    if (!socket) return;

    const handleUnreadCounts = (unreadCountsObj) => {
      if (typeof unreadCountsObj !== "object" || unreadCountsObj === null) return;

      Object.entries(unreadCountsObj).forEach(([convId, count]) => {
        updateMessagesCount(convId, count);
      });
    };

    socket.on("unreadCountsByConversation", handleUnreadCounts);
    return () => {
      socket.off("unreadCountsByConversation", handleUnreadCounts);
    };
  }, [socket, updateMessagesCount]);

  useEffect(() => {
    if (!socket || !businessId) return;

    if (location.pathname.includes("/messages")) {
      hasResetUnreadCount.current = false;
      const conversationId = location.state?.conversationId || null;
      if (conversationId) {
        socket.emit("markMessagesRead", conversationId, (response) => {
          if (response.ok) {
            updateMessagesCount(conversationId, 0);
          }
        });
      }
    } else {
      if (!hasResetUnreadCount.current) {
        setTimeout(() => {
          if (!hasResetUnreadCount.current) {
            Object.keys(unreadCountsByConversation).forEach((convId) =>
              updateMessagesCount(convId, 0)
            );
            hasResetUnreadCount.current = true;
          }
        }, 200);
      }
    }
  }, [location.pathname, socket, businessId, updateMessagesCount, location.state, unreadCountsByConversation]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setShowSidebar(!mobile);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!loading && user?.role !== "business") {
      navigate("/", { replace: true });
      return;
    }
    const searchParams = new URLSearchParams(location.search);
    const tabFromQuery = searchParams.get("tab");
    const tabFromState = location.state?.activeTab;

    if (tabFromQuery && tabs.some((t) => t.path === tabFromQuery)) {
      navigate(`./${tabFromQuery}`, { replace: true });
    } else if (tabFromState && tabs.some((t) => t.path === tabFromState)) {
      navigate(`./${tabFromState}`, { replace: true });
    }
  }, [user, loading, location.search, location.state, navigate]);

  useEffect(() => {
    if (!isMobile || !showSidebar) return;

    const focusableSelectors =
      'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusableEls = sidebarRef.current.querySelectorAll(focusableSelectors);
    if (focusableEls.length === 0) return;

    const firstEl = focusableEls[0];
    const lastEl = focusableEls[focusableEls.length - 1];

    const handleKeyDown = (e) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
      if (e.key === "Escape") {
        setShowSidebar(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    firstEl.focus();

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobile, showSidebar]);

  return (
    <BusinessServicesProvider>
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
              <h2>ניהול העסק</h2>
              <nav>
                {user?.role === "business" && (
                  <NavLink
                    to={`/business/${businessId}`}
                    end
                    className={({ isActive }) => (isActive ? "active" : undefined)}
                  >
                    👀 צפייה בפרופיל
                  </NavLink>
                )}
                {tabs.map(({ path, label }) => (
                  <NavLink
                    key={path}
                    to={path}
                    end
                    className={({ isActive }) => (isActive ? "active" : undefined)}
                  >
                    {label}
                    {path === "messages" && unreadCount > 0 && (
                      <span
                        style={{
                          backgroundColor: "red",
                          color: "white",
                          borderRadius: "12px",
                          padding: "2px 8px",
                          fontSize: "12px",
                          marginLeft: "8px",
                          fontWeight: "bold",
                          verticalAlign: "middle",
                        }}
                      >
                        {unreadCount}
                      </span>
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
              aria-label="סגור תפריט"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setShowSidebar(false);
              }}
            />
          )}

          {isMobile && (
            <button
              onClick={() => setShowSidebar((prev) => !prev)}
              aria-label={showSidebar ? "סגור ניווט / חזור לדשבורד" : "פתח ניווט"}
              style={{
                position: "fixed",
                top: 60,
                left: 12,
                zIndex: 9999,
                backgroundColor: "#7c4dff",
                border: "none",
                borderRadius: 40,
                width: 120,
                height: 40,
                color: "#fff",
                fontSize: 16,
                cursor: "pointer",
                boxShadow: "0 2px 12px rgba(124, 77, 255, 0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                userSelect: "none",
                fontWeight: "600",
              }}
            >
              <span style={{ fontSize: 24 }}>{showSidebar ? "×" : "☰"}</span>
              <span>{showSidebar ? "סגור ניווט" : "פתח ניווט"}</span>
            </button>
          )}

          <main
            className="dashboard-content"
            tabIndex={-1}
            aria-live="polite"
            aria-atomic="true"
          >
            <Outlet
              context={{
                unreadCount,
                updateMessagesCount,
              }}
            />
          </main>

          {/* הוספת מודאל AI גלובלי */}
          <AiModal />
        </div>
      </div>
    </BusinessServicesProvider>
  );
}
