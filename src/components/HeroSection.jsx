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
          One smart platform to manage your business page,
          clients, collaborations, CRM and AI — all connected.
        </p>

        <div className="hero-actions">
          {/* ✅ Primary CTA */}
          <Link to="/register" className="btn-primary">
            Get started free
          </Link>

          {/* 🔗 Secondary action as text link */}
          <Link to="/how-it-works" className="hero-link">
            See how it works →
          </Link>
        </div>

        <p className="hero-note">
          14-day free trial · No credit card required · Cancel anytime
        </p>
      </div>

      {/* 🔹 DASHBOARD PREVIEW */}
      {children && (
        <div className="hero-dashboard">
          <span className="hero-dashboard-label">
            Dashboard preview
          </span>

          <div className="hero-dashboard-inner">
            {children}
          </div>
        </div>
      )}
    </section>
  );
}
