import React, { useState } from "react";
import "../styles/business-support.css";

const COUNTRIES = [
  { code: "US", dial: "+1", flag: "🇺🇸" },
  { code: "IL", dial: "+972", flag: "🇮🇱" },
  { code: "GB", dial: "+44", flag: "🇬🇧" },
  { code: "CA", dial: "+1", flag: "🇨🇦" },
];

export default function BusinessSupport() {
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      setStatus({ type: "error", message: "Please fill in all fields" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          phone: `${country.dial}${formData.phone}`,
        }),
      });

      if (!res.ok) throw new Error();

      setStatus({ type: "success", message: "Message sent successfully!" });
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch {
      setStatus({ type: "error", message: "Failed to send message" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="support-wrapper" dir="ltr">
      <div className="support-card">
        <h1 className="support-title">Contact Us</h1>
        <p className="support-subtitle">
          Have a question or want us to get back to you?  
          Fill out the form and we’ll be in touch shortly!
        </p>

        <form onSubmit={handleSubmit}>
          <label>Full Name:</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full name"
          />

          <label>Phone:</label>
          <div className="phone-row">
            <select
              value={country.code}
              onChange={(e) =>
                setCountry(COUNTRIES.find(c => c.code === e.target.value))
              }
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.dial}
                </option>
              ))}
            </select>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone number"
            />
          </div>

          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@email.com"
          />

          <label>Message:</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your message here..."
          />

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "SEND MESSAGE"}
          </button>
        </form>

        {status && (
          <div className={`form-status ${status.type}`}>
            {status.message}
          </div>
        )}

        <div className="support-footer">
          📧 You can also email us directly at{" "}
          <strong>support@bizuply.com</strong>
        </div>
      </div>
    </div>
  );
}
