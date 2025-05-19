import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BusinessServicesProvider } from "@context/BusinessServicesContext";
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

  // Responsive check
  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setShowSidebar(!mobile); // דסקטופ: פתוח, מובייל: סגור
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Lock scroll on sidebar open (mobile only)
  useEffect(() => {
    document.body.style.overflow = isMobile && showSidebar ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobile, showSidebar]);

  // ESC key closes sidebar on mobile
  useEffect(() => {
    if (!isMobile || !showSidebar) return;
    const onKey = e => e.key === "Escape" && setShowSidebar(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobile, showSidebar]);

  // Auth & default tab redirect
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

          {/* Header */}
          <header className="dashboard-header">
            <div className="logo">עסקליק</div>
            {/* כפתור המבורגר במובייל בלבד */}
            {isMobile && (
              <button
                className="sidebar-toggle-button"
                onClick={() => setShowSidebar(v => !v)}
                aria-label={showSidebar ? "סגור תפריט" : "פתח תפריט"}
              >
                {showSidebar ? "✕" : "☰"}
              </button>
            )}
          </header>

          {/* Overlay במובייל (סוגר תפריט בלחיצה מחוץ לסיידבר) */}
          {isMobile && showSidebar && (
            <div
              className="sidebar-overlay"
              onClick={() => setShowSidebar(false)}
              aria-label="סגור תפריט"
              role="button"
            />
          )}

          {/* Sidebar - מוצג תמיד, במובייל/דסקטופ נפתח/נסגר ע"י קלאס */}
          <aside
            className={[
              "sidebar",
              isMobile ? "mobile" : "",
              isMobile && showSidebar ? "open" : ""
            ].filter(Boolean).join(" ")}
          >
            <nav>
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
          </aside>

          {/* Main Content */}
          <main className="dashboard-content">
            <Outlet />
          </main>
        </div>
      </div>
    </BusinessServicesProvider>
  );
}
