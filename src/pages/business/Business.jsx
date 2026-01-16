import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "../../styles/Business.css";

function BusinessJoin() {
  return (
    <div className="business-join-container">
      <Helmet>
        <title>
          Join Businesses - Collaborations, Clients & Smart Management | Bizuply
        </title>
        <meta
          name="description"
          content="Join Bizuply and get real client inquiries, collaborations with other businesses, and smart CRM & scheduling. Everything your business needs to grow in one place."
        />
        <link rel="canonical" href="https://bizuply.com/join" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* =========================
          Header
      ========================= */}
      <div className="header-section">
        <h1 className="title">Join the Leading Business Platform</h1>
        <p className="subtitle">
          The smartest way to grow your business: connect, collaborate and manage
          everything in one place.
        </p>
      </div>

      {/* =========================
          Info Cards – 3 ONLY
      ========================= */}
      <div className="info-section three-cards">
        {/* Card 1 */}
        <div className="info-box purple">
          <h2>Benefits You’ll Get</h2>
          <ul>
            <li>Professional business page with calendar & CRM</li>
            <li>Collaboration system that brings new clients</li>
            <li>AI tools for management, marketing & reminders</li>
            <li>One simple monthly price — no surprises</li>
          </ul>
        </div>

        {/* Card 2 */}
        <div className="info-box white">
          <h2>More Collaborations = More Clients</h2>
          <ul>
            <li>Connect with complementary businesses</li>
            <li>Receive direct referrals</li>
            <li>Collaborate on projects & deals</li>
            <li>Build a strong growth network</li>
          </ul>
        </div>

        {/* Card 3 */}
        <div className="info-box purple">
          <h2>3 Simple Steps</h2>
          <ul>
            <li>Sign up and choose your plan</li>
            <li>Create your business page</li>
            <li>Start receiving inquiries</li>
            <li>Let the system work for you</li>
          </ul>
        </div>
      </div>

      {/* =========================
          CTA
      ========================= */}
      <div className="cta-section">
        <h2>Grow Smarter. Start Today.</h2>
        <p>
          Join Bizuply and manage collaborations, clients and growth — all in one
          platform.
        </p>
        <Link to="/register">
          <button className="join-button">Start Free Trial</button>
        </Link>
      </div>
    </div>
  );
}

export default BusinessJoin;
