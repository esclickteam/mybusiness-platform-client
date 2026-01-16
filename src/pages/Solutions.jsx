import React from "react";
import "./Solutions.css";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function Solutions() {
  return (
    <div className="solutions-page">
      {/* 🧠 SEO Meta Tags */}
      <Helmet>
        <title>BizUply — Smart Solutions for Every Type of Business</title>
        <meta
          name="description"
          content="Discover BizUply's tailored solutions for every business type — from service providers and freelancers to shops and collaborations. Manage clients, communication, and growth in one smart place."
        />
        <meta
          name="keywords"
          content="BizUply solutions, small business tools, CRM, client management, AI assistant, business collaborations, service providers, freelancers, shops, SaaS platform"
        />
        <meta name="author" content="BizUply" />
        <meta property="og:title" content="BizUply — Smart Solutions for Businesses" />
        <meta
          property="og:description"
          content="BizUply adapts to every business type with smart tools for management, communication, and automation."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.bizuply.com/solutions" />
        <meta property="og:image" content="https://www.bizuply.com/og-image.jpg" />
        <link rel="canonical" href="https://www.bizuply.com/solutions" />
      </Helmet>

      <div className="solutions-container">
        {/* Title */}
        <h1 className="solutions-title">Solutions</h1>

        {/* Introduction */}
        <p className="solutions-paragraph">
          Every business is unique — with its own clients, challenges, and goals.
          <strong> BizUply</strong> was built to deliver tailored solutions for
          each type of business, combining smart management, simple
          communication, and practical AI assistance. Whether you work on-site,
          online, or from your own studio — BizUply adapts to you, helping you
          stay organized, connected, and focused on growth.
        </p>

        {/* Service Providers */}
        <div className="solution-block">
          <h2 className="solution-title">For Service Providers</h2>
          <p className="solution-subtitle">
            (Clinics, Trainers, Therapists, Hair & Beauty Professionals)
          </p>
          <p className="solution-text">
            <strong>The Challenge:</strong> Managing clients, appointments, and
            daily communication can be overwhelming.
            <br />
            <strong>The Solution:</strong> A smart CRM that keeps all client
            information, messages, and reviews in one place.
            <br />
            <strong>Plus:</strong> Built-in live chat helps you stay connected
            and deliver a professional, personalized experience.
          </p>
        </div>

        {/* On-Site Professionals */}
        <div className="solution-block">
          <h2 className="solution-title">For On-Site Professionals</h2>
          <p className="solution-subtitle">
            (Electricians, Installers, Cleaners, Technicians)
          </p>
          <p className="solution-text">
            <strong>The Challenge:</strong> Communicating with clients while on
            the move is hard to manage.
            <br />
            <strong>The Solution:</strong> A mobile-friendly business page with
            built-in chat, customer reviews, and smart inquiry management.
            <br />
            <strong>Plus:</strong> Connect with complementary businesses nearby
            to build collaborations and expand your client base.
          </p>
        </div>

        {/* Freelancers */}
        <div className="solution-block">
          <h2 className="solution-title">
            For Freelancers & Digital Consultants
          </h2>
          <p className="solution-text">
            <strong>The Challenge:</strong> Staying visible and building trust in
            the digital space.
            <br />
            <strong>The Solution:</strong> A professional business profile with
            service listings, real client reviews, and instant chat
            communication.
            <br />
            <strong>Plus:</strong> BizUply’s built-in AI assistant helps you
            craft messages, track leads, and make data-driven decisions
            effortlessly.
          </p>
        </div>

        {/* Small Businesses */}
        <div className="solution-block">
          <h2 className="solution-title">For Small Businesses & Shops</h2>
          <p className="solution-text">
            <strong>The Challenge:</strong> Managing clients, messages, and
            reviews across multiple channels can quickly get messy.
            <br />
            <strong>The Solution:</strong> Centralized communication and client
            management through one simple interface.
            <br />
            <strong>Plus:</strong> Real-time insights and analytics help you
            understand your performance and keep improving every week.
          </p>
        </div>

        {/* Collaborations */}
        <div className="solution-block">
          <h2 className="solution-title">For Business Collaborations</h2>
          <p className="solution-text">
            <strong>The Challenge:</strong> Finding and managing partnerships
            with complementary businesses.
            <br />
            <strong>The Solution:</strong> A built-in collaboration network
            designed to connect professionals, expand reach, and boost profits
            together.
            <br />
            <strong>Plus:</strong> Every connection is built on transparency,
            trust, and mutual growth — because real success happens when
            businesses grow together.
          </p>
        </div>

        {/* Summary */}
        <h2 className="solutions-section-title">In Summary</h2>
        <p className="solutions-paragraph">
          No matter your field, <strong>BizUply</strong> adapts to your workflow.
          Simple to use, powerful in action, and focused on what truly matters —
          helping your business stay connected, efficient, and ready to grow.
        </p>

        <div className="solutions-cta">
          <Link to="/features" className="cta-button-outline">
            Explore Features
          </Link>
          <Link to="/register" className="cta-button">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Solutions;
