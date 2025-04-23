import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import { FaBars, FaSearch } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "../styles/Header.css";

const Header = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return null; // ⏳ לא מציג כלום עד שהטעינה מסתיימת

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("❌ logout failed:", err);
    }
  };

  const getDashboardPath = () => {
    switch (user?.role) {
      case "business":
        return '/business/dashboard';
      case "customer":
        return '/client/dashboard';
      case "worker":
        return "/staff/dashboard";
      case "manager":
        return "/manager/dashboard";
      case "admin":
        return "/admin/dashboard";
      default:
        return "/";
    }
  };

  return (
    <nav className="app-header">
      <button className="menu-button">
        <FaBars size={24} />
      </button>

      <Link to="/" className="logo-link">
        <img src={logo} alt="Logo" className="logo" />
      </Link>

      <div className="auth-controls">
        <Link to="/search" className="icon-button">
          <FaSearch size={24} />
        </Link>

        {user ? (
          <>
            <span className="username">שלום, {user.name || user.email}</span>
            <button
              onClick={() => navigate(getDashboardPath())}
              className="personal-area-button"
            >
              אזור אישי
            </button>
            <button onClick={handleLogout} className="logout-button">
              התנתק
            </button>
          </>
        ) : (
          <Link to="/login" className="login-button">
            התחבר
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Header;
