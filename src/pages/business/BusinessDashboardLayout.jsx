import React, { useEffect, useState, useRef } from "react";
import {
  NavLink,
  Outlet,
  useNavigate,
  useParams,
  useLocation
} from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BusinessServicesProvider } from "@context/BusinessServicesContext";
import { useNotifications } from "../context/NotificationsContext";
import { useQueryClient } from "@tanstack/react-query";
import API from "../../api";
import "../../styles/BusinessDashboardLayout.css";

import { AiProvider } from "../../context/AiContext";

const tabs = [
  { path: "dashboard", label: "📊 דשבורד" },
  { path: "build", label: "🧱 עריכת עמוד עסקי" },
  { path: "messages", label: "💬 הודעות מלקוחות" },
  { path: "collab", label: "🤝 שיתופי פעולה" },
  { path: "crm", label: "📇 מערכת CRM" },
  { path: "esclick", label: "🧠 יועץ עסקליק" },
  { path: "affiliate", label: "👥 תכנית שותפים" },
  { path: "help-center", label: "❓ מרכז העזרה" },
];

export default function BusinessDashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { businessId } = useParams();
  const location = useLocation();
  const queryClient = useQueryClient();

  // צריכת Socket ותצוגת ספירת ההודעות הלא־נקראו מתוך הקונטקסט
  const { socket, unreadMessagesCount } = useNotifications();
  const unreadCount = unreadMessagesCount;

  // prefetch של הנתונים
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

  // התאמת ניווט ברירת מחדל
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

  // הגדרת מצב מובייל ותפריט צדדי
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

  // Trap focus במובייל
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
                <h2>ניהול העסק</h2>
                <nav>
                  {user?.role === "business" && (
                    <NavLink
                      to={`/business/${businessId}`}
                      end={true}
                      className={({ isActive }) =>
                        isActive ? "active" : undefined
                      }
                    >
                      👀 צפייה בפרופיל ציבורי
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
                aria-label={
                  showSidebar
                    ? "סגור ניווט / חזור לדשבורד"
                    : "פתח ניווט"
                }
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
                <span style={{ fontSize: 24 }}>
                  {showSidebar ? "×" : "☰"}
                </span>
                <span>
                  {showSidebar ? "סגור ניווט" : "פתח ניווט"}
                </span>
              </button>
            )}

            <main
              className="dashboard-content"
              tabIndex={-1}
              aria-live="polite"
              aria-atomic="true"
            >
              {children ?? (
                <Outlet
                  context={{
                    unreadCount,
                    // אם צריך להעביר פונקציות נוספות:
                    // updateMessagesCount, incrementMessagesCount
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
