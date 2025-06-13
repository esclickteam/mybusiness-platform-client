import React, { useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import "./CRMMain.css";

const crmTabs = [
  { path: "appointments", label: "📆 תיאומים" },
  { path: "clients", label: "👥 לקוחות" },
  { path: "services", label: "🛠️ שירותים" },
  // מחקנו את ההגדרות פה
];

// דוגמת פונקציות fetch (תחליף לפי הקוד שלך)
async function fetchAppointments() {
  const res = await fetch("/api/appointments");
  return res.json();
}
async function fetchClients() {
  const res = await fetch("/api/clients");
  return res.json();
}
async function fetchServices() {
  const res = await fetch("/api/services");
  return res.json();
}

const CRMMain = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Prefetch לכל טאבים בעת טעינת הרכיב הראשי
    queryClient.prefetchQuery(["appointments"], fetchAppointments);
    queryClient.prefetchQuery(["clients"], fetchClients);
    queryClient.prefetchQuery(["services"], fetchServices);
  }, [queryClient]);

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
