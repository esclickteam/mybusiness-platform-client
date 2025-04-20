import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";  // מודול ה-API שלך

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "customer",  // ברירת מחדל
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const registerNewUser = async () => {
    try {
      const response = await API.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        userType: formData.userType,
      });

      console.log("המשתמש נרשם בהצלחה:", response.data);

      // שליחה ל־loginUser אחרי יצירת המשתמש החדש
      loginUser(formData.email, formData.password);
    } catch (err) {
      console.error("שגיאה בהרשמה:", err.response?.data);
      setError(
        err.response?.data?.error ||
        (err.response?.status === 400
          ? "❌ האימייל כבר קיים במערכת"
          : "❌ שגיאה בלתי צפויה, נסה שוב מאוחר יותר.")
      );
    }
  };

  const loginUser = async (email, password) => {
    try {
      const response = await API.post("/auth/login", {
        email,
        password,
      });

      console.log("ההתחברות הצליחה:", response.data);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);

      // ניווט אחרי התחברות
      if (formData.userType === "business") {
        navigate("/plans");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("שגיאה בהתחברות:", err.response?.data);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    registerNewUser();
  };

  return (
    <div className="register-container">
      <h2>הרשמה</h2>
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

        <button type="submit" className="register-button">הירשם</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Register;
