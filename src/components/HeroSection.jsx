import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <>
      {/* =========================
          HERO + VIDEO WRAP
          (Unified background)
      ========================= */}
      <div className="hero-wrap">
        {/* =========================
            HERO (TEXT ONLY)
        ========================= */}
        <section className="hero">
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
              <Link to="/register" className="btn-primary">
                Try it Free
              </Link>
            </div>

            <p className="hero-note">
              14-day free trial · No credit card required · Cancel anytime
            </p>
          </div>
        </section>

        {/* =========================
            VIDEO SHOWCASE (BIG)
        ========================= */}
        <section className="video-showcase">
          <div className="video-frame">
            <video
              src="/hero-demo.mp4"
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
        </section>
      </div>
    </>
  );
}
