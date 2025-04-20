import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./CRMMain.css"; // אפשר גם Tailwind במקום CSS

const crmTabs = [
  { path: "appointments", label: "📆 תיאומים" },
  { path: "clients", label: "👥 לקוחות" },
  { path: "services", label: "🛠️ שירותים" },
  { path: "settings", label: "⚙️ הגדרות" },
];

const CRMMain = () => {
  return (
    <div className="crm-main-wrapper">
      <nav className="crm-tabs-nav">
        {crmTabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              isActive ? "crm-tab active" : "crm-tab"
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <div className="crm-tab-content">
        <Outlet />
      </div>
    </div>
  );
};

export default CRMMain;
