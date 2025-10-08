import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import "../styles/ChangePassword.css"; // ✅ זה הייבוא שצריך להוסיף


const ChangePassword = () => {
  const { user, refreshUserData } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { currentPassword, newPassword, confirmPassword } = form;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("❗ כל השדות חובה");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("❗ הסיסמה החדשה ואישור הסיסמה לא תואמים");
      return;
    }

    if (newPassword.length < 6) {
      setError("❗ סיסמה חייבת להיות לפחות 6 תווים");
      return;
    }

    try {
      const res = await API.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      setSuccess("✅ הסיסמה עודכנה בהצלחה!");

      // רענון נתוני המשתמש מהשרת
      const updatedUser = await refreshUserData();

      // ניתוב לפי תפקיד
      switch (updatedUser.role) {
        case "business":
          navigate("/dashboard");
          break;
        case "customer":
          navigate("/client-dashboard");
          break;
        case "worker":
          navigate("/worker-dashboard");
          break;
        case "manager":
          navigate("/manager-dashboard");
          break;
        case "admin":
          navigate("/admin-dashboard");
          break;
        default:
          navigate("/");
      }

    } catch (err) {
      console.error("❌ שגיאה בהחלפת סיסמה:", err);
      setError(err.response?.data?.error || "❌ שגיאת שרת. נסה שוב.");
    }
  };

  return (
    <div className="change-password-container">
      <h2>🔒 שינוי סיסמה</h2>
      <p>מאחר ואתה נכנסת עם סיסמה זמנית, יש להחליף אותה כדי להמשיך.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          name="currentPassword"
          placeholder="סיסמה נוכחית"
          value={form.currentPassword}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="newPassword"
          placeholder="סיסמה חדשה"
          value={form.newPassword}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="אישור סיסמה חדשה"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit">עדכן סיסמה</button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
};

export default ChangePassword;
