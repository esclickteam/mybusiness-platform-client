// src/components/Header.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import { FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "../styles/Header.css";

const Header = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  if (loading) return null;

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
        return `/business/${user.businessId}/dashboard`;
      case "customer":
        return "/client/dashboard";
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
    <>
      <nav className="app-header">
        <div className="auth-controls right">
          <button
            className="menu-button"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        <div className="logo-wrapper">
          <Link to="/" className="logo-link">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
        </div>

        <div className="auth-controls left desktop-only">
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
            <Link to="/login" className="login-button">התחבר</Link>
          )}
        </div>
      </nav>

      {/* תפריט קורס במובייל */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {user ? (
          <>
            <span className="username">שלום, {user.name || user.email}</span>
            <button
              onClick={() => {
                navigate(getDashboardPath());
                setMenuOpen(false);
              }}
              className="personal-area-button"
            >
              אזור אישי
            </button>
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="logout-button"
            >
              התנתק
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="login-button"
            onClick={() => setMenuOpen(false)}
          >
            התחבר
          </Link>
        )}
      </div>
    </>
  );
};

export default Header;
