import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../images/logo_final.svg";
import { FaUser } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "../styles/Header.css";
import MobileMenu from "./MobileMenu";

const navLinks = [
  { to: "/features", label: "Features" },
  { to: "/solutions", label: "Solutions" },
  { to: "/how-it-works", label: "How it Works" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
];

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // 🚫 בדשבורד לא מציגים Header
  const isDashboard =
    location.pathname.includes("/dashboard") ||
    location.pathname.includes("/business/");

  if (isDashboard) return null;

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("❌ Logout failed:", err);
    } finally {
      setMenuOpen(false);
    }
  };

  return (
    <>
      <nav className="app-header">
        {/* 🔹 Logo */}
        <div className="logo-wrapper">
          <Link to="/" className="logo-link">
            <img src={logo} alt="Bizuply Logo" className="logo" />
          </Link>
        </div>

        {/* 🔹 Navigation (Desktop) */}
        <div className="nav-links desktop-only">
          {navLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={location.pathname === item.to ? "active-link" : ""}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* 🔹 Auth controls (Desktop) */}
        <div className="auth-controls desktop-only">
          {!user ? (
            <>
              <Link to="/login" className="login-link">
                <FaUser className="login-icon" />
                Login
              </Link>

              <Link to="/register" className="cta-button">
                Try it Free
              </Link>
            </>
          ) : (
            <>
              <span className="hello-user">Hello, {user.name}</span>

              <Link to="/dashboard" className="login-link">
                My Account
              </Link>

              <button onClick={handleLogout} className="login-link logout">
                Logout
              </button>
            </>
          )}
        </div>

        {/* ✅ Mobile right actions */}
        <div className="header-actions mobile-only">
          {/* Try it free only when NOT logged-in */}
          {!user && (
            <Link to="/register" className="mobile-try-free">
              Try it Free
            </Link>
          )}

          {/* When logged-in on mobile: show a small Logout (optional, if you want) */}
          {user && (
            <button
              type="button"
              className="mobile-logout"
              onClick={handleLogout}
              aria-label="Logout"
              title="Logout"
            >
              Logout
            </button>
          )}

          {/* Hamburger */}
          <button
            className="menu-button mobile-only"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            type="button"
          >
            <span className="hamb-line" />
            <span className="hamb-line" />
            <span className="hamb-line" />
          </button>
        </div>
      </nav>

      {/* 🔹 Mobile Menu */}
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        user={user}
        onLogout={handleLogout}
      />
    </>
  );
}
