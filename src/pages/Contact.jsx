import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import "../styles/Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phoneCode: "+1", // 🇺🇸 Default United States
    phone: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    const { name, phoneCode, phone, email, message } = formData;

    if (!name || !phone || !email || !message) {
      setStatus({ type: "error", message: "Please fill in all fields" });
      return;
    }

    setLoading(true);

    try {
      const fullPhone = `${phoneCode}${phone}`;

      const res = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone: fullPhone,
          email,
          issueDescription: message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error("Failed to send");
      }

      setStatus({
        type: "success",
        message: "Form submitted successfully! We’ll get back to you shortly.",
      });

      setFormData({
        name: "",
        phoneCode: "+1",
        phone: "",
        email: "",
        message: "",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: "An error occurred. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container">
      <Helmet>
        <title>Contact Us - Bizuply | We're Here to Help</title>
        <meta
          name="description"
          content="Contact the Bizuply team for questions, support, and business inquiries."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://bizuply.com/contact" />

        <meta property="og:title" content="Contact Bizuply – We're Here to Help" />
        <meta
          property="og:description"
          content="Reach out to the Bizuply team for support or questions."
        />
        <meta property="og:url" content="https://bizuply.com/contact" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://bizuply.com/og-image.jpg" />
      </Helmet>

      <h1 className="contact-title">Contact Us</h1>
      <p className="contact-subtitle">
        Have a question or want us to get back to you? Fill out the form and we’ll
        be in touch shortly!
      </p>

      <form className="contact-form" onSubmit={onSubmit}>
        <label>Full Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <label>Phone:</label>
        <div className="phone-row">
          <select
            name="phoneCode"
            value={formData.phoneCode}
            onChange={handleChange}
            disabled={loading}
            className="phone-code"
          >
            <option value="+1">🇺🇸 +1</option>
            <option value="+44">🇬🇧 +44</option>
            <option value="+972">🇮🇱 +972</option>
            <option value="+49">🇩🇪 +49</option>
            <option value="+33">🇫🇷 +33</option>
            <option value="+61">🇦🇺 +61</option>
          </select>

          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Phone number"
          />
        </div>

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <label>Message:</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>

      {status && (
        <div className={`status-msg ${status.type}`} style={{ marginTop: "1rem" }}>
          {status.message}
        </div>
      )}

      <p className="contact-email">
        You can also email us directly at <strong>support@bizuply.com</strong>
      </p>
    </div>
  );
}

export default Contact;
