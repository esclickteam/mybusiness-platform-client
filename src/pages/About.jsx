import React from "react";
import { Helmet } from "react-helmet-async";
import { FaUsers, FaRobot, FaChartLine, FaHandshake } from "react-icons/fa";
import "../styles/About.css";

function About() {
  return (
    <div className="about-container">
      <Helmet>
        {/* ✅ Title & Description */}
        <title>About Us - Bizuply | The All-in-One Business Platform</title>
        <meta
          name="description"
          content="Bizuply – the all-in-one platform for businesses. Manage clients, appointments, digital services, and collaborations in one smart solution."
        />
        <link rel="canonical" href="https://bizuply.com/about" />

        {/* ✅ Robots */}
        <meta name="robots" content="index, follow" />

        {/* ✅ Open Graph (Facebook, LinkedIn, WhatsApp) */}
        <meta property="og:title" content="About Bizuply" />
        <meta
          property="og:description"
          content="Learn more about Bizuply’s mission to empower small businesses worldwide with smart automation and AI tools."
        />
        <meta property="og:url" content="https://bizuply.com/about" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Bizuply" />
        <meta property="og:image" content="https://bizuply.com/og-image.jpg" />

        {/* ✅ Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Bizuply" />
        <meta
          name="twitter:description"
          content="Bizuply helps small and medium businesses grow smarter with AI-driven tools and automation."
        />
        <meta name="twitter:image" content="https://bizuply.com/og-image.jpg" />
      </Helmet>

      {/* Hero Section */}
      <section className="about-hero">
        <h1>
          About <span>Bizuply</span>
        </h1>
        <p>
          Bizuply is the all-in-one platform that helps businesses manage clients,
          bookings, digital services, and collaborations — all in one place.
        </p>
      </section>

      {/* Vision Section */}
      <section className="about-section">
        <h2>Our Vision</h2>
        <p>
          Empowering small and medium-sized businesses worldwide with simple,
          powerful, and innovative tools that make growth effortless.
        </p>
      </section>

      {/* Features Section */}
      <section className="about-features">
        <div className="feature">
          <FaUsers className="feature-icon" />
          <h3>Smart Client Management</h3>
          <p>
            Centralize requests, bookings, and communications in one dashboard.
          </p>
        </div>

        <div className="feature">
          <FaRobot className="feature-icon" />
          <h3>Automation Tools</h3>
          <p>
            Save time with AI-powered scheduling, reminders, and workflows.
          </p>
        </div>

        <div className="feature">
          <FaChartLine className="feature-icon" />
          <h3>Analytics & Insights</h3>
          <p>
            Track performance and make data-driven decisions with ease.
          </p>
        </div>

        <div className="feature">
          <FaHandshake className="feature-icon" />
          <h3>Business Collaborations</h3>
          <p>
            Connect with complementary businesses and unlock new opportunities.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          To be the digital home for businesses worldwide — simplifying
          operations, boosting growth, and creating unforgettable client
          experiences.
        </p>
      </section>
    </div>
  );
}

export default About;
