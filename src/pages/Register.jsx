// src/pages/Register.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
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
    userType: "business", 
    businessName: "",
    referralCode: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      localStorage.setItem("affiliate_referral", ref);
      setFormData((prev) => ({ ...prev, referralCode: ref }));
    } else {
      localStorage.removeItem("affiliate_referral");
      setFormData((prev) => ({ ...prev, referralCode: "" }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isValidPhone = (phone) => /^05\d{8}$/.test(phone);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
      userType,
      businessName,
      referralCode,
    } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setError("⚠️ Please fill in all required fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("⚠️ Passwords do not match");
      return;
    }
    if (userType === "business") {
      if (!businessName.trim()) {
        setError("⚠️ Please enter a business name to register as a business owner");
        return;
      }
      if (!phone.trim()) {
        setError("⚠️ Please enter a phone number to register as a business owner");
        return;
      }
      if (!isValidPhone(phone.trim())) {
        setError("⚠️ Please enter a valid Israeli phone number (10 digits starting with 05)");
        return;
      }
    }

    try {
      await API.post(
        "/auth/register",
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: userType === "business" ? phone.trim() : "",
          password,
          userType,
          businessName: userType === "business" ? businessName.trim() : undefined,
          referralCode:
            userType === "business" ? referralCode || undefined : undefined,
        },
        { withCredentials: true }
      );

      // Auto-login after registration
      const { user } = await login(email.trim().toLowerCase(), password, {
        skipRedirect: true,
      });

      if (!user) {
        setError("❌ Failed to log in after registration, please try again");
        return;
      }

      // Redirect based on user type
      if (userType === "business") {
        navigate("/dashboard"); // Business → dashboard
      } else {
        navigate("/client/dashboard/search"); // Customer → client dashboard
      }
    } catch (err) {
      console.error("❌ Registration error:", err.response?.data || err.message);
      if (err.response?.status === 400) {
        setError(err.response.data.error || "❌ Email is already registered");
      } else if (err.response?.status === 401) {
        setError("❌ Failed to log in after registration, please try again");
      } else {
        setError("❌ Unexpected error. Please try again later.");
      }
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <p>Select your account type and enter your details</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {formData.userType === "business" && (
          <>
            <input
              type="text"
              name="businessName"
              placeholder="Business Name"
              value={formData.businessName}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </>
        )}
        {formData.referralCode && (
          <input
            type="text"
            name="referralCode"
            value={formData.referralCode}
            readOnly
            placeholder="Referral Code"
          />
        )}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
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
            <label htmlFor="customer">Register as Customer</label>
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
            <label htmlFor="business">Register as Business Owner</label>
          </div>
        </div>

        <button type="submit" className="register-button">
          Sign Up
        </button>

        {error && <p className="error-message">{error}</p>}
      </form>

      <div className="login-link">
        Already have an account? <Link to="/login">Log in</Link>
      </div>
    </div>
  );
};

export default Register;
