import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const StaffLogin = () => {
  const { login, error, user } = useAuth(); // משתמשים ב־useAuth כדי לדעת את נתוני המשתמש
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [staffError, setStaffError] = useState(""); // מצב שגיאה
  const navigate = useNavigate();

  // פונקציה לטיפול בכניסת עובדים
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!identifier.trim() || !password) {
      return;
    }

    setLoading(true);
    try {
      await login(identifier.trim(), password); // התחברות למערכת

      // אם המשתמש הוא עובד, מנהל או אדמין, נוודא אותו לדף המתאים
      if (user.role === "worker") {
        navigate("/staff/dashboard");
      } else if (user.role === "manager") {
        navigate("/manager/dashboard");
      } else if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        // אם המשתמש הוא לקוח או בעל עסק, הצג הודעת שגיאה
        setStaffError("הגישה לעובדים מוגבלת רק לעובדים, מנהלים ואדמינים.");
      }
    } catch (err) {
      // אם יש שגיאה במערכת התחברות
      setStaffError("שגיאה בהתחברות, אנא נסה שוב.");
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

        {staffError && <p className="error-message">{staffError}</p>} {/* הצגת שגיאה אם יש */}

        {/* קישורים לדפים נוספים */}
        <div className="login-extra-options">
          <span className="forgot-password" onClick={() => setShowForgot(true)}>
            שכחת את הסיסמה?
          </span>

          <div className="signup-link">
            <span>לא רשום? <Link to="/register" className="signup-link-text">הירשם עכשיו</Link></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;
