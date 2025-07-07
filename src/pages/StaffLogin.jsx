// src/pages/StaffLogin.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";     // ← משתמשים ב־AuthContext
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";

export default function StaffLogin() {
  const { staffLogin } = useAuth();                  // ← הפונקציה החדשה ל־staff-login ב־context
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [staffError, setStaffError] = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStaffError("");

    if (!username.trim() || !password) {
      setStaffError("יש למלא שם משתמש וסיסמה");
      return;
    }
    if (username.includes("@")) {
      setStaffError("נא להזין שם משתמש בלבד");
      return;
    }

    setLoading(true);
    try {
      // ← קוראים לפונקציה שב־AuthContext שתבצע את הקריאה ל־/auth/staff-login, תשמור טוקן, ותעדכן את user ב־context
      const user = await staffLogin(username.trim(), password);

      // ניווט לפי תפקיד
      switch (user.role) {
        case "worker":
          navigate("/staff/dashboard", { replace: true });
          break;
        case "manager":
        case "מנהל":
          navigate("/manager/dashboard", { replace: true });
          break;
        case "admin":
          navigate("/admin/dashboard", { replace: true });
          break;
        default:
          setStaffError("אין לך הרשאה להתחבר כעובד");
      }
    } catch (err) {
      console.error("Staff login failed:", err);
      setStaffError(err.response?.data?.error || "שם משתמש או סיסמה שגויים");
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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
          style={{cursor: "pointer"}}
        >
          שכחת את הסיסמה?
        </span>
      </div>
    </div>
  );
}
