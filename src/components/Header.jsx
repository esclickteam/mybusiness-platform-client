import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import { FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "../styles/Header.css";

const Header = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // 🔄 מצב תפריט פתוח

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
    <nav className="app-header">
      {/* צד ימין – תפריט (שמאל ויזואלית ב־RTL) */}
      <div className="auth-controls right">
        <button
          className="menu-button"
          onClick={() => setMenuOpen(prev => !prev)}
        >
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* מרכז – לוגו */}
      <div className="logo-wrapper">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
      </div>

      {/* צד שמאל – אזור אישי (פתיחה מותנית לפי מצב תפריט במובייל) */}
      <div className={`auth-controls left ${menuOpen ? "open" : ""}`}>
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
  );
};

export default Header;
