import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import {
  FaBars,
  FaChevronLeft,
  FaUserCircle,
  FaSignOutAlt,
  FaTachometerAlt,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationsContext";
import "../styles/Header.css";
import Notifications from "./Notifications";

// 🔗 Shared links (Footer + Hamburger)
const navLinks = [
  {
    title: "Company",
    items: [
      { to: "/how-it-works", label: "How It Works" },
      { to: "/business", label: "Join as a Business" },
    ],
  },
  {
    title: "Support",
    items: [
      { to: "/faq", label: "FAQ" },
      { to: "/terms", label: "Terms" },
      { to: "/privacy-policy", label: "Privacy Policy" },
      { to: "/accessibility", label: "Accessibility" },
      { to: "/contact", label: "Contact" },
    ],
  },
];

export default function Header() {
  const { user, logout, loading } = useAuth();
  const { clearAll, clearRead, unreadCount } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
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

  const link = (to, label) => (
    <Link
      key={to}
      to={to}
      onClick={() => {
        setMenuOpen(false);
        setDashboardOpen(false);
      }}
      className={location.pathname === to ? "active-link" : ""}
    >
      {label}
    </Link>
  );

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("❌ Logout failed:", err);
    }
    setMenuOpen(false);
    setDashboardOpen(false);
  };

  return (
    <>
      <nav className="app-header">
        {/* Mobile dashboard button */}
        {user?.role === "business" && (
          <button
            className="mobile-dashboard-button mobile-only"
            onClick={() => setDashboardOpen(!dashboardOpen)}
          >
            {dashboardOpen ? (
              <>
                <FaChevronLeft size={18} style={{ marginRight: 6 }} />
                <span>Close</span>
              </>
            ) : (
              <>
                <FaTachometerAlt size={18} style={{ marginRight: 6 }} />
                <span>Dashboard</span>
              </>
            )}
          </button>
        )}

        <div className="logo-wrapper">
          <Link to="/" className="logo-link">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
        </div>

        {/* Hamburger only on mobile */}
        <div className="menu-toggle mobile-only">
          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaChevronLeft size={24} /> : <FaBars size={24} />}
          </button>

          {user?.role === "business" && (
            <>
              <button
                className="notification-button"
                onClick={() => setNotifOpen(!notifOpen)}
              >
                🔔
                {unreadCount > 0 && (
                  <span>{unreadCount > 99 ? "99+" : unreadCount}</span>
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

        {/* Desktop auth controls */}
        <div className="auth-controls desktop-only">
          {!user ? (
            <Link to="/login" className="login-button">
              Login
            </Link>
          ) : (
            <>
              <button
                className="personal-area-button"
                onClick={() => navigate(getDashboardPath())}
              >
                Dashboard
              </button>
              <button className="logout-button" onClick={handleLogout}>
                <FaSignOutAlt style={{ marginLeft: 6 }} />
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hamburger menu for mobile */}
      {menuOpen && (
        <>
          <div className="menu-backdrop" onClick={() => setMenuOpen(false)} />
          <div className="side-menu open">
            <div className="drawer-header">
              <button
                className="back-button"
                onClick={() => setMenuOpen(false)}
              >
                <FaChevronLeft size={20} />
                <span>Back</span>
              </button>
            </div>

            <div className="menu-scroll">
              {/* Show login at the top if user is not logged in */}
              {!user && (
                <div className="mobile-auth">
                  <Link
                    to="/login"
                    className="login-button"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                </div>
              )}

              {/* Sections (Company + Support) */}
              {navLinks.map((section) => (
                <div key={section.title} className="menu-section">
                  <h4>{section.title}</h4>
                  {section.items.map((item) => link(item.to, item.label))}
                </div>
              ))}
            </div>

            {/* If logged in → personal area + logout */}
            {user && (
              <div className="auth-menu">
                <button
                  className="personal-area-button"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate(getDashboardPath());
                  }}
                >
                  Personal Area
                </button>
                <button className="logout-button" onClick={handleLogout}>
                  <FaSignOutAlt style={{ marginLeft: 6 }} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
