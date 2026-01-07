import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AdminsHeader.css"; // ❗ חובה

const AdminHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/admin-login", { replace: true });
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <header className="admin-header">
      {/* ⬅️ צד שמאל – ניווט */}
      <div className="admin-header-left">
        <span className="admin-logo">👑 Admin Panel</span>

        <nav className="admin-nav">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `admin-nav-link ${isActive ? "active" : ""}`
            }
          >
            📊 Dashboard
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `admin-nav-link ${isActive ? "active" : ""}`
            }
          >
            👥 Users
          </NavLink>
        </nav>
      </div>

      {/* ➡️ צד ימין – משתמש */}
      <div className="admin-header-right">
        <span className="admin-name">
          Hello, {user?.name || user?.email || "Admin"}
        </span>

        <button
          type="button"
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
