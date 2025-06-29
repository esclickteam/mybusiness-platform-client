import React, { useState, useEffect } from "react"; 
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import {
  FaBars,
  FaChevronLeft,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/socketContext";
import "../styles/Header.css";
import Notifications from "./Notifications";

export default function Header() {
  const { user, logout, loading } = useAuth();
  const socket = useSocket();
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification) => {
      setNotifications((prev) => {
        if (prev.some((n) => n.id === notification.id)) return prev; // מניעת כפילויות
        return [notification, ...prev];
      });
    };

    socket.on("newNotification", handleNewNotification);

    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, [socket]);

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

  // סופרים את מספר ההתראות שעדיין לא נקראו
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <nav
        className="app-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          className="menu-toggle"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            position: "relative",
            right: 20,
          }}
        >
          {!menuOpen && (
            <button
              className="menu-button"
              onClick={() => setMenuOpen(true)}
              aria-label="תפריט ראשי"
            >
              <FaBars size={24} />
            </button>
          )}

          {(user?.role === "business" || user?.role === "business-dashboard") && (
            <>
              <button
                className="notification-button"
                onClick={() => setNotifOpen(!notifOpen)}
                aria-label="התראות"
                style={{
                  fontSize: 24,
                  position: "relative",
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  color: "inherit",
                  padding: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                🔔
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      background: "red",
                      borderRadius: "50%",
                      width: "16px",
                      height: "16px",
                      color: "white",
                      fontSize: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && socket && user && (
                <Notifications
                  socket={socket}
                  user={user}
                  notifications={notifications}
                  onClose={() => setNotifOpen(false)}
                  clearNotifications={() => setNotifications([])}
                />
              )}
            </>
          )}
        </div>

        <div className="logo-wrapper">
          <Link to="/" className="logo-link">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
        </div>

        <div className="auth-controls desktop-only">
          {!user && (
            <Link to="/login" className="login-button">
              התחברות
            </Link>
          )}

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
            <div className="drawer-header">
              <button className="back-button" onClick={() => setMenuOpen(false)}>
                <FaChevronLeft size={20} />
                <span className="back-text">חזור</span>
              </button>
            </div>

            {!user && (
              <div className="mobile-auth">
                <Link
                  to="/login"
                  className="login-button"
                  onClick={() => setMenuOpen(false)}
                >
                  התחברות
                </Link>
              </div>
            )}

            <div className="menu-scroll">
              {user && (
                <div className="menu-user">
                  <FaUserCircle size={20} />
                  <span>{user.name || user.email}</span>
                </div>
              )}

              <div className="menu-section">
                <h4>לעסקים</h4>
                {link("/business", <FaUserPlus />, "הצטרפות כבעל עסק")}
                {link("/how-it-works", <FaCogs />, "איך זה עובד")}
              </div>

              <div className="menu-section">
                <h4>ללקוחות</h4>
                {link("/businesses", <FaListUl />, "רשימת עסקים")}
                {link("/categories", <FaTags />, "קטגוריות")}
                {link("/search", <FaSearch />, "חיפוש מתקדם")}
              </div>

              <div className="menu-section">
                <h4>כללי</h4>
                {link("/", <FaHome />, "דף הבית")}
                {link("/about", <FaInfoCircle />, "אודות")}
                {link("/contact", <FaPhone />, "צור קשר")}
                {link("/faq", <FaQuestionCircle />, "שאלות נפוצות")}
                {link("/", <FaFileContract />, "תנאי שימוש")}
                {link("/accessibility", <FaInfoCircle />, "הצהרת נגישות")}
                {link("/privacy-policy", <FaFileContract />, "מדיניות פרטיות")}
              </div>
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
