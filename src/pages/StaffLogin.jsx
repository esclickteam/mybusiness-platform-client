// src/pages/StaffLogin.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; // ← Using AuthContext
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";

export default function StaffLogin() {
  const { staffLogin } = useAuth(); // ← staff-login function from context
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [staffError, setStaffError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStaffError("");

    if (!username.trim() || !password) {
      setStaffError("Please enter both username and password.");
      return;
    }
    if (username.includes("@")) {
      setStaffError("Please enter a username only, not an email address.");
      return;
    }

    setLoading(true);
    try {
      // Call the staffLogin function from AuthContext
      const user = await staffLogin(username.trim(), password);

      // Navigate by role
      switch (user.role) {
        case "worker":
          navigate("/staff/dashboard", { replace: true });
          break;
        case "manager":
          navigate("/manager/dashboard", { replace: true });
          break;
        case "admin":
          navigate("/admin/dashboard", { replace: true });
          break;
        default:
          setStaffError("You don’t have permission to log in as staff.");
      }
    } catch (err) {
      console.error("Staff login failed:", err);
      setStaffError(
        err.response?.data?.error || "Incorrect username or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Staff Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "🔄 Logging in..." : "Log In"}
          </button>
        </form>

        {staffError && <p className="error-message">{staffError}</p>}

        <span
          className="forgot-password"
          onClick={() => navigate("/forgot-password")}
          style={{ cursor: "pointer" }}
        >
          Forgot password?
        </span>
      </div>
    </div>
  );
}
