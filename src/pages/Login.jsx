import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";
import ForgotPassword from "./ForgotPassword";

export default function Login() {
  const { login, logout, user } = useAuth(); // כולל user מה־Context
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // בדיקת שדות ריקים
    if (!identifier.trim() || !password) {
      setError("נא למלא את כל השדות");
      setLoading(false);
      return;
    }

    // פעולה ראשונית: ניקוי session/עוגיות ישן כדי למנוע role mismatch
    try {
      await logout();
    } catch (err) {
      console.warn("logout failed:", err);
    }

    // ניסיון התחברות חדש
    try {
      const loggedInUser = await login(identifier.trim(), password);

      // כאן הניווט יקרה רק אחרי שהמשתמש התחבר
      switch (loggedInUser.role) {
        case "business":
          navigate(`/business/${loggedInUser.businessId}/dashboard`, { replace: true });
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
          navigate("/dashboard", { replace: true }); // ניווט לדשבורד כללי
          break;
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

  useEffect(() => {
    // אם המשתמש כבר מחובר, נוודא שהוא לא יגיע לדף הבית
    if (user) {
      switch (user.role) {
        case "business":
          navigate(`/business/${user.businessId}/dashboard`, { replace: true });
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
          navigate("/dashboard", { replace: true });
          break;
      }
    }
  }, [user, navigate]); // אם הסטייט של המשתמש משתנה, נוודא שהניווט יקרה אוטומטית

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>התחברות</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="אימייל או שם משתמש"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
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
          <span
            className="forgot-password"
            onClick={() => setShowForgot(true)}
          >
            שכחת את הסיסמה?
          </span>
        </div>
      </div>

      {showForgot && <ForgotPassword closePopup={() => setShowForgot(false)} />}
    </div>
  );
}
