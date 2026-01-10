import { Link } from "react-router-dom";

export default function HeroSection() {
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
          {/* ✅ Single, clear CTA */}
          <Link to="/register" className="btn-primary">
            Try it Free
          </Link>
        </div>

        <p className="hero-note">
          14-day free trial · No credit card required · Cancel anytime
        </p>
      </div>
    </section>
  );
}
