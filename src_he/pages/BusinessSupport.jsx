```javascript
import React, { useState } from "react";
import { useForm } from "@formspree/react";

import "../styles/business-support.css";

export default function BusinessSupport() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",              // Add phone field here
    issueDescription: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const [state, handleSubmit] = useForm("mwpoojlv");

  if (state.succeeded) {
    return <p className="status-msg success">The request was sent successfully!</p>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    const { name, email, phone, issueDescription } = formData;

    if (!name || !email || !phone || !issueDescription) {
      setStatus({ type: "error", message: "Please fill in all fields including phone" });
      return;
    }

    setLoading(true);

    try {
      await handleSubmit(e);
      setStatus({ type: "success", message: "The request was sent successfully" });
      setFormData({ name: "", email: "", phone: "", issueDescription: "" });
    } catch (err) {
      console.error("Error:", err);
      setStatus({ type: "error", message: "Error in sending" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="support-page">
      <h1>Business Support</h1>

      <form onSubmit={handleFormSubmit}>
        <label>Your Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          disabled={loading}
          placeholder="Enter your name"
        />

        <label>Contact Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          disabled={loading}
          placeholder="Enter your email"
        />

        <label>Contact Phone:</label>  {/* Phone field */}
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          disabled={loading}
          placeholder="Enter your phone"
        />

        <label>Issue Description:</label>
        <textarea
          name="issueDescription"
          value={formData.issueDescription}
          onChange={handleInputChange}
          disabled={loading}
          placeholder="Describe the issue"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Submit Request"}
        </button>
      </form>

      {status && (
        <div
          className={`status-msg ${status.type}`}
          data-icon={status.type === "success" ? "✅" : "❌"}
        >
          {status.message}
        </div>
      )}
    </div>
  );
}
```