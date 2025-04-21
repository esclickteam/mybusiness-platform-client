// src/components/Header.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import { FaBars, FaUser, FaSearch } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "../styles/Header.css";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    console.log("🔒 handleLogout fired");
    try {
      await logout();
      console.log("✅ logout() finished");
      navigate("/login");
    } catch (err) {
      console.error("❌ logout failed:", err);
    }
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#d1b3ff",
        padding: "10px 20px",
        height: "100px",
        position: "relative",
      }}
    >
      {/* תפריט צד */}
      <button
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        <FaBars size={24} />
      </button>

      <Link
        to="/"
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <img
          src={logo}
          alt="Eshet Asakim"
          style={{ height: "120px", objectFit: "contain" }}
        />
      </Link>

      {/* חיפוש והתחברות/התנתקות */}
      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        <Link to="/search" style={{ color: "#000", textDecoration: "none" }}>
          <FaSearch size={24} />
        </Link>

        {user ? (
          <>
            <Link
              to="/profile"
              style={{ color: "#000", textDecoration: "none" }}
            >
              <FaUser size={24} />
            </Link>
            <button
              onClick={handleLogout}
              style={{
                marginLeft: "10px",
                background: "transparent",
                border: "none",
                color: "#000",
                cursor: "pointer",
              }}
            >
              התנתק
            </button>
          </>
        ) : (
          <Link to="/login" style={{ color: "#000", textDecoration: "none" }}>
            <FaUser size={24} />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Header;
