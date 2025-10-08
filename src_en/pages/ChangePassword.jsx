```javascript
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import "../styles/ChangePassword.css"; // ✅ This is the import that needs to be added


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
      setError("❗ All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("❗ The new password and confirmation do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("❗ Password must be at least 6 characters long");
      return;
    }

    try {
      const res = await API.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      setSuccess("✅ Password updated successfully!");

      // Refresh user data from the server
      const updatedUser = await refreshUserData();

      // Navigate based on role
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
      console.error("❌ Error changing password:", err);
      setError(err.response?.data?.error || "❌ Server error. Please try again.");
    }
  };

  return (
    <div className="change-password-container">
      <h2>🔒 Change Password</h2>
      <p>Since you logged in with a temporary password, you need to change it to continue.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          name="currentPassword"
          placeholder="Current Password"
          value={form.currentPassword}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={form.newPassword}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm New Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit">Update Password</button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
};

export default ChangePassword;
```