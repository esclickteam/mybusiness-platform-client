import React, { useEffect } from "react";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/BusinessDashboardLayout.css";

const tabs = [
  { path: "build",     label: "🧱 עריכת עמוד עסקי" },
  { path: "dashboard", label: "📊 דשבורד" },
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

  useEffect(() => {
    if (!loading && user?.role !== "business") {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="loading-screen">🔄 טוען נתונים…</div>;
  }

  return (
    <div className="rtl-wrapper">
      <div className="business-dashboard-layout">
        <aside className="sidebar">
          <h2>ניהול העסק</h2>
          <nav>
            {/* כפתור צפייה בפרופיל ציבורי */}
            {user?.role === "business" && (
              <NavLink
              to={`/business/${businessId}`}
              end
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              👀 צפייה בפרופיל
            </NavLink>
            
            )}

            {/* כפתורי הטאבים בדשבורד */}
            {tabs.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) => (isActive ? "active" : undefined)}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}