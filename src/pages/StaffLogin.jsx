// src/pages/StaffLogin.jsx
import React, { useState } from "react";
import API from "../api";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";

export default function StaffLogin() {
  const [username, setUsername] = useState(""); // כאן תמיד יהיה שם-משתמש
  const [password, setPassword] = useState("");
  const [staffError, setStaffError] = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStaffError("");

    // וידוא שכל השדות מולאו
    if (!username.trim() || !password) {
      setStaffError("יש למלא שם משתמש וסיסמה");
      return;
    }

    // וידוא שלא הוכנס אימייל
    if (username.includes("@")) {
      setStaffError("נא להזין שם משתמש בלבד");
      return;
    }

    setLoading(true);
    try {
      // קריאה ישירה לרוטת staff-login
      const res = await API.post("/auth/staff-login", {
        username: username.trim(),
        password,
      });
      const user = res.data.user;

      // ניווט לפי תפקיד staff
      if (user.role === "worker") {
        navigate("/staff/dashboard", { replace: true });
      } else if (user.role === "manager") {
        navigate("/manager/dashboard", { replace: true });
      } else if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
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
        >
          שכחת את הסיסמה?
        </span>
      </div>
    </div>
  );
}
