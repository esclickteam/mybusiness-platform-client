import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Column 1: Logo + tagline */}
        <div className="footer-col">
          <h3 className="footer-logo">Bizuply</h3>
          <p className="footer-desc">
            Everything your business needs. In one place.
          </p>
        </div>

        {/* Column 2: Product */}
        <div className="footer-col">
          <h4>Product</h4>
          <ul>
            <li><Link to="/how-it-works" className="footer-link">How It Works</Link></li>
            <li><Link to="/features" className="footer-link">Features</Link></li>
            <li><Link to="/plans" className="footer-link">Plans</Link></li>
            <li><Link to="/solutions" className="footer-link">Solutions</Link></li>
          </ul>
        </div>

        {/* Column 3: Company */}
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><Link to="/about" className="footer-link">About Us</Link></li>
            <li><Link to="/business" className="footer-link">Join as a Business</Link></li>
          </ul>
        </div>

        {/* Column 4: Support */}
        <div className="footer-col">
          <h4>Support</h4>
          <ul>
            <li><Link to="/faq" className="footer-link">FAQ</Link></li>
            <li><Link to="/contact" className="footer-link">Contact</Link></li>
            <li><Link to="/terms" className="footer-link">Terms</Link></li>
            <li><Link to="/privacy-policy" className="footer-link">Privacy Policy</Link></li>
            <li><Link to="/accessibility" className="footer-link">Accessibility</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Bizuply. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
