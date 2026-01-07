import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AdminsHeader.css"; // ❗ חובה

 const AdminHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/admin-login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

   return (
    <header className="admin-header">
      <div className="admin-header-left">
        👑 Admin Panel
      </div>

      <div className="admin-header-right">
        <span className="admin-name">
          Hello, {user?.name || "Admin"}
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
