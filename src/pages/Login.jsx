import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";
import ForgotPassword from "./ForgotPassword";
import { Link, useNavigate } from "react-router-dom"; // Importing useNavigate for redirection

export default function Login() {
  const { login, error } = useAuth(); // Assuming 'user' contains the logged-in user info
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const navigate = useNavigate(); // To handle redirection

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

  const handleStaffLogin = () => {
    // פנה לדף לוגין נפרד לעובדים
    navigate('/staff-login'); // הפניית המשתמש לדף נפרד של לוגין לעובדים
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

          {/* קישור לדף הרשמה */}
          <div className="signup-link">
            <span>לא רשום? <Link to="/register" className="signup-link-text">הירשם עכשיו</Link></span>
          </div>

          {/* כפתור כניסת עובדים */}
          <div className="staff-login-link">
            <button
              onClick={handleStaffLogin} // הפניה לדף לוגין לעובדים
              className="staff-login-btn"
            >
              כניסת עובדים
            </button>
          </div>
        </div>
      </div>

      {showForgot && <ForgotPassword closePopup={() => setShowForgot(false)} />}
    </div>
  );
}
