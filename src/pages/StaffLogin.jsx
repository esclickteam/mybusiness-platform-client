import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";

export default function StaffLogin() {
  const { login, logout } = useAuth();     // login מחזירה את אובייקט ה-user
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

      // תפקידים מורשים לדף עובדים
      if (user.role === "worker") {
        navigate("/staff/dashboard", { replace: true });
      } else if (user.role === "manager") {
        navigate("/manager/dashboard", { replace: true });
      } else if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        // כל תפקיד אחר (business/customer וכו') → מתנתקים ומציגים שגיאה
        setStaffError("אין לך הרשאה להתחבר כעובד");
        await logout();
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
