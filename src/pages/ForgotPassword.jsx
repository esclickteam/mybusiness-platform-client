import React, { useState } from "react";
import "../styles/ForgotPassword.css";
import API from "../api";

const ForgotPassword = ({ closePopup }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendReset = async () => {
    if (!email) {
      setMessage("Please enter your email address");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await API.post("/auth/forgot-password", { email });
      setMessage("✅ A reset link has been sent to your email!");
    } catch (error) {
      console.error("❌ Error sending reset link:", error);
      setMessage(
        error.response?.data?.error || "❌ Unexpected error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-overlay">
      <div className="forgot-password-modal">
        <h2>Reset Password</h2>
        <p>Enter your email address and we’ll send you a reset link</p>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleSendReset}
          className="send-button"
          disabled={loading}
        >
          {loading ? "🔄 Sending..." : "Send Reset Link"}
        </button>
        {message && <p className="message">{message}</p>}
        <button onClick={closePopup} className="close-button">
          Close
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
