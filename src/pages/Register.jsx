import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
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

  /*
  -------------------------------------------------------
  AFFILIATE REF TRACKING
  -------------------------------------------------------
  */

  useEffect(() => {

    const refFromUrl = searchParams.get("ref");
    const refFromStorage = localStorage.getItem("affiliate_referral");

    if (refFromUrl) {

      localStorage.setItem("affiliate_referral", refFromUrl);

      setFormData(prev => ({
        ...prev,
        referralCode: refFromUrl
      }));

    } else if (refFromStorage) {

      setFormData(prev => ({
        ...prev,
        referralCode: refFromStorage
      }));

    }

  }, [searchParams]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  /*
  -------------------------------------------------------
  PHONE VALIDATION (E.164)
  -------------------------------------------------------
  */

  const isValidPhone = (phone) => {
    const cleaned = phone.trim().replace(/\s|-/g, "");
    const regex = /^\+?[1-9]\d{7,14}$/;
    return regex.test(cleaned);
  };

  /*
  -------------------------------------------------------
  REGISTER
  -------------------------------------------------------
  */

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
      referralCode
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
        setError("⚠️ Please enter a business name");
        return;
      }

      if (!phone.trim()) {
        setError("⚠️ Please enter a phone number");
        return;
      }

      if (!isValidPhone(phone.trim())) {
        setError("⚠️ Please enter a valid phone number");
        return;
      }

    }

    try {

      await API.post("/auth/register",
      {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: userType === "business" ? phone.trim() : "",
        password,
        userType,
        businessName: userType === "business"
          ? businessName.trim()
          : undefined,

        referralCode: userType === "business"
          ? referralCode || localStorage.getItem("affiliate_referral") || undefined
          : undefined,

      },
      { withCredentials: true });

      /*
      -------------------------------------------------------
      CLEAR AFFILIATE AFTER SUCCESS
      -------------------------------------------------------
      */

      localStorage.removeItem("affiliate_referral");

      /*
      -------------------------------------------------------
      AUTO LOGIN
      -------------------------------------------------------
      */

      const { user } = await login(
        email.trim().toLowerCase(),
        password,
        { skipRedirect: true }
      );

      if (!user) {
        setError("❌ Failed to log in after registration");
        return;
      }

      /*
      -------------------------------------------------------
      FACEBOOK PIXEL
      -------------------------------------------------------
      */

      if (window.fbq && userType === "business") {

        window.fbq("track", "CompleteRegistration");

        console.log("✅ Facebook Pixel: CompleteRegistration sent");

      }

      /*
      -------------------------------------------------------
      REDIRECT
      -------------------------------------------------------
      */

      if (userType === "business") {
        navigate("/dashboard");
      } else {
        navigate("/client/dashboard/search");
      }

    } catch (err) {

      console.error("Registration error:", err.response?.data || err.message);

      if (err.response?.status === 400) {
        setError(err.response.data.error || "❌ Email already exists");
      } else {
        setError("❌ Unexpected error. Please try again later.");
      }

    }

  };

  /*
  -------------------------------------------------------
  UI
  -------------------------------------------------------
  */

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

            <div className="phone-input-wrapper">

              <PhoneInput
                country={"us"}
                enableSearch
                value={formData.phone}
                onChange={(phone) =>
                  setFormData(prev => ({
                    ...prev,
                    phone: `+${phone}`
                  }))
                }
                inputStyle={{
                  width: "100%",
                  height: "48px",
                  borderRadius: "10px",
                  border: "1px solid #c8c8c8",
                  paddingLeft: "48px",
                  fontSize: "16px",
                }}
              />

            </div>
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

          <label>
            <input
              type="radio"
              name="userType"
              value="customer"
              checked={formData.userType === "customer"}
              onChange={handleChange}
            />
            Register as Customer
          </label>

          <label>
            <input
              type="radio"
              name="userType"
              value="business"
              checked={formData.userType === "business"}
              onChange={handleChange}
            />
            Register as Business Owner
          </label>

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