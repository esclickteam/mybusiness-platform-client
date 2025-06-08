import React, { useEffect, useState, useRef } from "react";
import { NavLink, Outlet, useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BusinessServicesProvider } from "@context/BusinessServicesContext";
import { useSocket } from "../../context/socketContext";
import "../../styles/BusinessDashboardLayout.css";

const tabs = [
  { path: "dashboard", label: "📊 דשבורד" },
  { path: "build", label: "🧱 עריכת עמוד עסקי" },
  { path: "messages", label: "💬 הודעות מלקוחות" },
  { path: "collab", label: "🤝 שיתופי פעולה" },
  { path: "crm", label: "📇 מערכת CRM" },
  { path: "esclick", label: "🧠 יועץ עסקליק" },
  { path: "goals", label: "🎯 היעדים שלי" },
  { path: "affiliate", label: "👥 תכנית שותפים" },
  { path: "upgrade", label: "🚀 שדרוג חבילה" },
];

export default function BusinessDashboardLayout() {
  const { user, loading } = useAuth();
  const socket = useSocket();
  const navigate = useNavigate();
  const { businessId } = useParams();
  const location = useLocation();

  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [messagesRead, setMessagesRead] = useState(false);

  const resetMessagesCount = () => {
    console.log("resetMessagesCount called");
    setNewMessagesCount(0);
    setMessagesRead(true);
  };

  const updateMessagesCount = (count) => {
    console.log("updateMessagesCount called with count:", count);
    if (!messagesRead) {
      setNewMessagesCount(count);
    } else if (count > 0) {
      setMessagesRead(false);
      setNewMessagesCount(count);
    }
  };

  // מאזין להודעות חדשות מהשרת
  useEffect(() => {
    if (!socket) return;

    const handleNewClientMessage = (data) => {
      console.log("Received newClientMessageNotification:", data);
      setNewMessagesCount((prev) => prev + 1);
    };

    socket.on("newClientMessageNotification", handleNewClientMessage);

    return () => {
      socket.off("newClientMessageNotification", handleNewClientMessage);
    };
  }, [socket]);

  // מאזין לספירת הודעות שלא נקראו מהשרת
  useEffect(() => {
    if (!socket) return;

    const handleUnreadCount = (count) => {
      console.log("Received unreadMessagesCount:", count);
      setNewMessagesCount(count);
    };

    socket.on("unreadMessagesCount", handleUnreadCount);

    return () => {
      socket.off("unreadMessagesCount", handleUnreadCount);
    };
  }, [socket]);

  const isMobileInit = window.innerWidth <= 768;
  const [isMobile, setIsMobile] = useState(isMobileInit);
  const [showSidebar, setShowSidebar] = useState(!isMobileInit);
  const sidebarRef = useRef(null);

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
    // eslint-disable-next-line
  }, [user, loading, location.search, location.state, navigate]);

  // איפוס ספירת ההודעות כשנכנסים ל"טאב הודעות"
  useEffect(() => {
    if (location.pathname.includes("/messages")) {
      resetMessagesCount();
    }
  }, [location.pathname]);

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
        <div className={`business-dashboard-layout`}>
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
                    {path === "messages" && newMessagesCount > 0 && (
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
                        {newMessagesCount}
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
                newMessagesCount,
                resetMessagesCount,
                updateMessagesCount,
              }}
            />
          </main>
        </div>
      </div>
    </BusinessServicesProvider>
  );
}
