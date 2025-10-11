import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../images/logo_final.svg";
import { FaBars, FaChevronLeft } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import FacebookStyleNotifications from "../components/FacebookStyleNotifications";
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
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  if (loading) return null;

  const isDashboard =
    location.pathname.includes("/dashboard") ||
    location.pathname.includes("/business/");

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("❌ Logout failed:", err);
    }
    setMenuOpen(false);
  };

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

  return (
    <>
      {/* ========================
         📊 DASHBOARD HEADER
      ======================== */}
      {isDashboard ? (
        <header className="dashboard-topbar">
          <div className="dashboard-left">
            {/* 🔹 לוגו ליד הסיידבר */}
            <img src={logo} alt="Bizuply Logo" className="dashboard-logo" />

            {/* 🔹 פעמון ההתראות ליד הלוגו */}
            {user?.businessId && <FacebookStyleNotifications />}
          </div>
        </header>
      ) : (
        /* ========================
           🌐 REGULAR HEADER
        ======================== */
        <nav className="app-header">
          <div className="logo-wrapper">
            <Link to="/" className="logo-link">
              <img src={logo} alt="Logo" className="logo" />
            </Link>

            {user?.businessId && <FacebookStyleNotifications />}
          </div>

          <div className="nav-links desktop-only">
            {navLinks.map((item) => link(item.to, item.label))}
          </div>

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

          <div className="menu-toggle mobile-only">
            <button
              className="menu-button"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <FaChevronLeft size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </nav>
      )}

      {/* ========================
         📱 Mobile Drawer
      ======================== */}
      {menuOpen && !isDashboard && (
        <>
          <div className="menu-backdrop" onClick={() => setMenuOpen(false)} />
          <div className="side-menu open">
            <div className="drawer-header">
              <button
                className="back-button"
                onClick={() => setMenuOpen(false)}
              >
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
