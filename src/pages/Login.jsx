import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";
import ForgotPassword from "./ForgotPassword";

export default function Login() {
  const { login, error } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      return;
    }
    setLoading(true);
    try {
      await login(identifier.trim(), password);
      // הניווט נעשה בתוך login()
    } catch (_) {
      // error מטופל ומוצג אוטומטית מהקונטקסט
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

          {/* קישור להרשמה */}
          <div className="signup-link">
            <span>לא רשום? <a href="/register" className="signup-link-text">הירשם עכשיו</a></span>
          </div>
        </div>
      </div>

      {showForgot && <ForgotPassword closePopup={() => setShowForgot(false)} />}
    </div>
  );
}
