import React from "react";
import { Helmet } from "react-helmet";
import "../styles/Home.css";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-container">
      <Helmet>
        <title>Bizuply – All-in-One Business Management Platform</title>
        <meta
          name="description"
          content="Manage clients, schedule appointments, automate with AI, and grow smarter — all in one platform."
        />
        <link rel="canonical" href="https://bizuply.com/" />
      </Helmet>

      {/* Hero Section */}
      <section className="hero-section text-center">
        <h1 className="main-title">
          Everything Your Business Needs. <br /> In One Place.
        </h1>
        <p className="subtitle">
          Manage clients, schedule appointments, automate with AI, and grow smarter — all with Bizuply.
        </p>
        <div className="hero-buttons">
          <Link to="/get-started">
            <button className="button-primary">Get Started</button>
          </Link>
          <Link to="/how-it-works">
            <button className="button-secondary">See How It Works</button>
          </Link>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="value-section text-center">
        <h2 className="section-title">
          More Than a Platform — Your True Business Partner.
        </h2>
        <p className="section-text max-w-3xl mx-auto">
          Bizuply is built to empower small businesses to operate like the big ones.
          From smart scheduling and client management, to AI that delivers insights and acts as your personal advisor,
          and even collaborations with other businesses — everything works seamlessly together in one powerful system.
        </p>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        <div className="benefit-card">
          <h3>🤝 Collaboration</h3>
          <p>
            The system identifies potential partners from complementary fields and introduces them to you.
            Together, you can form agreements to increase profits and achieve shared growth.
          </p>
        </div>
        <div className="benefit-card">
          <h3>⚙️ Smart Management</h3>
          <p>
            An integrated CRM plus a branded business page where clients can view your gallery,
            ratings, reviews, chat, and more.
          </p>
        </div>
        <div className="benefit-card">
          <h3>🤖 AI Assistant</h3>
          <p>
            Automate replies, gain valuable insights, and let Bizuply handle repetitive tasks so you can save time.
          </p>
        </div>
        <div className="benefit-card">
          <h3>📈 Grow With You</h3>
          <p>
            Our growth is your growth — businesses thrive together.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section text-center">
        <h2 className="cta-title">Ready to Grow Smarter?</h2>
        <Link to="/get-started">
          <button className="button-primary">Start Today</button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="footer">
        <ul className="footer-links">
          <li><Link to="/about">About</Link></li>
          <li><Link to="/features">Features</Link></li>
          <li><Link to="/pricing">Pricing</Link></li>
          <li><Link to="/faq">FAQ</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
        <p>© All rights reserved Bizuply</p>
      </footer>
    </div>
  );
}
