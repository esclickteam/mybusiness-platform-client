import React, { useState } from "react";
import "../styles/ForgotPassword.css";
import API from "../api";

const ForgotPassword = ({ closePopup }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendReset = async () => {
    if (!email) {
      setMessage("נא להזין כתובת אימייל");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await API.post("/api/auth/forgot-password", { email });
      setMessage("✅ קישור איפוס נשלח לאימייל שלך!");
    } catch (error) {
      console.error("❌ שגיאה בשליחת קוד איפוס:", error);
      setMessage(
        error.response?.data?.error || "❌ שגיאה בלתי צפויה. נסה שוב."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-overlay">
      <div className="forgot-password-modal">
        <h2>שחזור סיסמה</h2>
        <p>הזן את כתובת האימייל שלך ונשלח לך קישור לאיפוס הסיסמה</p>
        <input
          type="email"
          placeholder="הזן אימייל"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleSendReset}
          className="send-button"
          disabled={loading}
        >
          {loading ? "🔄 שולח..." : "שלח קישור איפוס"}
        </button>
        {message && <p className="message">{message}</p>}
        <button onClick={closePopup} className="close-button">
          סגור
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
