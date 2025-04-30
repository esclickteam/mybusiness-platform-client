import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../images/logo.png";
import {
  FaBars,
  FaChevronLeft,
  FaHome,
  FaInfoCircle,
  FaPhone,
  FaQuestionCircle,
  FaFileContract,
  FaShieldAlt,
  FaMoneyBillAlt,
  FaCogs,
  FaUserPlus,
  FaListUl,
  FaTags,
  FaSearch,
  FaSignOutAlt,
  FaUserCircle
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "../styles/Header.css";

const Header = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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
      case "business": return `/business/${user.businessId}/dashboard`;
      case "customer": return "/client/dashboard";
      case "worker": return "/staff/dashboard";
      case "manager": return "/manager/dashboard";
      case "admin": return "/admin/dashboard";
      default: return "/";
    }
  };

  const link = (to, icon, label) => (
    <Link
      to={to}
      onClick={() => setMenuOpen(false)}
      className={location.pathname === to ? "active-link" : ""}
    >
      <span className="link-icon">{icon}</span>
      <span>{label}</span>
    </Link>
  );

  return (
    <>
      <nav className="app-header">
        {!menuOpen && (
          <div className="menu-toggle">
            <button className="menu-button" onClick={() => setMenuOpen(true)}>
              <FaBars size={24} />
            </button>
          </div>
        )}
        <div className="logo-wrapper">
          <Link to="/" className="logo-link">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
        </div>
        <div className="auth-controls desktop-only">
          {!user && <Link to="/login" className="login-button">התחבר</Link>}
        </div>
      </nav>

      {menuOpen && (
        <>
          <div className="menu-backdrop" onClick={() => setMenuOpen(false)} />

          <div className="side-menu open">
            <div className="drawer-header">
              <button className="back-button" onClick={() => setMenuOpen(false)}>
                <FaChevronLeft size={20} />
                <span className="back-text">חזור</span>
              </button>
            </div>

            {user && (
              <div className="menu-user">
                <FaUserCircle size={20} />
                <span>{user.name || user.email}</span>
              </div>
            )}

            <div className="menu-section">
              <h4>כללי</h4>
              {link("/", <FaHome />, "דף הבית")}
              {link("/about", <FaInfoCircle />, "אודות")}
              {link("/contact", <FaPhone />, "צור קשר")}
              {link("/faq", <FaQuestionCircle />, "שאלות נפוצות")}
              {link("/terms", <FaFileContract />, "תנאי שימוש")}
              {link("/privacy", <FaShieldAlt />, "מדיניות פרטיות")}
            </div>

            <div className="menu-section">
              <h4>לעסקים</h4>
              {link("/pricing", <FaMoneyBillAlt />, "מחירים")}
              {link("/how-it-works", <FaCogs />, "איך זה עובד")}
              {link("/register/business", <FaUserPlus />, "הצטרפות כבעל עסק")}
            </div>

            <div className="menu-section">
              <h4>ללקוחות</h4>
              {link("/businesses", <FaListUl />, "רשימת עסקים")}
              {link("/categories", <FaTags />, "קטגוריות")}
              {link("/search", <FaSearch />, "חיפוש מתקדם")}
            </div>

            <hr />

            {user && (
              <div className="menu-section auth-menu">
                <button
                  className="personal-area-button"
                  onClick={() => {
                    navigate(getDashboardPath());
                    setMenuOpen(false);
                  }}
                >
                  אזור אישי
                </button>
                <button
                  className="logout-button"
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                >
                  <FaSignOutAlt style={{ marginLeft: 6 }} /> התנתק
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Header;
