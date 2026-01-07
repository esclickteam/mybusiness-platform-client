import React from "react";
import { useNavigate, NavLink } from "react-router-dom";
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
      <div className="admin-header-left">
        👑 Admin Panel
      </div>

      {/* 🔗 ניווט אדמין */}
      <nav className="admin-nav">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) => isActive ? "admin-link active" : "admin-link"}
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) => isActive ? "admin-link active" : "admin-link"}
        >
          Users
        </NavLink>
      </nav>

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
