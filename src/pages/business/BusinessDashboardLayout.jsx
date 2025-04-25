import React, { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/BusinessDashboardLayout.css";

const tabs = [
  { path: "profile", label: "👤 פרופיל" },
  { path: "build", label: "🧱 עריכת עמוד עסקי" },
  { path: "dashboard", label: "📊 דשבורד" },
  { path: "messages", label: "💬 הודעות מלקוחות" },
  { path: "collab", label: "🤝 שיתופי פעולה" },
  { path: "crm", label: "📇 מערכת CRM" },
  { path: "esclick", label: "🧠 יועץ עסקליק" },
  { path: "goals", label: "🎯 היעדים שלי" },
  { path: "affiliate", label: "👥 תכנית שותפים" },
  { path: "upgrade", label: "🚀 שדרוג חבילה" },
];

const BusinessDashboardLayout = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user?.role !== "business") {
      navigate("/");
    }
  }, [user, loading]);

  if (loading) return <div className="loading-screen">🔄 טוען נתונים…</div>;

  return (
    <div className="rtl-wrapper">
      <div className="business-dashboard-layout">
        <aside className="sidebar">
          <h2>ניהול העסק</h2>
          <nav>
            {tabs.map((tab) => (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={({ isActive }) =>
                  isActive ? "active" : undefined
                }
              >
                {tab.label}
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
};

export default BusinessDashboardLayout;
