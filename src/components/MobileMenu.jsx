import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaTimes, FaChevronRight, FaSearch } from "react-icons/fa";
import logo from "../images/logo_final.svg";
import "./MobileMenu.css";

const navLinks = [
  { to: "/features", label: "Features" },
  { to: "/solutions", label: "Solutions" },
  { to: "/how-it-works", label: "How it Works" },
  { to: "/plans", label: "Plans" },
  { to: "/about", label: "About" },
];

export default function MobileMenu({ open, onClose, user, onLogout }) {
  const location = useLocation();

  // 🔒 נועל גלילה כשפתוח
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  if (!open) return null;

  return (
    <div className="mobile-menu">
      {/* Header */}
      <div className="mobile-menu-header">
        <img src={logo} alt="BizUply" />
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>
      </div>

      {/* Search */}
      <div className="menu-search-wrapper">
        <FaSearch className="search-icon" />
        <input placeholder="Search BizUply" />
      </div>

      {/* Navigation */}
      <nav className="menu-nav">
        {navLinks.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={
              location.pathname === item.to ? "active" : ""
            }
          >
            <span>{item.label}</span>
            <FaChevronRight />
          </Link>
        ))}
      </nav>

      {/* CTAs */}
      <div className="menu-ctas">
        {!user ? (
          <>
            <Link to="/register" className="cta-primary" onClick={onClose}>
              Try it Free
            </Link>
            <Link to="/login" className="cta-secondary" onClick={onClose}>
              Log in
            </Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className="cta-primary" onClick={onClose}>
              My Account
            </Link>
            <button className="cta-secondary logout" onClick={onLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
