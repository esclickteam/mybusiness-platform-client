import React, { useState } from "react";
import "../styles/ForgotPassword.css";

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
    try {
      // TODO: כאן תוכל להוסיף קריאה ל-API אמיתי
      console.log("שולח קוד איפוס ל:", email);
      setTimeout(() => {
        setMessage("✅ קוד איפוס נשלח לאימייל שלך!");
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("❌ שגיאה בשליחת קוד איפוס:", error);
      setMessage("❌ אירעה שגיאה. נסה שוב.");
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-overlay">
      <div className="forgot-password-modal">
        <h2>שחזור סיסמה</h2>
        <p>הזן את כתובת האימייל שלך ונשלח לך קוד לאיפוס הסיסמה</p>
        <input
          type="email"
          placeholder="הזן אימייל"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleSendReset} className="send-button" disabled={loading}>
          {loading ? "שולח..." : "שלח קוד איפוס"}
        </button>
        {message && <p className="message">{message}</p>}
        <button onClick={closePopup} className="close-button">סגור</button>
      </div>
    </div>
  );
};

export default ForgotPassword;
