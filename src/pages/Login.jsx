// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
-import { useAuth } from "../context/AuthContext";
+import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";
import ForgotPassword from "./ForgotPassword";

export default function Login() {
-  const { login } = useAuth();
+  // ✅ עכשיו שולפים גם את logout כדי לנקות קודם את ה-cookie מהשרת
+  const { login, logout } = useAuth();

  const [identifier, setIdentifier] = useState(""); // אימייל או שם משתמש
  const [password, setPassword] = useState("");
  const [isEmployeeLogin, setIsEmployeeLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);

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

+   // ✅ 1. קוראים קודם ל־logout כדי שהשרת ייגרום ל-clearCookie("token")
+   //    וכשהוא מסיים – אין cookie ישן יותר שיפליא אותנו role=business
+   try {
+     await logout();
+   } catch {
+     // אפילו אם נכשל, ממשיכ/ה ל-login
+   }

    try {
      // מבצעים את הקריאה ל־login ב־AuthContext
      const user = await login(identifier.trim(), password);

      // ניתוב לפי role
      switch (user.role) {
        case "business":
          // דשבורד בעלי עסקים מוגדר ב־App כב-/dashboard/*
          navigate("/dashboard", { replace: true });
          break;
        case "customer":
          navigate("/client/dashboard", { replace: true });
          break;
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
          navigate("/", { replace: true });
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
        <h2>{isEmployeeLogin ? "כניסת צוות" : "התחברות"}</h2>
        <form onSubmit={handleSubmit}>
          {isEmployeeLogin ? (
            <input
              type="text"
              placeholder="שם משתמש"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          ) : (
            <input
              type="text"
              placeholder="אימייל או שם משתמש"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          )}

          <input
            type="password"
            placeholder="סיסמה"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "🔄 מתחבר..." : "התחבר"}
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}

        <div className="login-extra-options">
          {isEmployeeLogin ? (
            <button
              type="button"
              className="staff-login-link"
              onClick={() => {
                setIsEmployeeLogin(false);
                setError("");
              }}
            >
              🔙 חזרה להתחברות רגילה
            </button>
          ) : (
            <button
              type="button"
              className="staff-login-link"
              onClick={() => {
                setIsEmployeeLogin(true);
                setError("");
              }}
            >
              👥 כניסת צוות
            </button>
          )}

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

      {showForgot && <ForgotPassword closePopup={() => setShowForgot(false)} />}
    </div>
  );
}
