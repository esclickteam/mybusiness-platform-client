// src/components/Header.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../images/logo.png";
import "../styles/Header.css";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("❌ שגיאה בהתנתקות:", err);
    }
  };

  return (
    <header className="app-header">
      <div className="logo-container">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
      </div>
      <nav className="nav-links">
        <Link to="/about">אודות</Link>
        <Link to="/how-it-works">איך זה עובד</Link>
        <Link to="/plans">תמחור</Link>
        {/* ...עוד קישורים... */}
      </nav>
      <div className="auth-controls">
        {user ? (
          <button
            onClick={handleLogout}
            className="logout-button"
          >
            התנתק
          </button>
        ) : (
          <Link to="/login" className="login-button">
            התחבר
          </Link>
        )}
      </div>
    </header>
  );
}
