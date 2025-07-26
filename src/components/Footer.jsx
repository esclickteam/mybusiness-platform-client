import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <ul className="footer-links">
        <li><Link to="/about" className="footer-link">📖 קצת עלינו</Link></li>
        <li><Link to="/how-it-works" className="footer-link">⚙️ איך זה עובד</Link></li>
        <li><Link to="/business" className="footer-link">✏️ הצטרפות עסקים</Link></li>
        <li><Link to="/faq" className="footer-link">❓ שאלות נפוצות</Link></li>
        <li><Link to="/terms" className="footer-link">📜 תקנון</Link></li>
        <li><Link to="/contact" className="footer-link">📞 יצירת קשר</Link></li>
      </ul>
      <p className="copyright">כל הזכויות שמורות © עסקליק</p>
    </footer>
  );
}

export default Footer;
