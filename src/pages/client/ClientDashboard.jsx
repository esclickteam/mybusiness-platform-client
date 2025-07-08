// src/pages/client/ClientDashboard.jsx
import React from "react";
import { NavLink, Link, Outlet } from "react-router-dom";
import "./ClientDashboard.css";
import { useAuth } from "../../context/AuthContext";

export default function ClientDashboard() {
  const { user } = useAuth();

  return (
    <div className="client-dashboard">
      <h1 className="client-dashboard-title">שלום {user.name} 👋</h1>
      <p className="client-dashboard-subtitle">מה תרצה לעשות היום?</p>

      <div className="client-tabs">
        {/* החלפתי NavLink ל-Link עם נתיב חיצוני */}
        <Link to="/search" className="client-tab-button">
          🔎 חיפוש עסקים
        </Link>

        {/* שאר הטאבים נשארים כמו שהם */}
        <NavLink
          to="orders"
          className={({ isActive }) =>
            `client-tab-button ${isActive ? "active" : ""}`
          }
        >
          📄 הפגישות שלי
        </NavLink>

        <NavLink
          to="messages"
          className={({ isActive }) =>
            `client-tab-button ${isActive ? "active" : ""}`
          }
        >
          💬 ההודעות שלי
        </NavLink>

        <NavLink
          to="favorites"
          className={({ isActive }) =>
            `client-tab-button ${isActive ? "active" : ""}`
          }
        >
          ⭐ מועדפים
        </NavLink>
      </div>

      <div className="client-tab-content">
        <Outlet />
      </div>
    </div>
  );
}
