// src/pages/Register.jsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import "../styles/Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "customer",
    businessName: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isValidPhone = (phone) => /^05\d{8}$/.test(phone);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { name, email, phone, password, confirmPassword, userType, businessName } = formData;

    // בדיקות בסיס
    if (!name || !email || !password || !confirmPassword) {
      setError("⚠️ יש למלא את כל השדות הנדרשים");
      return;
    }
    if (password !== confirmPassword) {
      setError("⚠️ הסיסמאות לא תואמות");
      return;
    }
    if (userType === "business") {
      if (!businessName.trim()) {
        setError("⚠️ יש להזין שם עסק כדי להירשם כבעל עסק");
        return;
      }
      if (!phone.trim()) {
        setError("⚠️ יש להזין מספר טלפון כדי להירשם כבעל עסק");
        return;
      }
      if (!isValidPhone(phone.trim())) {
        setError("⚠️ יש להזין מספר טלפון ישראלי תקין (10 ספרות המתחילות ב‑05)");
        return;
      }
    }

    try {
      // שליחה לשרת להרשמה
      await API.post("/auth/register", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: userType === "business" ? phone.trim() : "",
        password,
        userType, // ← שרת ישלוף role מתוך userType
        businessName: userType === "business" ? businessName.trim() : undefined,
      });

      // אחרי הרשמה – מבצעים login דרך ה‐AuthContext
      const user = await login(email.trim(), password);

      // ניתוב לפי תפקיד ו־businessId
      let dashboardPath = "/";
      switch (user.role) {
        case "admin":
          dashboardPath = "/admin/dashboard";
          break;
        case "manager":
          dashboardPath = "/manager/dashboard";
          break;
        case "worker":
          dashboardPath = "/staff/dashboard";
          break;
        case "business":
          dashboardPath = user.businessId
            ? `/business/${user.businessId}/dashboard`
            : "/create-business";
          break;
        case "customer":
          dashboardPath = "/client/dashboard";
          break;
        default:
          dashboardPath = "/";
      }

      navigate(dashboardPath); // ניתוב לפי ה-role

    } catch (err) {
      console.error("❌ Registration error:", err.response?.data || err.message);
      if (err.response?.status === 400) {
        setError(err.response.data.error || "❌ אימייל כבר רשום במערכת");
      } else if (err.response?.status === 401) {
        setError("❌ לא מצליח להתחבר לאחר הרשמה, נסה שוב");
      } else {
        setError("❌ שגיאה בלתי צפויה. נסה שוב מאוחר יותר.");
      }
    }
  };

  return (
    <div className="register-container">
      <h2>הרשמה</h2>
      <p>בחר את סוג החשבון שלך והזן את הפרטים</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="שם מלא"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="אימייל"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {formData.userType === "business" && (
          <>
            <input
              type="text"
              name="businessName"
              placeholder="שם העסק"
              value={formData.businessName}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="טלפון"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </>
        )}
        <input
          type="password"
          name="password"
          placeholder="סיסמה"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="אימות סיסמה"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <div className="radio-container">
          <div className="radio-option">
            <input
              type="radio"
              id="customer"
              name="userType"
              value="customer"
              checked={formData.userType === "customer"}
              onChange={handleChange}
            />
            <label htmlFor="customer">הרשמה כלקוח</label>
          </div>
          <div className="radio-option">
            <input
              type="radio"
              id="business"
              name="userType"
              value="business"
              checked={formData.userType === "business"}
              onChange={handleChange}
            />
            <label htmlFor="business">הרשמה כבעל עסק</label>
          </div>
        </div>

        <button type="submit" className="register-button">
          הירשם
        </button>

        {error && <p className="error-message">{error}</p>}
      </form>

      <div className="login-link">
        כבר יש לך חשבון? <Link to="/login">התחבר עכשיו</Link>
      </div>
    </div>
  );
};

export default Register;
