// ✅ src/pages/ResetPassword.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/ForgotPassword.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!password || !confirmPassword) {
      return setMessage("יש למלא את כל השדות");
    }
    if (password !== confirmPassword) {
      return setMessage("הסיסמאות אינן תואמות");
    }

    setLoading(true);
    try {
      const res = await API.put("/auth/reset-password", { newPassword: password });
      setMessage("✅ הסיסמה עודכנה בהצלחה!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("❌ שגיאה בשמירת סיסמה חדשה:", err);
      setMessage("❌ שגיאה בשמירת הסיסמה");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-overlay">
      <div className="forgot-password-modal">
        <h2>שינוי סיסמה</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="סיסמה חדשה"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="אימות סיסמה"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button className="send-button" type="submit" disabled={loading}>
            {loading ? "🔄 שומר..." : "שמור סיסמה חדשה"}
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
