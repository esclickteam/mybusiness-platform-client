import React, { useState } from "react";
import { useForm } from "@formspree/react";
import { Helmet } from "react-helmet-async"; // ✅ עודכן לגרסה הנכונה
import "../styles/Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [state, handleSubmit] = useForm("mwpoojlv"); // ✅ החלף ל-ID שלך אם נדרש
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    const { name, phone, email, message } = formData;

    if (!name || !phone || !email || !message) {
      setStatus({ type: "error", message: "Please fill in all fields" });
      return;
    }

    setLoading(true);

    try {
      await handleSubmit({
        data: { name, phone, email, message },
      });

      setStatus({ type: "success", message: "Form submitted successfully!" });
      setFormData({ name: "", phone: "", email: "", message: "" });
    } catch (error) {
      setStatus({
        type: "error",
        message: "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (state.succeeded) {
    return (
      <div className="contact-container">
        <h2>Form submitted successfully!</h2>
      </div>
    );
  }

  return (
    <div className="contact-container">
      <Helmet>
        {/* ✅ Title & Description */}
        <title>Contact Us - Bizuply | We're Here to Help</title>
        <meta
          name="description"
          content="Contact the Bizuply team for questions, support, and business inquiries. Fill out a simple form and we'll get back to you quickly."
        />
        <meta
          name="keywords"
          content="contact, support, Bizuply, questions, help, business, customer service"
        />
        <link rel="canonical" href="https://bizuply.com/contact" />

        {/* ✅ Robots */}
        <meta name="robots" content="index, follow" />

        {/* ✅ Open Graph (Facebook, LinkedIn, WhatsApp) */}
        <meta property="og:title" content="Contact Bizuply – We're Here to Help" />
        <meta
          property="og:description"
          content="Reach out to the Bizuply team for support, questions, or business inquiries. We're always happy to help."
        />
        <meta property="og:url" content="https://bizuply.com/contact" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Bizuply" />
        <meta property="og:image" content="https://bizuply.com/og-image.jpg" />

        {/* ✅ Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Bizuply – We're Here to Help" />
        <meta
          name="twitter:description"
          content="Get in touch with Bizuply for support and business inquiries. Quick response guaranteed."
        />
        <meta name="twitter:image" content="https://bizuply.com/og-image.jpg" />
      </Helmet>

      <h1 className="contact-title">Contact Us</h1>
      <p className="contact-subtitle">
        Have a question or want us to get back to you? Fill out the form and we’ll be in touch shortly!
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
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          disabled={loading}
        />

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
        ></textarea>

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
        You can also email us directly at: <strong>support@bizuply.com</strong>
      </p>
    </div>
  );
}

export default Contact;
