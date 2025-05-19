import React, { useEffect, useState, useRef } from "react";
import { NavLink, Outlet, useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BusinessServicesProvider } from "@context/BusinessServicesContext";
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
  const navigate = useNavigate();
  const { businessId } = useParams();
  const location = useLocation();

  const isMobileInit = window.innerWidth <= 768;
  const [isMobile, setIsMobile] = useState(isMobileInit);
  const [showSidebar, setShowSidebar] = useState(!isMobileInit);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setShowSidebar(false); // סגור תמיד במובייל
      } else {
        setShowSidebar(true);
      }
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

  // Trap focus for accessibility
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
          {/* Sidebar */}
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
                  </NavLink>
                ))}
              </nav>
            </aside>
          )}

          {/* Overlay */}
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

          {/* Toggle Sidebar Button (mobile) עם הזזה למטה */}
          {isMobile && (
            <button
              onClick={() => setShowSidebar((prev) => !prev)}
              aria-label={showSidebar ? "הסתר תפריט / חזור לדשבורד" : "פתח תפריט"}
              style={{
                position: "fixed",
                top: 60, // הזזה למטה
                right: 12,
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
              <span>{showSidebar ? "סגור תפריט" : "פתח תפריט"}</span>
            </button>
          )}

          {/* Main content */}
          <main
            className="dashboard-content"
            tabIndex={-1}
            aria-live="polite"
            aria-atomic="true"
          >
            <Outlet />
          </main>
        </div>
      </div>
    </BusinessServicesProvider>
  );
}
