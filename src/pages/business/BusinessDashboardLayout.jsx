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

  // עדכון: מאותחל אוטומטית לפי מצב חלון (מובייל - מוסתר, דסקטופ - מוצג)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 768);

  // קביעת מצב מובייל וסיידבר
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setShowSidebar(!mobile); // במובייל מוסתר, בדסקטופ גלוי
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // הפעלה ראשונית
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // הגנת גישה וניווט ראשוני
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
          {showSidebar && (
            <aside className="sidebar">
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
            </aside>
          )}

          <main className="dashboard-content">
            {/* כפתור סגירה/פתיחה לסיידבר */}
            <button
              className="sidebar-toggle-button"
              onClick={() => setShowSidebar(prev => !prev)}
              aria-label={showSidebar ? "הסתר סיידבר" : "הצג סיידבר"}
            >
              {showSidebar ? '✕' : '☰'}
            </button>
            <Outlet />
          </main>
        </div>
      </div>
    </BusinessServicesProvider>
  );
}
