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

  // ✅ שמירת קוד הפניה (referral) מה-URL
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

  // ✅ ולידציה בינלאומית לפי תקן E.164
  const isValidPhone = (phone) => {
    const cleaned = phone.trim().replace(/\s|-/g, "");
    const regex = /^\+?[1-9]\d{7,14}$/;
    return regex.test(cleaned);
  };

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
        setError(
          "⚠️ Please enter a valid phone number (e.g., +1..., +972..., +44...)"
        );
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
          businessName:
            userType === "business" ? businessName.trim() : undefined,
          referralCode:
            userType === "business" ? referralCode || undefined : undefined,
        },
        { withCredentials: true }
      );

      // ✅ Auto-login אחרי הרשמה
      const { user } = await login(email.trim().toLowerCase(), password, {
        skipRedirect: true,
      });

    

      if (!user) {
        setError("❌ Failed to log in after registration, please try again");
        return;
      }

      // 🟣 Facebook Pixel Event - CompleteRegistration
if (window.fbq && userType === "business") {

  window.fbq("track", "CompleteRegistration");
  console.log("✅ Facebook Pixel: CompleteRegistration sent");
}

      // ✅ הפניה לפי סוג המשתמש
      if (userType === "business") {
        navigate("/dashboard");
      } else {
        navigate("/client/dashboard/search");
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

            {/* ✅ Phone input with country flags - default US 🇺🇸 */}
            <div className="phone-input-wrapper">
              <PhoneInput
                country={"us"} // 🇺🇸 ברירת מחדל
                enableSearch={true}
                value={formData.phone}
                onChange={(phone) =>
                  setFormData((prev) => ({ ...prev, phone: `+${phone}` }))
                }
                inputStyle={{
                  width: "100%",
                  height: "48px",
                  borderRadius: "10px",
                  border: "1px solid #c8c8c8",
                  paddingLeft: "48px",
                  fontSize: "16px",
                }}
                buttonStyle={{
                  border: "none",
                  backgroundColor: "transparent",
                }}
                dropdownStyle={{
                  maxHeight: "200px",
                }}
                placeholder="Enter phone number"
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

        {/* ✅ בחירת סוג משתמש */}
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
