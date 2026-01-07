import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import logo from "../images/logo_final.svg";
import { useAuth } from "../context/AuthContext";

import MobileMenu from "./MobileMenu";
import "../styles/Header.css";

const navLinks = [
  { to: "/features", label: "Features" },
  { to: "/solutions", label: "Solutions" },
  { to: "/how-it-works", label: "How it Works" },
  { to: "/plans", label: "Plans" },
  { to: "/about", label: "About" },
];

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // ❌ לא מציגים Header בדשבורד
  const isDashboard =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/business");

  if (isDashboard) return null;

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setMenuOpen(false);
    }
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <nav className="app-header">
        {/* 🔹 Logo (Centered on Mobile) */}
        <div className="logo-wrapper">
          <Link to="/" className="logo-link">
            <img src={logo} alt="BizUply Logo" className="logo" />
          </Link>
        </div>

        {/* 🔹 Desktop Navigation */}
        <div className="nav-links desktop-only">
          {navLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={
                location.pathname === item.to ? "active-link" : ""
              }
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* 🔹 Desktop Auth */}
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

        {/* 🔹 Mobile Hamburger (Right Side) */}
        <button
          className="menu-button mobile-only"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <FaBars size={22} />
        </button>
      </nav>

      {/* ================= MOBILE MENU ================= */}
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        user={user}
        onLogout={handleLogout}
      />
    </>
  );
}
