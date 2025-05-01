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

export default function Header() {
  const { user, logout, loading } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  if (loading) return null;

  /* ——— דשבורד לפי תפקיד ——— */
  const getDashboardPath = () => {
    switch (user?.role) {
      case "business": return `/business/${user.businessId}/dashboard`;
      case "customer": return "/client/dashboard";
      case "worker":   return "/staff/dashboard";
      case "manager":  return "/manager/dashboard";
      case "admin":    return "/admin/dashboard";
      default:         return "/";
    }
  };

  /* ——— קישור Drawer עם active ——— */
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

  /* ——— Logout ——— */
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("❌ logout failed:", err);
    }
  };

  return (
    <>
      {/* ===== HEADER BAR ===== */}
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

          {user && (
            <>
              <button
                className="personal-area-button"
                onClick={() => navigate(getDashboardPath())}
              >
                לוח בקרה
              </button>

              <button className="logout-button" onClick={handleLogout}>
                <FaSignOutAlt style={{ marginLeft: 6 }} />
                התנתק
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ===== DRAWER ===== */}
      {menuOpen && (
        <>
          <div className="menu-backdrop" onClick={() => setMenuOpen(false)} />

          <div className="side-menu open">
            {/* header קטן */}
            <div className="drawer-header">
              <button className="back-button" onClick={() => setMenuOpen(false)}>
                <FaChevronLeft size={20} />
                <span className="back-text">חזור</span>
              </button>
            </div>

            {/* ===== תוכן גלילה ===== */}
            <div className="menu-scroll">
              {user && (
                <div className="menu-user">
                  <FaUserCircle size={20} />
                  <span>{user.name || user.email}</span>
                </div>
              )}

              {/* ——— 1) לעסקים ——— */}
              <div className="menu-section">
                <h4>לעסקים</h4>
                {link("/register/business", <FaUserPlus />, "הצטרפות כבעל עסק")}
                {link("/how-it-works",      <FaCogs />,         "איך זה עובד")}
                {link("/pricing",           <FaMoneyBillAlt />, "מחירים")}
              </div>

              {/* ——— 2) ללקוחות ——— */}
              <div className="menu-section">
                <h4>ללקוחות</h4>
                {link("/businesses", <FaListUl />, "רשימת עסקים")}
                {link("/categories", <FaTags />,   "קטגוריות")}
                {link("/search",     <FaSearch />, "חיפוש מתקדם")}
              </div>

              {/* ——— 3) כללי ——— */}
              <div className="menu-section">
                <h4>כללי</h4>
                {link("/",        <FaHome />,         "דף הבית")}
                {link("/about",   <FaInfoCircle />,   "אודות")}
                {link("/contact", <FaPhone />,        "צור קשר")}
                {link("/faq",     <FaQuestionCircle />,"שאלות נפוצות")}
                {link("/terms",   <FaFileContract />, "תנאי שימוש")}
                {link("/accessibility", <FaInfoCircle />, "הצהרת נגישות")} {/* הוסף קישור לדף נגישות */}
              </div>
            </div>

            {/* ===== פוטר קבוע ===== */}
            {user && (
              <div className="auth-menu">
                <button
                  className="personal-area-button"
                  onClick={() => { navigate(getDashboardPath()); setMenuOpen(false); }}
                >
                  אזור אישי
                </button>

                <button
                  className="logout-button"
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                >
                  <FaSignOutAlt style={{ marginLeft: 6 }} />
                  התנתק
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
