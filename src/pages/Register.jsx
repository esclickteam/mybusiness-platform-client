import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import "../styles/Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "customer",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isValidPhone = (phone) => /^05\d{8}$/.test(phone);

  const registerNewUser = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError("⚠️ הסיסמאות לא תואמות");
      return;
    }

    if (formData.userType === "business") {
      if (!formData.phone.trim()) {
        setError("⚠️ יש להזין מספר טלפון כדי להירשם כבעל עסק");
        return;
      }
      if (!isValidPhone(formData.phone)) {
        setError("⚠️ יש להזין מספר טלפון ישראלי תקין (10 ספרות המתחילות ב־05)");
        return;
      }
    }

    try {
      const response = await API.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        phone: formData.userType === "business" ? formData.phone : "",
        password: formData.password,
        userType: formData.userType,
        role: formData.userType === "business" ? "business" : "customer",
      });

      console.log("🎉 נרשמת בהצלחה:", response.data);
      loginUser(formData.email, formData.password);
    } catch (err) {
      console.error("❌ שגיאה בהרשמה:", err.response?.data);
      setError(
        err.response?.data?.error ||
        (err.response?.status === 400
          ? "❌ אימייל כבר רשום במערכת"
          : "❌ שגיאה בלתי צפויה. נסה שוב מאוחר יותר.")
      );
    }
  };

  const loginUser = async (email, password) => {
    try {
      const response = await API.post("/auth/login", { email, password });

      const user = response.data.user;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", response.data.token);

      // ✅ ניתוב לפי תפקיד
      switch (user.role) {
        case "business":
          navigate("/dashboard");
          break;
        case "customer":
          navigate("/client-dashboard");
          break;
        case "worker":
          navigate("/staff/dashboard");
          break;
        case "manager":
          navigate("/manager/dashboard");
          break;
        case "admin":
          navigate("/admin/dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      console.error("❌ שגיאה בהתחברות:", err.response?.data);
      setError("❌ שגיאה בעת ההתחברות לאחר הרשמה");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    registerNewUser();
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
        <input
          type="tel"
          name="phone"
          placeholder="טלפון"
          value={formData.phone}
          onChange={handleChange}
          required={formData.userType === "business"}
          style={{ display: formData.userType === "business" ? "block" : "none" }}
        />
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
