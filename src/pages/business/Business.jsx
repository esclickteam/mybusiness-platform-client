import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import "../../styles/Business.css";

function BusinessJoin() {
  return (
    <div className="business-join-container">
      <Helmet>
        <title>Join Businesses - Collaborations, Clients & Smart Management | Bizuply</title>
        <meta
          name="description"
          content="Join Bizuply and get real client inquiries, collaborations with other businesses, and smart CRM & scheduling. Everything your business needs to grow in one place."
        />
        <meta
          name="keywords"
          content="join business, collaborations, client inquiries, CRM, smart management, Bizuply"
        />
        <link rel="canonical" href="https://yourdomain.com/join" />
      </Helmet>

      {/* Title Section */}
      <div className="header-section">
        <h1 className="title">Join the Leading Business Platform!</h1>
        <p className="subtitle">
          Smart businesses know — the way to increase revenue and achieve real
          growth is through collaborations, efficient management, and exposure
          to new clients. Bizuply brings everything together in one place.
        </p>
      </div>

      {/* Info Cards */}
      <div className="info-section">
        <div className="info-box purple">
          <h2>Benefits You’ll Get</h2>
          <ul>
            <li>Professional business page with smart calendar & CRM</li>
            <li>Collaboration system that brings new clients</li>
            <li><b>AI tools</b> for management, marketing & reminders</li>
            <li>One monthly price — no surprises</li>
          </ul>
        </div>

        <div className="info-box white">
          <h2>More Collaborations = More Clients</h2>
          <ul>
            <li>Connect with complementary businesses in your field</li>
            <li>Receive direct referrals from other businesses</li>
            <li>Collaborate on new projects</li>
            <li>Build a strong network that drives growth</li>
          </ul>
        </div>

        <div className="info-box purple">
          <h2>Who is Bizuply For?</h2>
          <ul>
            <li>Businesses ready to grow and expand</li>
            <li>Those who want more client inquiries & collaborations</li>
            <li>Businesses seeking strong digital exposure</li>
            <li>Professionals looking for structure & efficiency</li>
          </ul>
        </div>

        <div className="info-box white">
          <h2>3 Simple Steps to Get Started</h2>
          <ul>
            <li>Sign up and choose your plan</li>
            <li>Create a business page with chat, calendar & gallery</li>
            <li>Start receiving inquiries and collaborations</li>
            <li>Let the smart system work for you</li>
          </ul>
        </div>
      </div>

      {/* Call To Action */}
      <div className="cta-section">
        <h2>Manage Your Business Smarter — Collaborations, Inquiries & Structure in One Place</h2>
        <p>Join Bizuply and enjoy everything your business needs — all in one platform.</p>
        <Link to="/register">
          <button className="join-button">14-Day Free Trial</button>
        </Link>
      </div>
    </div>
  );
}

export default BusinessJoin;
