import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./Features.css";

function Features() {
  return (
    /* 🟣 Page Wrapper – רקע אחיד לכל העמוד */
    <div className="features-page">
      {/* 🔵 Content Container – רוחב מוגבל */}
      <div className="features-container">
        {/* 🧠 SEO Meta Tags */}
        <Helmet>
          <title>BizUply — All the Tools Your Business Needs in One Place</title>
          <meta
            name="description"
            content="Explore BizUply features — an all-in-one platform combining CRM, chat, scheduling, reviews, collaborations, and AI tools for small businesses."
          />
          <meta
            name="keywords"
            content="BizUply, business platform, CRM, chat, reviews, scheduling, AI assistant, small business tools, SaaS, business management"
          />
          <meta name="author" content="BizUply" />
        </Helmet>

        {/* 🌟 Hero Section */}
        <section className="features-hero">
          <h1 className="features-title">
            All the Tools Your Business Needs — In One Place
          </h1>
          <p className="features-subtitle">
            BizUply brings together everything a small business needs to manage
            clients, appointments, messages, reviews, collaborations, and
            AI-powered insights — all from one smart, intuitive platform.
          </p>
        </section>

        {/* 1️⃣ Business Page */}
        <section className="feature-block">
          <h2 className="feature-title">1. Professional Business Page</h2>
          <p className="feature-text">
            Every business on BizUply gets a dedicated business page that serves
            as a digital business card — complete with all the key information
            clients need.
          </p>
          <ul className="feature-list">
            <li>Business name, category, and description</li>
            <li>Logo and photo gallery to represent your brand</li>
            <li>Working hours and contact details</li>
            <li>Social media links and location</li>
            <li>List of services with names, duration, and availability</li>
          </ul>
          <p className="feature-result">
            <strong>Result:</strong> A clean, professional online presence that
            makes your business easy to find and trust.
          </p>
        </section>

        {/* 2️⃣ CRM */}
        <section className="feature-block">
          <h2 className="feature-title">2. CRM — Client Management</h2>
          <p className="feature-text">
            The BizUply CRM helps you manage all your client relationships in one
            organized space. You can record interactions, track tasks, and
            manage appointments with ease.
          </p>
          <ul className="feature-list">
            <li>Create a client file for every customer you work with</li>
            <li>Add notes about meetings, calls, or service details</li>
            <li>Document activities and completed work</li>
            <li>Open tasks or follow-ups for ongoing actions</li>
            <li>Schedule appointments directly from each client file</li>
          </ul>
          <p className="feature-result">
            <strong>Result:</strong> All your client data, history, and
            communications — in one well-organized system.
          </p>
        </section>

        {/* 3️⃣ Messaging */}
        <section className="feature-block">
          <h2 className="feature-title">3. Messaging System (Chat)</h2>
          <p className="feature-text">
            BizUply’s built-in messaging system makes it simple for clients to
            reach out directly from your business page. You can read, reply, and
            track all messages from your dashboard.
          </p>
          <ul className="feature-list">
            <li>Clients can send messages straight from your business page</li>
            <li>All messages appear in your Messages panel</li>
            <li>Read and reply directly inside your dashboard</li>
            <li>Message history is saved for easy follow-up</li>
            <li>Notifications keep you updated in real time</li>
          </ul>
          <p className="feature-result">
            <strong>Result:</strong> Centralized, organized client communication —
            easy to manage and track.
          </p>
        </section>

        {/* 4️⃣ Reviews */}
        <section className="feature-block">
          <h2 className="feature-title">4. Ratings & Reviews</h2>
          <p className="feature-text">
            Build trust and strengthen your reputation with verified client
            reviews and star ratings.
          </p>
          <ul className="feature-list">
            <li>Clients can leave public reviews and rate their experience</li>
            <li>Reviews appear on your business page and build credibility</li>
            <li>Higher ratings improve your visibility across the BizUply network</li>
          </ul>
          <p className="feature-result">
            <strong>Result:</strong> Authentic feedback that builds trust and
            helps you grow your reputation.
          </p>
        </section>

        {/* ✨ Summary */}
        <section className="feature-summary">
          <h2 className="feature-title">In Summary</h2>
          <p className="feature-text">
            <strong>BizUply</strong> brings together all your essential business
            tools under one smart platform. From client management to AI insights,
            you’ll have everything you need to manage, grow, and improve — all in
            one place.
          </p>

          <div className="feature-cta">
            <Link to="/how-it-works" className="cta-button-outline">
              See How It Works
            </Link>
            <Link to="/register" className="cta-button">
              Get Started
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Features;
