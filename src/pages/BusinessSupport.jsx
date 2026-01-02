import React, { useState } from "react";
import "../styles/business-support.css";

export default function BusinessSupport() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    issueDescription: "",
  });

  const [loading, setLoading] = useState(false);
   const [status, setStatus] = useState(null); // { type: "success" | "error", message }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    const { name, email, phone, issueDescription } = formData;

    if (!name || !email || !phone || !issueDescription) {
      setStatus({
        type: "error",
        message: "Please fill out all fields, including phone",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          issueDescription,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send request");
      }

      setStatus({
        type: "success",
        message: "Your request was sent successfully!",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        issueDescription: "",
      });
    } catch (err) {
      console.error("Support form error:", err);
      setStatus({
        type: "error",
        message: "Error sending the request. Please try again.",
      });
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
          required
        />

        <label>Contact Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          disabled={loading}
          placeholder="Enter your email"
          required
        />

        <label>Contact Phone:</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          disabled={loading}
          placeholder="Enter your phone number"
          required
        />

        <label>Issue Description:</label>
        <textarea
          name="issueDescription"
          value={formData.issueDescription}
          onChange={handleInputChange}
          disabled={loading}
          placeholder="Describe the issue"
          required
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
