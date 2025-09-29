import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <ul className="footer-links">
        <li><Link to="/about" className="footer-link">📖 About Us</Link></li>
        <li><Link to="/how-it-works" className="footer-link">⚙️ How It Works</Link></li>
        <li><Link to="/business" className="footer-link">✏️ Join as a Business</Link></li>
        <li><Link to="/faq" className="footer-link">❓ FAQ</Link></li>
        <li><Link to="/terms" className="footer-link">📜 Terms</Link></li>
        <li><Link to="/contact" className="footer-link">📞 Contact</Link></li>
      </ul>
      
      <p className="copyright">
        © {new Date().getFullYear()} Bizuply. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
