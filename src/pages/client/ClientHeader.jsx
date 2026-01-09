import React from "react";
import { useAuth } from "../../context/AuthContext";
import "./ClientHeader.css";

const ClientHeader = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout(); // ✅ logout כבר עושה navigate ל-login ומנקה הכל
  };

  return (
    <header className="client-header">
      <div className="client-header-left">
        Hello {user?.name || "Guest"} 👋
      </div>

      <div className="client-header-right">
        <button className="client-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default ClientHeader;
