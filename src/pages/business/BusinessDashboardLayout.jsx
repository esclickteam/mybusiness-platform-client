import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "../../styles/BusinessDashboardLayout.css"; // ודא שזה הנתיב הנכון לקובץ ה-CSS שלך

// 👇 טאב חדש ל"יעדים שלי" נוסף פה
const tabs = [
  { path: "profile", label: "👤 פרופיל" },
  { path: "build", label: "🧱 עריכת עמוד עסקי" },
  { path: "dashboard", label: "📊 דשבורד" },
  { path: "messages", label: "💬 הודעות מלקוחות" },
  { path: "collab", label: "🤝 שיתופי פעולה" },
  { path: "crm", label: "📇 מערכת CRM" },
  { path: "esclick", label: "🧠 יועץ עסקליק" },
  { path: "goals", label: "🎯 היעדים שלי" }, // ✅ נוספה כאן שורת הטאב החדש
  { path: "upgrade", label: "🚀 שדרוג חבילה" },
];

const BusinessDashboardLayout = () => {
  return (
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
  );
};

export default BusinessDashboardLayout;
