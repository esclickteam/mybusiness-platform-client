import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import { FaBars, FaChevronLeft } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "../styles/Header.css";

// Shared links
const navLinks = [
  { to: "/how-it-works", label: "How It Works" },
  { to: "/pricing", label: "Pricing" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const { user, logout, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

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
    } catch (err) {
      console.error("❌ Logout failed:", err);
    }
    setMenuOpen(false);
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

        {/* Desktop nav */}
        <div className="nav-links desktop-only">
          {navLinks.map((item) => link(item.to, item.label))}
        </div>

        {/* Desktop actions */}
        <div className="auth-controls desktop-only">
          {!user ? (
            <>
              <Link to="/login" className="login-link">
                Login
              </Link>
              <Link to="/register" className="cta-button">
                Try it Free
              </Link>
            </>
          ) : (
            <>
              <button
                className="personal-area-button"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </button>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="menu-toggle mobile-only">
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaChevronLeft size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
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
              {!user ? (
                <div className="mobile-auth">
                  <Link
                    to="/login"
                    className="login-button"
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
                </div>
              ) : (
                <div className="auth-menu">
                  <button
                    className="personal-area-button"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/dashboard");
                    }}
                  >
                    Dashboard
                  </button>
                  <button className="logout-button" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}

              {/* Nav links */}
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
