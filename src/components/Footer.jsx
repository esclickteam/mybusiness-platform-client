import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* טור 1: לוגו + טקסט קצר */}
        <div className="footer-col">
          <h3 className="footer-logo">Bizuply</h3>
          <p className="footer-desc">
            Everything your business needs. In one place.
          </p>
        </div>

        {/* טור 2: Company */}
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><Link to="/about" className="footer-link">About Us</Link></li>
            <li><Link to="/how-it-works" className="footer-link">How It Works</Link></li>
            <li><Link to="/business" className="footer-link">Join as a Business</Link></li>
          </ul>
        </div>

        {/* טור 3: Support */}
        <div className="footer-col">
          <h4>Support</h4>
          <ul>
            <li><Link to="/faq" className="footer-link">FAQ</Link></li>
            <li><Link to="/terms" className="footer-link">Terms</Link></li>
            <li><Link to="/contact" className="footer-link">Contact</Link></li>
          </ul>
        </div>

        {/* טור 4: Social */}
        <div className="footer-col">
          <h4>Connect</h4>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-linkedin-in"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Bizuply. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
