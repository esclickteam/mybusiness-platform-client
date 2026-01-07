import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // ⚠️ עדכני נתיב לפי הפרויקט

const AdminHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout(); // 🔐 logout מרכזי
      navigate("/admin-login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <span className="admin-logo">👑 Admin Panel</span>
      </div>

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
