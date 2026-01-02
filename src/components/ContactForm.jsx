// ContactForm.jsx
import React, { useState } from "react";

function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // success | error

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);

    const { name, email, message } = formData;

    if (!name || !email || !message) {
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
          issueDescription: message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Submission failed");
      }

      setStatus({
        type: "success",
        message: "Form submitted successfully!",
      });

      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (err) {
      setStatus({
        type: "error",
        message: "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
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
          }}
        >
          {status.message}
        </p>
      )}
    </form>
  );
}

export default ContactForm;
