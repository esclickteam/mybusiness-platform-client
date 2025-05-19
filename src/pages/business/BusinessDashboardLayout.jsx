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

  // handle resize
  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setShowSidebar(!mobile);
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // prevent background scroll when sidebar open on mobile
  useEffect(() => {
    document.body.style.overflow = isMobile && showSidebar ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobile, showSidebar]);

  // close on Escape
  useEffect(() => {
    if (!isMobile || !showSidebar) return;
    const onKey = e => e.key === "Escape" && setShowSidebar(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobile, showSidebar]);

  // auth & default route
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

          {/* header */}
          <header className="dashboard-header">
            <div className="logo">עסקליק</div>
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

          {/* overlay for mobile */}
          {isMobile && showSidebar && (
            <div
              className="sidebar-overlay"
              onClick={() => setShowSidebar(false)}
              aria-label="סגור תפריט"
              role="button"
            />
          )}

          {/* sidebar */}
          {showSidebar && (
            <aside className={`sidebar ${isMobile ? "mobile" : ""}`}>
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
          )}

          {/* main content */}
          <main className="dashboard-content">
            <Outlet />
          </main>
        </div>
      </div>
    </BusinessServicesProvider>
  );
}
