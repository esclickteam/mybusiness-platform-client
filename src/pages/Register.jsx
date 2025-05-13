// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import "../styles/Register.css";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "customer",
  });
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function isValidPhone(phone) {
    return /^05\d{8}$/.test(phone);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const { name, email, phone, password, confirmPassword, userType } = formData;

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("⚠️ יש למלא את כל השדות הנדרשים");
      return;
    }
    if (password !== confirmPassword) {
      setError("⚠️ הסיסמאות לא תואמות");
      return;
    }
    if (userType === "business") {
      if (!phone.trim()) {
        setError("⚠️ יש להזין מספר טלפון כדי להירשם כבעל עסק");
        return;
      }
      if (!isValidPhone(phone.trim())) {
        setError("⚠️ יש להזין מספר טלפון ישראלי תקין (10 ספרות המתחילות ב-05)");
        return;
      }
    }

    try {
      await API.post("/auth/register", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: userType === "business" ? phone.trim() : "",
        password,
        userType,
      });

      const user = await login(email.trim(), password);

      let path = "/";
      switch (user.role) {
        case "admin": path = "/admin/dashboard"; break;
        case "manager": path = "/manager/dashboard"; break;
        case "worker": path = "/staff/dashboard"; break;
        case "business":
          path = user.businessId
            ? `/business/${user.businessId}/dashboard`
            : "/create-business";
          break;
        case "customer": path = "/client/dashboard"; break;
      }
      navigate(path);
    } catch (err) {
      const status = err.response?.status;
      if (status === 400) setError(err.response.data.error || "❌ אימייל כבר רשום במערכת");
      else if (status === 401) setError("❌ לא מצליח להתחבר לאחר הרשמה, נסה שוב");
      else setError("❌ שגיאה בלתי צפויה. נסה שוב מאוחר יותר.");
      console.error("Registration error:", err);
    }
  }

  return (
    <div className="register-container">
      <h2>הרשמה</h2>
      <p>בחר את סוג החשבון שלך והזן את הפרטים</p>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          type="text"
          placeholder="שם מלא"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="אימייל"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {formData.userType === "business" && (
          <input
            name="phone"
            type="tel"
            placeholder="טלפון"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        )}
        <input
          name="password"
          type="password"
          placeholder="סיסמה"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          name="confirmPassword"
          type="password"
          placeholder="אימות סיסמה"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <div className="radio-container">
          <label>
            <input
              type="radio"
              name="userType"
              value="customer"
              checked={formData.userType === "customer"}
              onChange={handleChange}
            />
            הרשמה כלקוח
          </label>
          <label>
            <input
              type="radio"
              name="userType"
              value="business"
              checked={formData.userType === "business"}
              onChange={handleChange}
            />
            הרשמה כבעל עסק
          </label>
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
}

export default Register;
