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

/* ============================
   🧭 רשימת טאבים (ללא אייקונים)
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
   🔌 חיבור Socket.io לשרת
   ============================ */
const SOCKET_URL = "https://api.bizuply.com";
const socket = io(SOCKET_URL, { autoConnect: false });

export default function BusinessDashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { businessId } = useParams();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { unreadCount: messagesCount } = useNotifications();

  /* ============================
     🧩 זיהוי אם אנחנו בתוך הדשבורד
     ============================ */
  const isDashboardPath = location.pathname.includes("/dashboard");

  /* ============================
     🧠 ניהול חיבור Socket לעסק
     ============================ */
  useEffect(() => {
    if (!user?.businessId) return;

    if (!socket.connected) socket.connect();
    socket.emit("joinBusinessRoom", user.businessId);

    return () => {
      socket.emit("leaveRoom", `business-${user.businessId}`);
    };
  }, [user?.businessId]);

  /* ============================
     🚀 Prefetch של נתונים חשובים
     ============================ */
  useEffect(() => {
    if (!user?.businessId) return;

    // פרופיל עסק
    queryClient.prefetchQuery(
      ["business-profile", user.businessId],
      () => API.get(`/business/${user.businessId}`).then((res) => res.data)
    );

    // הודעות שלא נקראו
    queryClient.prefetchQuery(
      ["unread-messages", user.businessId],
      () =>
        API.get(`/messages/unread-count?businessId=${user.businessId}`).then(
          (res) => res.data
        )
    );

    // תורים עם שירותים
    queryClient.prefetchQuery(
      ["crm-appointments", user.businessId],
      () =>
        API.get(
          `/appointments/all-with-services?businessId=${user.businessId}`
        ).then((res) => res.data)
    );
  }, [user?.businessId, queryClient]);

  /* ============================
     🔐 הרשאות משתמש
     ============================ */
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

  /* ============================
     📱 ניהול מובייל ודשבורד
     ============================ */
  const isMobileInit = window.innerWidth <= 768;
  const [isMobile, setIsMobile] = useState(isMobileInit);
  const [showSidebar, setShowSidebar] = useState(
    !isMobileInit || isDashboardPath // ✅ גלוי רק אם דשבורד או דסקטופ
  );
  const sidebarRef = useRef(null);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // ✅ רק במובייל בדשבורד שומרים סיידבר גלוי
      setShowSidebar(!mobile || (mobile && isDashboardPath));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isDashboardPath]);

  /* ============================
     🔄 ניהול מקשים ו־Focus במובייל
     ============================ */
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

  /* ============================
     🕓 טעינה
     ============================ */
  if (loading) {
    return <p className="loading">Loading information…</p>;
  }

  /* ============================
     🎨 Layout מלא
     ============================ */
  return (
    <BusinessServicesProvider>
      <AiProvider>
        <div className={`ltr-wrapper ${showSidebar ? "sidebar-open" : ""}`}>
          <div className="business-dashboard-layout">
            {/* ========================
                📂 Sidebar – גלוי תמיד בדשבורד במובייל
               ======================== */}
            {(!isMobile || showSidebar) && (
              <aside
                className={`sidebar ${isMobile ? "mobile open" : ""}`}
                ref={sidebarRef}
                aria-modal={isMobile && showSidebar ? "true" : undefined}
                role={isMobile && showSidebar ? "dialog" : undefined}
                id="sidebar"
              >
                {/* 🔹 לוגו בחלק העליון */}
                <div className="sidebar-logo">
                  <img
                    src="/bizuply logo.png"
                    alt="BizUply Logo"
                    className="sidebar-logo-img"
                  />
                </div>

                {/* 🔹 כותרת הסיידבר */}
                <h2>Business Management</h2>

                {/* 🔹 ניווט */}
                <nav>
                  {user?.role === "business" && (
                    <NavLink
                      to={`/business/${businessId}`}
                      end
                      className={({ isActive }) =>
                        isActive ? "active" : undefined
                      }
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
                    >
                      {label}

                      {/* 🔔 באדג' הודעות */}
                      {path === "messages" && messagesCount > 0 && (
                        <span className="badge">{messagesCount}</span>
                      )}
                    </NavLink>
                  ))}
                </nav>
              </aside>
            )}

            {/* ========================
                💬 תוכן הדשבורד
               ======================== */}
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
