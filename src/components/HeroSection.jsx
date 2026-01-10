import { Link } from "react-router-dom";

export default function HeroSection({ children }) {
  return (
    <section className="hero">
      {/* 🔹 HERO CONTENT */}
      <div className="hero-content">
        <h1>
          Run your business.
          <br />
          <span className="hero-accent">All in one place.</span>
        </h1>

        <p className="hero-subtitle">
          A professional business page, collaborations,
          CRM and AI — built to grow with you.
        </p>

        <div className="hero-actions">
          <Link to="/register" className="btn-primary">
            Get started free
          </Link>

          <Link to="/how-it-works" className="btn-ghost">
            How it works
          </Link>
        </div>

        <p className="hero-note">
          14-day free trial · No credit card · No commitment
        </p>
      </div>

      {/* 🔹 DASHBOARD PREVIEW – PART OF HERO */}
      {children && (
        <div className="hero-dashboard">
          {children}
        </div>
      )}
    </section>
  );
}
