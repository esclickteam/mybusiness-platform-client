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

  // זיהוי מובייל לפי רוחב חלון
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

    // זיהוי tab מה-query או state
    const searchParams = new URLSearchParams(location.search);
    const tabFromQuery = searchParams.get("tab");
    const tabFromState = location.state?.activeTab;

    if (tabFromQuery && tabs.some(t => t.path === tabFromQuery)) {
      navigate(`./${tabFromQuery}`, { replace: true });
    } else if (tabFromState && tabs.some(t => t.path === tabFromState)) {
      navigate(`./${tabFromState}`, { replace: true });
    }
    // eslint-disable-next-line
  }, [user, loading, location.search, location.state, navigate]);

  if (loading) {
    return <div className="loading-screen">🔄 טוען נתונים…</div>;
  }

  // בדיקה אם אנחנו בנתיב messages
  const isMessagesTab = location.pathname.includes("/messages");

  return (
    <BusinessServicesProvider>
      <div className="rtl-wrapper">
        <div className="business-dashboard-layout">
          {/* במובייל ב- messages: לא להציג סיידבר */}
          {!(isMobile && isMessagesTab) && (
            <aside className="sidebar">
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
            <Outlet />
          </main>
        </div>
      </div>
    </BusinessServicesProvider>
  );
}
