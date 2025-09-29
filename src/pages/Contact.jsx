import React, { useState } from "react";
import { useForm } from "@formspree/react"; 
import { Helmet } from "react-helmet";
import "../styles/Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [state, handleSubmit] = useForm("mwpoojlv"); // replace with your Formspree ID
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
        data: { name, phone, email, message }
      });

      setStatus({ type: "success", message: "Form submitted successfully!" });
      setFormData({ name: "", phone: "", email: "", message: "" });
    } catch (error) {
      setStatus({ type: "error", message: "An error occurred. Please try again." });
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
        <title>Contact Us - Bizuply | We're Here to Help</title>
        <meta
          name="description"
          content="Contact the Bizuply team for questions, support, and business inquiries. Fill out a simple form and we'll get back to you quickly."
        />
        <meta
          name="keywords"
          content="contact, support, Bizuply, questions, help, business"
        />
        <link rel="canonical" href="https://yourdomain.com/contact" />
      </Helmet>

      <h1 className="contact-title">📞 Contact Us</h1>
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
        <div
          className={`status-msg ${status.type}`}
          data-icon={status.type === "success" ? "✅" : "❌"}
          style={{ marginTop: "1rem" }}
        >
          {status.message}
        </div>
      )}

      <p className="contact-email">
        ✉️ You can also email us directly at: <strong>support@bizuply.com</strong>
      </p>
    </div>
  );
}

export default Contact;
