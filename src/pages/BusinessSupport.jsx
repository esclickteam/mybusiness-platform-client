import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "../styles/business-support.css";

export default function BusinessSupport() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    issueDescription: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

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
        message: "Please fill in all fields, including phone.",
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
        throw new Error(data.error || "Failed to send");
      }

      setStatus({
        type: "success",
        message: "Your request was sent successfully! We’ll contact you soon.",
      });
      setFormData({ name: "", email: "", phone: "", issueDescription: "" });
    } catch (error) {
      console.error("Error:", error);
      setStatus({
        type: "error",
        message: "An error occurred. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="support-page" dir="ltr" lang="en">
      <h1 className="contact-title">Business Support</h1>
      <p className="contact-subtitle">
        Have a question or need help? Fill out the form below and our team will
        get back to you shortly.
      </p>

      <form className="contact-form" onSubmit={handleFormSubmit}>
        <label>Full Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          disabled={loading}
          placeholder="Enter your full name"
          required
        />

        <label>Phone:</label>
        <PhoneInput
          country={"us"} // 🇺🇸 ברירת מחדל
          preferredCountries={["us", "il", "gb", "ca"]}
          enableSearch
          value={formData.phone}
          onChange={(phone) => setFormData((prev) => ({ ...prev, phone }))}
          inputProps={{
            name: "phone",
            required: true,
            disabled: loading,
          }}
          containerClass="phone-container"
          inputClass="phone-input"
          buttonClass="phone-flag"
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          disabled={loading}
          placeholder="Enter your email"
          required
        />

        <label>Message:</label>
        <textarea
          name="issueDescription"
          value={formData.issueDescription}
          onChange={handleInputChange}
          disabled={loading}
          placeholder="Describe your issue or question"
          required
        />

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? "Sending..." : "Send Message"}
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

      <p className="contact-email">
        You can also email us directly at <strong>support@bizuply.com</strong>
      </p>
    </div>
  );
}
