// StaffLogin.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css"; // או כל עיצוב אחר שתבחר
import { useNavigate } from "react-router-dom";

const StaffLogin = () => {
  const { login, error } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [staffError, setStaffError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      return;
    }
    setLoading(true);
    try {
      await login(identifier.trim(), password);
      // הניווט יקרה לפי התפקיד
      if (user.role === "worker") {
        navigate("/staff/dashboard");
      } else if (user.role === "manager") {
        navigate("/manager/dashboard");
      } else if (user.role === "admin") {
        navigate("/admin/dashboard");
      }
    } catch (_) {
      setStaffError("המשתמש לא נמצא או שהתפקיד לא תואם.");
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
        {staffError && <p className="error-message">{staffError}</p>}

        <div className="login-extra-options">
          <span className="forgot-password">שכחת את הסיסמה?</span>
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;
