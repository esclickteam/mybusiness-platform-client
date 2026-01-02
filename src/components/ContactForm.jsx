// ContactForm.jsx
import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "./ContactForm.css";



function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "", // full international phone
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: "success" | "error", message }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);

    const { name, email, phone, message } = formData;

    if (!name || !email || !phone || !message) {
      setStatus({
        type: "error",
        message: "Please fill in all fields",
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
          issueDescription: message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Submission failed");
      }

      setStatus({
        type: "success",
        message: "Form submitted successfully! We’ll get back to you shortly.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (err) {
      setStatus({
        type: "error",
        message: "An error occurred. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      {/* Full Name */}
      <label htmlFor="name">Full Name</label>
      <input
        id="name"
        name="name"
        type="text"
        value={formData.name}
        onChange={handleChange}
        disabled={loading}
        required
      />

      {/* Phone with real flags */}
      <label>Phone</label>
      <PhoneInput
        country="us"                 // 🇺🇸 default
        value={formData.phone}
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, phone: value }))
        }
        inputClass="phone-input"
        containerClass="phone-container"
        buttonClass="phone-flag"
        inputProps={{
          required: true,
          disabled: loading,
        }}
        enableSearch
      />

      {/* Email */}
      <label htmlFor="email">Email Address</label>
      <input
        id="email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        disabled={loading}
        required
      />

      {/* Message */}
      <label htmlFor="message">Message</label>
      <textarea
        id="message"
        name="message"
        value={formData.message}
        onChange={handleChange}
        disabled={loading}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Sending..." : "Submit"}
      </button>

      {status && (
        <p
          style={{
            marginTop: "1rem",
            color: status.type === "success" ? "green" : "red",
            fontWeight: 600,
          }}
        >
          {status.message}
        </p>
      )}
    </form>
  );
}

export default ContactForm;
