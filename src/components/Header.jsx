import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import {
  FaBars,
  FaChevronLeft,
  FaUserCircle,
  FaSignOutAlt,
  FaUserPlus,
  FaCogs,
  FaListUl,
  FaHome,
  FaInfoCircle,
  FaPhone,
  FaQuestionCircle,
  FaFileContract,
  FaTachometerAlt,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationsContext";
import "../styles/Header.css";
import Notifications from "./Notifications";

export default function Header() {
  const { user, logout, loading } = useAuth();
  const { clearAll, clearRead, unreadCount } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") setNotifOpen(false);
    }
    if (notifOpen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [notifOpen]);

  if (loading) return null;

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

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("❌ Logout failed:", err);
    }
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="app-header">
        {/* כפתור ניווט לדשבורד בצד שמאל, רק במובייל ולבעלי עסקים */}
        {(user?.role === "business" || user?.role === "business-dashboard") && (
          <button
            className="mobile-dashboard-button"
            aria-label="לוח בקרה"
            onClick={() => navigate(getDashboardPath())}
            title="לוח בקרה"
          >
            <FaTachometerAlt size={22} />
          </button>
        )}

        <div className="logo-wrapper">
          <Link to="/" className="logo-link">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
        </div>

        <div className="menu-toggle">
          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "סגור תפריט" : "תפריט ראשי"}
          >
            {menuOpen ? <FaChevronLeft size={24} /> : <FaBars size={24} />}
          </button>

          {(user?.role === "business" || user?.role === "business-dashboard") && (
            <>
              <button
                className="notification-button"
                onClick={() => setNotifOpen(!notifOpen)}
                aria-label="התראות"
              >
                🔔
                {unreadCount > 0 && (
                  <span aria-live="polite" aria-atomic="true">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <Notifications
                  onClose={() => setNotifOpen(false)}
                  clearReadNotifications={clearRead}
                  clearAllNotifications={clearAll}
                />
              )}
            </>
          )}
        </div>

        <div className="auth-controls desktop-only">
          {!user ? (
            <Link to="/login" className="login-button">
              התחברות
            </Link>
          ) : (
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

      {menuOpen && (
        <>
          <div className="menu-backdrop" onClick={() => setMenuOpen(false)} />
          <div className="side-menu open" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <button className="back-button" onClick={() => setMenuOpen(false)}>
                <FaChevronLeft size={20} />
                <span className="back-text">חזור</span>
              </button>
            </div>

            <div className="menu-scroll">
              {!user ? (
                <div className="mobile-auth">
                  <Link
                    to="/login"
                    className="login-button"
                    onClick={() => setMenuOpen(false)}
                  >
                    התחברות
                  </Link>
                </div>
              ) : (
                <>
                  <div className="menu-user">
                    <FaUserCircle size={20} />
                    <span>{user.name || user.email}</span>
                  </div>
                  <div className="menu-section">
                    <h4>לעסקים</h4>
                    {link("/business", <FaUserPlus />, "הצטרפות כבעל עסק")}
                    {link("/how-it-works", <FaCogs />, "איך זה עובד")}
                  </div>
                  <div className="menu-section">
                    <h4>ללקוחות</h4>
                    {link("/businesses", <FaListUl />, "רשימת עסקים")}
                    {/* הוסר: קטגוריות וחיפוש מתקדם */}
                  </div>
                  <div className="menu-section">
                    <h4>כללי</h4>
                    {link("/", <FaHome />, "דף הבית")}
                    {link("/about", <FaInfoCircle />, "אודות")}
                    {link("/contact", <FaPhone />, "צור קשר")}
                    {link("/faq", <FaQuestionCircle />, "שאלות נפוצות")}
                    {link("/accessibility", <FaInfoCircle />, "הצהרת נגישות")}
                    {link("/privacy-policy", <FaFileContract />, "מדיניות פרטיות")}
                  </div>
                </>
              )}
            </div>

            {user && (
              <div className="auth-menu">
                <button
                  className="personal-area-button"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate(getDashboardPath());
                  }}
                >
                  אזור אישי
                </button>
                <button className="logout-button" onClick={handleLogout}>
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
