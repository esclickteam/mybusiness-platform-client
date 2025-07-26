import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import "../styles/Contact.css"; // ודא שה- CSS העדכני

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
      <Helmet>
        <title>יצירת קשר - עסקליק | נשמח לעמוד לשירותך</title>
        <meta
          name="description"
          content="צור קשר עם צוות עסקליק לשאלות, תמיכה והצטרפות. מלא טופס פשוט ונחזור אליך בהקדם."
        />
        <meta
          name="keywords"
          content="צור קשר, תמיכה, עסקליק, שאלות, הצטרפות, שירות לקוחות"
        />
        <link rel="canonical" href="https://yourdomain.co.il/contact" />
      </Helmet>

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

        <button type="submit" className="submit-button">
          שליחת טופס
        </button>
      </form>

      <p className="contact-email">
        ✉️ ניתן גם לפנות ישירות במייל: <strong>support@esclick.co.il</strong>
      </p>

      {/* Footer בעיצוב כפול שורה */}
      <footer className="footer-links-box">
        <div className="footer-links-row">
          
          <Link to="/about"><span role="img" aria-label="ספר">📖</span> קצת עלינו</Link>
          <Link to="/how-it-works"><span role="img" aria-label="הגדרות">⚙️</span> איך זה עובד</Link>
          <Link to="/join"><span role="img" aria-label="חץ ימני">➥</span> הצטרפות עסקים</Link>
        </div>
        <div className="footer-links-row">
          <Link to="/faq"><span role="img" aria-label="סימן שאלה">❓</span> שאלות נפוצות</Link>
          <Link to="/terms"><span role="img" aria-label="גליון">📜</span> תקנון</Link>
          <Link to="/contact"><span role="img" aria-label="טלפון">📞</span> יצירת קשר</Link>
        </div>
        <div className="footer-copyright">
          כל הזכויות שמורות © עסקליק
        </div>
      </footer>
    </div>
  );
}

export default Contact;
