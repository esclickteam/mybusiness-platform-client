import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import {
  FaBars,
  FaChevronLeft,
  FaHome,
  FaInfoCircle,
  FaPhone,
  FaQuestionCircle,
  FaFileContract,
  FaCogs,
  FaUserPlus,
  FaListUl,
  FaTags,
  FaSearch,
  FaSignOutAlt,
  FaUserCircle,
  FaHeadset
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "../styles/Header.css";

export default function Header() {
  const { user, logout, loading } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();

  // סטייט התראות - דמו
  const [notifications, setNotifications] = useState([
    { id: 1, type: "message", text: "💬 התקבלה הודעה חדשה", read: false },
    { id: 2, type: "collaboration", text: "🤝 שיתוף פעולה חדש", read: false },
    { id: 3, type: "meeting", text: "📅 פגישה חדשה", read: false },
    { id: 4, type: "review", text: "⭐ ביקורת חדשה", read: true }
  ]);

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

  const handleNotificationClick = (type, id) => {
    // סימון התראה כנקראה
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

    // ניווט לפי סוג
    switch (type) {
      case "message":
        navigate("/messages");
        break;
      case "collaboration":
        navigate("/collaborations");
        break;
      case "meeting":
        navigate("/meetings");
        break;
      case "review":
        navigate("/reviews");
        break;
      default:
        break;
    }

    setNotifOpen(false);
  };

  return (
    <>
      {/* ===== HEADER BAR ===== */}
      <nav className="app-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* המבורגר + פעמון התראות */}
        <div className="menu-toggle" style={{ display: "flex", alignItems: "center", gap: "8px", position: "relative", right: 20 }}>
          {!menuOpen && (
            <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="תפריט ראשי">
              <FaBars size={24} />
            </button>
          )}

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
              justifyContent: "center"
            }}
          >
            🔔
            {notifications.some((n) => !n.read) && (
              <span
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  backgroundColor: "red",
                  color: "white",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  userSelect: "none",
                  minWidth: 18,
                  textAlign: "center",
                  lineHeight: 1,
                }}
              >
                {notifications.filter((n) => !n.read).length}
              </span>
            )}
          </button>

          {notifOpen && (
            <div
              style={{
                position: "absolute",
                top: "36px",
                left: 0,
                width: 320,
                maxHeight: 400,
                overflowY: "auto",
                backgroundColor: "white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                borderRadius: 8,
                zIndex: 1000,
              }}
            >
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif.type, notif.id)}
                  style={{
                    padding: "10px 15px",
                    borderBottom: "1px solid #eee",
                    fontWeight: notif.read ? "normal" : "700",
                    backgroundColor: notif.read ? "white" : "#e8f4ff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span>{notif.text}</span>
                </div>
              ))}
            </div>
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

            {/* כפתור התחברות במובייל */}
            {!user && (
              <div className="mobile-auth">
                <Link to="/login" className="login-button" onClick={() => setMenuOpen(false)}>
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
                {link("/business-support", <FaHeadset />, "תמיכה לעסק")}
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
                {link("/terms", <FaFileContract />, "תנאי שימוש")}
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
