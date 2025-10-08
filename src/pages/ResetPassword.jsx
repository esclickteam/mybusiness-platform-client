// src/pages/ResetPassword.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../api";
import "../styles/ForgotPassword.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      setError("קישור לא תקין לאיפוס סיסמה");
    }
  }, [token, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!password || !confirmPassword) {
      setError("יש למלא את כל השדות");
      return;
    }
    if (password !== confirmPassword) {
      setError("הסיסמאות אינן תואמות");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/reset-password", {
        email,
        token,
        newPassword: password,
      });
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("❌ שגיאה באיפוס סיסמה:", err);
      setError(err.response?.data?.message || "שגיאה בשרת");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-overlay">
      <div className="forgot-password-modal">
        <h2>איפוס סיסמה</h2>
        {error && <p className="error-message">{error}</p>}
        {message ? (
          <p className="success-message">{message}</p>
        ) : (
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
            <button className="send-button" type="submit" disabled={loading || error}>
              {loading ? "🔄 שומר..." : "אפס סיסמה"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
