import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import "../styles/Register.css"; // ודא שקיים

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "customer", // ברירת מחדל: לקוח
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const registerNewUser = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError("⚠️ הסיסמאות לא תואמות");
      return;
    }

    try {
      const response = await API.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        userType: formData.userType,
      });

      console.log("🎉 נרשמת בהצלחה:", response.data);

      // כניסה אוטומטית לאחר הרשמה
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
      const response = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);

      // ניווט לפי תפקיד
      const role = response.data.user.role;
      switch (role) {
        case "business":
          navigate("/plans");
          break;
        case "customer":
          navigate("/client-dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      console.error("❌ שגיאה בהתחברות:", err.response?.data);
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
