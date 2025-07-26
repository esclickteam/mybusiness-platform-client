import React, { useState } from "react";
import { useForm } from "@formspree/react"; // ייבוא Formspree
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import "../styles/Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [state, handleSubmit] = useForm("mwpoojlv"); // החלף ב-ID שלך מ-Formspree
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
      setStatus({ type: "error", message: "אנא מלא את כל השדות" });
      return;
    }

    setLoading(true);

    try {
      await handleSubmit({
        data: { name, phone, email, message }
      });

      setStatus({ type: "success", message: "הטופס נשלח בהצלחה!" });
      setFormData({ name: "", phone: "", email: "", message: "" });
    } catch (error) {
      setStatus({ type: "error", message: "אירעה שגיאה בשליחה. נסה שוב." });
    } finally {
      setLoading(false);
    }
  };

  if (state.succeeded) {
    return (
      <div className="contact-container">
        <h2>הטופס נשלח בהצלחה!</h2>
      </div>
    );
  }

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

      <form className="contact-form" onSubmit={onSubmit}>
        <label>שם מלא:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <label>טלפון:</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <label>אימייל:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <label>הודעה:</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          disabled={loading}
        ></textarea>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "שולח..." : "שליחת טופס"}
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
