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

  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
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

  const isMessagesTab = /\/messages(\/|$)/.test(location.pathname);

  useEffect(() => {
    if (isMobile && isMessagesTab) {
      setShowSidebar(false);
    } else {
      setShowSidebar(true);
    }
  }, [isMobile, isMessagesTab]);

  // Trap focus inside sidebar when open (accessibility)
  useEffect(() => {
    if (!isMobile || !showSidebar) return;

    const focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), \
      textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], \
      [contenteditable]';

    const firstFocusableElement = sidebarRef.current.querySelectorAll(focusableElementsString)[0];
    const focusableContent = sidebarRef.current.querySelectorAll(focusableElementsString);
    const lastFocusableElement = focusableContent[focusableContent.length - 1];

    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) { // shift + tab
          if (document.activeElement === firstFocusableElement) {
            e.preventDefault();
            lastFocusableElement.focus();
          }
        } else { // tab
          if (document.activeElement === lastFocusableElement) {
            e.preventDefault();
            firstFocusableElement.focus();
          }
        }
      }
      if (e.key === 'Escape') {
        setShowSidebar(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    firstFocusableElement?.focus();

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobile, showSidebar]);

  return (
    <BusinessServicesProvider>
      <div className={`rtl-wrapper ${showSidebar ? "sidebar-open" : ""}`}>
        <div className={`business-dashboard-layout${isMobile && isMessagesTab ? " mobile-messages" : ""}`}>
          {/* Sidebar */}
          {(!isMobile || showSidebar) && (
            <aside
              className={`sidebar ${isMobile ? "mobile open" : ""}`}
              ref={sidebarRef}
              aria-modal={isMobile && showSidebar ? "true" : undefined}
              role={isMobile && showSidebar ? "dialog" : undefined}
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

          {/* Overlay for mobile when sidebar is open */}
          {isMobile && showSidebar && (
            <div
              className="sidebar-overlay"
              onClick={() => setShowSidebar(false)}
              aria-label="סגור תפריט"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowSidebar(false); }}
            />
          )}

          {/* Toggle button for mobile */}
          {isMobile && (
            <button
              className="sidebar-toggle-button"
              onClick={() => setShowSidebar((v) => !v)}
              aria-label={showSidebar ? "סגור תפריט" : "פתח תפריט"}
              aria-expanded={showSidebar}
              aria-controls="sidebar"
            >
              {showSidebar ? "✕" : "☰"}
            </button>
          )}

          {/* Main content */}
          <main className="dashboard-content" tabIndex={-1} aria-live="polite" aria-atomic="true">
            {/* Back to dashboard button in messages tab (mobile) */}
            {isMobile && isMessagesTab && (
              <button
                onClick={() => {
                  setShowSidebar(false);
                  navigate(`/business/${businessId}/dashboard`);
                }}
                style={{
                  marginBottom: "1rem",
                  padding: "8px 16px",
                  fontSize: "1rem",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "#4a3aff",
                  color: "#fff",
                  cursor: "pointer",
                }}
                aria-label="חזרה לדשבורד וסגירת תפריט"
              >
                ← חזרה לדשבורד
              </button>
            )}

            <Outlet />
          </main>
        </div>
      </div>
    </BusinessServicesProvider>
  );
}
