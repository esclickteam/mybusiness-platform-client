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

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 768);

  const closeBtnRef = useRef(null);

  // התמודדות עם שינוי רזולוציה
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

  // ניגוד גלילה כשהסיידבר פתוח במובייל
  useEffect(() => {
    document.body.style.overflow = isMobile && showSidebar ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobile, showSidebar]);

  // לחיצה על ESC תסגור במובייל
  useEffect(() => {
    if (!isMobile || !showSidebar) return;
    const handleEsc = e => e.key === "Escape" && setShowSidebar(false);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isMobile, showSidebar]);

  // פוקוס אוטומטי לכפתור הסגירה במעבר
  useEffect(() => {
    if (isMobile && showSidebar) closeBtnRef.current?.focus();
  }, [isMobile, showSidebar]);

  // הגנת גישה וניווט ברירת מחדל
  useEffect(() => {
    if (!loading && user?.role !== "business") {
      navigate("/", { replace: true });
      return;
    }
    const base = `/business/${businessId}`;
    if (location.pathname === base || location.pathname === `${base}/`) {
      navigate("dashboard", { replace: true });
    }
  }, [user, loading, location.pathname, navigate, businessId]);

  return (
    <BusinessServicesProvider>
      <div className="rtl-wrapper">
        <div className="business-dashboard-layout">
          {/* רק במובייל: רקע חצי־שקוף בהקלקה על האוברליי */}
          {isMobile && showSidebar && (
            <div
              className="sidebar-overlay"
              onClick={() => setShowSidebar(false)}
              aria-label="סגור תפריט צד"
              tabIndex={-1}
              role="button"
            />
          )}

          {/* סיידבר */}
          {showSidebar && (
            <aside
              className={`sidebar${isMobile ? " mobile" : ""}`}
              aria-label="ניווט ראשי"
            >
              <nav className="sidebar-menu">
                {user?.role === "business" && (
                  <NavLink
                    to={`/business/${businessId}`}
                    end
                    className={({ isActive }) => isActive ? "active" : undefined}
                  >
                    👀 צפייה בפרופיל
                  </NavLink>
                )}
                {tabs.map(({ path, label }) => (
                  <NavLink
                    key={path}
                    to={path}
                    end
                    className={({ isActive }) => isActive ? "active" : undefined}
                  >
                    {label}
                  </NavLink>
                ))}
              </nav>
              {/* כפתור X לסגירה במובייל */}
              {isMobile && (
                <button
                  className="close-sidebar-btn"
                  onClick={() => setShowSidebar(false)}
                  aria-label="סגור תפריט צד"
                  ref={closeBtnRef}
                >
                  ✕
                </button>
              )}
            </aside>
          )}

          <main className="dashboard-content">
            {/* כפתור ☰ במובייל כשהסיידבר סגור */}
            {isMobile && !showSidebar && (
              <button
                className="sidebar-toggle-button"
                onClick={() => setShowSidebar(true)}
                aria-label="פתח תפריט צד"
              >
                ☰
              </button>
            )}
            {/* בכפתור אחד לדסקטופ */}
            {!isMobile && (
              <button
                className="sidebar-toggle-button"
                onClick={() => setShowSidebar(prev => !prev)}
                aria-label={showSidebar ? "הסתר סיידבר" : "הצג סיידבר"}
              >
                {showSidebar ? "✕" : "☰"}
              </button>
            )}
            <Outlet />
          </main>
        </div>
      </div>
    </BusinessServicesProvider>
  );
}
