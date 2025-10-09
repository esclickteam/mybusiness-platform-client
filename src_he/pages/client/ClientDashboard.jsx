// src/pages/client/ClientDashboard.jsx
import React from "react";
import { NavLink, Link, Outlet } from "react-router-dom";
import "./ClientDashboard.css";
import { useAuth } from "../../context/AuthContext";

export default function ClientDashboard() {
  const { user } = useAuth();

  return (
    <div className="client-dashboard">
      <h1 className="client-dashboard-title">Hello {user.name} 👋</h1>
      <p className="client-dashboard-subtitle">What would you like to do today?</p>

      <div className="client-tabs">
        {/* I replaced NavLink with Link with an external path */}
        <Link to="/search" className="client-tab-button">
          🔎 Business Search
        </Link>

        {/* The rest of the tabs remain as they are */}
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
  );
}
