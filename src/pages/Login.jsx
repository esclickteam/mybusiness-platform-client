// src/pages/auth/Login.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../../styles/Login.css";
import ForgotPassword from "./ForgotPassword";

export default function Login() {
  const [identifier, setIdentifier] = useState(""); // אימייל או שם משתמש
  const [password, setPassword] = useState("");
  const [isEmployeeLogin, setIsEmployeeLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!identifier.trim() || !password) {
      setError("נא למלא את כל השדות");
      setLoading(false);
      return;
    }

    try {
      // שולחים רק את זה ל־login, כל שאר הפלאגינים בצד ה-frontend
      const user = await login(identifier.trim(), password);

      // ניתוב לפי תפקיד
      if (isEmployeeLogin) {
        // צוות (worker / manager / admin)
        if (user.role === "worker") {
          navigate("/staff/dashboard");
        } else if (user.role === "manager") {
          navigate("/manager/dashboard");
        } else if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          setError("אין הרשאה להתחברות כצוות");
        }
      } else {
        // התחברות רגילה (business / customer)
        if (user.role === "business") {
          navigate("/dashboard");        // או "/business/dashboard" לפי ה-route שלך
        } else if (user.role === "customer") {
          navigate("/client");           // או "/customer/dashboard"
        } else {
          setError("אין הרשאה להתחברות רגילה");
        }
      }
    } catch (err) {
      setError(
        err.response?.status === 401
          ? "❌ אימייל/שם משתמש או סיסמה שגויים"
          : "❌ שגיאה בשרת, נסו שוב"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isEmployeeLogin ? "🔐 כניסת צוות" : "🔐 התחברות"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder={isEmployeeLogin ? "שם משתמש" : "אימייל או שם משתמש"}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <input
            type="password"
            placeholder="סיסמה"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" disabled={loading} className="login-button">
            {loading ? "🔄 מתחבר..." : "התחבר"}
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}

        <div className="login-extra-options">
          <button
            className="staff-login-toggle"
            onClick={() => {
              setIsEmployeeLogin((prev) => !prev);
              setError("");
            }}
          >
            {isEmployeeLogin ? "🔙 חזרה להתחברות רגילה" : "👥 כניסת צוות"}
          </button>
          <div className="bottom-links">
            <span
              className="forgot-password"
              onClick={() => setShowForgot(true)}
            >
              שכחת את הסיסמה?
            </span>
            {!isEmployeeLogin && (
              <>
                <span className="separator">|</span>
                <Link to="/register" className="register-link">
                  אין לך חשבון? הירשם עכשיו
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {showForgot && (
        <ForgotPassword closePopup={() => setShowForgot(false)} />
      )}
    </div>
  );
}
