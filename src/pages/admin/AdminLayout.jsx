import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AdminLayout.css";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="admin-layout">
      {/* ===== Admin Header ===== */}
      <header className="admin-header">
        <div className="admin-header-left">
          <span className="admin-badge">👑 ADMIN</span>
          <h1 className="admin-title">BizUply Admin</h1>
        </div>

        <div className="admin-header-right">
          <span className="admin-user">
            {user?.name || user?.email}
          </span>

          <button
            className="admin-btn"
            onClick={() => navigate("/")}
          >
            🌐 Go to Site
          </button>

          <button
            className="admin-btn logout"
            onClick={logout}
          >
            🚪 Logout
          </button>
        </div>
      </header>

      {/* ===== Admin Content ===== */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
