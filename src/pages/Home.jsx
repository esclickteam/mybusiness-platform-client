import React from "react";
import { Helmet } from "react-helmet";
import "../styles/Home.css";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="esd-page">
      <Helmet>
        <title>Bizuply — Everything Your Business Needs. In One Place.</title>
        <meta
          name="description"
          content="Manage clients, schedule appointments, automate with AI, collaborate and grow — all in one platform."
        />
      </Helmet>

      {/* ===== HERO ===== */}
      <section className="esd-hero" aria-labelledby="hero-title">
        <div className="esd-hero__bg" />
        <div className="esd-hero__inner">
          <h1 id="hero-title" className="esd-hero__title">
            Everything Your Business Needs. <br />
            <span>In One Place.</span>
          </h1>

          <p className="esd-hero__subtitle">
            Manage clients, schedule appointments, automate with AI, and grow smarter — all with Bizuply.
          </p>

          <div className="esd-hero__cta" role="group" aria-label="Primary actions">
            <Link to="/get-started" className="esd-btn esd-btn--primary">Get Started</Link>
            <Link to="/how-it-works" className="esd-btn esd-btn--ghost">See How It Works</Link>
          </div>

          <p className="esd-hero__trust">
            ✓ 14-day free trial • ✓ No credit card • ✓ Mobile-friendly
          </p>

          <div className="esd-partners" aria-label="Partners & tech">
            <div>OpenAI</div>
            <div>MongoDB</div>
            <div>WordPress</div>
            <div>Stripe</div>
          </div>
        </div>
        <div className="esd-curve" />
      </section>

      {/* ===== VALUE ===== */}
      <section className="esd-value" aria-labelledby="value-title">
        <div className="esd-card esd-value__card">
          <h2 id="value-title" className="esd-section-title">
            More Than a Platform — <span>Your True Business Partner.</span>
          </h2>
          <p className="esd-section-text">
            Bizuply is built to empower small businesses to operate like the big ones.
            From smart scheduling and client management, to AI that delivers insights
            and acts as your personal advisor — and even collaborations with other
            businesses — everything works seamlessly together in one powerful system.
          </p>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="esd-features" aria-labelledby="features-title">
        <h2 id="features-title" className="esd-section-title">What You Get</h2>
        <div className="esd-grid">
          <article className="esd-feature">
            <div className="esd-icon" aria-hidden>🤝</div>
            <h3>Collaboration</h3>
            <p>Identify complementary partners and create agreements to increase profits and grow together.</p>
          </article>
          <article className="esd-feature">
            <div className="esd-icon" aria-hidden>⚙️</div>
            <h3>Smart Management</h3>
            <p>Integrated CRM + branded page with gallery, ratings, reviews, chat, and more.</p>
          </article>
          <article className="esd-feature">
            <div className="esd-icon" aria-hidden>🤖</div>
            <h3>AI Assistant</h3>
            <p>Automate replies, get insights, and let Bizuply handle repetitive tasks to save time.</p>
          </article>
          <article className="esd-feature">
            <div className="esd-icon" aria-hidden>📈</div>
            <h3>Grows With You</h3>
            <p>Dashboards and automations that scale as you do.</p>
          </article>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="esd-cta" aria-labelledby="cta-title">
        <div className="esd-cta__inner">
          <h2 id="cta-title">Ready to Grow Smarter?</h2>
          <Link to="/get-started" className="esd-btn esd-btn--primary esd-btn--lg">Start Today</Link>
        </div>
      </section>
    </main>
  );
}
