import React from "react";
import { NavLink, Link, Outlet } from "react-router-dom";
import "./ClientDashboard.css";
import ClientHeader from "./ClientHeader"; // ✅ Header ללקוח

export default function ClientDashboard() {
  return (
    <>
      {/* 🔝 CLIENT HEADER */}
      <ClientHeader />

      {/* 📊 DASHBOARD CONTENT */}
      <div className="client-dashboard">
        <p className="client-dashboard-subtitle">
          What would you like to do today?
        </p>

        <div className="client-tabs">
          {/* ✅ חיפוש עסקים – בתוך הדשבורד (לא חיצוני) */}
          <NavLink
            to="search"
            end
            className={({ isActive }) =>
              `client-tab-button ${isActive ? "active" : ""}`
            }
          >
            🔎 Search Businesses
          </NavLink>

          <NavLink
            to="orders"
            className={({ isActive }) =>
              `client-tab-button ${isActive ? "active" : ""}`
            }
          >
            📄 My Appointments
          </NavLink>

          <NavLink
            to="messages"
            className={({ isActive }) =>
              `client-tab-button ${isActive ? "active" : ""}`
            }
          >
            💬 My Messages
          </NavLink>

          <NavLink
            to="favorites"
            className={({ isActive }) =>
              `client-tab-button ${isActive ? "active" : ""}`
            }
          >
            ⭐ Favorites
          </NavLink>
        </div>

        <div className="client-tab-content">
          <Outlet />
        </div>
      </div>
    </>
  );
}
