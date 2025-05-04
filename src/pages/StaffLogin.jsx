// src/pages/StaffLogin.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";

export default function StaffLogin() {
  const { login, logout } = useAuth();     // login מחזירה את אובייקט ה-user
  const [identifier, setIdentifier] = useState(""); // כאן תמיד יהיה שם-משתמש
  const [password, setPassword] = useState("");
  const [staffError, setStaffError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStaffError("");

    // וידוא שכל השדות מולאו
    if (!identifier.trim() || !password) {
      setStaffError("יש למלא שם משתמש וסיסמה");
      return;
    }

    // וידוא שלא הוכנס אימייל
    if (identifier.includes("@")) {
      setStaffError("נא להזין שם משתמש בלבד");
      return;
    }

    setLoading(true);
    try {
      // עובדים משתמשים בשם-משתמש בדיוק כמו שהוקלד (case-sensitive)
      const user = await login(identifier.trim(), password, { skipRedirect: true });

      // ניווט לפי תפקיד staff
      if (user.role === "worker") {
        navigate("/staff/dashboard", { replace: true });
      } else if (user.role === "manager") {
        navigate("/manager/dashboard", { replace: true });
      } else if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        // תפקיד לא מורשה
        setStaffError("אין לך הרשאה להתחבר כעובד");
        await logout();
      }
    } catch (err) {
      console.error("Staff login failed:", err);
      setStaffError("שם משתמש או סיסמה שגויים");
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
            placeholder="שם משתמש"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            disabled={loading}
            required
          />
          <input
            type="password"
            placeholder="סיסמה"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "🔄 מתחבר..." : "התחבר"}
          </button>
        </form>

        {staffError && <p className="error-message">{staffError}</p>}

        <span
          className="forgot-password"
          onClick={() => navigate("/forgot-password")}
        >
          שכחת את הסיסמה?
        </span>
      </div>
    </div>
  );
}
