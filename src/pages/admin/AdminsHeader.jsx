import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AdminsHeader.css";

const AdminHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/admin-login");
  };

  return (
    <header className="admin-header">
      {/* צד שמאל – כותרת */}
      <div className="admin-header-left">
        👑 Admin Panel
      </div>

      {/* אמצע – ניווט (Dashboard בלבד) */}
      <nav className="admin-nav">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `admin-link ${isActive ? "active" : ""}`
          }
        >
          Dashboard
        </NavLink>
      </nav>

      {/* צד ימין – משתמש + Logout */}
      <div className="admin-header-right">
        <span className="admin-name">
          Hello, {user?.name || "Admin"}
        </span>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
