import React, { useState } from "react";
import { useForm } from "@formspree/react";

import "../styles/business-support.css";

export default function BusinessSupport() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",              // add phone field here
    issueDescription: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const [state, handleSubmit] = useForm("mwpoojlv");

  if (state.succeeded) {
    return <p className="status-msg success">Your request was sent successfully!</p>;
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
      setStatus({ type: "error", message: "Please fill out all fields, including phone" });
      return;
    }

    setLoading(true);

    try {
      await handleSubmit(e);
      setStatus({ type: "success", message: "Request sent successfully" });
      setFormData({ name: "", email: "", phone: "", issueDescription: "" });
    } catch (err) {
      console.error("Error:", err);
      setStatus({ type: "error", message: "Error sending the request" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="support-page" dir="ltr" lang="en">
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

        <label>Contact Phone:</label>  {/* phone field */}
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          disabled={loading}
          placeholder="Enter your phone number"
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
