import React, { useEffect, useState, useRef } from "react";
import { NavLink, Outlet, useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BusinessServicesProvider } from '@context/BusinessServicesContext';
import "../../styles/BusinessDashboardLayout.css";

const tabs = [
  { path: "dashboard", label: "📊 דשבורד" },
  { path: "build",     label: "🧱 עריכת עמוד עסקי" },
  { path: "messages",  label: "💬 הודעות מלקוחות" },
  { path: "collab",    label: "🤝 שיתופי פעולה" },
  { path: "crm",       label: "📇 מערכת CRM" },
  { path: "esclick",   label: "🧠 יועץ עסקליק" },
  { path: "goals",     label: "🎯 היעדים שלי" },
  { path: "affiliate", label: "👥 תכנית שותפים" },
  { path: "upgrade",   label: "🚀 שדרוג חבילה" },
];

export default function BusinessDashboardLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { businessId } = useParams();
  const location = useLocation();

  // מאותחל לפי מצב חלון
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 768);

  // לשיפור נגישות: רפרנס לכפתור סגירה
  const closeBtnRef = useRef(null);

  // התאמת מובייל/דסקטופ
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setShowSidebar(!mobile);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // UX: הסתרת גלילה כשהסיידבר פתוח במובייל
  useEffect(() => {
    if (isMobile && showSidebar) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobile, showSidebar]);

  // UX: ESC סוגר סיידבר
  useEffect(() => {
    if (!isMobile || !showSidebar) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowSidebar(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isMobile, showSidebar]);

  // UX: פוקוס אוטומטי על כפתור סגירה במובייל
  useEffect(() => {
    if (isMobile && showSidebar) {
      closeBtnRef.current?.focus();
    }
  }, [isMobile, showSidebar]);

  // הגנת גישה
  useEffect(() => {
    if (!loading && user?.role !== "business") {
      navigate("/", { replace: true });
      return;
    }
    const basePath = `/business/${businessId}`;
    if (location.pathname === basePath || location.pathname === `${basePath}/`) {
      navigate("dashboard", { replace: true });
      return;
    }
  }, [user, loading, location.pathname, navigate, businessId]);

  return (
    <BusinessServicesProvider>
      <div className="rtl-wrapper">
        <div className="business-dashboard-layout">
          {/* Overlay במובייל */}
          {isMobile && showSidebar && (
            <div
              className="sidebar-overlay"
              onClick={() => setShowSidebar(false)}
              aria-label="סגור תפריט צד"
              tabIndex={-1}
              role="button"
            />
          )}

          {/* Sidebar */}
          {showSidebar && (
            <aside
              className={`sidebar${isMobile ? " mobile" : ""}`}
              aria-label="ניווט ראשי"
              tabIndex={-1}
            >
              <nav className="sidebar-menu">
                {user?.role === "business" && (
                  <NavLink to={`/business/${businessId}`} end className={({ isActive }) => (isActive ? "active" : undefined)}>
                    👀 צפייה בפרופיל
                  </NavLink>
                )}
                {tabs.map(({ path, label }) => (
                  <NavLink key={path} to={path} end className={({ isActive }) => (isActive ? "active" : undefined)}>
                    {label}
                  </NavLink>
                ))}
              </nav>
              {/* כפתור ✕ לסגירה מהירה - במובייל בלבד */}
              {isMobile && (
                <button
                  className="close-sidebar-btn"
                  onClick={() => setShowSidebar(false)}
                  aria-label="סגור תפריט צד"
                  ref={closeBtnRef}
                  tabIndex={0}
                >
                  ✕
                </button>
              )}
            </aside>
          )}

          <main className="dashboard-content">
            {/* כפתור ☰ במובייל (רק כשהסיידבר סגור) */}
            {(isMobile && !showSidebar) && (
              <button
                className="sidebar-toggle-button"
                onClick={() => setShowSidebar(true)}
                aria-label="פתח תפריט צד"
                tabIndex={0}
              >
                ☰
              </button>
            )}
            {/* בדסקטופ - כפתור סגירה/פתיחה רגיל */}
            {!isMobile && (
              <button
                className="sidebar-toggle-button"
                onClick={() => setShowSidebar(prev => !prev)}
                aria-label={showSidebar ? "הסתר סיידבר" : "הצג סיידבר"}
                tabIndex={0}
              >
                {showSidebar ? '✕' : '☰'}
              </button>
            )}
            <Outlet />
          </main>
        </div>
      </div>
    </BusinessServicesProvider>
  );
}
