import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-inner">
        {/* LEFT – TEXT */}
        <div className="hero-content">
          <span className="hero-eyebrow">PLATFORM</span>

          <h1 id="hero-title">
            Run your business.
            <br />
            <span className="hero-accent">All in one place.</span>
          </h1>

          <p className="hero-description">
            A clean, professional business page with collaborations,
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
            14-day free trial · No credit card required · Cancel anytime
          </p>
        </div>

        {/* RIGHT – VISUAL */}
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-mockup">
            <img
              src="/images/hero-business-page.png"
              alt="Preview of a professional business profile page"
              loading="eager"
              width="900"
              height="560"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
