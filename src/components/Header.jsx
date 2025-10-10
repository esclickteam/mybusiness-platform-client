import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../images/logo_final.svg";
import { FaBars, FaChevronLeft, FaBell } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationsContext"; // ✅ חיבור אמיתי
import "../styles/Header.css";

const navLinks = [
  { to: "/features", label: "Features" },
  { to: "/solutions", label: "Solutions" },
  { to: "/pricing", label: "Pricing" },
  { to: "/resources", label: "Resources" },
  { to: "/about", label: "About" },
];

export default function Header() {
  const { user, logout, loading } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  if (loading) return null;

  const link = (to, label) => (
    <Link
      key={to}
      to={to}
      onClick={() => setMenuOpen(false)}
      className={location.pathname === to ? "active-link" : ""}
    >
      {label}
    </Link>
  );

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("❌ Logout failed:", err);
    }
    setMenuOpen(false);
  };

  const handleNotificationClick = (notif) => {
    markAsRead(notif.id);
    if (notif.targetUrl) navigate(notif.targetUrl);
    setShowNotifications(false);
  };

  return (
    <>
      <nav className="app-header">
        {/* Logo */}
        <div className="logo-wrapper">
          <Link to="/" className="logo-link">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
        </div>

        {/* Desktop navigation */}
        <div className="nav-links desktop-only">
          {navLinks.map((item) => link(item.to, item.label))}
        </div>

        {/* Desktop actions */}
        <div className="auth-controls desktop-only">
          {!user ? (
            <>
              <Link to="/login" className="auth-link">
                Login
              </Link>
              <Link to="/register" className="cta-button">
                Try it Free
              </Link>
            </>
          ) : (
            <>
              {/* 🔔 Notification Bell */}
              <div
                className="notification-bell"
                onClick={() => setShowNotifications(!showNotifications)}
                title="Notifications"
              >
                <FaBell size={18} />
                {unreadCount > 0 && <span className="notification-dot" />}
              </div>

              <span className="hello-user">Hello, {user.name}</span>
              <Link to="/dashboard" className="auth-link">
                My Account
              </Link>
              <button onClick={handleLogout} className="auth-link logout">
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile hamburger menu */}
        <div className="menu-toggle mobile-only">
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaChevronLeft size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </nav>

      {/* 🔔 Notifications dropdown */}
      {showNotifications && user && (
        <div className="notifications-dropdown">
          <p className="notif-header">Notifications</p>

          {notifications.length === 0 ? (
            <div className="notif-item empty">No new notifications 🎉</div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`notif-item ${notif.read ? "read" : "unread"}`}
                onClick={() => handleNotificationClick(notif)}
              >
                <p>{notif.text}</p>
                <small>
                  {new Date(notif.timestamp).toLocaleString("en-US", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </small>
              </div>
            ))
          )}
        </div>
      )}

      {/* Mobile side drawer */}
      {menuOpen && (
        <>
          <div className="menu-backdrop" onClick={() => setMenuOpen(false)} />
          <div className="side-menu open">
            <div className="drawer-header">
              <button className="back-button" onClick={() => setMenuOpen(false)}>
                <FaChevronLeft size={18} />
                <span>Back</span>
              </button>
            </div>

            <div className="menu-scroll">
              <div className="mobile-auth">
                {!user ? (
                  <>
                    <Link
                      to="/login"
                      className="auth-link full-width"
                      onClick={() => setMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="cta-button full-width"
                      onClick={() => setMenuOpen(false)}
                    >
                      Try it Free
                    </Link>
                  </>
                ) : (
                  <>
                    <span className="hello-user">Hello, {user.name}</span>
                    <Link
                      to="/dashboard"
                      className="auth-link full-width"
                      onClick={() => setMenuOpen(false)}
                    >
                      My Account
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="auth-link logout full-width"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>

              <div className="menu-section">
                {navLinks.map((item) => link(item.to, item.label))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
