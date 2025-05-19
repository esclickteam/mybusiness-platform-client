import React, { useEffect, useState } from "react";
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

  // מצב מובייל ודסקטופ
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
            />
          )}

          {/* Sidebar */}
          {showSidebar && (
            <aside className={`sidebar${isMobile ? " mobile" : ""}`}>
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
                  aria-label="סגור תפריט"
                >
                  ✕
                </button>
              )}
            </aside>
          )}

          <main className="dashboard-content">
            {/* כפתור ☰ תמיד מוצג במובייל (גם כשהסיידבר סגור) */}
            {(isMobile && !showSidebar) && (
              <button
                className="sidebar-toggle-button"
                onClick={() => setShowSidebar(true)}
                aria-label="פתח תפריט"
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
