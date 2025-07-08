import React, { useState } from "react";
import "../styles/Contact.css";
import { Link } from "react-router-dom";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("הטופס נשלח בהצלחה!");
    setFormData({ name: "", phone: "", email: "", message: "" });
  };

  return (
    <div className="contact-container">
      <h1 className="contact-title">📞 יצירת קשר</h1>
      <p className="contact-subtitle">
        יש לכם שאלה או רוצים שנחזור אליכם? מלאו את הטופס וניצור קשר בהקדם!
      </p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <label>שם מלא:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>טלפון:</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <label>אימייל:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>הודעה:</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>

        <button type="submit" className="submit-button">שליחת טופס</button>
      </form>

      <p className="contact-email">
        ✉️ ניתן גם לפנות ישירות במייל: <strong>support@esclick.co.il</strong>
      </p>

      {/* תחתית הדף */}
      <footer className="footer">
        <ul className="footer-links">
          <li><Link to="/search">📋 חיפוש עסקים</Link></li>
          <li><Link to="/about">📖 קצת עלינו</Link></li>
          <li><Link to="/how-it-works">⚙️ איך זה עובד</Link></li>
          <li><Link to="/join">✏️ הצטרפות עסקים</Link></li>
          <li><Link to="/faq">❓ שאלות נפוצות</Link></li>
          <li><Link to="/terms">📜 תקנון</Link></li>
          <li><Link to="/contact">📞 יצירת קשר</Link></li>
        </ul>
        <p className="copyright">כל הזכויות שמורות © עסקליק</p>
      </footer>
    </div>
  );
}

export default Contact;
