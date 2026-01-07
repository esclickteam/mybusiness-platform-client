import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./ClientHeader.css";

const ClientHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
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
