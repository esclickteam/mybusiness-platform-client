import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css"; // או עיצוב מותאם אישית
import { useNavigate } from "react-router-dom";

export default function StaffLogin() {
  const { login, error } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      return;
    }
    setLoading(true);
    try {
      await login(identifier.trim(), password);
      navigate("/staff-dashboard"); // ניווט לאחר התחברות לעובדים
    } catch (_) {
      // error מטופל ומוצג אוטומטית מהקונטקסט
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>כניסת עובדים</h2>
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
      </div>
    </div>
  );
}
