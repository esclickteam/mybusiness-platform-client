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

  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  // קביעת מצב מובייל
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // הגנת גישה וניווט ראשוני לפי נתיב
  useEffect(() => {
    if (!loading && user?.role !== "business") {
      navigate("/", { replace: true });
      return;
    }

    // אם הגענו לבסיס ללא טאב, ניגש לדשבורד
    const basePath = `/business/${businessId}`;
    if (location.pathname === basePath) {
      navigate("dashboard", { replace: true });
      return;
    }

    const searchParams = new URLSearchParams(location.search);
    const tabFromQuery = searchParams.get("tab");
    const tabFromState = location.state?.activeTab;

    if (tabFromQuery && tabs.some(t => t.path === tabFromQuery)) {
      navigate(`./${tabFromQuery}`, { replace: true });
    } else if (tabFromState && tabs.some(t => t.path === tabFromState)) {
      navigate(`./${tabFromState}`, { replace: true });
    }
    // eslint-disable-next-line
  }, [user, loading, location.pathname, location.search, location.state, navigate]);

  const isMessagesTab = /\/messages(\/|$)/.test(location.pathname);
  const isDashboardTab = /\/dashboard(\/|$)/.test(location.pathname);

  // הצגת/הסתרת סיידבר בהתאם לטאב במובייל
  useEffect(() => {
    if (isMobile) {
      setShowSidebar(!isMessagesTab);
    } else {
      setShowSidebar(true);
    }
  }, [isMobile, isMessagesTab]);

  return (
    <BusinessServicesProvider>
      <div className="rtl-wrapper">
        <div
          key={location.pathname}
          className={`business-dashboard-layout${isMobile && isMessagesTab ? " mobile-messages" : ""}`}
        >
          {( !isMobile || showSidebar ) && (
            <aside className="sidebar">
              {isMobile && isMessagesTab && (
                <button
                  onClick={() => setShowSidebar(false)}
                  style={{ marginBottom: "1rem", padding: "8px 16px", fontSize: "1rem", borderRadius: "6px", border: "none", backgroundColor: "#ccc", cursor: "pointer" }}
                  aria-label="הסתר סיידבר"
                >
                  ✕ סגור
                </button>
              )}
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

          <main className="dashboard-content">
            {isMessagesTab && (
              <button
                onClick={() => navigate("dashboard")}
                style={{ marginBottom: "1rem", padding: "8px 16px", fontSize: "1rem", borderRadius: "6px", border: "none", backgroundColor: "#4a3aff", color: "#fff", cursor: "pointer" }}
                aria-label="חזרה לדשבורד"
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
