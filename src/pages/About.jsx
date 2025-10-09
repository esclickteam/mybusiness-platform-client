import React from "react";
import { Helmet } from "react-helmet";
import { FaUsers, FaRobot, FaChartLine, FaHandshake } from "react-icons/fa";
import "../styles/About.css";

function About() {
  return (
    <div className="about-container">
      <Helmet>
        <title>About Us - Bizuply | The All-in-One Business Platform</title>
        <meta
          name="description"
          content="Bizuply – the all-in-one platform for businesses. Manage clients, appointments, digital services, and collaborations in one smart solution."
        />
        <link rel="canonical" href="https://bizuply.com/about" />
      </Helmet>

      {/* Hero Section */}
      <section className="about-hero">
        <h1>About <span>Bizuply</span></h1>
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
          <p>Centralize requests, bookings, and communications in one dashboard.</p>
        </div>
        <div className="feature">
          <FaRobot className="feature-icon" />
          <h3>Automation Tools</h3>
          <p>Save time with AI-powered scheduling, reminders, and workflows.</p>
        </div>
        <div className="feature">
          <FaChartLine className="feature-icon" />
          <h3>Analytics & Insights</h3>
          <p>Track performance and make data-driven decisions with ease.</p>
        </div>
        <div className="feature">
          <FaHandshake className="feature-icon" />
          <h3>Business Collaborations</h3>
          <p>Connect with complementary businesses and unlock new opportunities.</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          To be the digital home for businesses worldwide — simplifying operations,
          boosting growth, and creating unforgettable client experiences.
        </p>
      </section>
    </div>
  );
}

export default About;
