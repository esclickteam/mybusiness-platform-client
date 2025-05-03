// src/pages/StaffLogin.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";

export default function StaffLogin() {
  const { login, logout } = useAuth(); // login מחזירה user, logout למקרה של תפקיד לא מורשה
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [staffError, setStaffError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStaffError("");

    if (!identifier.trim() || !password) {
      setStaffError("יש למלא אימייל וסיסמה");
      return;
    }

    setLoading(true);
    try {
      // קריאה ל-login עם skipRedirect כדי למנוע ניווט אוטומטי
      const user = await login(identifier.trim(), password, { skipRedirect: true });

      // ניווט לדשבורד לפי תפקיד, או טיפול במי שלא מורשה
      switch (user.role) {
        case "worker":
          navigate("/staff/dashboard", { replace: true });
          break;
        case "manager":
          navigate("/manager/dashboard", { replace: true });
          break;
        case "admin":
          navigate("/admin/dashboard", { replace: true });
          break;
        default:
          // התפקיד לא מורשה בדף זה → מתנתקים ומציגים שגיאה
          await logout();
          setStaffError("אין לך הרשאה להיכנס כדף עובדים");
      }
    } catch (err) {
      console.error("Staff login failed:", err);
      setStaffError("אימייל או סיסמה שגויים");
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
