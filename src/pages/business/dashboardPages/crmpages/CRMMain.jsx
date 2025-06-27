import React, { useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import "./CRMMain.css";

const crmTabs = [
  { path: "appointments", label: "📆 תיאומים" },
  { path: "clients", label: "👥 לקוחות" },
  { path: "services", label: "🛠️ שירותים" },
  { path: "work-hours", label: "⏰ שעות פעילות" }, // טאב חדש
];

// דוגמאות פונקציות fetch (החלף לפי הקוד שלך)
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
async function fetchWorkHours() {
  const res = await fetch("/api/appointments/get-work-hours");
  return res.json();
}

const CRMMain = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Prefetch לכל הטאבים
    queryClient.prefetchQuery(["appointments"], fetchAppointments);
    queryClient.prefetchQuery(["clients"], fetchClients);
    queryClient.prefetchQuery(["services"], fetchServices);
    queryClient.prefetchQuery(["work-hours"], fetchWorkHours);  // הוספה
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
