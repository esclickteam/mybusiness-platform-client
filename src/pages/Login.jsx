// src/pages/Login.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";
import ForgotPassword from "./ForgotPassword";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth(); // רק פונקציית ה-login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    if (!email.trim() || !password) {
      setLoginError("יש למלא אימייל וסיסמה");
      return;
    }

    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      // קוראים ל-login עם skipRedirect כדי שהניווט ייעשה רק כאן
      const userData = await login(cleanEmail, password, { skipRedirect: true });

      console.log("🔥 login returned:", userData);
      const role = (userData.role || "").toLowerCase();
      console.log("🔥 role:", role, "businessId:", userData.businessId);

      switch (role) {
        case "business":
          console.log("➡️ navigating to business dashboard");
          navigate(`/business/${userData.businessId}/dashboard`, { replace: true });
          break;
        case "customer":
          console.log("➡️ navigating to client dashboard");
          navigate("/client/dashboard", { replace: true });
          break;
        case "worker":
          console.log("➡️ navigating to staff dashboard");
          navigate("/staff/dashboard", { replace: true });
          break;
        case "manager":
          console.log("➡️ navigating to manager dashboard");
          navigate("/manager/dashboard", { replace: true });
          break;
        case "admin":
          console.log("➡️ navigating to admin dashboard");
          navigate("/admin/dashboard", { replace: true });
          break;
        default:
          console.warn("⚠️ unknown role, falling back to home");
          setLoginError("אין לך הרשאה להתחבר כאן");
      }
    } catch (err) {
      console.error("Login failed:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setLoginError("אימייל/שם משתמש או סיסמה שגויים");
      } else {
        setLoginError("שגיאה בשרת, נסה שוב מאוחר יותר");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>התחברות</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="אימייל"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
          <input
            type="password"
            placeholder="סיסמה"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "🔄 מתחבר..." : "התחבר"}
          </button>
        </form>

        {loginError && <p className="error-message">{loginError}</p>}

        <div className="login-extra-options">
          <span
            className="forgot-password"
            onClick={() => setShowForgot(true)}
          >
            שכחת את הסיסמה?
          </span>
          <p className="signup-link">
            לא רשום?{" "}
            <Link to="/register" className="signup-link-text">
              הירשם עכשיו
            </Link>
          </p>
          <button
            className="staff-login-btn"
            onClick={() => navigate("/staff-login")}
            disabled={loading}
          >
            כניסת עובדים
          </button>
        </div>
      </div>

      {showForgot && <ForgotPassword closePopup={() => setShowForgot(false)} />}
    </div>
  );
}
