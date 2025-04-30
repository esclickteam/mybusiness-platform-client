// src/components/Header.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import { FaBars, FaTimes, FaChevronRight } from "react-icons/fa";
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
        {/* המבורגר תמיד */}
        <div className="menu-toggle">
          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* לוגו במרכז */}
        <div className="logo-wrapper">
          <Link to="/" className="logo-link">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
        </div>

        {/* כפתורי משתמש – רק בדסקטופ */}
        <div className="auth-controls desktop-only">
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

      {/* Drawer פתוח בכל גודל מסך */}
      {menuOpen && (
        <>
          <div className="menu-backdrop" onClick={() => setMenuOpen(false)} />

          <div className="side-menu open">
            {/* כפתור חזור */}
            <div className="drawer-header">
              <button
                className="back-button"
                onClick={() => setMenuOpen(false)}
              >
                <FaChevronRight size={24} />
              </button>
            </div>

            <div className="menu-section">
              <h4>כללי</h4>
              <Link to="/" onClick={() => setMenuOpen(false)}>דף הבית</Link>
              <Link to="/about" onClick={() => setMenuOpen(false)}>אודות</Link>
              <Link to="/contact" onClick={() => setMenuOpen(false)}>צור קשר</Link>
              <Link to="/faq" onClick={() => setMenuOpen(false)}>שאלות נפוצות</Link>
              <Link to="/terms" onClick={() => setMenuOpen(false)}>תנאי שימוש</Link>
              <Link to="/privacy" onClick={() => setMenuOpen(false)}>מדיניות פרטיות</Link>
            </div>

            <div className="menu-section">
              <h4>לגלות עסקים</h4>
              <Link to="/businesses" onClick={() => setMenuOpen(false)}>רשימת עסקים</Link>
              <Link to="/categories" onClick={() => setMenuOpen(false)}>קטגוריות</Link>
              <Link to="/search" onClick={() => setMenuOpen(false)}>חיפוש מתקדם</Link>
            </div>

            <div className="menu-section">
              <h4>לעסקים</h4>
              <Link to="/pricing" onClick={() => setMenuOpen(false)}>מחירים</Link>
              <Link to="/how-it-works" onClick={() => setMenuOpen(false)}>איך זה עובד</Link>
              <Link to="/register/business" onClick={() => setMenuOpen(false)}>הצטרפות כבעל עסק</Link>
            </div>

            <hr />

            {/* כפתורי משתמש בתוך ה־drawer */}
            <div className="menu-section auth-menu">
              {user ? (
                <>
                  <button
                    onClick={() => { navigate(getDashboardPath()); setMenuOpen(false); }}
                    className="personal-area-button"
                  >
                    אזור אישי
                  </button>
                  <button
                    onClick={() => { handleLogout(); setMenuOpen(false); }}
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
          </div>
        </>
      )}
    </>
  );
};

export default Header;
